const express = require("express");
const router = new express.Router();
const multer = require("multer");
const auth = require("../middleware/check-auth");
const ProductController = require("../controllers/products");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    return cb(null, true);
  }
  cb(null, false);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

//get all products route
router.get("/", ProductController.products_get_all);

//get a single product route
router.get("/:id", ProductController.products_get);

//create a product route
router.post(
  "/",
  auth,
  upload.single("productImage"),
  ProductController.products_create
);

//update a product route
router.patch("/:id", auth, ProductController.products_update);

//delete a product route
router.delete("/:id", auth, ProductController.products_delete);

module.exports = router;
