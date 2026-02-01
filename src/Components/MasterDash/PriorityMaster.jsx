// --- IMPORTS ---
import React, { useState, useEffect } from "react";
import {
    getPriorities,
    createPriority,
    updatePriority,
    deletePriority,
} from "./priorityApi";

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
const PriorityMaster = () => {
    const emptyForm = {
        id: null,
        name: "",
        color: "#000000", // Default black
        status: "Active", // Default Active
    };

    const [form, setForm] = useState(emptyForm);
    const [priorities, setPriorities] = useState([]);

    // --- STATE DEFINITIONS ---
    // CRITICAL: Ensure this line exists exactly as below
    const [isEdit, setIsEdit] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loading, setLoading] = useState(false);

    // Responsive State
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // --- EFFECTS ---
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchPriorities();
    }, []);

    // --- HANDLERS ---
    const fetchPriorities = async () => {
        try {
            const data = await getPriorities();
            setPriorities(data);
        } catch (error) {
            console.error("Failed to fetch priorities", error);
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
            if (isEdit) {
                await updatePriority(form.id, form);
            } else {
                await createPriority(form);
            }

            await fetchPriorities();
            setForm(emptyForm);
            setIsEdit(false);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save priority.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (priority) => {
        setForm({ ...priority, id: priority._id });
        setIsEdit(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteClick = (priority) => {
        setDeleteTarget(priority);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deletePriority(deleteTarget._id);
            fetchPriorities();
            setDeleteTarget(null);
        } catch (error) {
            alert("Failed to delete priority");
        }
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleView = (priority) => {
        setViewData(priority);
    };

    const closePopup = () => {
        setViewData(null);
    };

    const [searchTerm, setSearchTerm] = useState("");

    // Filter Logic
    const filteredPriorities = priorities.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Dynamic Styles
    const formGridColumns = isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(250px, 1fr))";
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
                            <div style={styles.colorPreviewLarge}>
                                <div
                                    style={{
                                        backgroundColor: viewData.color,
                                        width: 60,
                                        height: 60,
                                        borderRadius: 8,
                                        border: "1px solid #e5e7eb",
                                    }}></div>
                                <div style={{ marginLeft: 15 }}>
                                    <div style={styles.detailRow}>
                                        <strong>Color Code:</strong>{" "}
                                        <span>{viewData.color}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <strong>Status:</strong>
                                        <span
                                            style={{
                                                padding: 4,
                                                borderRadius: 4,
                                                fontSize: 12,
                                                fontWeight: 600,
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
                            <h3 style={styles.deleteTitle}>Delete Priority?</h3>
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
                        Priority Master
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
                                {isEdit ? "Edit Priority" : "Add New Priority"}
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
                                gridTemplateColumns: formGridColumns,
                            }}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Priority Name
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
                                <label style={styles.label}>Color</label>
                                <div style={styles.colorInputWrapper}>
                                    <input
                                        type="color"
                                        name="color"
                                        value={form.color}
                                        onChange={handleChange}
                                        style={styles.colorInput}
                                    />
                                    <span style={styles.colorHex}>
                                        {form.color}
                                    </span>
                                </div>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    style={styles.input}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
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
                            Priorities ({filteredPriorities.length})
                        </h3>
                    )}
                    <div style={styles.tableResponsive}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Color</th>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.thAction}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPriorities.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={styles.noData}>
                                            No priorities found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPriorities.map((p) => (
                                        <tr key={p._id} style={styles.tr}>
                                            <td style={styles.td}>
                                                {/* Container to align Dot and Text */}
                                                <div style={styles.colorRow}>
                                                    {/* Color Dot */}
                                                    <div
                                                        style={{
                                                            ...styles.colorDot,
                                                            backgroundColor:
                                                                p.color,
                                                        }}></div>
                                                    {/* Color Code Text */}
                                                    <span
                                                        style={
                                                            styles.colorHexText
                                                        }>
                                                        {p.color}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <strong>{p.name}</strong>
                                            </td>
                                            <td style={styles.td}>
                                                <span
                                                    style={{
                                                        padding: 4,
                                                        borderRadius: 4,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        color:
                                                            p.status ===
                                                            "Active"
                                                                ? "#065f46"
                                                                : "#9f1239",
                                                        backgroundColor:
                                                            p.status ===
                                                            "Active"
                                                                ? "#d1fae5"
                                                                : "#fecdd3",
                                                    }}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td style={styles.tdAction}>
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() =>
                                                        handleView(p)
                                                    }>
                                                    <ViewIcon />
                                                </button>
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() =>
                                                        handleEdit(p)
                                                    }>
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    style={
                                                        styles.actionBtnDelete
                                                    }
                                                    onClick={() =>
                                                        handleDeleteClick(p)
                                                    }>
                                                    <DeleteIcon />
                                                </button>
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
    headerRightGroup: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
    },
    searchWrapper: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        border: "1px solid #d1d5db",
        borderRadius: "25px",
        padding: "8px 15px",
        gap: "8px",
        width: "250px",
        transition: "border-color 0.2s",
    },
    searchInput: {
        border: "none",
        outline: "none",
        fontSize: "14px",
        color: "#374151",
        flex: 1,
    },
    searchIcon: {
        color: "#9ca3af",
        flexShrink: 0,
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
        flexShrink: 0,
    },
    formCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "30px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
    },
    formHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
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
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px",
        marginBottom: "15px",
    },
    inputGroup: { display: "flex", flexDirection: "column" },
    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#374151",
        marginBottom: "5px",
    },
    input: {
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#374151",
        outline: "none",
        boxSizing: "border-box",
    },
    colorInputWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        padding: "5px",
        backgroundColor: "#fff",
    },
    colorInput: {
        width: 50,
        height: 40,
        border: "none",
        cursor: "pointer",
        background: "none",
        padding: 0,
    },
    colorHex: {
        fontSize: "14px",
        color: "#374151",
        fontFamily: "monospace",
    },
    submitButton: {
        marginTop: "20px",
        padding: "12px",
        width: "100%",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },
    listCard: {
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
    },
    listTitle: {
        padding: "20px",
        margin: 0,
        borderBottom: "1px solid #e5e7eb",
        color: "#111827",
        fontSize: "18px",
    },
    tableResponsive: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
    th: {
        textAlign: "left",
        padding: "12px 16px",
        backgroundColor: "#f9fafb",
        color: "#6b7280",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "600",
    },
    thAction: {
        color: "#6b7280",
        textAlign: "right",
        paddingRight: "50px",
        backgroundColor: "#f9fafb",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "600",
    },
    tr: { borderBottom: "1px solid #f3f4f6" },
    td: {
        padding: "12px 16px",
        color: "#374151",
        fontSize: "14px",
        verticalAlign: "middle",
    },
    tdAction: {
        textAlign: "right",
        whiteSpace: "nowrap",
        paddingRight: "24px",
    },
    actionBtn: {
        background: "#e0e7ff",
        color: "#3730a3",
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
        background: "#fee2e2",
        color: "#991b1b",
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
        padding: "30px",
        color: "#9ca3af",
        fontStyle: "italic",
    },
    statusBadge: {
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
        display: "inline-block",
    },
    activeBadge: { color: "#065f46", backgroundColor: "#d1fae5" },
    inactiveBadge: { color: "#9f1239", backgroundColor: "#fecdd3" },
    colorRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    colorDot: {
        width: "24px",
        height: "24px",
        borderRadius: "4px",
        border: "1px solid #d1d5db",
        flexShrink: 0,
    },
    colorHexText: {
        fontSize: "12px",
        color: "#6b7280",
        fontFamily: "monospace",
        fontWeight: "500",
    },
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
        borderRadius: "12px",
        padding: "25px",
        position: "relative",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "1px solid #f3f4f6",
    },
    modalTitle: { margin: 0, color: "#1f2937", fontSize: "20px" },
    iconBtnClose: {
        background: "transparent",
        border: "none",
        color: "#9ca3af",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
    },
    modalBody: { textAlign: "left", marginBottom: "20px" },
    colorPreviewLarge: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
    },
    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
        fontSize: "14px",
    },
    modalCloseBtn: {
        width: "100%",
        padding: "10px",
        background: "#f3f4f6",
        color: "#374151",
        border: "none",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
    },
    deleteModalContent: {
        background: "#fff",
        width: "90%",
        maxWidth: "400px",
        borderRadius: "12px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
        fontSize: "15px",
        lineHeight: 1.5,
        margin: 0,
    },
    deleteActions: {
        display: "flex",
        gap: "10px",
        justifyContent: "center",
    },
    cancelDeleteBtn: {
        padding: "10px 20px",
        background: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
        flex: 1,
    },
    confirmDeleteBtn: {
        padding: "10px 20px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
        flex: 1,
    },
};

export default PriorityMaster;
