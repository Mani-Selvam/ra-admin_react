import WorkAnalysis from "../models/WorkAnalysis.js";

// @desc    Create Work Analysis (Worker Submit)
// @route   POST /api/work-analysis
// @Access  Private (Worker)
export const createWorkAnalysis = async (req, res) => {
    try {
        // req.files comes from multer (array of files)
        const imagePaths = req.files ? req.files.map((file) => file.path) : [];

        const {
            ticket_id,
            material_required,
            material_description,
            worker_id,
        } = req.body;

        // Use worker_id from request body or fallback to authenticated user
        const finalWorkerId = worker_id || req.user.id;

        if (!finalWorkerId) {
            return res.status(400).json({ message: "Worker ID is required" });
        }

        const analysis = new WorkAnalysis({
            analysis_id: "WA-" + Date.now().toString().slice(-6),
            ticket_id,
            worker_id: finalWorkerId,
            material_required,
            uploaded_images: imagePaths,
            material_description:
                material_required === "Yes" ? material_description : "",
            approval_status: "Pending",
        });

        const savedAnalysis = await analysis.save();
        await savedAnalysis.populate("approved_by", "name email");

        res.status(201).json(savedAnalysis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Approval Status (Manager Action)
// @route   PUT /api/work-analysis/:id/approve
export const updateApproval = async (req, res) => {
    try {
        const { approval_status } = req.body;

        const analysis = await WorkAnalysis.findById(req.params.id);
        if (!analysis)
            return res.status(404).json({ message: "Analysis not found" });

        analysis.approval_status = approval_status;
        analysis.approved_by = req.user.id; // Manager ID
        analysis.approved_at = Date.now();

        await analysis.save();
        res.status(200).json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Analysis
// @route   GET /api/work-analysis
export const getWorkAnalysis = async (req, res) => {
    try {
        const analyses = await WorkAnalysis.find()
            .populate("ticket_id", "ticket_id title")
            .populate("approved_by", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(analyses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
