const Ticket = require("../models/Ticket");

// @desc    Create a new Ticket
// @route   POST /api/tickets
exports.createTicket = async (req, res) => {
    try {
        // 1. Extract text data
        const {
            institution_id,
            department_id,
            title,
            description,
            priority,
            status,
        } = req.body;

        // 2. Check if file was uploaded
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path; // Multer saves path here
        }

        // 3. Create Ticket Object
        // 'req.user' is set by your AuthMiddleware (see section 5)
        const ticketData = {
            institution_id,
            department_id,
            raised_by: req.user.id, // Auto Capture Login User
            title,
            description,
            image: imagePath,
            priority,
            status,
        };

        const ticket = await Ticket.create(ticketData);

        // 4. Populate details for the response (optional, but good for frontend)
        await ticket.populate("raised_by", "name email");
        await ticket.populate("assigned_to", "name email");
        await ticket.populate("institution_id", "name");
        await ticket.populate("department_id", "name");

        res.status(201).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Get all Tickets
// @route   GET /api/tickets
exports.getTickets = async (req, res) => {
    try {
        // If client requested only tickets assigned to current user, filter
        const requesterId =
            req.user?.user?.id || req.user?.id || req.user || null;
        const filter = {};
        if (req.query.assigned === "true" && requesterId) {
            // assigned_to is an array of ObjectIds - match tickets where assigned_to contains requesterId
            filter.assigned_to = requesterId;
        }

        const tickets = await Ticket.find(filter)
            .populate("institution_id", "name")
            .populate("department_id", "name")
            .populate("raised_by", "name email")
            .populate("assigned_to", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Ticket (e.g., change status to Closed)
// @route   PUT /api/tickets/:id
exports.updateTicket = async (req, res) => {
    try {
        let ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res
                .status(404)
                .json({ success: false, message: "Ticket not found" });
        }

        // If new image uploaded, handle logic here (delete old one, save new path)
        // For simplicity, we are just updating text fields here
        ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
