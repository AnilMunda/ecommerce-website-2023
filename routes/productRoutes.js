import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductContrller,
  getProductController,
  getSingleProductController,
  productCountController,
  productDeleteController,
  productFilterController,
  productListController,
  productPhotoController,
  reltedProductController,
  serachProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

// routes

// create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductContrller
);

// get products
router.get("/get-product", getProductController);

// single product
router.get("/get-product/:slug", getSingleProductController);

// get photo
router.get("/product-photo/:pid", productPhotoController);

// delete product
router.delete("/delete-product/:pid", productDeleteController);

// update product

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// filter product
router.post("/product-filters", productFilterController);

// product count
router.get("/product-count", productCountController);

// product per page
router.get("/product-list/:page", productListController);

// search product
router.get("/search/:keyword", serachProductController);

// similar product
router.get("/releted-product/:pid/:cid", reltedProductController);

// payment routes
// token
router.get("/braintree/token", braintreeTokenController);

// payment
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
