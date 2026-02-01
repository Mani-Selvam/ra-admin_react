import express from "express";
import TicketStatus from "../models/TicketStatus.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
    try {
        const data = await TicketStatus.find().sort({ sortOrder: 1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE
router.post("/", async (req, res) => {
    try {
        const { name, sortOrder, status } = req.body;

        const existing = await TicketStatus.findOne({
            $or: [{ name }, { sortOrder }],
        });

        if (existing) {
            return res.status(400).json({
                message: "Ticket Status Name or Sort Order must be unique.",
            });
        }

        const newTicketStatus = new TicketStatus({ name, sortOrder, status });
        const savedStatus = await newTicketStatus.save();

        res.status(201).json(savedStatus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updatedStatus = await TicketStatus.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        res.json(updatedStatus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        await TicketStatus.findByIdAndDelete(req.params.id);
        res.json({ message: "Ticket Status deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
