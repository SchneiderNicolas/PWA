import express from "express";
import { getAllUsers } from "../controllers/user.controller";

export const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);
