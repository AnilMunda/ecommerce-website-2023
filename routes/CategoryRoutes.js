import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  CreateCategoryController,
  categoryController,
  deleteController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/CategoryController.js";

const router = express.Router();

// routes

// Create Category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  CreateCategoryController
);

// update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// getAll category
router.get("/getall-category", categoryController);

// single category
router.get("/single-category/:slug", singleCategoryController);

// delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteController);

export default router;
