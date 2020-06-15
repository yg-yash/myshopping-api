const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .select("product quantity _id")
      .populate("product", "name")
      .exec();

    if (orders.length <= 0) {
      return res.status(404).json({ error: "No Order Found" });
    }
    const counts = orders.length;
    const response = orders.map(order => {
      return {
        id: order._id,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: "GET",
          url: "https://localhost:3000/orders" + order._id
        }
      };
    });

    res.status(200).json({ counts, orders: response });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.orders_get = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const order = await Order.findOne({ _id })
      .populate("product")
      .exec();
    if (!order) {
      return res.status(404).json({ error: "No Order Found" });
    }
    const response = {
      id: order._id,
      product: order.product,
      quantity: order.quantity,
      request: {
        type: "GET",
        url: "https://localhost:3000/orders/" + order._id
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.order_create = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      product: req.body.productId,
      quantity: req.body.quantity
    });
    if (!product) {
      return res.status(404).json({ message: "Product Doesnt Exist" });
    }

    await order.save();
    res.status(200).json({
      message: "order was created",
      order
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.order_delete = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const order = await Order.deleteOne({ _id });
    if (order.deletedCount === 0) {
      return res.status(404).json({ error: "No Order Found to Delete" });
    }
    const response = {
      message: "Order Deleted",
      request: {
        type: "POST",
        url: "https://localhost:3000/orders/",
        body: {
          productId: "String",
          quantity: "Number"
        }
      }
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
};
