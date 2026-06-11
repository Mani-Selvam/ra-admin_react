import {
    DashboardRoutes,
    MasterRoutes,
    TicketRoutes,
} from "@/Route/AuthRoutes";

export const sidebarConfig = [
    {
        name: "Dashboard",
        path: DashboardRoutes.MAIN_PAGE,
        iconClass: "ph-duotone ph-house",
    },
    {
        name: "",
        path: DashboardRoutes.MAIN_PAGE,
    },
    {
        type: "dropdown",
        title: "",
        name: "master",
        collapseId: "master",
        path: "/master",
        iconClass: "ph-duotone ph-database",
        children: [
            { name: "Company", path: MasterRoutes.COMPANY_MASTER_PAGE },
            { name: "Priority", path: MasterRoutes.PRIORITY_MASTER_PAGE },
            { name: "Designation", path: MasterRoutes.DESIGNATION_MASTER_PAGE },
            { name: "User", path: MasterRoutes.USER_MASTER_PAGE },
            { name: "Department", path: MasterRoutes.DEPARTMENT_MASTER_PAGE },
            {
                name: "Ticket Status",
                path: MasterRoutes.TICKET_STATUS_MASTER_PAGE,
            },
        ],
    },
    {
        type: "dropdown",
        title: "",
        name: "ticket",
        collapseId: "ticket",
        path: "/ticket",
        iconClass: "ph-duotone ph-ticket",
        children: [
            { name: "Ticket", path: TicketRoutes.TICKET_PAGE },
            { name: "Work Details", path: TicketRoutes.WORK_PAGE },
            {
                name: "Material Approved",
                path: TicketRoutes.MATERIAL_APPROVED_PAGE,
            },
            { name: "Closed Ticket", path: TicketRoutes.CLOSED_PAGE },
        ],
    },
];
