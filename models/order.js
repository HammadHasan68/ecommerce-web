import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    _id: String,
    title: String,
    price: Number,
    quantity: Number,
    image: String,
});

const OrderSchema = new mongoose.Schema({
    items: [OrderItemSchema],
    subtotal: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    customer: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        postal: String,
    },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
