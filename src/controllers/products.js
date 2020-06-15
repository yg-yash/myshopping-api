const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = async (req, res, next) => {
  try {
    const products = await Product.find().select("name price _id productImage");

    if (products.length <= 0) {
      return res.status(404).json({ message: "No Product Found " });
    }
    const response = {
      count: products.length,
      products: products.map(product => {
        return {
          name: product.name,
          price: product.price,
          _id: product._id,
          productImage: product.productImage,
          request: {
            type: "GET",
            url: "https://localhost:3000/products/" + product._id
          }
        };
      })
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.products_get = async (req, res, next) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id).select(
      "name price _id productImage"
    );

    if (!product) {
      return res.status(404).json({ error: "No Product Found" });
    }
    const response = {
      _id: product._id,
      name: product.name,
      price: product.price,
      request: {
        type: "GET",
        url: "https://localhost:3000/products/" + product._id
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.products_create = async (req, res, next) => {
  try {
    const product = await new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });
    await product.save();
    res.status(201).json({
      message: "Product Created Successfully",
      createdProduct: {
        name: product.name,
        price: product.price,
        _id: product._id,
        productImage: product.productImage,
        request: {
          type: "GET",
          url: "https://localhost:3000/products/" + product._id
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: "Couldnt Create Product" });
  }
};

exports.products_update = async (req, res, next) => {
  const _id = req.params.id;
  const allowedUpdates = {};
  try {
    for (const ops of req.body) {
      allowedUpdates[ops.propName] = ops.value;
    }
    const product = await Product.updateOne({ _id }, { $set: allowedUpdates });
    if (product.n === 0) {
      return res.status(404).json({ error: "No Product Found" });
    }

    const response = {
      message: "Product updated successfully",
      request: {
        type: "GET",
        url: "https://localhost:3000/products/" + _id
      }
    };
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(error);
  }
};

exports.products_delete = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const product = await Product.deleteOne({ _id });
    if (product.deletedCount === 0) {
      return res.status(404).json({ error: "No Product Found" });
    }
    const response = {
      message: "Product Deleted",
      request: {
        type: "POST",
        url: "localhost:3000/products/",
        body: { name: "String", price: "Number" }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json();
  }
};
