import React, { useState, useEffect } from "react";
import {
    getUsers,
    getDropdowns,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
} from "@/Components/Api/MasterApi/userApi";

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

const KeyIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="8" cy="10" r="3"></circle>
        <path d="M13.5 6.5L21 14"></path>
        <path d="M16 11l2 2"></path>
        <path d="M19 14l2 2"></path>
    </svg>
);

// --- COMPONENT ---
const UserMaster = () => {
    const emptyForm = {
        id: null,
        name: "",
        companyId: "",
        designationId: "",
        mobile: "",
        email: "",
        password: "",
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [resetPasswordForm, setResetPasswordForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchDropdowns();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const data = await getDropdowns();
            setCompanies(data.companies);
            setDesignations(data.designations);
        } catch (error) {
            console.error("Failed to fetch dropdown data", error);
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
            // Client-side validation
            if (!form.name || !form.email || !form.mobile) {
                alert("Name, email and mobile are required");
                setLoading(false);
                return;
            }
            if (!isEdit) {
                if (!form.password || form.password.length < 6) {
                    alert("Password must be at least 6 characters");
                    setLoading(false);
                    return;
                }
            }
            if (isEdit) {
                const updateData = { ...form };
                if (!updateData.password) {
                    delete updateData.password;
                }
                await updateUser(form.id, updateData);
            } else {
                if (!form.password) {
                    alert("Password is required for new users");
                    setLoading(false);
                    return;
                }
                await createUser(form);
            }

            await fetchUsers();
            setForm(emptyForm);
            setIsEdit(false);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            const serverMsg =
                error?.response?.data?.message || error?.message || "Failed to save user.";
            alert(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (user) => {
        try {
            setForm({
                name: user.name,
                companyId: user.companyId?._id || user.companyId,
                designationId: user.designationId?._id || user.designationId,
                mobile: user.mobile,
                email: user.email,
                password: "",
                status: user.status,
                id: user._id,
            });
            setIsEdit(true);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Failed to set user data for editing", error);
        }
    };

    const handleDeleteClick = (user) => {
        setDeleteTarget(user);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteUser(deleteTarget._id);
            fetchUsers();
            setDeleteTarget(null);
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleView = (user) => {
        setViewData(user);
    };

    const closePopup = () => {
        setViewData(null);
        setShowPasswordReset(false);
        setResetPasswordForm({ newPassword: "", confirmPassword: "" });
    };

    const handlePasswordReset = () => {
        setShowPasswordReset(true);
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();

        if (
            resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword
        ) {
            alert("Passwords do not match");
            return;
        }

        if (resetPasswordForm.newPassword.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        try {
            await updateUser(viewData._id, {
                password: resetPasswordForm.newPassword,
            });
            alert("Password reset successfully");
            setShowPasswordReset(false);
            setResetPasswordForm({ newPassword: "", confirmPassword: "" });
            closePopup();
        } catch (error) {
            console.error("Failed to reset password", error);
            alert("Failed to reset password");
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.mobile.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const formGridColumns = isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(200px, 1fr))";
    const modalWidth = isMobile ? "95%" : "90%";
    const modalMaxWidth = isMobile ? "none" : "600px";
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
                                <strong>Company:</strong>
                                <span>{viewData.companyId?.name || "N/A"}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Designation:</strong>
                                <span>
                                    {viewData.designationId?.name || "N/A"}
                                </span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Mobile:</strong>
                                <span>{viewData.mobile}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Email:</strong>
                                <span>{viewData.email}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <strong>Password:</strong>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            color: "#059669",
                                            backgroundColor: "#d1fae5",
                                        }}>
                                        <KeyIcon
                                            style={{
                                                marginRight: "5px",
                                                verticalAlign: "middle",
                                            }}
                                        />
                                        Password Set
                                    </span>
                                    <button
                                        onClick={handlePasswordReset}
                                        style={styles.resetPasswordBtn}
                                        title="Reset Password">
                                        Reset
                                    </button>
                                </div>
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
                        {!showPasswordReset && (
                            <button
                                onClick={closePopup}
                                style={styles.modalCloseBtn}>
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* PASSWORD RESET MODAL */}
            {showPasswordReset && (
                <div style={styles.modalOverlay}>
                    <div style={styles.passwordResetModal}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Reset Password</h3>
                            <button
                                onClick={closePopup}
                                style={styles.iconBtnClose}>
                                <CloseIcon />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordResetSubmit}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>New Password</label>
                                <input
                                    type="password"
                                    value={resetPasswordForm.newPassword}
                                    onChange={(e) =>
                                        setResetPasswordForm({
                                            ...resetPasswordForm,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Enter new password"
                                    required
                                    minLength="6"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={resetPasswordForm.confirmPassword}
                                    onChange={(e) =>
                                        setResetPasswordForm({
                                            ...resetPasswordForm,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Confirm new password"
                                    required
                                    minLength="6"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.passwordResetActions}>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordReset(false)}
                                    style={styles.cancelResetBtn}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={styles.confirmResetBtn}>
                                    Reset Password
                                </button>
                            </div>
                        </form>
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
                            <h3 style={styles.deleteTitle}>Delete User?</h3>
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
                        User Master
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
                                {isEdit ? "Edit User" : "Add New User"}
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
                                <label style={styles.label}>Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Company</label>
                                <select
                                    name="companyId"
                                    value={form.companyId}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}>
                                    <option value="">Select Company</option>
                                    {companies.map((company) => (
                                        <option
                                            key={company._id}
                                            value={company._id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Designation</label>
                                <select
                                    name="designationId"
                                    value={form.designationId}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}>
                                    <option value="">Select Designation</option>
                                    {designations.map((designation) => (
                                        <option
                                            key={designation._id}
                                            value={designation._id}>
                                            {designation.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Mobile No</label>
                                <input
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Password{" "}
                                    {isEdit && "(Leave blank to keep current)"}
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder={
                                        isEdit
                                            ? "Leave blank to keep current"
                                            : "Enter password"
                                    }
                                    required={!isEdit}
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
                            Users ({filteredUsers.length})
                        </h3>
                    )}
                    <div style={styles.tableResponsive}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Company</th>
                                    <th style={styles.th}>Designation</th>
                                    <th style={styles.th}>Mobile</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.thAction}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={styles.noData}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u._id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <span>{u.name}</span>
                                            </td>
                                            <td style={styles.td}>
                                                {u.companyId?.name || "N/A"}
                                            </td>
                                            <td style={styles.td}>
                                                {u.designationId?.name || "N/A"}
                                            </td>
                                            <td style={styles.td}>
                                                {u.mobile}
                                            </td>
                                            <td style={styles.td}>{u.email}</td>
                                            <td style={styles.td}>
                                                <span
                                                    style={{
                                                        ...styles.statusBadge,
                                                        color:
                                                            u.status ===
                                                            "Active"
                                                                ? "#065f46"
                                                                : "#9f1239",
                                                        backgroundColor:
                                                            u.status ===
                                                            "Active"
                                                                ? "#d1fae5"
                                                                : "#fecdd3",
                                                    }}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td style={styles.tdAction}>
                                                <button
                                                    style={styles.actionBtnView}
                                                    onClick={() =>
                                                        handleView(u)
                                                    }>
                                                    <ViewIcon />
                                                </button>
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() =>
                                                        handleEdit(u)
                                                    }>
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    style={
                                                        styles.actionBtnDelete
                                                    }
                                                    onClick={() =>
                                                        handleDeleteClick(u)
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
    searchIcon: { color: "#9ca3af", flexShrink: 0 },
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
        gap: "20px",
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
    table: { width: "100%", borderCollapse: "collapse", minWidth: "900px" },
    th: {
        textAlign: "left",
        padding: "16px 10px",
        backgroundColor: "#f9fafb",
        color: "#000000",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "700",
    },
    thAction: { textAlign: "right", paddingRight: "24px" },
    tr: { borderBottom: "1px solid #f3f4f6" },
    td: {
        padding: "16px 10px",
        color: "#374151",
        fontSize: "16px",
        verticalAlign: "middle",
    },
    tdAction: {
        textAlign: "right",
        whiteSpace: "nowrap",
        paddingRight: "24px",
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
        margin:"5px",
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
        maxWidth: "600px",
        borderRadius: "16px",
        padding: "30px",
        position: "relative",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
        padding: 0,
        display: "flex",
        alignItems: "center",
    },
    modalBody: { textAlign: "left", marginBottom: "25px" },
    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
    statusBadge: {
        padding: "6px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "700",
        display: "inline-block",
    },

    // Password Reset Button
    resetPasswordBtn: {
        background: "#3b82f6",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "12px",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },

    // Password Reset Modal
    passwordResetModal: {
        background: "#fff",
        width: "90%",
        maxWidth: "450px",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    passwordResetActions: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
    },
    cancelResetBtn: {
        flex: 1,
        padding: "10px",
        background: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
    },
    confirmResetBtn: {
        flex: 1,
        padding: "10px",
        background: "#3b82f6",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
    },

    // Delete Modal
    deleteModalContent: {
        background: "#fff",
        width: "90%",
        maxWidth: "400px",
        borderRadius: "16px",
        padding: "30px",
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

export default UserMaster;
