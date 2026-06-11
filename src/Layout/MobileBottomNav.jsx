import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardRoutes, MasterRoutes, TicketRoutes } from "@/Route/AuthRoutes";

// Custom hook for long press
const useLongPress = (onLongPress, onClick, { shouldPreventDefault = true, delay = 500 } = {}) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef();
    const target = useRef();

    const start = useCallback(
        (e) => {
            if (e.target) {
                target.current = e.target;
            }
            setLongPressTriggered(false);
            timeout.current = setTimeout(() => {
                onLongPress(e);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay]
    );

    const clear = useCallback(
        (e, shouldTriggerClick = true) => {
            timeout.current && clearTimeout(timeout.current);
            shouldTriggerClick && !longPressTriggered && onClick(e);
            setLongPressTriggered(false);
        },
        [onClick, longPressTriggered]
    );

    return {
        onMouseDown: (e) => start(e),
        onTouchStart: (e) => start(e),
        onMouseUp: (e) => clear(e),
        onMouseLeave: (e) => clear(e, false),
        onTouchEnd: (e) => clear(e),
    };
};

const MobileBottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null); // 'master', 'ticket', or null

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path.split('/')[1] ? `/${path.split('/')[1]}` : path);
    };

    const navItems = [
        {
            id: "dashboard",
            name: "Dashboard",
            path: DashboardRoutes.MAIN_PAGE,
            icon: "ph-duotone ph-house",
            basePath: "/",
            children: []
        },
        {
            id: "master",
            name: "Master",
            path: MasterRoutes.COMPANY_MASTER_PAGE,
            icon: "ph-duotone ph-database",
            basePath: "/master",
            children: [
                { name: "Company", path: MasterRoutes.COMPANY_MASTER_PAGE, icon: "ph-duotone ph-buildings" },
                { name: "Priority", path: MasterRoutes.PRIORITY_MASTER_PAGE, icon: "ph-duotone ph-flag" },
                { name: "Designation", path: MasterRoutes.DESIGNATION_MASTER_PAGE, icon: "ph-duotone ph-identification-card" },
                { name: "User", path: MasterRoutes.USER_MASTER_PAGE, icon: "ph-duotone ph-users" },
                { name: "Department", path: MasterRoutes.DEPARTMENT_MASTER_PAGE, icon: "ph-duotone ph-briefcase" },
                { name: "Ticket Status", path: MasterRoutes.TICKET_STATUS_MASTER_PAGE, icon: "ph-duotone ph-traffic-signal" },
            ]
        },
        {
            id: "ticket",
            name: "Ticket",
            path: TicketRoutes.TICKET_PAGE,
            icon: "ph-duotone ph-ticket",
            basePath: "/ticket",
            children: [
                { name: "Ticket", path: TicketRoutes.TICKET_PAGE, icon: "ph-duotone ph-ticket" },
                { name: "Work Details", path: TicketRoutes.WORK_PAGE, icon: "ph-duotone ph-clipboard-text" },
                { name: "Material Approved", path: TicketRoutes.MATERIAL_APPROVED_PAGE, icon: "ph-duotone ph-check-square-offset" },
                { name: "Closed Ticket", path: TicketRoutes.CLOSED_PAGE, icon: "ph-duotone ph-lock-key" },
            ]
        }
    ];

    const closeMenu = () => setOpenMenu(null);

    return (
        <div className="mobile-bottom-nav d-md-none">
            {openMenu && (
                <div className="radial-menu-overlay" onClick={closeMenu}></div>
            )}
            
            <div className="mobile-nav-container">
                {navItems.map((item, index) => {
                    const active = isActive(item.basePath);
                    const isMenuOpen = openMenu === item.id;
                    const hasChildren = item.children && item.children.length > 0;

                    // Setup long press handlers
                    const longPressProps = useLongPress(
                        (e) => {
                            if (hasChildren) {
                                e.preventDefault();
                                setOpenMenu(isMenuOpen ? null : item.id);
                            }
                        },
                        (e) => {
                            if (!isMenuOpen) {
                                navigate(item.path);
                            } else {
                                closeMenu();
                            }
                        },
                        { delay: 400 } // 400ms long press
                    );

                    return (
                        <div key={item.id} className="mobile-nav-item-wrapper" style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
                            {/* The Main Navigation Button */}
                            <div
                                {...longPressProps}
                                className={`mobile-nav-item ${active ? 'active' : ''} ${isMenuOpen ? 'menu-open' : ''}`}
                                style={{ cursor: 'pointer', WebkitUserSelect: 'none', userSelect: 'none' }}
                            >
                                <div className="mobile-nav-icon">
                                    <i className={item.icon}></i>
                                </div>
                                <span className="mobile-nav-text">{item.name}</span>
                            </div>

                            {/* Radial Children Menu */}
                            {hasChildren && (
                                <div className={`radial-menu ${isMenuOpen ? 'open' : ''} radial-${item.id}`}>
                                    {item.children.map((child, childIndex) => {
                                        // Calculate position in a semi-circle
                                        const totalChildren = item.children.length;
                                        let startAngle, endAngle;
                                        if (item.id === "master") {
                                            // 6 items, spread across the top
                                            startAngle = 185;
                                            endAngle = 355;
                                        } else {
                                            // 4 items. Must stay between 205 (to clear the bottom bar) and 275 (to not go off the right edge)
                                            startAngle = 205;
                                            endAngle = 275;
                                        }
                                        
                                        // Convert degrees to radians
                                        const angleStep = (endAngle - startAngle) / (totalChildren - 1);
                                        const currentAngleDeg = startAngle + (childIndex * angleStep);
                                        const angleRad = currentAngleDeg * (Math.PI / 180);
                                        
                                        // Radius of the circle
                                        const radius = item.id === "master" ? 150 : 160; // px
                                        
                                        // Calculate X and Y coordinates relative to the button center
                                        const x = radius * Math.cos(angleRad);
                                        const y = radius * Math.sin(angleRad);
                                        
                                        const transformStyle = isMenuOpen 
                                            ? `translate(${x}px, ${y}px) scale(1)` 
                                            : `translate(0px, 0px) scale(0)`;

                                        return (
                                            <div 
                                                key={childIndex}
                                                className="radial-child-item"
                                                style={{
                                                    transform: transformStyle,
                                                    transitionDelay: isMenuOpen ? `${childIndex * 0.04}s` : '0s'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(child.path);
                                                    closeMenu();
                                                }}
                                            >
                                                <div className="radial-child-icon">
                                                    <i className={child.icon}></i>
                                                </div>
                                                <span className="radial-child-text">{child.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
