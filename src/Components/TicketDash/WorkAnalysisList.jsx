import React, { useState, useEffect } from "react";
import { getWorkAnalysis } from "./workAnalysisAPI";
import "./workAnalysis.css";

const WorkAnalysisRecords = ({ refreshTrigger }) => {
    const [allAnalysis, setAllAnalysis] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAnalysis, setFilteredAnalysis] = useState([]);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [displayAnalysis, setDisplayAnalysis] = useState(null);

    // Helper function to safely convert any value to string
    const safeString = (value, fallback = "N/A") => {
        if (value === null || value === undefined) return fallback;
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();
        if (typeof value === "object") {
            if (value._id) return value._id.toString();
            if (value.id) return value.id.toString();
            if (value.ticket_id)
                return typeof value.ticket_id === "object"
                    ? value.ticket_id._id || fallback
                    : value.ticket_id.toString();
            if (value.title) return value.title.toString();
            try {
                return JSON.stringify(value);
            } catch {
                return fallback;
            }
        }
        return String(value);
    };

    // Fetch all analysis on component mount and when refreshTrigger changes
    useEffect(() => {
        fetchAllAnalysis();
    }, [refreshTrigger]);

    // Filter analysis based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = allAnalysis.filter((analysis) => {
                const analysisId = safeString(analysis?.analysis_id);
                const workerId = safeString(analysis?.worker_id);
                const ticketId = safeString(analysis?.ticket_id);

                return (
                    analysisId
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ticketId.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredAnalysis(filtered);
        } else {
            setFilteredAnalysis(allAnalysis);
        }
    }, [searchTerm, allAnalysis]);

    const fetchAllAnalysis = async () => {
        setAnalysisLoading(true);
        try {
            const data = await getWorkAnalysis();
            setAllAnalysis(data || []);
        } catch (error) {
            console.error("Error fetching analysis:", error.message);
            alert("Failed to load submitted analysis");
        } finally {
            setAnalysisLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return "Invalid Date";
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return "Invalid Date";
        }
    };

    return (
        <>
            {/* All Analysis Section */}
            <div className="wa-analysis-section">
                <div className="wa-section-header">
                    <h2>All Submitted Work Analysis</h2>
                    <span className="wa-count-badge">
                        {filteredAnalysis.length} Records
                    </span>
                </div>

                {analysisLoading ? (
                    <div className="wa-loading-state">
                        <div className="wa-spinner"></div>
                        <p>Loading analysis data...</p>
                    </div>
                ) : filteredAnalysis.length === 0 ? (
                    <div className="wa-empty-state">
                        <div className="wa-empty-icon">📋</div>
                        <h3>No work analysis records found</h3>
                        <p>
                            Click "New Work Analysis" to create your first
                            submission
                        </p>
                    </div>
                ) : (
                    <div className="wa-analysis-grid">
                        {filteredAnalysis.map((analysis) => (
                            <div
                                key={safeString(analysis?._id)}
                                className="wa-analysis-card">
                                <div className="wa-card-header">
                                    <span className="wa-analysis-id">
                                        {safeString(analysis?.analysis_id)}
                                    </span>
                                    <span
                                        className={`wa-approval-badge ${safeString(analysis?.approval_status).toLowerCase()}`}>
                                        {safeString(
                                            analysis?.approval_status,
                                            "Unknown",
                                        )}
                                    </span>
                                </div>
                                <div className="wa-card-body">
                                    <div className="wa-info-row">
                                        <span className="wa-info-label">
                                            Worker ID:
                                        </span>
                                        <span className="wa-info-value">
                                            {safeString(analysis?.worker_id)}
                                        </span>
                                    </div>
                                    <div className="wa-info-row">
                                        <span className="wa-info-label">
                                            Ticket ID:
                                        </span>
                                        <span className="wa-info-value">
                                            {safeString(analysis?.ticket_id)}
                                        </span>
                                    </div>
                                    <div className="wa-info-row">
                                        <span className="wa-info-label">
                                            Material:
                                        </span>
                                        <span className="wa-info-value">
                                            {safeString(
                                                analysis?.material_required,
                                            )}
                                        </span>
                                    </div>
                                    <div className="wa-info-row">
                                        <span className="wa-info-label">
                                            Created:
                                        </span>
                                        <span className="wa-info-value">
                                            {formatDate(analysis?.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <div className="wa-card-footer">
                                    <button
                                        type="button"
                                        className="wa-view-details-btn"
                                        onClick={() =>
                                            setDisplayAnalysis(analysis)
                                        }>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {displayAnalysis && (
                <div
                    className="wa-modal-overlay"
                    onClick={() => setDisplayAnalysis(null)}>
                    <div
                        className="wa-modal-content"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="wa-modal-header">
                            <h3>Analysis Details</h3>
                            <button
                                className="wa-modal-close"
                                onClick={() => setDisplayAnalysis(null)}>
                                ×
                            </button>
                        </div>
                        <div className="wa-modal-body">
                            <div className="wa-details-grid">
                                <div className="wa-detail-item">
                                    <label>Analysis ID:</label>
                                    <span>
                                        {safeString(
                                            displayAnalysis?.analysis_id,
                                        )}
                                    </span>
                                </div>
                                <div className="wa-detail-item">
                                    <label>Ticket ID:</label>
                                    <span>
                                        {safeString(displayAnalysis?.ticket_id)}
                                    </span>
                                </div>
                                <div className="wa-detail-item">
                                    <label>Worker ID:</label>
                                    <span>
                                        {safeString(displayAnalysis?.worker_id)}
                                    </span>
                                </div>
                                <div className="wa-detail-item">
                                    <label>Material Required:</label>
                                    <span>
                                        {safeString(
                                            displayAnalysis?.material_required,
                                        )}
                                    </span>
                                </div>
                                <div className="wa-detail-item full-width">
                                    <label>Material Description:</label>
                                    <span>
                                        {safeString(
                                            displayAnalysis?.material_description,
                                            "N/A",
                                        )}
                                    </span>
                                </div>
                                <div className="wa-detail-item">
                                    <label>Uploaded Images:</label>
                                    <span>
                                        {displayAnalysis?.uploaded_images
                                            ?.length || 0}{" "}
                                        files
                                    </span>
                                </div>
                                <div className="wa-detail-item">
                                    <label>Approval Status:</label>
                                    <span
                                        className={`wa-approval-badge ${safeString(displayAnalysis?.approval_status).toLowerCase()}`}>
                                        {safeString(
                                            displayAnalysis?.approval_status,
                                            "Unknown",
                                        )}
                                    </span>
                                </div>
                                <div className="wa-detail-item">
                                    <label>Created At:</label>
                                    <span>
                                        {formatDateTime(
                                            displayAnalysis?.created_at,
                                        )}
                                    </span>
                                </div>
                                {displayAnalysis?.approved_by && (
                                    <div className="wa-detail-item">
                                        <label>Approved By:</label>
                                        <span>
                                            {typeof displayAnalysis.approved_by ===
                                            "object"
                                                ? safeString(
                                                      displayAnalysis
                                                          .approved_by?.name,
                                                  )
                                                : safeString(
                                                      displayAnalysis.approved_by,
                                                  )}
                                        </span>
                                    </div>
                                )}
                                {displayAnalysis?.approved_at && (
                                    <div className="wa-detail-item">
                                        <label>Approved At:</label>
                                        <span>
                                            {formatDateTime(
                                                displayAnalysis.approved_at,
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WorkAnalysisRecords;
