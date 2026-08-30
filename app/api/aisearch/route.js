import connectDB from "@/lib/db";
import Product from "@/models/product";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const vectorIndex = process.env.MONGODB_VECTOR_INDEX || "vector_index";

async function embedQuery(query) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: [query],
    });
    const values = response.embeddings?.[0]?.values;

    if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Gemini returned an empty query embedding");
    }

    return values;
}

function cosineSimilarity(first, second) {
    let dotProduct = 0;
    let firstMagnitude = 0;
    let secondMagnitude = 0;

    for (let index = 0; index < first.length; index += 1) {
        dotProduct += first[index] * second[index];
        firstMagnitude += first[index] ** 2;
        secondMagnitude += second[index] ** 2;
    }

    return dotProduct / Math.sqrt(firstMagnitude * secondMagnitude);
}

async function searchWithoutIndex(queryEmbedding) {
    const products = await Product.find({ embedding: { $exists: true, $ne: [] } })
        .select("title description price category image embedding")
        .lean();

    return products
        .filter((product) => product.embedding.length === queryEmbedding.length)
        .map((product) => ({
            ...product,
            score: cosineSimilarity(product.embedding, queryEmbedding),
        }))
        .sort((first, second) => second.score - first.score)
        .slice(0, 10)
        .map(({ embedding, ...product }) => product);
}

export async function POST(req) {
    try {
        const { query } = await req.json();

        await connectDB();

        if (!query || query.trim() === "") {
            const allProducts = await Product.find({})
                .select("title description price category image")
                .lean();
            return Response.json({ products: allProducts });
        }

        const queryEmbedding = await embedQuery(query.trim());

        try {
            const products = await Product.aggregate([
                {
                    $vectorSearch: {
                        index: vectorIndex,
                        path: "embedding",
                        queryVector: queryEmbedding,
                        numCandidates: 10,
                        limit: 10,
                    },
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        price: 1,
                        category: 1,
                        image: 1,
                        score: { $meta: "vectorSearchScore" },
                    },
                },
            ]);

            if (products.length > 0) {
                return Response.json({ products });
            }

            const fallbackProducts = await searchWithoutIndex(queryEmbedding);
            return Response.json({
                products: fallbackProducts,
                notice: `Atlas index "${vectorIndex}" returned no results. Using local similarity search.`,
            });
        } catch (vectorError) {
            console.warn("Atlas vector index unavailable; using local similarity search", vectorError);
            const products = await searchWithoutIndex(queryEmbedding);
            return Response.json({
                products,
                notice: `Atlas index "${vectorIndex}" is unavailable. Using local similarity search.`,
            });
        }
    } catch (err) {
        console.error("Vector search error:", err);
        const message = err?.errorResponse?.errmsg || "Unable to search products";
        const indexError = message.includes("is not indexed as vector");

        return Response.json(
            {
                error: "vector_search_failed",
                message: indexError
                    ? `MongoDB index "${vectorIndex}" must index embedding as a vector`
                    : message,
            },
            { status: 500 }
        );
    }
}