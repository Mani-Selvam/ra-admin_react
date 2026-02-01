import React, { useState, useEffect } from "react";
import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "./departmentApi";

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
const DepartmentMaster = () => {
    const emptyForm = {
        id: null,
        name: "",
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);
    const [departments, setDepartments] = useState([]);
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
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
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
                await updateDepartment(form.id, form);
            } else {
                await createDepartment(form);
            }
            await fetchDepartments();
            setForm(emptyForm);
            setIsEdit(false);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save department.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (department) => {
        setForm({ ...department, id: department._id });
        setIsEdit(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteClick = (department) => {
        setDeleteTarget(department);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteDepartment(deleteTarget._id);
            fetchDepartments();
            setDeleteTarget(null);
        } catch (error) {
            alert("Failed to delete department");
        }
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleView = (department) => {
        setViewData(department);
    };

    const closePopup = () => {
        setViewData(null);
    };

    const filteredDepartments = departments.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

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
                                Delete Department?
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
                        Department Master
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
                                    ? "Edit Department"
                                    : "Add New Department"}
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
                                    Department Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Engineering"
                                    required
                                    style={styles.input}
                                />
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
                            Departments ({filteredDepartments.length})
                        </h3>
                    )}
                    <div style={styles.tableResponsive}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.thLeft}>Name</th>
                                    <th style={styles.thCenter}>Status</th>
                                    <th style={styles.thAction}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDepartments.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={styles.noData}>
                                            No departments found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDepartments.map((d) => (
                                        <tr key={d._id} style={styles.tr}>
                                            <td style={styles.tdLeft}>
                                                <strong>{d.name}</strong>
                                            </td>
                                            <td style={styles.tdCenter}>
                                                <span
                                                    style={{
                                                        ...styles.statusBadge,
                                                        color:
                                                            d.status ===
                                                            "Active"
                                                                ? "#065f46"
                                                                : "#9f1239",
                                                        backgroundColor:
                                                            d.status ===
                                                            "Active"
                                                                ? "#d1fae5"
                                                                : "#fecdd3",
                                                    }}>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td style={styles.tdAction}>
                                                <div
                                                    style={
                                                        styles.actionButtonGroup
                                                    }>
                                                    <button
                                                        style={styles.actionBtn}
                                                        onClick={() =>
                                                            handleView(d)
                                                        }
                                                        title="View">
                                                        <ViewIcon />
                                                    </button>
                                                    <button
                                                        style={styles.actionBtn}
                                                        onClick={() =>
                                                            handleEdit(d)
                                                        }
                                                        title="Edit">
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        style={
                                                            styles.actionBtnDelete
                                                        }
                                                        onClick={() =>
                                                            handleDeleteClick(d)
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

    container: {
        width: "100%",
        maxWidth: "100%",
    },

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
        boxShadow: "0 4px 6px rgba(37,99,235,0.3)",
    },

    /* FORM */
    formCard: {
        background: "#fff",
        padding: "30px",
        borderRadius: "16px",
        marginBottom: "40px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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

    formHeaderTitle: {
        margin: 0,
        color: "#111827",
        fontSize: "18px",
    },

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
        width: "100%",
        gap: "20px",
        marginBottom: "20px",
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
    },

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
        width: "30%",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    },

    /* LIST */
    listCard: {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
    },

    listTitle: {
        padding: "30px",
        margin: 0,
        borderBottom: "1px solid #f3f4f6",
        color: "#111827",
        fontSize: "20px",
    },

    tableResponsive: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "600px",
    },

    // --- REDESIGNED TABLE STYLES ---
    th: {
        padding: "20px 15px",
        backgroundColor: "#f9fafb",
        color: "#374151", // Darker text for better contrast
        fontSize: "14px",
        textTransform: "uppercase",
        fontWeight: "700",
        borderBottom: "2px solid #e5e7eb", // Thicker border for header separation
    },
    thLeft: {
        textAlign: "left",
        padding: "20px 28px",
    },
    thCenter: {
        textAlign: "left",
        padding: "20px 15px",
    },
    thAction: {
        textAlign: "center",
        width: "150px", // Fixed width for actions column
    },

    tr: {
        borderBottom: "1px solid #f3f4f6",
        transition: "background-color 0.2s ease-in-out", // Smooth transition for hover
    },
    trHover: {
        "&:hover": {
            backgroundColor: "#f9fafb",
        },
    },

    td: {
        padding: "20px 15px",
        color: "#374151",
        fontSize: "16px",
        verticalAlign: "middle",
    },
    tdLeft: {
        textAlign: "left",
        padding: "20px 28px",
    },
    tdCenter: {
        textAlign: "left",
        padding: "20px 15px",
    },
    tdAction: {
        padding: "18px 50px", // Slightly less vertical padding for buttons
        verticalAlign: "middle",
    },

    actionButtonGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "8px", // Consistent gap between buttons
    },

    statusBadge: {
        padding: "6px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "700",
        display: "inline-block",
    },

    actionBtn: {
        background: "#e0e7ff",
        color: "#3730a3",
        border: "none",
        borderRadius: "50%",
        width: "36px", // Slightly larger for better clickability
        height: "36px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "transform 0.1s ease, box-shadow 0.1s ease",
    },
    actionBtnHover: {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
};

export default DepartmentMaster;
