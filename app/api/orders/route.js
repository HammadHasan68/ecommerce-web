import connectDB from "@/lib/db";
import Order from "@/models/order";
import mongoose from "mongoose";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "tttggg444";

export async function POST(req) {
    try {
        const body = await req.json();
        await connectDB();

        const order = new Order({
            items: body.items || [],
            subtotal: Number(body.subtotal || 0),
            shipping: Number(body.shipping || 0),
            discount: Number(body.discount || 0),
            total: Number(body.total || 0),
            customer: body.customer || {},
        });

        await order.save();

        return Response.json({ success: true, id: order._id });
    } catch (err) {
        console.error("Order save error:", err);
        return Response.json({ success: false, message: "Unable to save order" }, { status: 500 });
    }
}

export async function GET(req) {
    // Require token in query/header OR username/password headers OR admin cookie
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || req.headers.get("x-admin-token") || "";

    // cookie check (simple): look for admin_auth=1 in cookie header
    const cookieHeader = req.headers.get('cookie') || '';
    const hasAuthCookie = cookieHeader.includes('admin_auth=1');

    // header user/pass check
    const headerUser = req.headers.get('x-admin-username') || '';
    const headerPass = req.headers.get('x-admin-password') || '';
    const headerAuthMatches = headerUser === ADMIN_USER && headerPass === ADMIN_PASS;

    // allow if any valid auth present (keep existing token behavior as fallback)
    const tokenAuthMatches = ADMIN_TOKEN && token === ADMIN_TOKEN;

    if (!tokenAuthMatches && !hasAuthCookie && !headerAuthMatches) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
        return Response.json({ success: true, orders });
    } catch (err) {
        console.error("Order list error:", err);
        return Response.json({ success: false, message: "Unable to fetch orders" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || req.headers.get("x-admin-token") || "";
    const cookieHeader = req.headers.get("cookie") || "";
    const hasAuthCookie = cookieHeader.includes("admin_auth=1");
    const headerUser = req.headers.get("x-admin-username") || "";
    const headerPass = req.headers.get("x-admin-password") || "";
    const headerAuthMatches = headerUser === ADMIN_USER && headerPass === ADMIN_PASS;
    const tokenAuthMatches = ADMIN_TOKEN && token === ADMIN_TOKEN;

    if (!tokenAuthMatches && !hasAuthCookie && !headerAuthMatches) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const id = url.searchParams.get("id");
    if (!id || !mongoose.isValidObjectId(id)) {
        return Response.json({ success: false, message: "Invalid order id" }, { status: 400 });
    }

    try {
        await connectDB();
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return Response.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return Response.json({ success: true });
    } catch (err) {
        console.error("Order delete error:", err);
        return Response.json({ success: false, message: "Unable to delete order" }, { status: 500 });
    }
}
