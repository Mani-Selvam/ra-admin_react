import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import {
    DashboardRoutes,
    MasterRoutes,
    TicketRoutes,
} from "@/Route/AuthRoutes";
import Layout from "@/Layout";
import { ProtectedRoute } from "@/Components/Login/ProtectedRoute";
import Login from "@/Components/Login/Login";

// DashboardRoutes
const EnhancedDashboard = React.lazy(() => import("@/Pages/Dashboard/EnhancedDashboard"));

// MasterRoutes
const Company = React.lazy(() => import("@/Pages/Master/Company"));
const Priority = React.lazy(() => import("@/Pages/Master/Priority"));
const Designation = React.lazy(() => import("@/Pages/Master/Designation"));
const User = React.lazy(() => import("@/Pages/Master/User"));
const Department = React.lazy(() => import("@/Pages/Master/Department"));
const TicketStatus = React.lazy(() => import("@/Pages/Master/TicketStatus"));

// TicketRoutes
const TicketList = React.lazy(() => import("@/Pages/Ticket/TicketList"));
const CreateTicket = React.lazy(() => import("@/Pages/Ticket/CreateTicket"));
const Worker = React.lazy(() => import("@/Pages/Ticket/Worker"));
const MaterialApprovedPage = React.lazy(() => import("@/Components/TicketDash/MaterialApprovedPage"));
const ClosedTicket = React.lazy(() => import("@/Pages/Ticket/Closed"));
const ShowTicket = React.lazy(() => import("@/Components/TicketDash/ShowTicket"));

const Routes = () => {
    let element = [
        // Login Route
        { path: "/login", element: <Login /> },
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                // DashboardRoutes
                { path: DashboardRoutes.MAIN_PAGE, element: <EnhancedDashboard /> },

                // MasterRoutes
                { path: MasterRoutes.COMPANY_MASTER_PAGE, element: <Company /> },
                { path: MasterRoutes.PRIORITY_MASTER_PAGE, element: <Priority /> },
                { path: MasterRoutes.DESIGNATION_MASTER_PAGE, element: <Designation /> },
                { path: MasterRoutes.USER_MASTER_PAGE, element: <User /> },
                { path: MasterRoutes.DEPARTMENT_MASTER_PAGE, element: <Department /> },
                { path: MasterRoutes.TICKET_STATUS_MASTER_PAGE, element: <TicketStatus /> },

                // TicketRoutes
                { path: TicketRoutes.TICKET_PAGE, element: <TicketList /> },
                { path: TicketRoutes.CREATE_TICKET_PAGE, element: <CreateTicket /> },
                { path: TicketRoutes.WORK_PAGE, element: <Worker /> },
                { path: TicketRoutes.MATERIAL_APPROVED_PAGE, element: <MaterialApprovedPage /> },
                { path: TicketRoutes.CLOSED_PAGE, element: <ClosedTicket /> },
                { path: TicketRoutes.SHOW_TICKET_PAGE, element: <ShowTicket /> },
            ],
        },
        // Fallback for not found
        { path: "*", element: <Navigate to={DashboardRoutes.MAIN_PAGE} /> },
    ];
    return useRoutes(element);
};

export default Routes;
