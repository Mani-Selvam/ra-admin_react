import React, { useEffect, useState } from "react";
import {
    getWorkerAssignedTickets,
    getWorkerWorkAnalysis,
} from "./workerApi";
import { getMaterialApprovedAnalysis } from "./workAnalysisAPI";
import { updateTicket } from "./ticketAPI";
import { getTicketStatuses } from "../MasterDash/ticketStatusApi";
import { createWorkLog, getWorkLogsByAnalysis } from "./workLogAPI";
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

const FileTextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const BuildingIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
        <line x1="9" y1="2" x2="9" y2="22"></line>
        <line x1="15" y1="2" x2="15" y2="22"></line>
        <line x1="3" y1="7" x2="21" y2="7"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
    </svg>
);

const UserIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const CalendarIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

// New Icons for Buttons
const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const ListIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-20 0v-1a10 10 0 1 1 20 0z"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const MaterialApprovedPage = () => {
    const [workAnalyses, setWorkAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [selectedAnalysisToView, setSelectedAnalysisToView] = useState(null);
    const [showWorkLogForm, setShowWorkLogForm] = useState(false);
    const [selectedAnalysisForLog, setSelectedAnalysisForLog] = useState(null);
    const [showViewLog, setShowViewLog] = useState(false);
    const [workLogs, setWorkLogs] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [logFormData, setLogFormData] = useState({
        fromTime: "",
        toTime: "",
        date: new Date().toISOString().split('T')[0],
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const workerId = user?.id;

    useEffect(() => {
        const initPage = async () => {
            setLoading(true);
            try {
                const statuses = await getTicketStatuses();
                setTicketStatuses(statuses || []);
                
                if (workerId) {
                    await fetchWorkAnalyses();
                }
            } finally {
                setLoading(false);
            }
        };
        initPage();
    }, [workerId]);

    const fetchWorkAnalyses = async () => {
        try {
            const data = await getMaterialApprovedAnalysis();
            const approvedAnalyses = Array.isArray(data) ? data : data.data || [];
            setWorkAnalyses(approvedAnalyses);
        } catch (error) {
            console.error("Error fetching Material Approved analyses:", error);
            showToast("Failed to load Material Approved analyses", "error");
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), 3000);
    };

    const loadWorkLogs = async (analysisId) => {
        try {
            setLoadingLogs(true);
            const logs = await getWorkLogsByAnalysis(analysisId);
            setWorkLogs(logs || []);
        } catch (error) {
            console.error("Error loading work logs:", error);
            showToast("Failed to load work logs: " + error.message, "error");
            setWorkLogs([]);
        } finally {
            setLoadingLogs(false);
        }
    };

    const calculateDuration = (fromTime, toTime) => {
        if (!fromTime || !toTime) return "0h 0m";
        const [fromHour, fromMin] = fromTime.split(':').map(Number);
        const [toHour, toMin] = toTime.split(':').map(Number);
        let hours = toHour - fromHour;
        let minutes = toMin - fromMin;
        
        if (minutes < 0) {
            hours--;
            minutes += 60;
        }
        return `${hours}h ${minutes}m`;
    };

    const handleSubmitWorkLog = async () => {
        if (!logFormData.fromTime || !logFormData.toTime) {
            showToast("Please fill in both From Time and To Time", "error");
            return;
        }

        try {
            const duration = calculateDuration(logFormData.fromTime, logFormData.toTime);
            
            const workLogData = {
                ticket_id: selectedAnalysisForLog.ticket_id?._id,
                analysis_id: selectedAnalysisForLog._id,
                worker_id: user?.id,
                worker_name: user?.name || selectedAnalysisForLog.worker_name,
                from_time: logFormData.fromTime,
                to_time: logFormData.toTime,
                duration: duration,
                log_date: logFormData.date,
            };

            const savedLog = await createWorkLog(workLogData);
            console.log("🟢 Saved Work Log:", savedLog);
            showToast("Work log submitted successfully!", "success");

            // Refresh and open Work Logs view so user can verify the saved entry
            try {
                await loadWorkLogs(selectedAnalysisForLog._id);
                setShowViewLog(true);
            } catch (e) {
                console.warn("Could not auto-open work logs view:", e.message || e);
            }

            const ticket = selectedAnalysisForLog.ticket_id;
            const ticketId = ticket._id;
            const statusName = "Working In Progress";
            
            let statusId = null;
            let statusObj = null;
            if (ticketStatuses && ticketStatuses.length > 0) {
                statusObj = ticketStatuses.find((s) => String(s.name).toLowerCase() === String(statusName).toLowerCase());
                statusId = statusObj?._id || statusObj?.id || null;
            }
            
            const updatePayload = statusId ? { status_id: statusId } : { status: statusName };
            await updateTicket(ticketId, updatePayload);
            
            showToast("Ticket status updated to Working In Progress", "success");
            
            setShowWorkLogForm(false);
            setLogFormData({
                fromTime: "",
                toTime: "",
                date: new Date().toISOString().split('T')[0],
            });
            
            setTimeout(() => {
                fetchWorkAnalyses();
            }, 500);
            
        } catch (error) {
            console.error("Error submitting work log:", error);
            showToast("Failed to submit work log: " + error.message, "error");
        }
    };

    const handleCompleteWork = async (analysis) => {
        try {
            const ticket = analysis.ticket_id;
            if (!ticket || !ticket._id) {
                showToast("No ticket found for this analysis", "error");
                return;
            }
            
            const ticketId = ticket._id;
            const statusName = "Work Completed";
            
            let statusId = null;
            let statusObj = null;
            const statusesToSearch = (ticketStatuses && ticketStatuses.length > 0) ? ticketStatuses : await getTicketStatuses();
            
            if (statusesToSearch && statusesToSearch.length > 0) {
                statusObj = statusesToSearch.find((s) => String(s.name).toLowerCase() === String(statusName).toLowerCase());
                statusId = statusObj?._id || statusObj?.id || null;
            }
            
            const updatePayload = statusId ? { status_id: statusId } : { status: statusName };
            
            showToast("Updating ticket status to 'Work Completed'...", "success");
            await updateTicket(ticketId, updatePayload);
            
            showToast("Ticket status updated to Work Completed", "success");
            
            setTimeout(() => {
                fetchWorkAnalyses();
            }, 500);
            
        } catch (error) {
            console.error("Error updating ticket status:", error);
            showToast("Failed to update ticket status: " + (error.response?.data?.message || error.message), "error");
        }
    };

    const getStatusStyle = (statusName) => {
        const n = String(statusName).toLowerCase();
        let bgColor = "#dbeafe";
        let textColor = "#1e40af";

        if (n.includes("closed")) {
            bgColor = "#f3f4f6";
            textColor = "#4b5563";
        } else if (n.includes("progress")) {
            bgColor = "#e0e7ff";
            textColor = "#3730a3";
        } else if (n.includes("resolved")) {
            bgColor = "#dcfce7";
            textColor = "#166534";
        } else if (n.includes("material approved")) {
            bgColor = "#dcfce7";
            textColor = "#166534";
        }

        return { backgroundColor: bgColor, color: textColor };
    };

    const filteredAnalyses = workAnalyses.filter((analysis) => {
        const term = searchTerm.toLowerCase();
        const id = String(analysis.analysis_id || "").toLowerCase();
        const ticketId = String(analysis.ticket_id?.ticket_id || "").toLowerCase();
        const desc = String(analysis.material_description || "").toLowerCase();
        return id.includes(term) || ticketId.includes(term) || desc.includes(term);
    });

    if (loading) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.spinnerContainer}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading Material Approved records...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            {/* --- Professional Page Header --- */}
            <div style={styles.headerSection}>
               
                <div style={styles.statsBadge}>
                    <span style={styles.statsCount}>{filteredAnalyses.length}</span>
                    <span style={styles.statsLabel}>Records Found</span>
                </div>
            </div>

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
                        {toast.type === "success" ? <CheckIcon /> : <span style={styles.errorIcon}>⚠</span>}
                        <span style={styles.toastMessage}>{toast.message}</span>
                    </div>
                    <button style={styles.toastClose} onClick={() => setToast({ show: false, message: "", type: "" })}>
                        <CloseIcon />
                    </button>
                </div>
            )}

            {/* --- Analysis View Modal --- */}
            {selectedAnalysisToView && (
                <div style={styles.modalOverlay} onClick={() => setSelectedAnalysisToView(null)}>
                    <div style={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={styles.iconCircle}>
                                    <FileTextIcon />
                                </div>
                                <h3 style={styles.modalTitle}>Analysis Details</h3>
                            </div>
                            <button onClick={() => setSelectedAnalysisToView(null)} style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                                <div>
                                    <h5 style={styles.detailLabel}>Analysis ID</h5>
                                    <p style={styles.detailValue}>{selectedAnalysisToView.analysis_id || selectedAnalysisToView._id}</p>
                                </div>
                                <div>
                                    <h5 style={styles.detailLabel}>Ticket ID</h5>
                                    <p style={styles.detailValue}>{selectedAnalysisToView.ticket_id?.ticket_id || selectedAnalysisToView.ticket_id}</p>
                                </div>
                                <div>
                                    <h5 style={styles.detailLabel}>Worker Name</h5>
                                    <p style={styles.detailValue}>{user?.name || selectedAnalysisToView.worker_name || "N/A"}</p>
                                </div>
                                <div>
                                    <h5 style={styles.detailLabel}>Ticket Status</h5>
                                    {(() => {
                                        const ticketStatus = selectedAnalysisToView.ticket_id?.status_id?.name || selectedAnalysisToView.ticket_id?.status || "Unknown";
                                        return (
                                            <span style={{
                                                display: "inline-block",
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: "700",
                                                textTransform: "uppercase",
                                                ...getStatusStyle(ticketStatus)
                                            }}>
                                                {ticketStatus}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <div>
                                    <h5 style={styles.detailLabel}>Material Required</h5>
                                    <p style={styles.detailValue}>{selectedAnalysisToView.material_required}</p>
                                </div>
                            </div>
                            {selectedAnalysisToView.material_description && (
                                <div style={{ marginTop: "24px", background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    <h5 style={styles.detailLabel}>Material Description</h5>
                                    <p style={{ margin: "8px 0 0 0", fontSize: "15px", color: "#334155", lineHeight: "1.6" }}>{selectedAnalysisToView.material_description}</p>
                                </div>
                            )}
                            <div style={{ marginTop: "24px" }}>
                                <h5 style={styles.detailLabel}>Uploaded Images</h5>
                                {selectedAnalysisToView.uploaded_images && selectedAnalysisToView.uploaded_images.length > 0 ? (
                                    <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                                        {selectedAnalysisToView.uploaded_images.map((img, i) => {
                                            const normalized = img && typeof img === "string" ? img.replace(/\\/g, "/") : img;
                                            const src = normalized && normalized.startsWith("http") ? normalized : `http://localhost:5000/${normalized}`;
                                            return (
                                                <img 
                                                    key={i} 
                                                    src={src} 
                                                    alt={`analysis-${i}`} 
                                                    style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} 
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", fontStyle: "italic" }}>No images uploaded</p>
                                )}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px", borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
                                <div>
                                    <h5 style={styles.detailLabel}>Analysis Status</h5>
                                    <span style={{
                                        display: "inline-block",
                                        background: "#dcfce7",
                                        color: "#166534",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textTransform: "uppercase"
                                    }}>
                                        Approved
                                    </span>
                                </div>
                                <div>
                                    <h5 style={styles.detailLabel}>Submitted On</h5>
                                    <p style={styles.detailValue}>
                                        {new Date(selectedAnalysisToView.created_at || selectedAnalysisToView.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Edit Form Modal (Work Log) --- */}
            {showWorkLogForm && selectedAnalysisForLog && (
                <div style={styles.modalOverlay} onClick={() => setShowWorkLogForm(false)}>
                    <div style={styles.modalMedium} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h3 style={styles.modalTitle}>Work Log - Time Tracking</h3>
                                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>Ticket: <strong>{selectedAnalysisForLog.ticket_id?.ticket_id}</strong> <span style={{ marginLeft: 8 }}>| Submitting as: <strong>{user?.name || selectedAnalysisForLog.worker_name}</strong></span></p>
                            </div>
                            <button onClick={() => setShowWorkLogForm(false)} style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
                                <div style={{ marginBottom: "16px" }}>
                                    <label style={styles.inputLabel}>Date</label>
                                    <div style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginTop: "4px" }}>
                                        {new Date(logFormData.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                                    <div>
                                        <label style={styles.inputLabel}>From Time</label>
                                        <input 
                                            type="time" 
                                            value={logFormData.fromTime}
                                            onChange={(e) => setLogFormData({...logFormData, fromTime: e.target.value})}
                                            style={styles.timeInput}
                                        />
                                    </div>
                                    <div>
                                        <label style={styles.inputLabel}>To Time</label>
                                        <input 
                                            type="time" 
                                            value={logFormData.toTime}
                                            onChange={(e) => setLogFormData({...logFormData, toTime: e.target.value})}
                                            style={styles.timeInput}
                                        />
                                    </div>
                                </div>
                                {logFormData.fromTime && logFormData.toTime && (
                                    <div style={{ marginTop: "16px", padding: "12px", background: "white", borderRadius: "8px", borderLeft: "4px solid #3b82f6", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                                        <p style={{ margin: 0, fontSize: "14px", color: "#0f172a" }}>
                                            <span style={{ color: "#64748b", marginRight: "8px" }}>Calculated Duration:</span>
                                            <strong style={{ color: "#2563eb" }}>{calculateDuration(logFormData.fromTime, logFormData.toTime)}</strong>
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                                <button onClick={() => handleSubmitWorkLog()} style={styles.btnPrimary}>
                                    Submit Work Log & Update Status
                                </button>
                                <button onClick={() => setShowWorkLogForm(false)} style={styles.btnSecondary}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- View Work Log Modal --- */}
            {showViewLog && selectedAnalysisForLog && (
                <div style={styles.modalOverlay} onClick={() => setShowViewLog(false)}>
                    <div style={styles.modalMedium} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h3 style={styles.modalTitle}>Work Log Records</h3>
                                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>Ticket: <strong>{selectedAnalysisForLog.ticket_id?.ticket_id}</strong></p>
                            </div>
                            <button onClick={() => setShowViewLog(false)} style={styles.iconBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            {loadingLogs ? (
                                <div style={{ padding: "40px", textAlign: "center", background: "#f8fafc", borderRadius: "8px" }}>
                                    <div style={styles.spinnerSmall}></div>
                                    <p style={{ color: "#64748b", fontSize: "14px", marginTop: "16px" }}>Loading work logs...</p>
                                </div>
                            ) : workLogs.length === 0 ? (
                                <div style={{ padding: "40px", textAlign: "center", background: "#f8fafc", borderRadius: "8px" }}>
                                    <p style={{ color: "#64748b", fontSize: "14px" }}>No work logs submitted yet</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: "auto" }}>
                                    <table style={styles.logTable}>
                                        <thead>
                                            <tr>
                                                <th style={styles.logTh}>Worker</th>
                                                <th style={styles.logTh}>Time Range</th>
                                                <th style={styles.logTh}>Duration</th>
                                                <th style={styles.logTh}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workLogs.map((log, idx) => (
                                                <tr key={idx} style={idx % 2 === 0 ? styles.logTrEven : styles.logTrOdd}>
                                                    <td style={styles.logTd}>
                                                        <div style={{ fontWeight: "600", color: "#0f172a" }}>{log.worker_name}</div>
                                                    </td>
                                                    <td style={styles.logTd}>
                                                        {log.from_time} - {log.to_time}
                                                    </td>
                                                    <td style={styles.logTd}>
                                                        <span style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "700" }}>
                                                            {log.duration}
                                                        </span>
                                                    </td>
                                                    <td style={styles.logTd}>
                                                        {new Date(log.log_date).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
         
            {/* --- Search Bar --- */}
            <div style={styles.searchWrapper}>
                <div style={styles.searchInputWrapper}>
                    <span style={styles.searchIcon}>
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by analysis ID, ticket ID, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {/* --- Analysis Cards --- */}
            <div style={styles.cardContainer}>
                {filteredAnalyses.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📊</div>
                        <h3 style={styles.emptyTitle}>No Material Approved Records</h3>
                        <p style={styles.emptyText}>
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "No analyses with approved materials found"}
                        </p>
                    </div>
                ) : (
                    <div style={styles.cardGrid}>
                        {filteredAnalyses.map((analysis) => {
                            const statusName = analysis.ticket_id?.status_id?.name || analysis.ticket_id?.status;
                            const statusStyles = getStatusStyle(statusName);
                            
                            return (
                                <div key={analysis._id} style={styles.cardItem}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.cardIdRow}>
                                            <div style={styles.cardIdBox}>
                                                <FileTextIcon />
                                                <span style={styles.cardId}>{analysis.analysis_id}</span>
                                            </div>
                                            <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Approved</span>
                                        </div>
                                    </div>
                                    <div style={styles.cardBody}>
                                        <div style={styles.cardInfoGrid}>
                                            <div style={styles.infoCol}>
                                                <span style={styles.label}>Ticket ID</span>
                                                <span style={styles.value}>{analysis.ticket_id?.ticket_id || "-"}</span>
                                            </div>
                                            <div style={styles.infoCol}>
                                                <span style={styles.label}>Worker</span>
                                                <span style={styles.value}>{user?.name || analysis.worker_name || "-"}</span>
                                            </div>
                                        </div>
                                        <div style={{ ...styles.cardInfoGrid, marginTop: "12px" }}>
                                            <div style={styles.infoCol}>
                                                <span style={styles.label}>Status</span>
                                                <span style={{ ...styles.statusBadge, ...statusStyles }}>
                                                    {statusName || "Unknown"}
                                                </span>
                                            </div>
                                            <div style={styles.infoCol}>
                                                <span style={styles.label}>Date</span>
                                                <span style={styles.value}>
                                                    {new Date(analysis.created_at || analysis.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        {analysis.material_description && (
                                            <div style={{ marginTop: "12px" }}>
                                                <span style={styles.label}>Description</span>
                                                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                    {analysis.material_description}
                                                </p>
                                            </div>
                                        )}
                                        {analysis.uploaded_images && analysis.uploaded_images.length > 0 && (
                                            <div style={{ marginTop: "12px" }}>
                                                <span style={styles.label}>Images ({analysis.uploaded_images.length})</span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={styles.cardFooter}>
                                        <button onClick={() => setSelectedAnalysisToView(analysis)} style={styles.btnOutline}>
                                            View Details
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setSelectedAnalysisForLog({ ...analysis, worker_name: user?.name || analysis.worker_name });
                                                setWorkLogs([]);
                                                setShowWorkLogForm(true);
                                            }} 
                                            style={styles.btnAction}>
                                            <ClockIcon />
                                            <span>Work Log</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setSelectedAnalysisForLog(analysis);
                                                loadWorkLogs(analysis._id);
                                                setShowViewLog(true);
                                            }} 
                                            style={styles.btnOutline}>
                                            <ListIcon />
                                            <span>View Log</span>
                                        </button>
                                        <button 
                                            onClick={() => handleCompleteWork(analysis)} 
                                            style={styles.btnSuccess}>
                                            <CheckCircleIcon />
                                            <span>Complete</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Styles ---
const styles = {
    pageContainer: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "32px",
        color: "#1e293b",
        width: "100%",
        transform: "scale(0.65)",
        transformOrigin: "top left",
    },
    headerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
    },
    pageTitle: {
        margin: "0 0 4px 0",
        fontSize: "32px",
        fontWeight: "800",
        color: "#0f172a",
        letterSpacing: "-0.5px",
    },
    pageSubtitle: {
        margin: "0",
        fontSize: "15px",
        color: "#64748b",
        fontWeight: "400",
    },
    statsBadge: {
        background: "white",
        padding: "8px 16px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    statsCount: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#3b82f6",
    },
    statsLabel: {
        fontSize: "13px",
        color: "#94a3b8",
        textTransform: "uppercase",
        fontWeight: "600",
    },

    // Search
    searchWrapper: {
        marginBottom: "32px",
    },
    searchInputWrapper: {
        position: "relative",
        maxWidth: "600px",
    },
    searchIcon: {
        position: "absolute",
        left: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
    },
    searchInput: {
        width: "100%",
        padding: "14px 14px 14px 48px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        outline: "none",
        fontSize: "15px",
        backgroundColor: "white",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s",
        color: "#334155",
    },

    // Grid
    cardContainer: {
        background: "transparent",
    },
    cardGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
        gap: "24px",
    },

    // Card
    cardItem: {
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        borderLeft: "4px solid transparent", // Dynamic color inline
    },
    "cardItem:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    cardHeader: {
        padding: "16px 20px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardIdRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    cardIdBox: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#f8fafc",
        padding: "6px 10px",
        borderRadius: "6px",
    },
    cardId: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "13px",
        fontWeight: "600",
        color: "#64748b",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: "10px",
        fontWeight: "700",
        padding: "4px 10px",
        borderRadius: "9999px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },

    // Card Body
    cardBody: {
        padding: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    cardInfoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
    },
    infoCol: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    label: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    value: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#334155",
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
    },

    // Card Footer
    cardFooter: {
        padding: "16px 20px",
        borderTop: "1px solid #f1f5f9",
        background: "#f8fafc",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
    },
    
    // Buttons
    btnOutline: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#475569",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
        transition: "all 0.2s",
    },
    "btnOutline:hover": {
        background: "#f1f5f9",
        borderColor: "#94a3b8",
    },
    btnAction: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #3b82f6",
        background: "white",
        color: "#2563eb",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
        transition: "all 0.2s",
    },
    "btnAction:hover": {
        background: "#eff6ff",
        borderColor: "#2563eb",
    },
    btnSuccess: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #10b981",
        background: "white",
        color: "#059669",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
        transition: "all 0.2s",
        gridColumn: "span 2", // Make complete button wide
    },
    "btnSuccess:hover": {
        background: "#ecfdf5",
        borderColor: "#059669",
    },

    // Empty State
    emptyState: {
        textAlign: "center",
        padding: "60px 40px",
        background: "white",
        borderRadius: "16px",
        border: "1px dashed #cbd5e1",
    },
    emptyIcon: {
        fontSize: "48px",
        marginBottom: "16px",
        opacity: 0.8,
    },
    emptyTitle: {
        margin: "0 0 8px 0",
        fontSize: "20px",
        fontWeight: "700",
        color: "#0f172a",
    },
    emptyText: {
        margin: 0,
        fontSize: "15px",
        color: "#64748b",
    },

    // Loading
    spinnerContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    spinnerSmall: {
        width: "30px",
        height: "30px",
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "0 auto",
    },
    loadingText: {
        marginTop: "16px",
        color: "#64748b",
        fontSize: "16px",
        fontWeight: "500",
    },

    // Modals
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease-out",
    },
    modalLarge: {
        background: "white",
        width: "700px",
        maxWidth: "90%",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    modalMedium: {
        background: "white",
        width: "550px",
        maxWidth: "90%",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    modalHeader: {
        padding: "20px 24px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a",
    },
    modalBody: {
        padding: "24px",
        overflowY: "auto",
    },
    iconBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#94a3b8",
        padding: "4px",
        borderRadius: "4px",
        transition: "color 0.2s",
    },
    "iconBtn:hover": {
        color: "#475569",
        background: "#f1f5f9",
    },
    iconCircle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        background: "#eff6ff",
        color: "#2563eb",
    },

    // Detail Modal Specifics
    detailLabel: {
        margin: "0 0 6px 0",
        fontSize: "12px",
        color: "#94a3b8",
        textTransform: "uppercase",
        fontWeight: "700",
        letterSpacing: "0.05em",
    },
    detailValue: {
        margin: 0,
        fontSize: "15px",
        color: "#0f172a",
        fontWeight: "500",
    },

    // Work Log Form Inputs
    inputLabel: {
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "6px",
    },
    timeInput: {
        width: "100%",
        padding: "10px",
        marginTop: "4px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "15px",
        outline: "none",
        transition: "border 0.2s",
    },
    "timeInput:focus": {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
    },
    btnPrimary: {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        background: "#3b82f6",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s",
    },
    "btnPrimary:hover": {
        background: "#2563eb",
        transform: "translateY(-1px)",
    },
    btnSecondary: {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#475569",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s",
    },
    "btnSecondary:hover": {
        background: "#f8fafc",
        borderColor: "#94a3b8",
    },

    // Log Table Styles
    logTable: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
    },
    logTh: {
        textAlign: "left",
        padding: "12px 16px",
        background: "#f8fafc",
        color: "#64748b",
        fontWeight: "700",
        textTransform: "uppercase",
        fontSize: "12px",
        borderBottom: "2px solid #e2e8f0",
    },
    logTrEven: {
        background: "#ffffff",
    },
    logTrOdd: {
        background: "#f8fafc",
    },
    logTd: {
        padding: "16px",
        borderBottom: "1px solid #e2e8f0",
        color: "#334155",
    },

    // Toast
    toast: {
        position: "fixed",
        top: "24px",
        right: "24px",
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        zIndex: 2000,
        animation: "slideIn 0.3s ease-out",
        minWidth: "320px",
    },
    toastSuccess: {
        borderLeft: "4px solid #10b981",
    },
    toastError: {
        borderLeft: "4px solid #ef4444",
    },
    toastContent: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#0f172a",
    },
    toastMessage: {
        fontSize: "14px",
        fontWeight: "500",
    },
    toastClose: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#94a3b8",
        padding: 0,
        display: "flex",
        alignItems: "center",
    },
    errorIcon: {
        color: "#ef4444",
        fontSize: "18px",
    },
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(styleSheet);

export default MaterialApprovedPage; 