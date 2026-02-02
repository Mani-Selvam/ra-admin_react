import React, { useEffect, useState } from "react";
import { getTickets, updateTicket, deleteTicket } from "./ticketAPI";
import { getWorkAnalysis } from "./workAnalysisAPI";
import CreateTicket from "./CreateTicket";
import ApprovalModule from "./ApprovalModule";
import WorkAnalysisForm from "./WorkAnalysisForm";
import "./ticketForm.css";

// --- SVG Icons ---
const SearchIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const CloseIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const CheckIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const TrashIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const CalendarIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const UserIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const BuildingIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Modal States
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [viewTicket, setViewTicket] = useState(null);
    const [editTicket, setEditTicket] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [selectedTicketForApproval, setSelectedTicketForApproval] =
        useState(null);

    // Work Analysis Modal State
    const [showWorkAnalysisModal, setShowWorkAnalysisModal] = useState(false);
    const [selectedTicketForAnalysis, setSelectedTicketForAnalysis] =
        useState(null);
    const [workAnalyses, setWorkAnalyses] = useState([]);
    const [loadingAnalyses, setLoadingAnalyses] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
    });

    // --- 1. Fetch Data ---
    const [showAssignedOnly, setShowAssignedOnly] = useState(
        localStorage.getItem("assignedOnly") === "true",
    );

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const currentUser = JSON.parse(
                localStorage.getItem("user") || "{}",
            );
            const assignedOnlyFlag =
                showAssignedOnly ||
                localStorage.getItem("assignedOnly") === "true";
            const data = await getTickets(assignedOnlyFlag);
            const fetchedTickets = Array.isArray(data) ? data : data.data || [];
            setTickets(fetchedTickets);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            showToast("Failed to load tickets", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkAnalyses = async () => {
        setLoadingAnalyses(true);
        try {
            const data = await getWorkAnalysis();
            const analyses = Array.isArray(data) ? data : data.data || [];
            setWorkAnalyses(analyses);
        } catch (error) {
            console.error("Error fetching work analyses:", error);
        } finally {
            setLoadingAnalyses(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchWorkAnalyses();
    }, []);

    // --- 2. Helper: Safe Getters ---
    const getPriorityName = (ticket) => {
        return ticket.priority_id?.name || ticket.priority || "Unknown";
    };

    const getStatusName = (ticket) => {
        return ticket.status_id?.name || ticket.status || "Unknown";
    };

    const getCompanyName = (ticket) => {
        return ticket.company_id?.name || ticket.institution_id?.name || "-";
    };

    const getAnalysesForTicket = (ticket) => {
        if (!ticket || !workAnalyses || workAnalyses.length === 0) return [];
        const ticketIdStr = ticket._id
            ? String(ticket._id)
            : String(ticket.ticket_id || ticket.ticket_id);
        const ticketHumanId = ticket.ticket_id
            ? String(ticket.ticket_id)
            : null;
        return workAnalyses.filter((a) => {
            const t = a.ticket_id;
            const refId =
                t && typeof t === "object"
                    ? String(t._id || t)
                    : String(t || "");
            const refHuman =
                t && typeof t === "object" && t.ticket_id
                    ? String(t.ticket_id)
                    : null;

            return (
                refId === ticketIdStr ||
                (ticketHumanId && refId === String(ticketHumanId)) ||
                (refHuman && ticketHumanId && refHuman === ticketHumanId)
            );
        });
    };

    // --- 3. UI Interaction Logic ---
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), 3000);
    };

    const openConfirmModal = (title, message, onConfirm) => {
        setConfirmModal({ isOpen: true, title, message, onConfirm });
    };

    const handleDelete = (ticket) => {
        openConfirmModal(
            "Delete Ticket",
            `Are you sure you want to delete ticket ${ticket.ticket_id}?`,
            async () => {
                try {
                    await deleteTicket(ticket._id);
                    showToast("Ticket deleted successfully", "success");
                    fetchTickets();
                } catch (err) {
                    showToast("Failed to delete ticket", "error");
                }
            },
        );
    };

    const handleTicketCreated = () => {
        setShowCreateForm(false);
        setEditTicket(null);
        fetchTickets();
        showToast("Ticket created successfully!", "success");
    };

    // --- 4. Filtering ---
    const filteredTickets = tickets.filter((ticket) => {
        const term = searchTerm.toLowerCase();
        const id = String(ticket.ticket_id || "").toLowerCase();
        const title = String(ticket.title || "").toLowerCase();
        const desc = String(ticket.description || "").toLowerCase();
        return id.includes(term) || title.includes(term) || desc.includes(term);
    });

    // --- 5. Render Logic ---
    if (loading)
        return (
            <div style={styles.pageContainer}>
                <div style={styles.spinnerContainer}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading tickets...</p>
                </div>
            </div>
        );

    return (
        <div style={styles.pageContainer}>
            {/* --- Toast Notification --- */}
            {toast.show && (
                <div
                    style={{
                        ...styles.toast,
                        ...(toast.type === "error"
                            ? styles.toastError
                            : styles.toastSuccess),
                    }}>
                    <div style={styles.toastContent}>
                        {toast.type === "success" ? (
                            <CheckIcon />
                        ) : (
                            <span style={styles.errorIcon}>⚠</span>
                        )}
                        <span style={styles.toastMessage}>{toast.message}</span>
                    </div>
                    <button
                        style={styles.toastClose}
                        onClick={() =>
                            setToast({ show: false, message: "", type: "" })
                        }>
                        <CloseIcon />
                    </button>
                </div>
            )}

            {/* --- Confirmation Modal --- */}
            {confirmModal.isOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.confirmModal}>
                        <div style={styles.confirmHeader}>
                            <h3 style={styles.confirmTitle}>
                                {confirmModal.title}
                            </h3>
                        </div>
                        <div style={styles.confirmBody}>
                            <p>{confirmModal.message}</p>
                        </div>
                        <div style={styles.confirmFooter}>
                            <button
                                onClick={() =>
                                    setConfirmModal({
                                        ...confirmModal,
                                        isOpen: false,
                                    })
                                }
                                style={styles.btnSecondary}>
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmModal.onConfirm)
                                        confirmModal.onConfirm();
                                    setConfirmModal({
                                        ...confirmModal,
                                        isOpen: false,
                                    });
                                }}
                                style={styles.btnPrimary}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Create/Edit Ticket Modal --- */}
            {showCreateForm && (
                <div
                    style={styles.modalOverlay}
                    onClick={() => {
                        setShowCreateForm(false);
                        setEditTicket(null);
                    }}>
                    <div
                        style={styles.largeModal}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                {editTicket
                                    ? "Edit Ticket"
                                    : "Create New Ticket"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditTicket(null);
                                }}
                                style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <CreateTicket
                                onTicketCreated={handleTicketCreated}
                                isEdit={!!editTicket}
                                initialData={editTicket}
                                onTicketUpdated={() => {
                                    setEditTicket(null);
                                    handleTicketCreated();
                                }}
                                onClose={() => {
                                    setShowCreateForm(false);
                                    setEditTicket(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- View Ticket Modal --- */}
            {viewTicket && (
                <div
                    style={styles.modalOverlay}
                    onClick={() => setViewTicket(null)}>
                    <div
                        style={styles.viewModal}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={styles.viewModalHeader}>
                            <h3 style={styles.viewModalTitle}>
                                Ticket Details
                            </h3>
                            <button
                                onClick={() => setViewTicket(null)}
                                style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.viewModalBody}>
                            <div style={styles.ticketCard}>
                                <div style={styles.ticketHeader}>
                                    <div style={styles.ticketId}>
                                        <span style={styles.ticketIdLabel}>
                                            Ticket ID:
                                        </span>
                                        <span style={styles.ticketIdValue}>
                                            {viewTicket.ticket_id}
                                        </span>
                                    </div>
                                    <div style={styles.ticketStatusContainer}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                ...getPriorityStyle(
                                                    getPriorityName(viewTicket),
                                                ),
                                            }}>
                                            {getPriorityName(viewTicket)}
                                        </span>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                ...getStatusStyle(
                                                    getStatusName(viewTicket),
                                                ),
                                            }}>
                                            {getStatusName(viewTicket)}
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.ticketSection}>
                                    <h4 style={styles.sectionTitle}>
                                        Ticket Information
                                    </h4>
                                    <div style={styles.infoGrid}>
                                        <div style={styles.infoItem}>
                                            <h5 style={styles.infoLabel}>
                                                Title
                                            </h5>
                                            <p style={styles.infoValue}>
                                                {viewTicket.title}
                                            </p>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <h5 style={styles.infoLabel}>
                                                Description
                                            </h5>
                                            <p style={styles.infoValue}>
                                                {viewTicket.description}
                                            </p>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <h5 style={styles.infoLabel}>
                                                <BuildingIcon /> Company
                                            </h5>
                                            <p style={styles.infoValue}>
                                                {getCompanyName(viewTicket)}
                                            </p>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <h5 style={styles.infoLabel}>
                                                Department
                                            </h5>
                                            <p style={styles.infoValue}>
                                                {viewTicket.department_id
                                                    ?.name || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.ticketSection}>
                                    <h4 style={styles.sectionTitle}>
                                        People & Dates
                                    </h4>
                                    <div style={styles.infoGrid}>
                                        <div style={styles.infoItem}>
                                            <h5 style={styles.infoLabel}>
                                                <UserIcon /> Raised By
                                            </h5>
                                            <p style={styles.infoValue}>
                                                {viewTicket.raised_by?.name ||
                                                    "-"}
                                            </p>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <h5 style={styles.infoLabel}>
                                                <CalendarIcon /> Created On
                                            </h5>
                                            <p style={styles.infoValue}>
                                                {new Date(
                                                    viewTicket.createdAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {viewTicket.closed_at && (
                                            <div style={styles.infoItem}>
                                                <h5 style={styles.infoLabel}>
                                                    <CalendarIcon /> Closed On
                                                </h5>
                                                <p style={styles.infoValue}>
                                                    {new Date(
                                                        viewTicket.closed_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {viewTicket.image && (
                                    <div style={styles.ticketSection}>
                                        <h4 style={styles.sectionTitle}>
                                            Attachment
                                        </h4>
                                        <div style={styles.imageContainer}>
                                            <img
                                                src={`http://localhost:5000/${viewTicket.image}`}
                                                alt="ticket attachment"
                                                style={styles.detailImage}
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Work Analysis List for this ticket */}
                                <div style={styles.ticketSection}>
                                    <h4 style={styles.sectionTitle}>
                                        Work Analyses
                                    </h4>
                                    {loadingAnalyses ? (
                                        <p style={{ color: "#6b7280" }}>
                                            Loading analyses...
                                        </p>
                                    ) : (
                                        (() => {
                                            const analyses =
                                                getAnalysesForTicket(
                                                    viewTicket,
                                                );
                                            if (
                                                !analyses ||
                                                analyses.length === 0
                                            )
                                                return (
                                                    <p
                                                        style={{
                                                            color: "#6b7280",
                                                        }}>
                                                        No work analyses for
                                                        this ticket.
                                                    </p>
                                                );
                                            return (
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gap: "10px",
                                                    }}>
                                                    {analyses.map((an) => (
                                                        <div
                                                            key={
                                                                an._id ||
                                                                an.analysis_id
                                                            }
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #e5e7eb",
                                                                borderRadius:
                                                                    "8px",
                                                                background:
                                                                    "white",
                                                                display: "flex",
                                                                gap: "12px",
                                                                alignItems:
                                                                    "flex-start",
                                                            }}>
                                                            <div
                                                                style={{
                                                                    flex: 1,
                                                                }}>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        justifyContent:
                                                                            "space-between",
                                                                        alignItems:
                                                                            "center",
                                                                    }}>
                                                                    <div>
                                                                        <strong>
                                                                            {an.analysis_id ||
                                                                                an._id}
                                                                        </strong>
                                                                        {" — "}
                                                                        <span>
                                                                            {an.worker_id ||
                                                                                an.worker_name ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            fontSize:
                                                                                "12px",
                                                                            color: "#6b7280",
                                                                        }}>
                                                                        {an.created_at
                                                                            ? new Date(
                                                                                  an.created_at,
                                                                              ).toLocaleString()
                                                                            : an.createdAt
                                                                              ? new Date(
                                                                                    an.createdAt,
                                                                                ).toLocaleString()
                                                                              : ""}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        marginTop: 6,
                                                                        fontSize: 13,
                                                                        color: "#374151",
                                                                    }}>
                                                                    Material
                                                                    Required:{" "}
                                                                    {an.material_required ||
                                                                        "No"}
                                                                </div>
                                                                {an.material_description && (
                                                                    <div
                                                                        style={{
                                                                            marginTop: 6,
                                                                            fontSize: 13,
                                                                            color: "#374151",
                                                                        }}>
                                                                        {
                                                                            an.material_description
                                                                        }
                                                                    </div>
                                                                )}
                                                                <div
                                                                    style={{
                                                                        marginTop: 8,
                                                                        display:
                                                                            "flex",
                                                                        gap: 8,
                                                                        alignItems:
                                                                            "center",
                                                                    }}>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 12,
                                                                            color: "#6b7280",
                                                                        }}>
                                                                        <strong>
                                                                            Status:
                                                                        </strong>{" "}
                                                                        {an.approval_status ||
                                                                            "Pending"}
                                                                    </div>
                                                                    {an.approved_by && (
                                                                        <div
                                                                            style={{
                                                                                fontSize: 12,
                                                                                color: "#6b7280",
                                                                            }}>
                                                                            <strong>
                                                                                Approved
                                                                                By:
                                                                            </strong>{" "}
                                                                            {an
                                                                                .approved_by
                                                                                .name ||
                                                                                an.approved_by}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    width: 140,
                                                                    textAlign:
                                                                        "right",
                                                                }}>
                                                                {an.uploaded_images &&
                                                                an
                                                                    .uploaded_images
                                                                    .length >
                                                                    0 ? (
                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                "flex",
                                                                            gap: 6,
                                                                            justifyContent:
                                                                                "flex-end",
                                                                            flexWrap:
                                                                                "wrap",
                                                                        }}>
                                                                        {an.uploaded_images
                                                                            .slice(
                                                                                0,
                                                                                3,
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    img,
                                                                                    idx,
                                                                                ) => {
                                                                                    const normalized =
                                                                                        img &&
                                                                                        typeof img ===
                                                                                            "string"
                                                                                            ? img.replace(
                                                                                                  /\\/g,
                                                                                                  "/",
                                                                                              )
                                                                                            : img;
                                                                                    const src =
                                                                                        normalized &&
                                                                                        normalized.startsWith(
                                                                                            "http",
                                                                                        )
                                                                                            ? normalized
                                                                                            : `http://localhost:5000/${normalized}`;
                                                                                    return (
                                                                                        <img
                                                                                            key={
                                                                                                idx
                                                                                            }
                                                                                            src={
                                                                                                src
                                                                                            }
                                                                                            alt={`wa-${idx}`}
                                                                                            style={{
                                                                                                width: 48,
                                                                                                height: 48,
                                                                                                objectFit:
                                                                                                    "cover",
                                                                                                borderRadius: 6,
                                                                                                border: "1px solid #e5e7eb",
                                                                                            }}
                                                                                        />
                                                                                    );
                                                                                },
                                                                            )}
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        style={{
                                                                            color: "#9ca3af",
                                                                            fontSize: 12,
                                                                        }}>
                                                                        No
                                                                        images
                                                                    </div>
                                                                )}

                                                                <div
                                                                    style={{
                                                                        marginTop: 8,
                                                                    }}>
                                                                    <button
                                                                        onClick={() =>
                                                                            setSelectedAnalysis(
                                                                                an,
                                                                            )
                                                                        }
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid #e5e7eb",
                                                                            background:
                                                                                "white",
                                                                            cursor: "pointer",
                                                                            fontSize: 12,
                                                                        }}>
                                                                        View
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Analysis Detail Modal --- */}
            {selectedAnalysis && (
                <div
                    style={styles.modalOverlay}
                    onClick={() => setSelectedAnalysis(null)}>
                    <div
                        style={styles.largeModal}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                Analysis Details -{" "}
                                {selectedAnalysis.analysis_id ||
                                    selectedAnalysis._id}
                            </h3>
                            <button
                                onClick={() => setSelectedAnalysis(null)}
                                style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={{ display: "grid", gap: 12 }}>
                                <div>
                                    <strong>Ticket:</strong>{" "}
                                    {selectedAnalysis.ticket_id?.title ||
                                        selectedAnalysis.ticket_title ||
                                        "-"}
                                </div>
                                <div>
                                    <strong>Worker:</strong>{" "}
                                    {selectedAnalysis.worker_id}
                                </div>
                                <div>
                                    <strong>Material Required:</strong>{" "}
                                    {selectedAnalysis.material_required}
                                </div>
                                {selectedAnalysis.material_description && (
                                    <div>
                                        <strong>Description:</strong>
                                        <div style={{ marginTop: 6 }}>
                                            {
                                                selectedAnalysis.material_description
                                            }
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <strong>Status:</strong>{" "}
                                    {selectedAnalysis.approval_status}
                                </div>
                                {selectedAnalysis.approved_by && (
                                    <div>
                                        <strong>Approved By:</strong>{" "}
                                        {selectedAnalysis.approved_by.name ||
                                            selectedAnalysis.approved_by}
                                    </div>
                                )}

                                {selectedAnalysis.uploaded_images &&
                                    selectedAnalysis.uploaded_images.length >
                                        0 && (
                                        <div>
                                            <strong>Images</strong>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                    marginTop: 8,
                                                    flexWrap: "wrap",
                                                }}>
                                                {selectedAnalysis.uploaded_images.map(
                                                    (img, i) => {
                                                        const normalized =
                                                            img &&
                                                            typeof img ===
                                                                "string"
                                                                ? img.replace(
                                                                      /\\/g,
                                                                      "/",
                                                                  )
                                                                : img;
                                                        const src =
                                                            normalized &&
                                                            normalized.startsWith(
                                                                "http",
                                                            )
                                                                ? normalized
                                                                : `http://localhost:5000/${normalized}`;
                                                        return (
                                                            <img
                                                                key={i}
                                                                src={src}
                                                                alt={`wa-img-${i}`}
                                                                style={{
                                                                    width: 140,
                                                                    height: 100,
                                                                    objectFit:
                                                                        "cover",
                                                                    borderRadius: 8,
                                                                    border: "1px solid #e5e7eb",
                                                                }}
                                                            />
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Approval Modal --- */}
            {showApprovalModal && selectedTicketForApproval && (
                <div
                    style={styles.modalOverlay}
                    onClick={() => {
                        setShowApprovalModal(false);
                        setSelectedTicketForApproval(null);
                    }}>
                    <div
                        style={styles.largeModal}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                Ticket Approval -{" "}
                                {selectedTicketForApproval.ticket_number}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowApprovalModal(false);
                                    setSelectedTicketForApproval(null);
                                }}
                                style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <ApprovalModule
                                ticketId={selectedTicketForApproval._id}
                                ticketTitle={selectedTicketForApproval.title}
                                onApprovalSuccess={() => {
                                    setShowApprovalModal(false);
                                    setSelectedTicketForApproval(null);
                                    fetchTickets();
                                    showToast(
                                        "Approval submitted successfully!",
                                        "success",
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- Work Analysis Modal --- */}
            {showWorkAnalysisModal && selectedTicketForAnalysis && (
                <div
                    style={styles.modalOverlay}
                    onClick={() => {
                        setShowWorkAnalysisModal(false);
                        setSelectedTicketForAnalysis(null);
                    }}>
                    <div
                        style={styles.largeModal}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                Work Analysis -{" "}
                                {selectedTicketForAnalysis.ticket_number}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowWorkAnalysisModal(false);
                                    setSelectedTicketForAnalysis(null);
                                }}
                                style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <WorkAnalysisForm
                                ticketId={selectedTicketForAnalysis._id}
                                ticketTitle={selectedTicketForAnalysis.title}
                                onSuccess={() => {
                                    setShowWorkAnalysisModal(false);
                                    setSelectedTicketForAnalysis(null);
                                    fetchTickets();
                                    fetchWorkAnalyses();
                                    showToast(
                                        "Work Analysis submitted successfully!",
                                        "success",
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- Main Page Content --- */}
            <div style={styles.headerSection}>
                <div>
                    <h2 style={styles.mainTitle}>Ticket Management</h2>
                    <p style={styles.subtitle}>
                        Manage and track support tickets
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button
                        onClick={() => {
                            setEditTicket(null);
                            setShowCreateForm(true);
                        }}
                        style={styles.primaryBtn}>
                        + Create Ticket
                    </button>
                   
                </div>
            </div>

            <div style={styles.searchBarWrapper}>
                <div style={styles.searchInputWrapper}>
                    <span style={styles.searchIcon}>
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by ID, title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            <div style={styles.cardContainer}>
                {filteredTickets.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyStateIcon}>📋</div>
                        <h3 style={styles.emptyStateTitle}>No tickets found</h3>
                        <p style={styles.emptyStateText}>
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Create your first ticket to get started"}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => {
                                    setEditTicket(null);
                                    setShowCreateForm(true);
                                }}
                                style={styles.emptyStateBtn}>
                                Create New Ticket
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="desktop-view-container">
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            {[
                                                "ID",
                                                "Title",
                                                "Description",
                                                "Img",
                                                "Dept",
                                                "Company",
                                                "Raised By",
                                                "Priority",
                                                "Status",
                                                "Approval Status",
                                                "Assigned To",
                                                "Created",
                                                "Closed",
                                                "Actions",
                                            ].map((h, i) => (
                                                <th key={i} style={styles.th}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTickets.map((ticket) => (
                                            <tr
                                                key={ticket._id}
                                                style={styles.tr}>
                                                <td style={styles.td}>
                                                    <span style={styles.mono}>
                                                        {ticket.ticket_id}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <strong>
                                                        {ticket.title}
                                                    </strong>
                                                </td>
                                                <td style={styles.td}>
                                                    <span
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        title={
                                                            ticket.description
                                                        }>
                                                        {ticket.description.substring(
                                                            0,
                                                            35,
                                                        )}
                                                        ...
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    {ticket.image ? (
                                                        <img
                                                            src={`http://localhost:5000/${ticket.image}`}
                                                            alt="img"
                                                            style={styles.thumb}
                                                            onClick={() =>
                                                                setViewTicket(
                                                                    ticket,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <span
                                                            style={
                                                                styles.noData
                                                            }>
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={styles.td}>
                                                    {ticket.department_id
                                                        ?.name || "-"}
                                                </td>
                                                <td style={styles.td}>
                                                    {getCompanyName(ticket)}
                                                </td>
                                                <td style={styles.td}>
                                                    {ticket.raised_by?.name ||
                                                        "-"}
                                                </td>
                                                <td style={styles.td}>
                                                    <span
                                                        style={{
                                                            ...styles.badge,
                                                            ...getPriorityStyle(
                                                                getPriorityName(
                                                                    ticket,
                                                                ),
                                                            ),
                                                        }}>
                                                        {getPriorityName(
                                                            ticket,
                                                        )}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <span
                                                        style={{
                                                            ...styles.badge,
                                                            ...getStatusStyle(
                                                                getStatusName(
                                                                    ticket,
                                                                ),
                                                            ),
                                                        }}>
                                                        {getStatusName(ticket)}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    {ticket.approval_status ? (
                                                        <span
                                                            style={{
                                                                ...styles.badge,
                                                                background:
                                                                    ticket.approval_status ===
                                                                    "Approved"
                                                                        ? "#dcfce7"
                                                                        : "#fee2e2",
                                                                color:
                                                                    ticket.approval_status ===
                                                                    "Approved"
                                                                        ? "#166534"
                                                                        : "#991b1b",
                                                            }}>
                                                            {
                                                                ticket.approval_status
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span
                                                            style={
                                                                styles.badge
                                                            }>
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={styles.td}>
                                                    {ticket.assigned_to &&
                                                    ticket.assigned_to.length >
                                                        0 ? (
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}>
                                                            {ticket.assigned_to
                                                                .slice(0, 2)
                                                                .map(
                                                                    (
                                                                        user,
                                                                        idx,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            title={
                                                                                user.name
                                                                            }
                                                                            style={{
                                                                                whiteSpace:
                                                                                    "nowrap",
                                                                                overflow:
                                                                                    "hidden",
                                                                                textOverflow:
                                                                                    "ellipsis",
                                                                            }}>
                                                                            {user.name ||
                                                                                "Unknown"}
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {ticket.assigned_to
                                                                .length > 2 && (
                                                                <div
                                                                    style={{
                                                                        color: "#666",
                                                                        fontSize:
                                                                            "11px",
                                                                    }}>
                                                                    +
                                                                    {ticket
                                                                        .assigned_to
                                                                        .length -
                                                                        2}{" "}
                                                                    more
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                color: "#999",
                                                            }}>
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={styles.td}>
                                                    {new Date(
                                                        ticket.createdAt,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td style={styles.td}>
                                                    {ticket.closed_at
                                                        ? new Date(
                                                              ticket.closed_at,
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles.actions}>
                                                        <button
                                                            onClick={() =>
                                                                setViewTicket(
                                                                    ticket,
                                                                )
                                                            }
                                                            title="View"
                                                            style={
                                                                styles.iconButton
                                                            }>
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2">
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="3"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditTicket(
                                                                    ticket,
                                                                );
                                                                setShowCreateForm(
                                                                    true,
                                                                );
                                                            }}
                                                            title="Edit"
                                                            style={
                                                                styles.iconButton
                                                            }>
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTicketForApproval(
                                                                    ticket,
                                                                );
                                                                setShowApprovalModal(
                                                                    true,
                                                                );
                                                            }}
                                                            title="Approve"
                                                            style={{
                                                                ...styles.iconButton,
                                                                color: "#10b981",
                                                            }}>
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2">
                                                                <path d="M3 3h18v18H3z" />
                                                                <path d="M9 12l2 2 4-4" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTicketForAnalysis(
                                                                    ticket,
                                                                );
                                                                setShowWorkAnalysisModal(
                                                                    true,
                                                                );
                                                            }}
                                                            title="Work Analysis"
                                                            style={{
                                                                ...styles.iconButton,
                                                                color: "#3b82f6",
                                                            }}>
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2">
                                                                <path d="M9 11l3 3L22 4" />
                                                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    ticket,
                                                                )
                                                            }
                                                            title="Delete"
                                                            style={{
                                                                ...styles.iconButton,
                                                                color: "#ef4444",
                                                            }}>
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile/Tablet Card View */}
                        <div className="mobile-view-container">
                            <div className="mobile-card-grid">
                                {filteredTickets.map((ticket) => (
                                    <div
                                        key={ticket._id}
                                        style={styles.cardItem}>
                                        {/* Header: ID, Status, Priority */}
                                        <div style={styles.cardHeader}>
                                            <span style={styles.cardId}>
                                                #{ticket.ticket_id}
                                            </span>
                                            <div style={styles.headerBadges}>
                                                <span
                                                    style={{
                                                        ...styles.badge,
                                                        ...getPriorityStyle(
                                                            getPriorityName(
                                                                ticket,
                                                            ),
                                                        ),
                                                        fontSize: "10px",
                                                        padding: "2px 6px",
                                                    }}>
                                                    {getPriorityName(ticket)}
                                                </span>
                                                <span
                                                    style={{
                                                        ...styles.badge,
                                                        ...getStatusStyle(
                                                            getStatusName(
                                                                ticket,
                                                            ),
                                                        ),
                                                        fontSize: "10px",
                                                        padding: "2px 6px",
                                                    }}>
                                                    {getStatusName(ticket)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div style={styles.cardTitleBlock}>
                                            <h3>{ticket.title}</h3>
                                        </div>

                                        {/* Image Attachment */}
                                        {ticket.image && (
                                            <div style={styles.cardImageBlock}>
                                                <img
                                                    src={`http://localhost:5000/${ticket.image}`}
                                                    alt="Attachment"
                                                    style={styles.cardImage}
                                                />
                                            </div>
                                        )}

                                        {/* Data Rows (Card Body) */}
                                        <div style={styles.cardDataBody}>
                                            {/* Row 1: Company | Dept */}
                                            <div style={styles.dataRow}>
                                                <div style={styles.dataCol}>
                                                    <span style={styles.label}>
                                                        <BuildingIcon /> Company
                                                    </span>
                                                    <span style={styles.value}>
                                                        {getCompanyName(ticket)}
                                                    </span>
                                                </div>
                                                <div style={styles.dataCol}>
                                                    <span style={styles.label}>
                                                        Dept
                                                    </span>
                                                    <span style={styles.value}>
                                                        {ticket.department_id
                                                            ?.name || "-"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Row 2: Raised By | Approval */}
                                            <div style={styles.dataRow}>
                                                <div style={styles.dataCol}>
                                                    <span style={styles.label}>
                                                        <UserIcon /> Raised
                                                    </span>
                                                    <span style={styles.value}>
                                                        {ticket.raised_by
                                                            ?.name || "-"}
                                                    </span>
                                                </div>
                                                <div style={styles.dataCol}>
                                                    <span style={styles.label}>
                                                        Approval
                                                    </span>
                                                    <span
                                                        style={{
                                                            ...styles.value,
                                                            ...styles.approvalText(
                                                                ticket.approval_status,
                                                            ),
                                                        }}>
                                                        {ticket.approval_status ||
                                                            "Pending"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Row 3: Assigned To | Created */}
                                            <div style={styles.dataRow}>
                                                <div style={styles.dataCol}>
                                                    <span style={styles.label}>
                                                        Assigned
                                                    </span>
                                                    <span style={styles.value}>
                                                        {ticket.assigned_to &&
                                                        ticket.assigned_to
                                                            .length > 0
                                                            ? ticket
                                                                  .assigned_to[0]
                                                                  .name +
                                                              (ticket
                                                                  .assigned_to
                                                                  .length > 1
                                                                  ? ` +${ticket.assigned_to.length - 1}`
                                                                  : "")
                                                            : "-"}
                                                    </span>
                                                </div>
                                                <div style={styles.dataCol}>
                                                    <span style={styles.label}>
                                                        <CalendarIcon /> Created
                                                    </span>
                                                    <span style={styles.value}>
                                                        {new Date(
                                                            ticket.createdAt,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description Block */}
                                            <div style={styles.descRow}>
                                                <span style={styles.label}>
                                                    Description
                                                </span>
                                                <p style={styles.descText}>
                                                    {ticket.description}
                                                </p>
                                            </div>

                                            {/* Closed Date (if applicable) */}
                                            {ticket.closed_at && (
                                                <div style={styles.dataRow}>
                                                    <div
                                                        style={
                                                            styles.dataColFull
                                                        }>
                                                        <span
                                                            style={
                                                                styles.label
                                                            }>
                                                            <CalendarIcon />{" "}
                                                            Closed On
                                                        </span>
                                                        <span
                                                            style={
                                                                styles.value
                                                            }>
                                                            {new Date(
                                                                ticket.closed_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Footer */}
                                        <div style={styles.cardActions}>
                                            <button
                                                onClick={() =>
                                                    setViewTicket(ticket)
                                                }
                                                style={styles.actionBtn}>
                                                View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditTicket(ticket);
                                                    setShowCreateForm(true);
                                                }}
                                                style={styles.actionBtn}>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTicketForApproval(
                                                        ticket,
                                                    );
                                                    setShowApprovalModal(true);
                                                }}
                                                style={{
                                                    ...styles.actionBtn,
                                                    ...styles.approveBtnStyle,
                                                }}>
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTicketForAnalysis(
                                                        ticket,
                                                    );
                                                    setShowWorkAnalysisModal(
                                                        true,
                                                    );
                                                }}
                                                style={{
                                                    ...styles.actionBtn,
                                                    ...styles.analysisBtnStyle,
                                                }}>
                                                Analysis
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(ticket)
                                                }
                                                style={{
                                                    ...styles.actionBtn,
                                                    ...styles.deleteBtnStyle,
                                                }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- Helper Styles Functions ---
const getPriorityStyle = (name) => {
    const n = String(name).toLowerCase();
    if (n.includes("critical"))
        return { background: "#fee2e2", color: "#991b1b" };
    if (n.includes("high")) return { background: "#ffedd5", color: "#9a3412" };
    if (n.includes("low")) return { background: "#d1fae5", color: "#065f46" };
    return { background: "#fef3c7", color: "#92400e" };
};

const getStatusStyle = (name) => {
    const n = String(name).toLowerCase();
    if (n.includes("closed"))
        return {
            background: "#f3f4f6",
            color: "#4b5563",
            textDecoration: "line-through",
        };
    if (n.includes("progress"))
        return { background: "#e0e7ff", color: "#3730a3" };
    if (n.includes("resolved"))
        return { background: "#dcfce7", color: "#166534" };
    return { background: "#dbeafe", color: "#1e40af" };
};

// --- CSS Styles Object ---
const styles = {
    pageContainer: {
        fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "20px",
        color: "#111827",
    },
    headerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "16px",
    },
    mainTitle: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        margin: "5px 0 0 0",
        color: "#6b7280",
        fontSize: "14px",
    },
    primaryBtn: {
        background: "#4f46e5",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
        transition: "all 0.2s",
    },
    searchBarWrapper: {
        marginBottom: "20px",
    },
    searchInputWrapper: {
        position: "relative",
        maxWidth: "400px",
    },
    searchIcon: {
        position: "absolute",
        left: "12px",
        top: "12px",
        color: "#9ca3af",
    },
    searchInput: {
        width: "100%",
        padding: "10px 10px 10px 40px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        outline: "none",
        fontSize: "14px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s",
    },

    cardContainer: {
        background: "transparent",
        borderRadius: "0",
        boxShadow: "none",
        overflow: "visible",
    },

    // --- CARD BASED DESIGN (Mobile/Tablet) Styles ---
    cardItem: {
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
    },

    // Header Section
    cardHeader: {
        padding: "12px 16px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fafafa",
    },
    cardId: {
        fontFamily: "monospace",
        fontSize: "13px",
        fontWeight: 700,
        color: "#4b5563",
    },
    headerBadges: {
        display: "flex",
        gap: "4px",
    },
    badge: {
        borderRadius: "9999px",
        fontWeight: 600,
        textTransform: "uppercase",
        padding: "2px 8px",
        fontSize: "11px",
    },

    // Title Block
    cardTitleBlock: {
        padding: "16px 16px 8px 16px",
    },
    "cardTitleBlock h3": {
        margin: 0,
        fontSize: "16px",
        fontWeight: "700",
        color: "#111827",
        lineHeight: "1.4",
    },

    // Image Block
    cardImageBlock: {
        width: "50%",
        height: "200px",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer",
    },

    // Data Body (The Card Fields)
    cardDataBody: {
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        backgroundColor: "#ffffff",
    },
    dataRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        paddingBottom: "12px",
        borderBottom: "1px dashed #f3f4f6",
    },
    dataCol: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    dataColFull: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    label: {
        fontSize: "11px",
        textTransform: "uppercase",
        color: "#9ca3af",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    value: {
        fontSize: "13px",
        color: "#374151",
        fontWeight: 500,
        wordBreak: "break-word",
    },
    approvalText: (status) => ({
        color:
            status === "Approved"
                ? "#059669"
                : status === "Rejected"
                  ? "#dc2626"
                  : "#d97706",
    }),

    // Description
    descRow: {
        marginTop: "4px",
        paddingBottom: "12px",
        borderBottom: "1px dashed #f3f4f6",
    },
    descText: {
        margin: 0,
        fontSize: "13px",
        color: "#4b5563",
        lineHeight: "1.5",
    },

    // Footer Actions
    cardActions: {
        padding: "12px 16px",
        backgroundColor: "#f9fafb",
        borderTop: "1px solid #e5e7eb",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
    },
    actionBtn: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        background: "white",
        color: "#4b5563",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
    },
    approveBtnStyle: {
        borderColor: "#a7f3d0",
        color: "#059669",
        backgroundColor: "#ecfdf5",
    },
    analysisBtnStyle: {
        borderColor: "#bfdbfe",
        color: "#2563eb",
        backgroundColor: "#eff6ff",
    },
    deleteBtnStyle: {
        borderColor: "#fecaca",
        color: "#dc2626",
        backgroundColor: "#fef2f2",
    },

    // Desktop Styles (Table)
    tableContainer: {
        overflowX: "auto",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "1200px" },
    th: {
        textAlign: "left",
        padding: "16px",
        background: "#f9fafb",
        color: "#6b7280",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "600",
        borderBottom: "1px solid #e5e7eb",
    },
    tr: {
        borderBottom: "1px solid #f3f4f6",
        transition: "background-color 0.2s",
    },
    td: {
        padding: "16px",
        fontSize: "14px",
        color: "#374151",
        verticalAlign: "middle",
    },
    thumb: {
        width: "40px",
        height: "40px",
        borderRadius: "6px",
        objectFit: "cover",
        cursor: "pointer",
        border: "1px solid #eee",
    },
    noData: { color: "#d1d5db", fontStyle: "italic" },
    mono: { fontFamily: "monospace", color: "#6b7280" },
    actions: { display: "flex", gap: "8px" },
    iconButton: {
        background: "transparent",
        border: "1px solid #e5e7eb",
        color: "#6b7280",
        width: "32px",
        height: "32px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    emptyState: {
        padding: "60px 20px",
        textAlign: "center",
        color: "#9ca3af",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "white",
        borderRadius: "12px",
    },
    emptyStateIcon: { fontSize: "48px", marginBottom: "16px" },
    emptyStateTitle: {
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 8px 0",
        color: "#4b5563",
    },
    emptyStateText: {
        fontSize: "16px",
        margin: "0 0 24px 0",
        maxWidth: "400px",
    },
    emptyStateBtn: {
        background: "#4f46e5",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },

    // Modals (Unchanged)
    viewModal: {
        background: "white",
        width: "800px",
        maxWidth: "90%",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
        overflow: "hidden",
    },
    viewModalHeader: {
        padding: "24px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f9fafb",
    },
    viewModalTitle: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "700",
        color: "#111827",
    },
    viewModalBody: {
        padding: "0",
        overflowY: "auto",
        backgroundColor: "#f9fafb",
    },
    ticketCard: {
        margin: "24px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
    },
    ticketHeader: {
        padding: "20px 24px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ticketId: {
        display: "flex",
        flexDirection: "column",
    },
    ticketIdLabel: {
        fontSize: "12px",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "600",
    },
    ticketIdValue: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#111827",
        fontFamily: "monospace",
    },
    ticketStatusContainer: {
        display: "flex",
        gap: "8px",
    },
    ticketSection: {
        padding: "20px 24px",
        borderBottom: "1px solid #f3f4f6",
    },
    sectionTitle: {
        margin: "0 0 16px 0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#111827",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
    },
    infoItem: {
        display: "flex",
        flexDirection: "column",
    },
    infoLabel: {
        margin: "0 0 6px 0",
        fontSize: "12px",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    infoValue: {
        margin: 0,
        fontSize: "14px",
        color: "#374151",
    },
    imageContainer: {
        width: "20%",
        marginTop: "12px",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
    },
    detailImage: {
        maxWidth: "100%",
        display: "block",
    },
    modalOverlay: {
        position: "fixed",
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    largeModal: {
        padding:"20px",
        background: "white",
        width: "700px",
        maxWidth: "80%",
        borderRadius: "12px",
        boxShadow:
            "0 20px 25px -5px rgba(255, 15, 15, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
    },
    modalHeader: {
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "600",
        color: "#111827",
    },
    modalBody: { padding: "20px", overflowY: "auto" },
    iconBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#9ca3af",
        padding: "4px",
        borderRadius: "4px",
    },
    confirmModal: {
        background: "white",
        width: "400px",
        borderRadius: "12px",
        padding: "0",
        boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    confirmHeader: { padding: "20px", borderBottom: "1px solid #f3f4f6" },
    confirmTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "600",
        color: "#111827",
    },
    confirmBody: { padding: "20px", fontSize: "15px", color: "#374151" },
    confirmFooter: {
        padding: "15px 20px",
        background: "#f9fafb",
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
    },
    btnSecondary: {
        padding: "8px 16px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        background: "white",
        color: "#374151",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s",
    },
    btnPrimary: {
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        background: "#4f46e5",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s",
    },
    toast: {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "16px 20px",
        borderRadius: "8px",
        boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "300px",
        maxWidth: "500px",
        transform: "translateX(0)",
        transition: "transform 0.3s ease-in-out",
    },
    toastSuccess: { background: "#10b981", color: "white" },
    toastError: { background: "#ef4444", color: "white" },
    toastContent: { display: "flex", alignItems: "center" },
    toastMessage: { marginLeft: "10px" },
    toastClose: {
        background: "none",
        border: "none",
        color: "inherit",
        cursor: "pointer",
        padding: "0",
        marginLeft: "10px",
        opacity: 0.8,
    },
    errorIcon: { fontSize: "18px" },
    spinnerContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #4f46e5",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "16px",
    },
    loadingText: {
        color: "#6b7280",
        fontSize: "16px",
    },
};

const styleSheet = document.createElement("style");

styleSheet.innerText = ` 
@keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
}

/* --- RESPONSIVE LOGIC --- */
/* Hide Desktop Table on Mobile, Show Cards */
@media (max-width: 1024px) {
    .desktop-view-container {
        display: none !important;
    }
    .mobile-view-container {
        display: block !important;
    }
    .mobile-card-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

/* Hide Mobile Cards on Desktop, Show Table */
@media (min-width: 1025px) {
    .desktop-view-container {
        display: block !important;
    }
    .mobile-view-container {
        display: none !important;
    }
}

/* Tablet Card Layout (600px to 1024px) */
@media (min-width: 600px) and (max-width: 1024px) {
    .mobile-card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* --- INTERACTION STYLES --- */
tr:hover {
    background-color: #f9fafb;
}

.iconButton:hover {
    background-color: #f3f4f6;
    color: #4b5563;
}

.thumb:hover {
    transform: scale(1.1);
}

/* Mobile Card Interaction */
.cardItem:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.actionBtn:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
}

.cardImage:hover {
    opacity: 0.9;
}
`;

document.head.appendChild(styleSheet);

export default TicketList;
