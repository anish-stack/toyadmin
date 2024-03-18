const Order = require("../models/order.model");
exports.CreateOrder = async (req, res) => {
    try {
       


        const { cartItems, Name, ContactNumber, Email, State, Address, Landmark, TotalCost } = req.body;

        // Check if cartItems or address is empty
        if (!cartItems || Object.keys(cartItems).length === 0) {
            return res.status(422).json({ error: "Cart items empty" });
        }

        const newOrder = new Order({
            product: cartItems,
            Name, ContactNumber, Email, State, Address, Landmark, TotalCost

        });

        await newOrder.save();

        return res.status(201).json({
            success: true,
            msg: "Order created",
            newOrder
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Update the order status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus:status }, { new: true });
        console.log(updatedOrder)
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json({
            success: true,
            msg: "Order status updated",
            updatedOrder
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};