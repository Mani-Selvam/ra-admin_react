import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTickets, updateTicket, deleteTicket } from "@/Components/Api/TicketApi/ticketAPI";
import { getWorkAnalysis, updateWorkAnalysis } from "@/Components/Api/TicketApi/workAnalysisAPI";
import { getTicketStatuses } from "@/Components/Api/MasterApi/ticketStatusApi";
import { decryptTicketId } from "../../_helper/encryption";
import { normalizeImageUrl } from "@/_helper/imageUrl";
import API_ENDPOINTS from "@/config/apiConfig";
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
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [ticketStatuses, setTicketStatuses] = useState([]);
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
            console.log("✅ Fetched", fetchedTickets.length, "tickets");

            // Log tickets with images
            const withImages = fetchedTickets.filter(t => t.image);
            if (withImages.length > 0) {
                console.log("🖼️ Tickets with images:", withImages.length);
                withImages.slice(0, 2).forEach((t, i) => {
                    console.log(`   Ticket ${i + 1} (_id=${t._id || t.id}): image="${t.image}"`);
                });
            }

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
            console.error("Error fetching work details:", error);
        } finally {
            setLoadingAnalyses(false);
        }
    };

    const fetchTicketStatuses = async () => {
        try {
            const data = await getTicketStatuses();
            setTicketStatuses(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error("Error fetching ticket statuses:", error);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchWorkAnalyses();
        fetchTicketStatuses();
    }, []);

    // Log when a ticket is viewed (for debugging image URLs)
    useEffect(() => {
        if (viewTicket) {
            console.log("📋 Ticket viewed - ID:", viewTicket._id || viewTicket.id);
            console.log("   Image field:", viewTicket.image);
            if (viewTicket.image) {
                const normalized = normalizeImageUrl(viewTicket.image);
                console.log("   Normalized URL:", normalized);
            }
        }
    }, [viewTicket]);

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

    const normalize = (text) =>
        String(text).toLowerCase().replace(/\s+/g, " ").trim();

    const handleTicketCreated = (statusName = "Raised") => {

        setShowCreateForm(false);
        setEditTicket(null);
        fetchTickets();

        console.log("STATUS RECEIVED 👉", statusName);
        const status = normalize(statusName);

        const statusMessages = {
            "closed": "🔒 Ticket closed successfully!",
            "material approved": "✅ Material approved successfully!",
            "material request": "📋 Material request created successfully!",
            "working in progress": "⏳ Ticket marked as working in progress!",
            "work completed": "✔️ Work completed successfully!",
            "raised": "🚀 Ticket raised successfully!",
            "approved": "✅ Ticket approved successfully!",
        };

        const toastMessage =
            statusMessages[status] ||
            `🎫 Ticket created with ${statusName} successfully!`;

        showToast(toastMessage, "success");
    };

    // Toggle material approval for a ticket's analysis -> updates ticket status and work analysis
    const handleMaterialToggle = async (analysis, makePending) => {
        try {
            const ticketId = viewTicket?._id || (analysis.ticket_id && (analysis.ticket_id._id || analysis.ticket_id));
            if (!ticketId) {
                showToast("Ticket not found for this analysis", "error");
                return;
            }

            // Map "Material Required" to "Material Request" and "Material Approved" stays the same
            const statusName = makePending ? "Material Request" : "Material Approved";
            const ticketObj = tickets.find((t) => String(t._id) === String(ticketId));
            const companyId = ticketObj?.company_id?._id || ticketObj?.company_id || null;

            console.log("Looking for status:", statusName);
            console.log("Available ticketStatuses:", ticketStatuses);

            // Find exact status match from master list
            let statusId = null;
            let statusObj = null;
            if (ticketStatuses && ticketStatuses.length > 0) {
                // Look for exact match first
                statusObj = ticketStatuses.find((s) => String(s.name).toLowerCase() === String(statusName).toLowerCase());
                statusId = statusObj?._id || statusObj?.id || null;
                console.log("Found status:", statusObj);
            }

            const updatePayload = statusId ? { status_id: statusId } : { status: statusName };
            console.log("Sending payload:", updatePayload);
            await updateTicket(ticketId, updatePayload);

            // Update the work analysis material_required field
            const analysisId = analysis._id || analysis.analysis_id;
            if (analysisId) {
                const materialValue = makePending ? "Yes" : "No";
                await updateWorkAnalysis(analysisId, { material_required: materialValue });
                console.log(`Work analysis ${analysisId} material_required updated to ${materialValue}`);
            }

            showToast(`Ticket status updated to ${statusName}`, "success");

            // Update viewTicket immediately with new status
            if (viewTicket && String(viewTicket._id) === String(ticketId)) {
                const updatedViewTicket = {
                    ...viewTicket,
                    status_id: statusObj ? { _id: statusObj._id, name: statusObj.name } : { name: statusName },
                    status: statusName,
                };
                console.log("Updated viewTicket:", updatedViewTicket);
                setViewTicket(updatedViewTicket);
            }

            // Re-fetch lists in background
            fetchTickets();
            fetchWorkAnalyses();
        } catch (err) {
            console.error("Failed to update ticket status:", err);
            showToast("Failed to update ticket status", "error");
        }
    };

    // Close ticket - only available to the person who raised the ticket
    const handleCloseTicket = async () => {
        if (!viewTicket) {
            showToast("No ticket selected", "error");
            return;
        }

        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        // Use 'id' or '_id' - localStorage uses 'id', but database uses '_id'
        const currentUserId = currentUser.id || currentUser._id;
        const raisedByUserId = viewTicket.raised_by?._id || viewTicket.raised_by;

        console.log("🔍 Close Ticket Debug:");
        console.log("   Current User ID:", currentUserId, "Type:", typeof currentUserId);
        console.log("   Current User Object:", currentUser);
        console.log("   Raised By ID:", raisedByUserId, "Type:", typeof raisedByUserId);
        console.log("   Raised By Object:", viewTicket.raised_by);
        console.log("   Match:", String(currentUserId) === String(raisedByUserId));

        // Check if current user is the one who raised the ticket
        if (String(currentUserId) !== String(raisedByUserId)) {
            showToast("Only the person who raised this ticket can close it", "error");
            return;
        }

        try {
            // Find "Closed" status
            let statusId = null;
            let statusObj = null;
            if (ticketStatuses && ticketStatuses.length > 0) {
                statusObj = ticketStatuses.find((s) => String(s.name).toLowerCase() === "closed");
                statusId = statusObj?._id || statusObj?.id || null;
            }

            const closedAtTimestamp = new Date().toISOString();
            const updatePayload = {
                ...(statusId ? { status_id: statusId } : { status: "Closed" }),
                closed_at: closedAtTimestamp,
            };

            await updateTicket(viewTicket._id, updatePayload);
            showToast("Ticket closed successfully", "success");

            // Update viewTicket immediately
            const updatedViewTicket = {
                ...viewTicket,
                status_id: statusObj ? { _id: statusObj._id, name: statusObj.name } : { name: "Closed" },
                status: "Closed",
                closed_at: closedAtTimestamp,
            };
            setViewTicket(updatedViewTicket);

            // Also update in the tickets array immediately (for table view)
            const updatedTickets = tickets.map((t) =>
                String(t._id) === String(viewTicket._id)
                    ? {
                        ...t,
                        status_id: statusObj ? { _id: statusObj._id, name: statusObj.name } : { name: "Closed" },
                        status: "Closed",
                        closed_at: closedAtTimestamp,
                    }
                    : t,
            );
            setTickets(updatedTickets);

            // Re-fetch lists in background
            fetchTickets();
            fetchWorkAnalyses();
        } catch (err) {
            console.error("Failed to close ticket:", err);
            showToast("Failed to close ticket: " + err.message, "error");
        }
    };

    // --- 4. Filtering ---
    const filteredTickets = tickets.filter((ticket) => {
        const term = searchTerm.toLowerCase();
        const id = String(ticket.ticket_id || "").toLowerCase();
        const title = String(ticket.title || "").toLowerCase();
        const desc = String(ticket.description || "").toLowerCase();

        // Search term filter
        const matchesSearch = id.includes(term) || title.includes(term) || desc.includes(term);

        // Status filter from URL parameter
        const ticketStatus = getStatusName(ticket);
        const matchesStatusFilter = !statusFilter || ticketStatus.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatusFilter;
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
                <div style={{...styles.toast,...(toast.type==="error"?styles.toastError:styles.toastSuccess)}}>
                    <div style={styles.toastContent}>
                        {toast.type==="success"?<CheckIcon />:<span style={styles.errorIcon}>⚠</span>}
                        <span style={styles.toastMessage}>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* --- Delete Confirmation Modal --- */}
            {confirmModal.isOpen && (
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,backdropFilter:"blur(4px)"}}>
                    <div style={{background:"white",borderRadius:"16px",padding:"32px",maxWidth:"420px",width:"90%",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)",animation:"fadeIn 0.2s ease"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"16px"}}>
                            <div style={{width:"44px",height:"44px",borderRadius:"50%",background:"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            </div>
                            <div>
                                <h3 style={{margin:0,fontSize:"18px",fontWeight:"700",color:"#111827"}}>{confirmModal.title}</h3>
                                <p style={{margin:"4px 0 0",fontSize:"14px",color:"#6b7280"}}>{confirmModal.message}</p>
                            </div>
                        </div>
                        <p style={{fontSize:"13px",color:"#9ca3af",margin:"0 0 24px",paddingLeft:"58px"}}>This action cannot be undone.</p>
                        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
                            <button
                                onClick={()=>setConfirmModal({isOpen:false,title:"",message:"",onConfirm:null})}
                                style={{padding:"10px 20px",borderRadius:"8px",border:"1px solid #e5e7eb",background:"white",color:"#374151",fontWeight:"600",cursor:"pointer",fontSize:"14px",transition:"all 0.15s"}}
                                onMouseEnter={(e)=>{e.currentTarget.style.background="#f9fafb";}}
                                onMouseLeave={(e)=>{e.currentTarget.style.background="white";}}>
                                Cancel
                            </button>
                            <button
                                onClick={()=>{const fn=confirmModal.onConfirm;setConfirmModal({isOpen:false,title:"",message:"",onConfirm:null});if(fn)fn();}}
                                style={{padding:"10px 20px",borderRadius:"8px",border:"none",background:"#ef4444",color:"white",fontWeight:"600",cursor:"pointer",fontSize:"14px",transition:"all 0.15s",boxShadow:"0 4px 6px -1px rgba(239,68,68,0.3)"}}
                                onMouseEnter={(e)=>{e.currentTarget.style.background="#dc2626";e.currentTarget.style.transform="translateY(-1px)";}}
                                onMouseLeave={(e)=>{e.currentTarget.style.background="#ef4444";e.currentTarget.style.transform="translateY(0)";}}>
                                🗑️ Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Create/Edit Form Modal --- */}
            {showCreateForm && (
                <div style={styles.modalOverlay} onClick={()=>{setShowCreateForm(false);setEditTicket(null);}}>
                    <div style={styles.largeModal} onClick={(e)=>e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{editTicket?"Edit Ticket":"Create New Ticket"}</h3>
                            <button onClick={()=>{setShowCreateForm(false);setEditTicket(null);}} style={styles.iconBtn}><CloseIcon /></button>
                        </div>
                        <div style={styles.modalBody}>
                            <CreateTicket
                                isEdit={!!editTicket}
                                initialData={editTicket}
                                onTicketCreated={()=>{setShowCreateForm(false);setEditTicket(null);fetchTickets();showToast("Ticket created successfully!","success");}}
                                onTicketUpdated={()=>{setShowCreateForm(false);setEditTicket(null);fetchTickets();showToast("Ticket updated successfully!","success");}}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- View Ticket Modal --- */}
            {viewTicket && (
                <div style={styles.modalOverlay} onClick={()=>setViewTicket(null)}>
                    <div style={{...styles.largeModal,maxWidth:"820px",width:"95%",maxHeight:"90vh",overflowY:"auto"}} onClick={(e)=>e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h3 style={styles.modalTitle}>#{viewTicket.ticket_id} — {viewTicket.title}</h3>
                                <div style={{display:"flex",gap:"8px",marginTop:"6px",flexWrap:"wrap"}}>
                                    <span style={{...styles.badge,...getStatusStyle(getStatusName(viewTicket))}}>{getStatusName(viewTicket)}</span>
                                    <span style={{...styles.badge,...getPriorityStyle(getPriorityName(viewTicket))}}>{getPriorityName(viewTicket)}</span>
                                    {viewTicket.approval_status&&(<span style={{...styles.badge,background:viewTicket.approval_status==="Approved"?"#dcfce7":"#fee2e2",color:viewTicket.approval_status==="Approved"?"#166534":"#991b1b"}}>{viewTicket.approval_status}</span>)}
                                </div>
                            </div>
                            <button onClick={()=>setViewTicket(null)} style={styles.iconBtn}><CloseIcon /></button>
                        </div>
                        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"20px"}}>
                            {/* Action Buttons */}
                            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                                <button onClick={()=>{setEditTicket(viewTicket);setViewTicket(null);setShowCreateForm(true);}} style={styles.actionBtn}>✏️ Edit</button>
                                <button onClick={()=>{setSelectedTicketForApproval(viewTicket);setViewTicket(null);setShowApprovalModal(true);}} style={{...styles.actionBtn,...styles.approveBtnStyle}}>✅ Approve</button>
                                <button onClick={()=>{setSelectedTicketForAnalysis(viewTicket);setViewTicket(null);setShowWorkAnalysisModal(true);}} style={{...styles.actionBtn,background:"#0ea5e9",color:"white",border:"none"}}>🔧 Work Analysis</button>
                                <button onClick={()=>{handleDelete(viewTicket);setViewTicket(null);}} style={{...styles.actionBtn,...styles.deleteBtnStyle}}>🗑️ Delete</button>
                            </div>
                            {/* Info Grid */}
                            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px"}}>
                                {[["Ticket ID",viewTicket.ticket_id],["Company",getCompanyName(viewTicket)],["Department",viewTicket.department_id?.name||"-"],["Raised By",viewTicket.raised_by?.name||"-"],["Location",viewTicket.location||"-"],["Assigned To",viewTicket.assigned_to?.map(u=>u.name).join(", ")||"-"],["Created",new Date(viewTicket.createdAt).toLocaleString()],["Closed At",viewTicket.closed_at?new Date(viewTicket.closed_at).toLocaleString():"-"]].map(([label,val])=>(
                                    <div key={label} style={{background:"#f8fafc",borderRadius:"8px",padding:"12px 14px",border:"1px solid #e2e8f0"}}>
                                        <div style={{fontSize:"11px",fontWeight:"600",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"4px"}}>{label}</div>
                                        <div style={{fontSize:"14px",color:"#1e293b",fontWeight:"500"}}>{val}</div>
                                    </div>
                                ))}
                            </div>
                            {/* Description */}
                            {viewTicket.description&&(
                                <div style={{background:"#f8fafc",borderRadius:"8px",padding:"14px",border:"1px solid #e2e8f0"}}>
                                    <div style={{fontSize:"11px",fontWeight:"600",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"8px"}}>Description</div>
                                    <p style={{margin:0,fontSize:"14px",color:"#374151",lineHeight:"1.6"}}>{viewTicket.description}</p>
                                </div>
                            )}
                            {/* Image */}
                            {viewTicket.image&&(
                                <div style={{background:"#f8fafc",borderRadius:"8px",padding:"14px",border:"1px solid #e2e8f0"}}>
                                    <div style={{fontSize:"11px",fontWeight:"600",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"8px"}}>Attachment</div>
                                    <img src={normalizeImageUrl(viewTicket.image)} alt="ticket" style={{maxWidth:"100%",maxHeight:"300px",objectFit:"contain",borderRadius:"8px",border:"1px solid #e2e8f0"}} />
                                </div>
                            )}
                            {/* Work Analyses */}
                            {workAnalyses&&workAnalyses.filter(w=>String(w.ticket_id)===String(viewTicket._id)).length>0&&(
                                <div style={{background:"#f8fafc",borderRadius:"8px",padding:"14px",border:"1px solid #e2e8f0"}}>
                                    <div style={{fontSize:"11px",fontWeight:"600",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"12px"}}>Work Analysis</div>
                                    {workAnalyses.filter(w=>String(w.ticket_id)===String(viewTicket._id)).map((wa,i)=>(
                                        <div key={i} style={{background:"white",borderRadius:"6px",padding:"12px",border:"1px solid #e2e8f0",marginBottom:"8px"}}>
                                            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#374151",marginBottom:"6px"}}>
                                                <span style={{fontWeight:"600"}}>{wa.work_done||"Work Entry"}</span>
                                                <span style={{color:"#6b7280"}}>{wa.createdAt?new Date(wa.createdAt).toLocaleDateString():""}</span>
                                            </div>
                                            {wa.remarks&&<p style={{margin:0,fontSize:"13px",color:"#6b7280"}}>{wa.remarks}</p>}
                                            {wa.uploaded_images&&wa.uploaded_images.length>0&&(
                                                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"8px"}}>
                                                    {wa.uploaded_images.map((img,j)=>(<img key={j} src={normalizeImageUrl(img)} alt={`wa-${j}`} style={{width:80,height:60,objectFit:"cover",borderRadius:"4px",border:"1px solid #e2e8f0"}} />))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- Approval Modal --- */}
            {showApprovalModal && selectedTicketForApproval && (
                <div style={styles.modalOverlay} onClick={()=>{setShowApprovalModal(false);setSelectedTicketForApproval(null);}}>
                    <div style={styles.largeModal} onClick={(e)=>e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Ticket Approval - {selectedTicketForApproval.ticket_number}</h3>
                            <button onClick={()=>{setShowApprovalModal(false);setSelectedTicketForApproval(null);}} style={styles.iconBtn}><CloseIcon /></button>
                        </div>
                        <div style={styles.modalBody}>
                            <ApprovalModule
                                ticketId={selectedTicketForApproval._id}
                                ticketTitle={selectedTicketForApproval.title}
                                onApprovalSuccess={()=>{setShowApprovalModal(false);setSelectedTicketForApproval(null);fetchTickets();showToast("Approval submitted successfully!","success");}}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- Work Analysis Modal --- */}
            {showWorkAnalysisModal && selectedTicketForAnalysis && (
                <div style={styles.modalOverlay} onClick={()=>{setShowWorkAnalysisModal(false);setSelectedTicketForAnalysis(null);}}>
                    <div style={styles.largeModal} onClick={(e)=>e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Work Details - {selectedTicketForAnalysis.ticket_id}</h3>
                            <button onClick={()=>{setShowWorkAnalysisModal(false);setSelectedTicketForAnalysis(null);}} style={styles.iconBtn}><CloseIcon /></button>
                        </div>
                        <div style={styles.modalBody}>
                            <WorkAnalysisForm
                                ticketId={selectedTicketForAnalysis._id}
                                ticketTitle={selectedTicketForAnalysis.title}
                                onAnalysisCreated={()=>{setShowWorkAnalysisModal(false);setSelectedTicketForAnalysis(null);fetchTickets();showToast("Work Analysis submitted!","success");}}
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
                        {statusFilter && (
                            <span style={{display:'inline-block',marginLeft:'16px',padding:'6px 12px',background:'#dbeafe',color:'#1e40af',borderRadius:'20px',fontSize:'13px',fontWeight:'600'}}>
                                Filtered: {statusFilter}
                            </span>
                        )}
                    </p>
                </div>
                <div style={styles.searchBarWrapper}>
                    <div style={styles.searchInputWrapper}>
                        <span style={styles.searchIcon}><SearchIcon /></span>
                        <input type="text" placeholder="Search" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} style={styles.searchInput} />
                    </div>
                </div>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <button onClick={()=>{setEditTicket(null);setShowCreateForm(true);}} style={styles.primaryBtn}>+ Create Ticket</button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="desktop-view-container">
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {["ID","Title","Description","Img","Location","Dept","Company","Raised By","Priority","Status","Approval","Assigned To","Created","Closed","Actions"].map((h,i)=>(
                                    <th key={i} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.length === 0 ? (
                                <tr><td colSpan={15} style={{textAlign:"center",padding:"40px",color:"#6b7280"}}>No tickets found</td></tr>
                            ) : filteredTickets.map((ticket)=>(
                                <tr key={ticket._id} style={styles.tr} onClick={()=>setViewTicket(ticket)}>
                                    <td style={styles.td}><span style={styles.mono}>{ticket.ticket_id}</span></td>
                                    <td style={styles.td}><span style={{maxWidth:"150px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block"}} title={ticket.title}>{ticket.title}</span></td>
                                    <td style={styles.td}><span style={{maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block",cursor:"pointer"}} title={ticket.description}>{ticket.description}</span></td>
                                    <td style={styles.td}>
                                        {ticket.image ? (
                                            <img src={normalizeImageUrl(ticket.image)} alt="img" style={styles.thumb} onClick={(e)=>{e.stopPropagation();setViewTicket(ticket);}} />
                                        ) : <span style={styles.noData}>-</span>}
                                    </td>
                                    <td style={styles.td}><span title={ticket.location} style={{maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{ticket.location||"-"}</span></td>
                                    <td style={styles.td}>{ticket.department_id?.name||"-"}</td>
                                    <td style={styles.td}><span style={{maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block"}} title={getCompanyName(ticket)}>{getCompanyName(ticket)}</span></td>
                                    <td style={styles.td}>{ticket.raised_by?.name||"-"}</td>
                                    <td style={styles.td}><span style={{...styles.badge,...getPriorityStyle(getPriorityName(ticket))}}>{getPriorityName(ticket)}</span></td>
                                    <td style={styles.td}><span style={{...styles.badge,...getStatusStyle(getStatusName(ticket))}}>{getStatusName(ticket)}</span></td>
                                    <td style={styles.td}>
                                        {ticket.approval_status ? (
                                            <span style={{...styles.badge,background:ticket.approval_status==="Approved"?"#dcfce7":"#fee2e2",color:ticket.approval_status==="Approved"?"#166534":"#991b1b"}}>{ticket.approval_status}</span>
                                        ) : <span style={styles.badge}>Pending</span>}
                                    </td>
                                    <td style={styles.td}>
                                        {ticket.assigned_to&&ticket.assigned_to.length>0 ? (
                                            <div style={{fontSize:"12px"}}>
                                                {ticket.assigned_to.slice(0,2).map((u,i)=>(<div key={i} title={u.name} style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name||"Unknown"}</div>))}
                                                {ticket.assigned_to.length>2&&<div style={{color:"#666",fontSize:"11px"}}>+{ticket.assigned_to.length-2} more</div>}
                                            </div>
                                        ) : <span style={{color:"#999"}}>-</span>}
                                    </td>
                                    <td style={styles.td}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    <td style={styles.td}>{ticket.status_id?.name!=="Closed"&&ticket.closed_at?new Date(ticket.closed_at).toLocaleDateString():"-"}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actions} onClick={(e)=>e.stopPropagation()}>
                                            <button onClick={()=>setViewTicket(ticket)} title="View" style={styles.iconButton}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                                            <button onClick={(e)=>{e.stopPropagation();setEditTicket(ticket);setShowCreateForm(true);}} title="Edit" style={styles.iconButton}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                            <button onClick={(e)=>{e.stopPropagation();setSelectedTicketForApproval(ticket);setShowApprovalModal(true);}} title="Approve" style={{...styles.iconButton,color:"#10b981"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3z"/><path d="M9 12l2 2 4-4"/></svg></button>
                                            <button onClick={(e)=>{e.stopPropagation();handleDelete(ticket);}} title="Delete" style={{...styles.iconButton,color:"#ef4444"}}><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-view-container">
                <div style={styles.cardContainer}>
                    {filteredTickets.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyStateIcon}>📋</div>
                            <h3 style={styles.emptyStateTitle}>No tickets found</h3>
                            <p style={styles.emptyStateText}>{searchTerm?"Try adjusting your search terms":"Create your first ticket to get started"}</p>
                            {!searchTerm&&(<button onClick={()=>{setEditTicket(null);setShowCreateForm(true);}} style={styles.emptyStateBtn}>Create New Ticket</button>)}
                        </div>
                    ) : (
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"20px",padding:"10px 0"}}>
                            {filteredTickets.map((ticket)=>(
                                <div key={ticket._id} onClick={()=>setViewTicket(ticket)}
                                    style={{background:"white",borderRadius:"12px",border:"1px solid #e5e7eb",padding:"16px",cursor:"pointer",display:"flex",flexDirection:"column",gap:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",transition:"all 0.2s ease-in-out",position:"relative",minHeight:"140px"}}
                                    onMouseEnter={(e)=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 15px -3px rgba(0,0,0,0.1)";}}
                                    onMouseLeave={(e)=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)";}}>
                                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                        <span style={{fontFamily:"monospace",fontSize:"14px",fontWeight:"700",color:"#4b5563"}}>#{ticket.ticket_id}</span>
                                        <span style={{...styles.badge,...getStatusStyle(getStatusName(ticket)),padding:"4px 8px",fontSize:"11px"}}>{getStatusName(ticket)}</span>
                                    </div>
                                    <h3 style={{margin:0,fontSize:"16px",fontWeight:"600",color:"#111827",lineHeight:"1.4",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"ellipsis"}}>{ticket.title}</h3>
                                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"13px",color:"#6b7280"}}>
                                        <span style={{display:"flex",alignItems:"center",gap:"6px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}><BuildingIcon /> {getCompanyName(ticket)}</span>
                                        <span style={{display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}><CalendarIcon /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{marginTop:"auto",display:"flex",justifyContent:"flex-end",gap:"8px",paddingTop:"12px",borderTop:"1px dashed #f3f4f6"}} onClick={(e)=>e.stopPropagation()}>
                                        <button onClick={(e)=>{e.stopPropagation();setEditTicket(ticket);setShowCreateForm(true);}} style={{...styles.actionBtn,padding:"6px 12px",fontSize:"11px"}} title="Edit">Edit</button>
                                        <button onClick={(e)=>{e.stopPropagation();setSelectedTicketForApproval(ticket);setShowApprovalModal(true);}} style={{...styles.actionBtn,...styles.approveBtnStyle,padding:"6px 12px",fontSize:"11px"}} title="Approve">Approve</button>
                                        <button onClick={(e)=>{e.stopPropagation();handleDelete(ticket);}} style={{...styles.actionBtn,...styles.deleteBtnStyle,padding:"6px 12px",fontSize:"11px"}} title="Delete">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
    if (n.includes("material request"))
        return { background: "#fef3c7", color: "#92400e" };
    if (n.includes("material approved"))
        return { background: "#dcfce7", color: "#166534" };
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
        backgroundColor: "#e2e5ea",
        minHeight: "100vh",
        padding: "20px",
        color: "#111827",

    },
    headerSection: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "flex-start",
        marginBottom: "24px",
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
        border: "1px solid #bf3014",
        background: "white",
        color: "#4b5563",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
    },
    approveBtnStyle: {
        borderColor: "#a1bc1d",
        color: "#059669",
        backgroundColor: "#ecfdf5",
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
        color: "#000000",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "700",
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
        minWidth: 0,   // ⭐ VERY IMPORTANT for grid ellipsis
    },

    infoValue: {
        width: "100%",     // ⭐ use column width
        margin: 0,
        fontSize: "14px",
        color: "#374151",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    largeModal: {
        padding: "20px",
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
    // --- Work Analysis Section Styles ---
    analysisSection: {
        padding: "24px 32px",
        backgroundColor: "#f8fafc", // Subtle background for the whole section
        borderTop: "1px solid #e2e8f0",
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    analysisCount: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#64748b",
        background: "#e2e8f0",
        padding: "2px 10px",
        borderRadius: "12px",
    },

    // List & Cards
    analysisList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    analysisCard: {
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        gap: "24px",
        transition: "all 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    "analysisCard:hover": {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        borderColor: "#cbd5e1",
        transform: "translateY(-1px)",
    },

    // Left Column
    analysisLeftCol: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    cardHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardIdBlock: {
        display: "flex",
        alignItems: "baseline",
        gap: "6px",
    },
    idLabel: {
        fontSize: "10px",
        textTransform: "uppercase",
        color: "#94a3b8",
        fontWeight: "700",
        letterSpacing: "0.5px",
    },
    idValue: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "13px",
        fontWeight: "600",
        color: "#334155",
        background: "#f1f5f9",
        padding: "2px 6px",
        borderRadius: "4px",
    },
    dateText: {
        fontSize: "12px",
        color: "#64748b",
        fontWeight: "500",
    },
    workerInfo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "#475569",
        fontWeight: "500",
    },
    detailRow: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
    },
    materialBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        backgroundColor: "#eff6ff",
        color: "#1e40af",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600",
        border: "1px solid #dbeafe",
    },
    descriptionBlock: {
        backgroundColor: "#f8fafc",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #f1f5f9",
    },
    descriptionText: {
        margin: 0,
        fontSize: "13px",
        color: "#475569",
        lineHeight: "1.5",
        fontStyle: "italic",
    },

    // Approval Controls (Modern Toggle)
    approvalControls: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    approvalLabel: {
        fontSize: "11px",
        textTransform: "uppercase",
        color: "#94a3b8",
        fontWeight: "700",
        letterSpacing: "0.5px",
    },
    toggleGroup: {
        display: "flex",
        background: "#f1f5f9",
        padding: "4px",
        borderRadius: "8px",
        width: "fit-content",
    },
    toggleBtn: {
        padding: "6px 16px",
        borderRadius: "6px",
        border: "none",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    toggleBtnInactive: {
        background: "transparent",
        color: "#64748b",
    },
    toggleBtnActivePending: {
        background: "white",
        color: "#d97706", // Amber
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
    toggleBtnActiveApproved: {
        background: "white",
        color: "#059669", // Green
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
    approverInfo: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    approverLabel: {
        color: "#94a3b8",
        textTransform: "uppercase",
        fontSize: "10px",
        fontWeight: "700",
    },
    approverName: {
        fontSize: "12px",
        color: "#475569",
        fontWeight: "500",
    },

    // Right Column (Media)
    analysisRightCol: {
        width: "160px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-end",
    },
    imageGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "6px",
        width: "100%",
    },
    thumbImg: {
        width: "100%",
        aspectRatio: "1",
        objectFit: "cover",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "transform 0.2s",
    },
    "thumbImg:hover": {
        transform: "scale(1.05)",
    },
    moreImagesBadge: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e293b",
        color: "white",
        fontSize: "11px",
        fontWeight: "700",
        borderRadius: "6px",
        aspectRatio: "1",
    },
    noImages: {
        width: "100%",
        aspectRatio: "1.6",
        border: "1px dashed #cbd5e1",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        color: "#94a3b8",
        fontSize: "11px",
    },
    viewDetailsBtn: {
        width: "100%",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#475569",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.2s",
    },
    "viewDetailsBtn:hover": {
        background: "#f8fafc",
        borderColor: "#94a3b8",
    },

    // Loading & Empty States
    loadingWrapper: {
        padding: "20px",
        textAlign: "center",
    },
    emptyAnalysisState: {
        padding: "40px 20px",
        textAlign: "center",
        border: "1px dashed #cbd5e1",
        borderRadius: "12px",
        background: "#f8fafc",
    },
    emptyIcon: { fontSize: "24px", marginBottom: "12px" },
    emptyText: { margin: 0, color: "#94a3b8", fontSize: "14px" },

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
