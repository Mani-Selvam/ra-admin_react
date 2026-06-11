import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Components/Login/AuthContext";
import { createPortal } from "react-dom";

const HeaderMenu = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/login");
    };

    return (
        <>
            {/* Header */}
            <ul
                style={{
                    display: "flex",
                    alignItems: "center",
                    listStyle: "none",
                    margin: 0,
                    padding: "10px 16px",
                    position: "relative",
                    zIndex: 10001, // stays above overlay
                }}>
                <li>
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                        }}>
                        <img
                            src="/neoticketsystem/assets/images/avtar/woman.jpg"
                            alt="avatar"
                            style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />
                    </button>
                </li>
            </ul>

            {/* GLOBAL OVERLAY + PANEL (PORTAL) */}
            {isOpen &&
                createPortal(
                    <>
                        {/* Overlay */}
                        <div
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                zIndex: 9998,
                                height: "auto",
                            }}
                        />

                        {/* Side Panel */}
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                right: 0,
                                height: "100vh",
                                width: "320px",
                                backgroundColor: "#fff",
                                color: "#000",
                                zIndex: 9999,
                                padding: "24px",
                                boxShadow: "-4px 0 20px rgba(0,0,0,0.4)",
                                borderRadius: "8px 0 0 8px",
                            }}>
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    position: "absolute",
                                    top: "16px",
                                    right: "16px",
                                    background: "none",
                                    border: "none",
                                    color: "#000",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                }}>
                                ✕
                            </button>

                            {/* Profile */}
                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: "40px",
                                }}>
                                <img
                                    src="/neoticketsystem/assets/images/avtar/woman.jpg"
                                    alt="profile"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "14px",
                                        objectFit: "cover",
                                        backgroundColor:
                                            "rgba(255,255,255,0.1)",
                                    }}
                                />

                                <h4
                                    style={{
                                        marginTop: "12px",
                                        marginBottom: "4px",
                                    }}>
                                    {user?.name || "User"}
                                </h4>

                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#000",
                                    }}>
                                    {user?.email || "user@email.com"}
                                </p>
                            </div>

                            {/* Divider */}
                            <div
                                style={{
                                    height: "1px",
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                    margin: "24px 0",
                                    color: "#000",
                                }}
                            />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "rgba(255,68,68,0.15)",
                                    color: "#000",
                                    border: "1px solid rgba(255,68,68,0.4)",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}>
                                Log Out
                            </button>
                        </div>
                    </>,
                    document.body,
                )}
        </>
    );
};

export default HeaderMenu;
