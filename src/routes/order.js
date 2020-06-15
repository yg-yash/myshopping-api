const express = require("express");
const router = new express.Router();
const auth = require("../middleware/check-auth");
const OrdersController = require("../controllers/orders");

//get all orders route
router.get("/", auth, OrdersController.orders_get_all);

//get single order route
router.get("/:id", auth, OrdersController.orders_get);

//create a order route
router.post("/", auth, OrdersController.order_create);

//delete a order route
router.delete("/:id", auth, OrdersController.order_delete);

module.exports = router;
