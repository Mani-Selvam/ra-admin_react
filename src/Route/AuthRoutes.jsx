const DashboardRoutes = {
    MAIN_PAGE: "/",
};

const MasterRoutes = {
    MAIN_PAGE: "/",
    COMPANY_MASTER_PAGE: "/master/company",
    PRIORITY_MASTER_PAGE: "/master/priority",
    DESIGNATION_MASTER_PAGE: "/master/designation",
    USER_MASTER_PAGE: "/master/user",
    DEPARTMENT_MASTER_PAGE: "/master/department",
    TICKET_STATUS_MASTER_PAGE: "/master/ticket-status",
};

const TicketRoutes = {
    MAIN_PAGE: "/",
    TICKET_PAGE: "/ticket/ticket",
    CREATE_TICKET_PAGE: "/ticket/create-ticket",
    WORK_PAGE: "/ticket/worker",
    MATERIAL_APPROVED_PAGE: "/ticket/material-approved",
    CLOSED_PAGE: "/ticket/closed",
    SHOW_TICKET_PAGE: "/ticket/show-ticket",
};

export {
    DashboardRoutes,
    MasterRoutes,
    TicketRoutes,
};
