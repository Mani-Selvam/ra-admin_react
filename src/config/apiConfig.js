// Centralized API Configuration

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_VERSION = "api";

export const API_ENDPOINTS = {
    // Base URL
    BASE_URL: API_BASE_URL,
    
    // Master Data endpoints
    COMPANIES: `${API_BASE_URL}/${API_VERSION}/companies`,
    DEPARTMENTS: `${API_BASE_URL}/${API_VERSION}/departments`,
    PRIORITIES: `${API_BASE_URL}/${API_VERSION}/priorities`,
    TICKET_STATUSES: `${API_BASE_URL}/${API_VERSION}/ticket-status`,
    DESIGNATIONS: `${API_BASE_URL}/${API_VERSION}/designations`,
    
    // Ticket endpoints
    TICKETS: `${API_BASE_URL}/${API_VERSION}/tickets`,
    WORK_ANALYSIS: `${API_BASE_URL}/${API_VERSION}/work-analysis`,
    WORK_LOGS: `${API_BASE_URL}/${API_VERSION}/work-logs`,
};

export default API_ENDPOINTS;
