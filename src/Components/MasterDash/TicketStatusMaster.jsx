import React, { useState, useEffect } from "react";
import {
    getTicketStatuses,
    createTicketStatus,
    updateTicketStatus,
    deleteTicketStatus,
} from "@/Components/Api/MasterApi/ticketStatusApi";

// --- ICONS ---
const PlusIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

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

const ViewIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EditIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const DeleteIcon = () => (
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

// --- COMPONENT ---
const TicketStatusMaster = () => {
    const emptyForm = {
        id: null,
        name: "",
        sortOrder: "",
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchTicketStatuses();
    }, []);

    const fetchTicketStatuses = async () => {
        try {
            const data = await getTicketStatuses();
            setTicketStatuses(data);
        } catch (error) {
            console.error("Failed to fetch ticket statuses", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleAddNew = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancel = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if name is empty
            if (!form.name.trim()) {
                alert("Ticket Status name is required");
                setLoading(false);
                return;
            }

            // Check for duplicate name (only if creating new, not editing)
            if (!isEdit) {
                const isDuplicate = ticketStatuses.some(
                    (status) => String(status.name).toLowerCase().trim() === String(form.name).toLowerCase().trim()
                );
                
                if (isDuplicate) {
                    alert(`Ticket Status "${form.name}" already exists! Please use a different name.`);
                    setLoading(false);
                    return;
                }
            }

            if (isEdit) {
                await updateTicketStatus(form.id, form);
            } else {
                await createTicketStatus(form);
            }

            await fetchTicketStatuses();
            setForm(emptyForm);
            setIsEdit(false);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save ticket status.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (ticketStatus) => {
        setForm({ ...ticketStatus, id: ticketStatus._id });
        setIsEdit(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteClick = (ticketStatus) => {
        setDeleteTarget(ticketStatus);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteTicketStatus(deleteTarget._id);
            fetchTicketStatuses();
            setDeleteTarget(null);
        } catch (error) {
            alert("Failed to delete ticket status");
        }
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleView = (ticketStatus) => {
        setViewData(ticketStatus);
    };

    const closePopup = () => {
        setViewData(null);
    };

    const filteredTicketStatuses = ticketStatuses.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const formGridColumns = isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(200px, 1fr))";
    const modalWidth = isMobile ? "95%" : "90%";
    const modalMaxWidth = isMobile ? "none" : "400px";
    const pagePadding = isMobile ? "10px" : "20px";

    return (
        <div style={{ ...styles.pageWrapper, padding: pagePadding }}>
            <style>{`
                @media (max-width: 768px) {
                    .responsive-hide-mobile { display: none; }
                }
            `}</style>

            {/* 1. VIEW DETAILS MODAL */}
            {viewData && (
                <div style={styles.modalOverlay}>
                    <div
                        style={{
                            ...styles.modalContent,
                            width: modalWidth,
                            maxWidth: modalMaxWidth,
                        }}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{viewData.name}</h3>
                            <button
                                onClick={closePopup}
                                style={styles.iconBtnClose}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.detailRow}>
                                <strong>Sort Order:</strong>
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "#374151",
                                    }}>
                                    #{viewData.sortOrder}
                                </span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Status:</strong>
                                <span
                                    style={{
                                        ...styles.statusBadge,
                                        color:
                                            viewData.status === "Active"
                                                ? "#065f46"
                                                : "#9f1239",
                                        backgroundColor:
                                            viewData.status === "Active"
                                                ? "#d1fae5"
                                                : "#fecdd3",
                                    }}>
                                    {viewData.status}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={closePopup}
                            style={styles.modalCloseBtn}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* 2. DELETE CONFIRMATION MODAL */}
            {deleteTarget && (
                <div style={styles.modalOverlay}>
                    <div
                        style={{
                            ...styles.deleteModalContent,
                            width: modalWidth,
                            maxWidth: modalMaxWidth,
                        }}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.deleteTitle}>
                                Delete Ticket Status?
                            </h3>
                        </div>
                        <div style={styles.deleteBody}>
                            <p style={styles.deleteMessage}>
                                Are you sure you want to delete{" "}
                                <strong>{deleteTarget.name}</strong>?<br />
                                This action cannot be undone.
                            </p>
                        </div>
                        <div style={styles.deleteActions}>
                            <button
                                onClick={cancelDelete}
                                style={styles.cancelDeleteBtn}>
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={styles.confirmDeleteBtn}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={styles.container}>
                {/* HEADER SECTION */}
                <div style={styles.headerRow}>
                    <h2
                        style={{
                            ...styles.headerTitle,
                            fontSize: isMobile ? "20px" : "28px",
                        }}>
                        Ticket Status Master
                    </h2>
                    <div style={styles.headerRightGroup}>
                        <div style={styles.searchWrapper}>
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        {!showForm && (
                            <button
                                onClick={handleAddNew}
                                style={styles.addNewBtn}>
                                <PlusIcon />
                            </button>
                        )}
                    </div>
                </div>

                {/* CONDITIONAL FORM RENDER */}
                {showForm && (
                    <form onSubmit={handleSubmit} style={styles.formCard}>
                        <div style={styles.formHeader}>
                            <h3 style={styles.formHeaderTitle}>
                                {isEdit
                                    ? "Edit Ticket Status"
                                    : "Add New Ticket Status"}
                            </h3>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={styles.cancelBtn}>
                                Cancel
                            </button>
                        </div>
                        <div
                            style={{
                                ...styles.formGrid,
                                display: "grid",
                                gridTemplateColumns: formGridColumns,
                            }}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Ticket Status Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. High"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Sort Order</label>
                                <input
                                    name="sortOrder"
                                    type="number"
                                    min="1"
                                    value={form.sortOrder}
                                    onChange={handleChange}
                                    placeholder="1"
                                    required
                                    style={{ ...styles.input, type: "number" }}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            style={styles.submitButton}
                            disabled={loading}>
                            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
                        </button>
                    </form>
                )}

                {/* LIST CARD */}
                <div style={styles.listCard}>
                    {!showForm && (
                        <h3 style={styles.listTitle}>
                            Ticket Statuses ({filteredTicketStatuses.length})
                        </h3>
                    )}
                    <div style={styles.tableResponsive}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.thLeft}>Name</th>
                                    <th style={styles.thCenter}>Sort Order</th>

                                    <th style={styles.thAction}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTicketStatuses.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={styles.noData}>
                                            No ticket statuses found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTicketStatuses.map((t) => (
                                        <tr key={t._id} style={styles.tr}>
                                            <td style={styles.tdLeft}>
                                                <span>{t.name}</span>
                                            </td>
                                            <td style={styles.tdCenter}>
                                                <span
                                                    style={{
                                                        ...styles.sortBadge,
                                                        backgroundColor:
                                                            "",
                                                        color: "#f8fafb",
                                                    }}>
                                                    #{t.sortOrder}
                                                </span>
                                            </td>

                                            <td style={styles.tdAction}>
                                                <div
                                                    style={
                                                        styles.actionButtonGroup
                                                    }>
                                                    <button
                                                        style={styles.actionBtnView}
                                                        onClick={() =>
                                                            handleView(t)
                                                        }
                                                        title="View">
                                                        <ViewIcon />
                                                    </button>
                                                    <button
                                                        style={styles.actionBtn}
                                                        onClick={() =>
                                                            handleEdit(t)
                                                        }
                                                        title="Edit">
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        style={
                                                            styles.actionBtnDelete
                                                        }
                                                        onClick={() =>
                                                            handleDeleteClick(t)
                                                        }
                                                        title="Delete">
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLESHEET ---
const styles = {
    pageWrapper: {
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: "20px",
    },
    container: { width: "100%", maxWidth: "100%" },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        marginTop: "10px",
        flexWrap: "wrap",
        gap: "10px",
    },
    headerTitle: {
        color: "#1f2937",
        fontSize: "28px",
        fontWeight: "700",
        margin: 0,
        flex: 1,
    },
    headerRightGroup: { display: "flex", gap: "15px", alignItems: "center" },
    searchWrapper: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        border: "1px solid #d1d5db",
        borderRadius: "25px",
        padding: "8px 15px",
        gap: "8px",
        width: "250px",
    },
    searchInput: {
        border: "none",
        outline: "none",
        fontSize: "14px",
        color: "#374151",
        flex: 1,
    },
    addNewBtn: {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "45px",
        height: "45px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.3)",
    },

    // --- FORM ---
    formCard: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "16px",
        marginBottom: "40px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
    },
    formHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        paddingBottom: "15px",
        borderBottom: "1px solid #f3f4f6",
        flexWrap: "wrap",
    },
    formHeaderTitle: { margin: 0, color: "#111827", fontSize: "18px" },
    cancelBtn: {
        background: "transparent",
        border: "1px solid #d1d5db",
        color: "#6b7280",
        padding: "6px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        width: "100%",
        gap: "10px",
        marginBottom: "20px",
    },
    inputGroup: { display: "flex", flexDirection: "column" },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
        marginBottom: "8px",
    },
    input: {
        
        padding: "14px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        fontSize: "16px",
        color: "#374151",
        outline: "none",
        boxSizing: "border-box",
    },
    submitButton: {
        marginTop: "25px",
        padding: "12px",
        width: "20%",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },

    // --- LIST CARD & TABLE ---
    listCard: {
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
    },
    listTitle: {
        padding: "30px",
        margin: 0,
        borderBottom: "1px solid #f3f4f6",
        color: "#111827",
        fontSize: "20px",
    },
    tableResponsive: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "700px" },

    // --- REDESIGNED TABLE STYLES ---
    th: {
        padding: "20px 15px",
        backgroundColor: "#f9fafb",
        color: "#374151",
        fontSize: "14px",
        textTransform: "uppercase",
        fontWeight: "700",
        borderBottom: "2px solid #e5e7eb",
    },
    thLeft: { textAlign: "left", padding: "20px 15px" },
    thCenter: { textAlign: "center" },
    thAction: { textAlign: "center", width: "150px" },

    tr: {
        borderBottom: "1px solid #f3f4f6",
        transition: "background-color 0.2s ease-in-out",
    },
    trHover: { "&:hover": { backgroundColor: "#f9fafb" } },

    td: {
        padding: "20px 15px",
        color: "#374151",
        fontSize: "16px",
        verticalAlign: "middle",
    },
    tdLeft: { textAlign: "left", padding: "20px 15px" },
    tdCenter: { textAlign: "center" },
    tdAction: { padding: "10px 15px", verticalAlign: "middle" },

    actionButtonGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "8px",
    },

    sortBadge: {
        color: "#f8fafb",
        backgroundColor: "#6366f1",
        padding: "4px 10px",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: "700",
        display: "inline-block",
    },
    statusBadge: {
        padding: "6px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "700",
        display: "inline-block",
    },
 actionBtn: {
        background: "#d017d6",
        color: "#e4e4e4",
        border: "none",
        borderRadius: "6px",
        width: "32px",
        height: "32px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        marginRight: "4px",
    },
    actionBtnDelete: {
        background: "#ef1414",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        width: "32px",
        height: "32px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    },
    actionBtnView: {
        background: "#7379c9",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        width: "32px",
        height: "32px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    },
    noData: {
        textAlign: "center",
        padding: "40px",
        fontSize: "16px",
        color: "#9ca3af",
        fontStyle: "italic",
    },

    // --- MODALS ---
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        background: "#fff",
        width: "90%",
        maxWidth: "400px",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0, 0.2)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        paddingBottom: "15px",
        borderBottom: "1px solid #f3f4f6",
    },
    modalTitle: {
        margin: 0,
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "700",
    },
    iconBtnClose: {
        background: "transparent",
        border: "none",
        color: "#9ca3af",
        cursor: "pointer",
        padding: "0",
        display: "flex",
        alignItems: "center",
    },
    modalBody: { textAlign: "left", marginBottom: "25px" },
    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        fontSize: "16px",
    },
    modalCloseBtn: {
        width: "100%",
        padding: "12px",
        background: "#f3f4f6",
        color: "#374151",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
    },
    deleteModalContent: {
        background: "#fff",
        width: "90%",
        maxWidth: "400px",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0, 0.2)",
        textAlign: "center",
    },
    deleteTitle: {
        margin: 0,
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "700",
    },
    deleteBody: { marginBottom: "25px" },
    deleteMessage: {
        color: "#6b7280",
        fontSize: "16px",
        lineHeight: 1.5,
        margin: 0,
    },
    deleteActions: { display: "flex", gap: "15px", justifyContent: "center" },
    cancelDeleteBtn: {
        padding: "12px 24px",
        background: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        flex: 1,
    },
    confirmDeleteBtn: {
        padding: "12px 24px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        flex: 1,
    },
};

export default TicketStatusMaster;
