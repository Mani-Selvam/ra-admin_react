import React, { useState, useEffect } from "react";
import {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
} from "./api";

// --- ICONS (SVG Components) ---
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
const CompanyMaster = () => {
    const emptyForm = {
        id: null,
        code: "",
        name: "",
        address: "",
        phone: "",
        mobile: "",
        email: "",
        website: "",
        logo: "",
        file: null,
    };

    const [form, setForm] = useState(emptyForm);
    const [companies, setCompanies] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- RESPONSIVE STATE ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const data = await getCompanies();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, file: file });
            const reader = new FileReader();
            reader.onload = () => {
                setForm((prev) => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file");
        }
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
            const formData = new FormData();
            formData.append("code", form.code);
            formData.append("name", form.name);
            formData.append("address", form.address);
            formData.append("phone", form.phone);
            formData.append("mobile", form.mobile);
            formData.append("email", form.email);
            formData.append("website", form.website);

            if (form.file) {
                formData.append("logo", form.file);
            }

            if (isEdit) {
                await updateCompany(form.id, formData);
            } else {
                await createCompany(formData);
            }

            await fetchCompanies();
            setForm(emptyForm);
            setIsEdit(false);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save company.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (company) => {
        setForm({ ...company, id: company._id, file: null });
        setIsEdit(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteClick = (company) => {
        setDeleteTarget(company);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCompany(deleteTarget._id);
            fetchCompanies();
            setDeleteTarget(null);
        } catch (error) {
            alert("Failed to delete company");
        }
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleView = (company) => {
        setViewData(company);
    };

    const closePopup = () => {
        setViewData(null);
    };

    // Responsive Dynamic Styles
    const formGridColumns = isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(250px, 1fr))";
    const modalWidth = isMobile ? "95%" : "90%";
    const modalMaxWidth = isMobile ? "none" : "450px";
    const pagePadding = isMobile ? "10px" : "20px";

    return (
        <div style={{ ...styles.pageWrapper, padding: pagePadding }}>
            {/* RESPONSIVE CSS MEDIA QUERIES FOR TABLE */}
            <style>
                {`
                    @media (max-width: 768px) {
                        .responsive-hide-mobile {
                            display: none;
                        }
                        table {
                            min-width: 600px !important;
                        }
                    }
                `}
            </style>

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
                            {viewData.logo && (
                                <img
                                    src={viewData.logo}
                                    alt="Logo"
                                    style={styles.modalLogoLarge}
                                />
                            )}
                            <div style={styles.detailRow}>
                                <strong>Code:</strong>
                                <span style={styles.codeBadgeView}>
                                    {viewData.code}
                                </span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Email:</strong>
                                <a
                                    href={`mailto:${viewData.email}`}
                                    style={styles.detailLink}>
                                    {viewData.email}
                                </a>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Phone:</strong>
                                <span>{viewData.phone || "-"}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Mobile:</strong>
                                <span>{viewData.mobile || "-"}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Website:</strong>
                                {viewData.website ? (
                                    <a
                                        href={viewData.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.detailLink}>
                                        {viewData.website}
                                    </a>
                                ) : (
                                    <span>N/A</span>
                                )}
                            </div>
                            <div style={styles.detailBlock}>
                                <strong>Address:</strong>
                                <p style={styles.addressText}>
                                    {viewData.address || "No address provided"}
                                </p>
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
                            <h3 style={styles.deleteTitle}>Delete Company?</h3>
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
                        Company Directory
                    </h2>
                    <div style={styles.headerButtons}>
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
                                {isEdit ? "Edit Company" : "Add New Company"}
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
                                <label style={styles.label}>Company Code</label>
                                <input
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    placeholder="CMP001"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Company Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Acme Corp"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Mobile</label>
                                <input
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    placeholder="+1 987 654 321"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="contact@company.com"
                                    type="email"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Website</label>
                                <input
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                    placeholder="https://www.company.com"
                                    style={styles.input}
                                />
                            </div>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Address</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter full address..."
                                style={styles.textarea}
                                rows={3}
                            />
                        </div>
                        <div style={styles.logoSection}>
                            <div style={styles.uploadWrapper}>
                                <label style={styles.label}>Company Logo</label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    onChange={handleLogoUpload}
                                    style={styles.fileInput}
                                />
                            </div>
                            {form.logo && (
                                <div style={styles.previewWrapper}>
                                    <img
                                        src={form.logo}
                                        alt="Logo Preview"
                                        style={styles.logoPreview}
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            style={styles.submitButton}
                            disabled={loading}>
                            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
                        </button>
                    </form>
                )}

                {/* LIST CARD (UPDATED WITH WEBSITE) */}
                <div style={styles.listCard}>
                    {!showForm && (
                        <h3 style={styles.listTitle}>
                            Active Companies ({companies.length})
                        </h3>
                    )}
                    <div style={styles.tableResponsive}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Logo</th>
                                    <th style={styles.th}>Code</th>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Contact</th>
                                    {/* Hide Email on small mobile */}
                                    <th
                                        style={styles.th}
                                        className="responsive-hide-mobile">
                                        Email
                                    </th>
                                    {/* Hide Website on small mobile */}
                                    <th
                                        style={styles.th}
                                        className="responsive-hide-mobile">
                                        Website
                                    </th>
                                    <th style={styles.thAction}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={styles.noData}>
                                            No companies found.
                                        </td>
                                    </tr>
                                ) : (
                                    companies.map((c) => (
                                        <tr key={c._id} style={styles.tr}>
                                            <td style={styles.td}>
                                                {c.logo ? (
                                                    <img
                                                        src={c.logo}
                                                        alt=""
                                                        style={styles.tableLogo}
                                                    />
                                                ) : (
                                                    <div
                                                        style={
                                                            styles.noLogoPlaceholder
                                                        }
                                                    />
                                                )}
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.codeBadge}>
                                                    {c.code}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <strong>{c.name}</strong>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.contactInfo}>
                                                    {c.phone} <br /> {c.mobile}
                                                </div>
                                            </td>
                                            {/* Email Column */}
                                            <td
                                                style={styles.td}
                                                className="responsive-hide-mobile">
                                                {c.email}
                                            </td>
                                            {/* Website Column */}
                                            <td
                                                style={styles.td}
                                                className="responsive-hide-mobile">
                                                {c.website ? (
                                                    <a
                                                        href={c.website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={
                                                            styles.tableLink
                                                        }>
                                                        {c.website.length > 30
                                                            ? c.website.substring(
                                                                  0,
                                                                  30,
                                                              ) + "..."
                                                            : c.website}
                                                    </a>
                                                ) : (
                                                    <span style={styles.noLink}>
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td style={styles.tdAction}>
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() =>
                                                        handleView(c)
                                                    }>
                                                    <ViewIcon />
                                                </button>
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() =>
                                                        handleEdit(c)
                                                    }>
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    style={
                                                        styles.actionBtnDelete
                                                    }
                                                    onClick={() =>
                                                        handleDeleteClick(c)
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
    headerButtons: { display: "flex", gap: "10px" },
    headerTitle: {
        color: "#1f2937",
        fontSize: "28px",
        fontWeight: "700",
        margin: 0,
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
    textarea: {
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#374151",
        outline: "none",
        fontFamily: "inherit",
        resize: "vertical",
        boxSizing: "border-box",
    },
    logoSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: "10px",
        padding: "15px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "1px dashed #d1d5db",
        flexWrap: "wrap",
        gap: "15px",
    },
    uploadWrapper: { flex: 1, minWidth: "200px" },
    fileInput: { fontSize: "14px", color: "#4b5563" },
    previewWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "5px",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        width: "90px",
        height: "90px",
    },
    logoPreview: { width: "100%", height: "100%", objectFit: "contain" },
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

    // --- LIST ---
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
    table: { width: "100%", borderCollapse: "collapse", minWidth: "800px" },
    th: {
        textAlign: "left",
        padding: "12px 16px",
        backgroundColor: "#f9fafb",
        color: "#6b7280",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },
    thAction: { textAlign: "right", padding:"12px" },
    tr: { borderBottom: "1px solid #f3f4f6" },
    td: {
        padding: "12px 16px",
        color: "#374151",
        fontSize: "14px",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
    },
    tdAction: { textAlign: "right", whiteSpace: "nowrap" , padding:"12px"}, 
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
        margin:"5px",
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
    tableLink: {
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: "500",
    },
    noLink: {
        color: "#9ca3af",
        fontStyle: "italic",
    },
    codeBadge: {
        backgroundColor: "#e0e7ff",
        color: "#3730a3",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
        display: "inline-block",
    },
    tableLogo: {
        width: "32px",
        height: "32px",
        objectFit: "contain",
        borderRadius: "4px",
        background: "#fff",
    },
    noLogoPlaceholder: {
        width: "32px",
        height: "32px",
        background: "#f3f4f6",
        borderRadius: "4px",
    },
    contactInfo: { fontSize: "13px", lineHeight: "1.3" },
    noData: {
        textAlign: "center",
        padding: "30px",
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

    // View Modal Specifics
    modalContent: {
        background: "#fff",
        width: "90%",
        maxWidth: "450px",
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
    modalLogoLarge: {
        width: "120px",
        height: "120px",
        objectFit: "contain",
        display: "block",
        margin: "0 auto 20px auto",
        border: "2px solid #f3f4f6",
        borderRadius: "8px",
        padding: "10px",
    },
    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        fontSize: "14px",
    },
    detailBlock: {
        marginTop: "15px",
        paddingTop: "10px",
        borderTop: "1px solid #f3f4f6",
    },
    addressText: {
        margin: "5px 0 0 0",
        color: "#4b5563",
        fontSize: "13px",
        lineHeight: 1.4,
        textAlign: "right",
    },
    codeBadgeView: {
        backgroundColor: "#e0e7ff",
        color: "#3730a3",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
    },
    detailLink: {
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: "500",
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

    // Delete Modal Specifics
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

export default CompanyMaster;
