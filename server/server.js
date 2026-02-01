import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import priorityRoutes from "./routes/priorityRoutes.js";
import designationRoutes from "./routes/designationRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import ticketStatusRoutes from "./routes/ticketStatusRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/tickets.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import workAnalysisRoutes from "./routes/workAnalysisRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./db.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/companies", companyRoutes);
app.use("/api/priorities", priorityRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/ticket-status", ticketStatusRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/work-analysis", workAnalysisRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
