import React, { useState, useEffect, useRef } from "react";
import { createApproval } from "./approvalAPI";
import { getTickets, updateTicket } from "./ticketAPI";
import { getUsers } from "./userAPI";
import "./approvalForm.css";

const ApprovalModule = ({
    ticketId,
    ticketTitle,
    onApprovalSuccess,
    approverId,
}) => {
    // Get logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    const [formData, setFormData] = useState({
        ticket_id: ticketId || "",
        approver_id: approverId || loggedInUser?.id || "", // Auto-set from logged-in user
        approval_status: "Approved", // Default - Auto Selected
        assigned_to: [], // Array of selected IDs
        remarks: "",
        approved_at: new Date().toISOString(), // Current timestamp
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch tickets and users on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                const [ticketsData, usersData] = await Promise.all([
                    getTickets(),
                    getUsers(),
                ]);
                setTickets(ticketsData || []);
                setUsers(usersData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage({ text: "Failed to load data", type: "error" });
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle User Selection from Dropdown
    const handleUserSelection = (userId) => {
        setFormData((prev) => {
            const current = prev.assigned_to;
            if (current.includes(userId)) {
                // Remove user
                return {
                    ...prev,
                    assigned_to: current.filter((id) => id !== userId),
                };
            } else {
                // Add user
                return { ...prev, assigned_to: [...current, userId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.ticket_id) {
            setMessage({ text: "Ticket is required", type: "error" });
            return;
        }
        if (!formData.approver_id) {
            setMessage({ text: "Approver is required", type: "error" });
            return;
        }
        if (formData.assigned_to.length === 0) {
            setMessage({
                text: "Please select at least one user to assign to",
                type: "error",
            });
            return;
        }

        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            console.log("Starting approval process...");

            // 1. Create approval
            console.log("Step 1: Creating approval...");
            const approvalData = await createApproval(formData);
            console.log("Approval created successfully:", approvalData);

            // 2. Update ticket with approval status and assigned users
            console.log("Step 2: Updating ticket...");
            const ticketUpdateData = {
                approval_status: formData.approval_status,
                assigned_to: formData.assigned_to,
                approver_id: formData.approver_id,
                approved_at: formData.approved_at,
            };
            console.log("Ticket update data:", ticketUpdateData);

            const ticketUpdateResponse = await updateTicket(
                formData.ticket_id,
                ticketUpdateData,
            );
            console.log("Ticket updated successfully:", ticketUpdateResponse);

            setMessage({
                text: "Approval recorded successfully and ticket updated!",
                type: "success",
            });

            // Reset form after delay
            setTimeout(() => {
                if (onApprovalSuccess) {
                    console.log("Calling onApprovalSuccess callback...");
                    onApprovalSuccess();
                } else {
                    // Optional: Clear form if standalone
                    setFormData({ ...formData, remarks: "", assigned_to: [] });
                }
            }, 1500);
        } catch (error) {
            console.error("Approval process error:", error);
            setMessage({ text: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Get selected user names for display
    const getSelectedUserNames = () => {
        return users
            .filter((user) => formData.assigned_to.includes(user._id))
            .map((user) => user.name)
            .join(", ");
    };

    return (
        <div className="approval-container">
            <div className="approval-card">
                <div className="approval-header">
                    <div>
                        <h3>Ticket Approval</h3>
                        {ticketTitle && (
                            <p className="ticket-ref">
                                Reference: {ticketTitle}
                            </p>
                        )}
                    </div>
                    <div
                        className={`status-badge ${formData.approval_status === "Approved" ? "approved" : "rejected"}`}>
                        {formData.approval_status}
                    </div>
                </div>

                {message.text && (
                    <div className={`alert ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="approval-form">
                    {dataLoading ? (
                        <div className="loading">Loading data...</div>
                    ) : (
                        <>
                            <div className="form-grid">
                                {/* 1. Ticket ID - Dropdown */}
                                <div className="form-group">
                                    <label>Ticket ID *</label>
                                    {ticketId ? (
                                        <>
                                            <input
                                                type="text"
                                                value={
                                                    ticketTitle || "Loading..."
                                                }
                                                disabled
                                                className="form-control"
                                            />
                                            <small className="form-text text-muted">
                                                Selected from ticket list
                                            </small>
                                        </>
                                    ) : (
                                        <select
                                            value={formData.ticket_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    ticket_id: e.target.value,
                                                })
                                            }
                                            className="form-control"
                                            required>
                                            <option value="">
                                                Select a Ticket
                                            </option>
                                            {tickets.map((ticket) => (
                                                <option
                                                    key={ticket._id}
                                                    value={ticket._id}>
                                                    {ticket.ticket_number} -{" "}
                                                    {ticket.title}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* 2. Approver ID - Disabled (Auto from logged-in user) */}
                                <div className="form-group">
                                    <label>Approver * (You)</label>
                                    <input
                                        type="text"
                                        value={
                                            loggedInUser?.name ||
                                            "Not logged in"
                                        }
                                        disabled
                                        className="form-control"
                                    />
                                    <small className="form-text text-muted">
                                        Auto-set to logged-in user
                                    </small>
                                </div>

                                {/* 3. Approval Status */}
                                <div className="form-group full-width">
                                    <label>Approval Status *</label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Approved"
                                                checked={
                                                    formData.approval_status ===
                                                    "Approved"
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        approval_status:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <div className="radio-option">
                                                <span>✓</span> Approved
                                            </div>
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Not Approved"
                                                checked={
                                                    formData.approval_status ===
                                                    "Not Approved"
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        approval_status:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <div className="radio-option">
                                                <span>✗</span> Not Approved
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* 4. Dropdown Multiselect for Assigned To */}
                                <div
                                    className="form-group full-width"
                                    ref={dropdownRef}>
                                    <label>Assign To (Select Agents)</label>
                                    <div className="dropdown-container">
                                        <div
                                            className="dropdown-header"
                                            onClick={() =>
                                                setDropdownOpen(!dropdownOpen)
                                            }>
                                            {formData.assigned_to.length > 0
                                                ? getSelectedUserNames()
                                                : "Select agents..."}
                                            <span
                                                className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}></span>
                                        </div>
                                        {dropdownOpen && (
                                            <div className="dropdown-list">
                                                {users.map((user) => (
                                                    <div
                                                        key={user._id}
                                                        className={`dropdown-item ${formData.assigned_to.includes(user._id) ? "selected" : ""}`}
                                                        onClick={() =>
                                                            handleUserSelection(
                                                                user._id,
                                                            )
                                                        }>
                                                        <div className="user-info">
                                                            <span className="user-avatar">
                                                                {user.name.charAt(
                                                                    0,
                                                                )}
                                                            </span>
                                                            {user.name}
                                                        </div>
                                                        {formData.assigned_to.includes(
                                                            user._id,
                                                        ) && (
                                                            <span className="check-icon">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {formData.assigned_to.length === 0 && (
                                        <span className="error-text">
                                            Please select at least one user.
                                        </span>
                                    )}
                                </div>

                                {/* 5. Remarks */}
                                <div className="form-group full-width">
                                    <label>Remarks</label>
                                    <textarea
                                        placeholder="Enter approval notes..."
                                        value={formData.remarks}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                remarks: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* 6. Approved At */}
                                <div className="form-group">
                                    <label>Approved At</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.approved_at.slice(
                                            0,
                                            16,
                                        )}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                approved_at: new Date(
                                                    e.target.value,
                                                ).toISOString(),
                                            })
                                        }
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={loading}>
                                    {loading
                                        ? "Processing..."
                                        : "Submit Decision"}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ApprovalModule;
