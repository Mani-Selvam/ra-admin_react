import React, { useState, useEffect } from "react";
import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "@/Components/Api/MasterApi/departmentApi";

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
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>

            {/* 1. VIEW DETAILS MODAL */}
            {viewData && (
                <div style={styles.modalOverlay}>
                    <div
                        style={{
                            ...styles.viewModalContent,
                            width: modalWidth,
                            maxWidth: modalMaxWidth,
                        }}>
                        {/* Modal Header with Close Button */}
                        <div style={styles.viewModalHeader}>
                            <button
                                onClick={closePopup}
                                style={styles.viewModalCloseBtn}>
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Card Body */}
                        <div style={styles.viewCardBody}>
                            {/* Icon Section */}
                            <div style={styles.iconSection}>
                                <div style={styles.departmentIcon}>
                                    <i className="ti ti-building" style={styles.largeIcon}></i>
                                </div>
                            </div>

                            {/* Department Name */}
                            <h2 style={styles.departmentName}>{viewData.name}</h2>

                            {/* Details Grid */}
                            <div style={styles.detailsGrid}>
                                <div style={styles.detailItem}>
                                    <label style={styles.detailLabel}>Department Name</label>
                                    <p style={styles.detailValue}>{viewData.name}</p>
                                </div>

                                <div style={styles.detailItem}>
                                    <label style={styles.detailLabel}>Status</label>
                                    <div style={styles.statusBadgeContainer}>
                                        <span
                                            style={{
                                                ...styles.statusBadgeLarge,
                                                color:
                                                    viewData.status === "Active"
                                                        ? "#065f46"
                                                        : "#9f1239",
                                                backgroundColor:
                                                    viewData.status === "Active"
                                                        ? "#d1fae5"
                                                        : "#fecdd3",
                                            }}>
                                            {viewData.status === "Active" ? "✓ Active" : "✗ Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {viewData.createdAt && (
                                    <div style={styles.detailItem}>
                                        <label style={styles.detailLabel}>Created Date</label>
                                        <p style={styles.detailValue}>
                                            {new Date(viewData.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {viewData.updatedAt && (
                                    <div style={styles.detailItem}>
                                        <label style={styles.detailLabel}>Updated Date</label>
                                        <p style={styles.detailValue}>
                                            {new Date(viewData.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div style={styles.viewModalActions}>
                                <button
                                    onClick={closePopup}
                                    style={styles.viewModalCloseActionBtn}>
                                    Close
                                </button>
                            </div>
                        </div>
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
                                                <span>{d.name}</span>
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
                                                        style={styles.actionBtnView}
                                                        onClick={() =>
                                                            handleView(d)
                                                        }
                                                        title="View">
                                                        <ViewIcon />
                                                    </button>
                                                    <button
                                                        style={styles.actionBtnEdit}
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
        width: "20%",
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

    actionBtnEdit: {
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
    actionBtnHover: {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },

    /* MODAL OVERLAY */
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        animation: "fadeIn 0.3s ease-out",
        backdropFilter: "blur(2px)",
    },

    /* ENHANCED VIEW MODAL STYLES */
    viewModalContent: {
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
        overflow: "hidden",
        animation: "slideUp 0.4s ease-out",
        minWidth: "320px",
        maxWidth: "500px",
        position: "relative",
        zIndex: 10,
    },

    viewModalHeader: {
        padding: "12px 16px",
        display: "flex",
        justifyContent: "flex-end",
        borderBottom: "1px solid #f3f4f6",
    },

    viewModalCloseBtn: {
        background: "#f3f4f6",
        color: "#6b7280",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: "20px",
    },

    viewCardBody: {
        padding: "20px 20px",
        textAlign: "center",
    },

    iconSection: {
        marginBottom: "12px",
    },

    departmentIcon: {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#eff6ff",
        marginBottom: "10px",
    },

    largeIcon: {
        fontSize: "32px",
        color: "#2563eb",
    },

    departmentName: {
        fontSize: "22px",
        fontWeight: "800",
        color: "#0f172a",
        margin: "0 0 16px 0",
        letterSpacing: "-0.5px",
    },

    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "12px",
        marginBottom: "16px",
        textAlign: "left",
        backgroundColor: "#f9fafb",
        padding: "12px",
        borderRadius: "10px",
    },

    detailItem: {
        display: "flex",
        flexDirection: "column",
    },

    detailLabel: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        marginBottom: "4px",
    },

    detailValue: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#1f2937",
        margin: "0",
    },

    statusBadgeContainer: {
        display: "flex",
        alignItems: "center",
    },

    statusBadgeLarge: {
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "700",
        display: "inline-block",
        minWidth: "100px",
        textAlign: "center",
    },

    viewModalActions: {
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        paddingTop: "12px",
        borderTop: "1px solid #f3f4f6",
    },

    viewModalCloseActionBtn: {
        padding: "12px 32px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
        transition: "all 0.2s ease",
    },

    /* DELETE MODAL STYLES */
    deleteModalContent: {
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden",
        animation: "slideUp 0.3s ease-out",
        minWidth: "300px",
    },

    modalHeader: {
        padding: "24px 28px",
        borderBottom: "1px solid #f3f4f6",
    },

    deleteTitle: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "700",
        color: "#dc2626",
    },

    deleteBody: {
        padding: "24px 28px",
        backgroundColor: "#fef2f2",
    },

    deleteMessage: {
        fontSize: "15px",
        color: "#374151",
        margin: 0,
        lineHeight: "1.6",
    },

    deleteActions: {
        display: "flex",
        gap: "12px",
        padding: "20px 28px",
        borderTop: "1px solid #f3f4f6",
        justifyContent: "flex-end",
    },

    cancelDeleteBtn: {
        padding: "10px 24px",
        backgroundColor: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },

    confirmDeleteBtn: {
        padding: "10px 24px",
        backgroundColor: "#dc2626",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
        transition: "all 0.2s ease",
    },

    modalCloseBtn: {
        padding: "10px 28px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
        transition: "all 0.2s ease",
    },

    iconBtnClose: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px",
        color: "#6b7280",
    },
};

export default DepartmentMaster;
