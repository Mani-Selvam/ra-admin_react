import express from "express";
import multer from "multer";
import path from "path";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname),
        );
    },
});

const upload = multer({ storage });

// GET ALL TICKETS - with optional filtering
router.get("/", async (req, res) => {
    try {
        const { status, priority, department_id, raised_by } = req.query;
        const filter = {};

        // Build dynamic filter based on query parameters
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (department_id) filter.department_id = department_id;
        if (raised_by) filter.raised_by = raised_by;

        const tickets = await Ticket.find(filter)
            .populate("raised_by", "name email mobile")
            .populate("department_id", "name")
            .populate("company_id", "name")
            .populate("priority_id", "name")
            .populate("status_id", "name")
            .populate("assigned_to", "name email")
            .populate("approver_id", "name email")
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET TICKETS BY STATUS - Must come before /:id
router.get("/status/:status", async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: req.params.status })
            .populate("raised_by", "name email mobile")
            .populate("department_id", "name")
            .populate("company_id", "name")
            .populate("priority_id", "name")
            .populate("status_id", "name")
            .populate("assigned_to", "name email")
            .populate("approver_id", "name email")
            .populate("status_id", "name")
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET TICKETS BY PRIORITY - Must come before /:id
router.get("/priority/:priority", async (req, res) => {
    try {
        const tickets = await Ticket.find({ priority: req.params.priority })
            .populate("raised_by", "name email mobile")
            .populate("department_id", "name")
            .populate("company_id", "name")
            .populate("priority_id", "name")
            .populate("status_id", "name")
            .populate("assigned_to", "name email")
            .populate("approver_id", "name email")
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET SINGLE TICKET - After specific routes
router.get("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate("raised_by", "name email mobile")
            .populate("department_id", "name")
            .populate("company_id", "name")
            .populate("priority_id", "name")
            .populate("status_id", "name")
            .populate("assigned_to", "name email")
            .populate("approver_id", "name email");

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE TICKET
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("Received ticket creation request");
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        const {
            title,
            description,
            priority_id,
            status_id,
            company_id,
            department_id,
            raised_by,
        } = req.body;

        // Validate required fields
        if (!title || !description || !department_id || !raised_by) {
            console.log("Validation failed:", {
                title: !!title,
                description: !!description,
                department_id: !!department_id,
                raised_by: !!raised_by,
            });
            return res.status(400).json({
                message:
                    "Missing required fields: title, description, department_id, raised_by",
            });
        }

        console.log("Creating new ticket with data:", {
            title,
            description,
            priority_id,
            status_id,
            company_id,
            department_id,
            raised_by,
        });

        const newTicket = new Ticket({
            title,
            description,
            priority_id: priority_id || null,
            status_id: status_id || null,
            company_id: company_id || null,
            department_id,
            raised_by,
            image: req.file ? req.file.path : null,
        });

        const savedTicket = await newTicket.save();
        const populatedTicket = await savedTicket.populate([
            { path: "raised_by", select: "name email mobile" },
            { path: "department_id", select: "name" },
            { path: "company_id", select: "name" },
            { path: "priority_id", select: "name" },
            { path: "status_id", select: "name" },
        ]);

        res.status(201).json(populatedTicket);
    } catch (error) {
        console.error("Ticket creation error:", error);
        res.status(400).json({ message: error.message });
    }
});

// UPDATE TICKET
router.put("/:id", async (req, res) => {
    try {
        const {
            title,
            description,
            priority_id,
            status_id,
            image,
            approval_status,
            assigned_to,
            approver_id,
            approved_at,
        } = req.body;

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(priority_id && { priority_id }),
                ...(status_id && { status_id }),
                ...(image && { image }),
                ...(approval_status && { approval_status }),
                ...(assigned_to && { assigned_to }),
                ...(approver_id && { approver_id }),
                ...(approved_at && { approved_at }),
            },
            { new: true, runValidators: true },
        )
            .populate("raised_by", "name email mobile")
            .populate("department_id", "name")
            .populate("company_id", "name")
            .populate("priority_id", "name")
            .populate("status_id", "name")
            .populate("assigned_to", "name email")
            .populate("approver_id", "name email");

        if (!updatedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE TICKET
router.delete("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.json({
            message: "Ticket deleted successfully",
            deletedTicket: ticket,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
