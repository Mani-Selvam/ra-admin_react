import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import ScrollArrow from "./Footer/ScrollArrow";
import { useEffect, useState } from "react";
import Customizer from "./Customizer";
import MobileBottomNav from "./MobileBottomNav";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleNavClick = () => {
        if (window.innerWidth <= 991) {
            setIsSidebarOpen(false); // Hide completely on mobile
        } else {
            setIsSidebarOpen(true);  // Collapse to semi-nav on desktop
        }
    };

    return (
        <div className="app-wrapper default">



            <style>
                {`
                    .mobile-sidebar-overlay {
                        display: none;
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease-in-out;
                    }
                    @media (max-width: 991px) {
                        .mobile-sidebar-overlay.active {
                            display: block;
                            opacity: 1;
                            visibility: visible;
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-color: rgba(0, 0, 0, 0.4);
                            backdrop-filter: blur(3px);
                            z-index: 998;
                        }
                        
                        /* Fix mobile sidebar drawer to be full width and visible */
                        .vertical-sidebar {
                            position: fixed !important;
                            top: 0 !important;
                            left: 0 !important;
                            bottom: 0 !important;
                            height: 100% !important;
                            max-height: 100% !important;
                            z-index: 9999 !important;
                            border-radius: 0 16px 16px 0 !important;
                            margin: 0 !important;
                            background-color: #ffffff !important;
                            box-shadow: 4px 0 24px rgba(0,0,0,0.15) !important;
                            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                            transform: translateX(-100%);
                            width: 260px !important;
                        }
                        
                        /* When active (using semi-nav as the trigger on mobile) */
                        .vertical-sidebar.semi-nav {
                            transform: translateX(0) !important;
                        }

                        /* Override semi-nav collapsing styles on mobile */
                        .vertical-sidebar.semi-nav .app-logo {
                            padding: 1.5rem 1.5rem 0 1.5rem !important;
                        }
                        .vertical-sidebar.semi-nav .app-logo .logo {
                            width: auto !important;
                        }
                        .vertical-sidebar.semi-nav .menu-title span {
                            display: inline !important;
                            font-size: 14px !important;
                        }
                        .vertical-sidebar.semi-nav .main-nav li a {
                            font-size: 15px !important;
                            text-align: left !important;
                        }
                        .vertical-sidebar.semi-nav .main-nav li a i {
                            margin: 0 !important;
                            margin-right: 0.3rem !important;
                        }
                        .vertical-sidebar.semi-nav .main-nav li:not(.menu-title) > a::after {
                            content: "\\ebf8" !important;
                            font-family: "Phosphor-Bold" !important;
                            position: absolute !important;
                            right: 1.5rem !important;
                            font-size: 0.7rem !important;
                        }
                        .vertical-sidebar.semi-nav .main-nav li:not(.menu-title) > a[aria-expanded="false"]::after {
                            content: "\\ec86" !important;
                        }
                        
                        /* Fix mobile submenus so they act as accordions normally */
                        .vertical-sidebar.semi-nav .main-nav > li:not(.menu-title) ul {
                            /* Reset semi-nav hiding behavior, but don't force display */
                            opacity: 1 !important;
                            visibility: visible !important;
                            height: auto !important;
                        }
                        
                        /* Allow Bootstrap collapse to work */
                        .vertical-sidebar.semi-nav .collapse:not(.show) {
                            display: none !important;
                        }
                        .vertical-sidebar.semi-nav .collapse.show {
                            display: block !important;
                        }
                    }
                `}
            </style>

            {/*-- Menu Navigation starts --*/}
            <Sidebar sidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleNavClick={handleNavClick} />

            {/* Mobile Sidebar Overlay */}
            <div
                className={`mobile-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            {/*-- Menu Navigation ends --*/}

            <div className="app-content">
                {/*-- Header Section starts --*/}
                <Header sidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                {/*-- Header Section ends --*/}

                {/*-- Body main section starts --*/}
                <main>
                    <Outlet />
                </main>
                {/*-- Body main section ends --*/}
            </div>

            {/*-- tap on top --*/}
            <ScrollArrow />

            {/*-- Footer Section starts--*/}
            {/* <Footer/> */}
            {/* <Customizer/> */}
            {/*-- Footer Section ends--*/}
            {/*-- Mobile Bottom Navigation --*/}
            <MobileBottomNav />
        </div>
    );
};

export default Layout;