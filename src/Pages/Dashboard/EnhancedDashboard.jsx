import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTickets } from "@/Components/Api/TicketApi/ticketAPI";
import { getTicketStatuses } from "@/Components/Api/MasterApi/ticketStatusApi";
import { getUsers } from "@/Components/Api/MasterApi/userApi";
import { getCompanies } from "@/Components/Api/MasterApi/api";
import { getDepartments } from "@/Components/Api/MasterApi/departmentApi";
import { getDesignations } from "@/Components/Api/MasterApi/designationApi";
import { getPriorities } from "@/Components/Api/MasterApi/priorityApi";
import "./dashboard.css";

// Import Chart.js for premium charts
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title } from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title);

// Professional SVG Icons
const Icons = {
    Building: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    ),
    Users: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    Department: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
        </svg>
    ),
    Briefcase: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
    ),
    Flag: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
    ),
    Ticket: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
    ),
    TrendingUp: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    ),
    Activity: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
    ),
    Clock: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    CheckCircle: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    ),
    AlertCircle: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    ),
    Grid: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    ),
    BarChart: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
    ),
    PieChart: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
    ),
    Calendar: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
};

const ProfessionalDashboard = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusCounts, setStatusCounts] = useState({});
    const [animatedCounts, setAnimatedCounts] = useState({});
    const [ticketTrendData, setTicketTrendData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [priorityData, setPriorityData] = useState([]);
    const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Animate counts
        const newAnimatedCounts = {};
        const allData = {
            "Companies": companies.length,
            "Users": users.length,
            "Departments": departments.length,
            "Designations": designations.length,
            "Priorities": priorities.length,
            "Total": tickets.length,
            ...statusCounts
        };
        
        Object.keys(allData).forEach(key => {
            const targetValue = allData[key];
            const increment = Math.max(1, Math.ceil(targetValue / 20));
            
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetValue) {
                    newAnimatedCounts[key] = targetValue;
                    clearInterval(timer);
                } else {
                    newAnimatedCounts[key] = current;
                }
                setAnimatedCounts(prev => ({...prev, ...newAnimatedCounts}));
            }, 50);
        });
    }, [tickets, users, companies, departments, designations, priorities, statusCounts]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                ticketsData,
                statusesData,
                usersData,
                companiesData,
                departmentsData,
                designsData,
                prioritiesData,
            ] = await Promise.all([
                getTickets(),
                getTicketStatuses(),
                getUsers(),
                getCompanies(),
                getDepartments(),
                getDesignations(),
                getPriorities(),
            ]);

            if (ticketsData) setTickets(Array.isArray(ticketsData) ? ticketsData : []);
            if (statusesData) setStatuses(Array.isArray(statusesData) ? statusesData : []);
            if (usersData) setUsers(Array.isArray(usersData) ? usersData : []);
            if (companiesData) setCompanies(Array.isArray(companiesData) ? companiesData : []);
            if (departmentsData) setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
            if (designsData) setDesignations(Array.isArray(designsData) ? designsData : []);
            if (prioritiesData) setPriorities(Array.isArray(prioritiesData) ? prioritiesData : []);

            // Process ticket trend data
            if (Array.isArray(ticketsData)) {
                // Generate trend data based on time range
                const now = new Date();
                const trendData = [];
                
                // Generate data points for the last 30 days
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const dayTickets = ticketsData.filter(ticket => {
                        const ticketDate = new Date(ticket.createdAt || ticket.created_at).toISOString().split('T')[0];
                        return ticketDate === dateStr;
                    });
                    
                    trendData.push({
                        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        created: dayTickets.length,
                        closed: dayTickets.filter(t => 
                            (t.status_id?.name || '').toLowerCase().includes('closed') || 
                            (t.status_id?.status_name || '').toLowerCase().includes('closed')
                        ).length
                    });
                }
                
                setTicketTrendData(trendData);
                
                // Process department data
                const deptCounts = {};
                ticketsData.forEach(ticket => {
                    const deptName = ticket.department_id?.name || 'Unknown';
                    deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
                });
                
                setDepartmentData(Object.entries(deptCounts).map(([name, count]) => ({ name, count })));
                
                // Process priority data
                const priorityCounts = {};
                prioritiesData.forEach(priority => {
                    priorityCounts[priority.name] = 0;
                });
                
                ticketsData.forEach(ticket => {
                    const priorityName = ticket.priority_id?.name || 'Medium';
                    priorityCounts[priorityName] = (priorityCounts[priorityName] || 0) + 1;
                });
                
                setPriorityData(Object.entries(priorityCounts).map(([name, count]) => ({ name, count })));
            }

            const counts = {};
            // Initialize counts from the fetched statusesData (not stale state)
            if (Array.isArray(statusesData) && statusesData.length > 0) {
                statusesData.forEach((s) => {
                    counts[s.status_name || s.name] = 0;
                });
            }

            // Count using ticketsData (freshly fetched)
            if (Array.isArray(ticketsData) && ticketsData.length > 0) {
                ticketsData.forEach((ticket) => {
                    const statusName =
                        ticket.status_id?.status_name ||
                        ticket.status_id?.name ||
                        (ticket.status && (ticket.status.status_name || ticket.status.name)) ||
                        "Unknown";

                    if (!counts.hasOwnProperty(statusName)) {
                        counts[statusName] = 0;
                    }
                    counts[statusName]++;
                });
            }

            setStatusCounts(counts);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIconComponent = (title) => {
        const t = String(title).toLowerCase();
        if (t.includes("companies") || t.includes("company")) return Icons.Building;
        if (t.includes("users") || t.includes("user")) return Icons.Users;
        if (t.includes("dept") || t.includes("department")) return Icons.Department;
        if (t.includes("desig") || t.includes("design")) return Icons.Briefcase;
        if (t.includes("priorities") || t.includes("priority")) return Icons.Flag;
        if (t.includes("ticket")) return Icons.Ticket;
        return Icons.Grid;
    };

    // Prepare chart data
    const statusChartData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#3b82f6', // blue
                    '#10b981', // green
                    '#f59e0b', // amber
                    '#ef4444', // red
                    '#8b5cf6', // purple
                    '#ec4899', // pink
                    '#14b8a6', // teal
                    '#f97316', // orange
                ],
                borderWidth: 0,
            },
        ],
    };

    const departmentChartData = {
        labels: departmentData.map(d => d.name),
        datasets: [
            {
                label: 'Tickets by Department',
                data: departmentData.map(d => d.count),
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                borderWidth: 1,
            },
        ],
    };

    const priorityChartData = {
        labels: priorityData.map(p => p.name),
        datasets: [
            {
                data: priorityData.map(p => p.count),
                backgroundColor: [
                    '#ef4444', // red for high/critical
                    '#f59e0b', // amber for medium
                    '#10b981', // green for low
                ],
                borderWidth: 0,
            },
        ],
    };

    const trendChartData = {
        labels: ticketTrendData.map(d => d.date),
        datasets: [
            {
                label: 'Created',
                data: ticketTrendData.map(d => d.created),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Closed',
                data: ticketTrendData.map(d => d.closed),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                    },
                    color: '#64748b',
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleFont: {
                    family: "'Inter', sans-serif",
                    size: 14,
                },
                bodyFont: {
                    family: "'Inter', sans-serif",
                    size: 12,
                },
                padding: 10,
                cornerRadius: 8,
            },
        },
    };

    const pieOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: {
                ...chartOptions.plugins.legend,
                position: 'right',
            },
        },
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(100, 116, 139, 0.1)',
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                    },
                    color: '#64748b',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                    },
                    color: '#64748b',
                },
            },
        },
    };

    // Professional Stat Card Component
    const StatCard = ({ title, count, Icon, color = "blue", onClick }) => {
        const IconComponent = Icon || getIconComponent(title);
        const animatedCount = animatedCounts[title] !== undefined ? animatedCounts[title] : count;
        
        return (
            <div 
                className={`professional-stat-card ${color}`}
                onClick={onClick}
                style={{
                    cursor: onClick ? "pointer" : "default",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    if (onClick) {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (onClick) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    }
                }}
            >
                <div className="stat-card-icon">
                    <IconComponent />
                </div>
                <div className="stat-card-content">
                    <div className="stat-number">{animatedCount.toLocaleString()}</div>
                    <div className="stat-title">{title}</div>
                </div>
                <div className="stat-card-indicator"></div>
            </div>
        );
    };

    // Professional Metric Card Component
    const MetricCard = ({ label, value, icon, change }) => (
        <div className="professional-metric-card">
            <div className="metric-icon">{icon}</div>
            <div className="metric-info">
                <div className="metric-label">{label}</div>
                <div className="metric-value">{value}</div>
                {change && (
                    <div className={`metric-change ${change > 0 ? 'positive' : 'negative'}`}>
                        {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                    </div>
                )}
            </div>
        </div>
    );

    // Compact Ticket Card Component
    const CompactTicketCard = ({ ticket }) => {
        const getPriorityColor = (priority) => {
            const p = String(priority).toLowerCase();
            if (p.includes('critical')) return 'red';
            if (p.includes('high')) return 'orange';
            if (p.includes('medium')) return 'blue';
            if (p.includes('low')) return 'green';
            return 'gray';
        };

        const getStatusColor = (status) => {
            const s = String(status).toLowerCase();
            if (s.includes('closed') || s.includes('resolved')) return 'green';
            if (s.includes('progress') || s.includes('working')) return 'blue';
            return 'orange';
        };

        const priorityColor = getPriorityColor(ticket.priority_id?.name || "medium");
        const statusColor = getStatusColor(ticket.status_id?.name || "open");

        return (
            <div className="compact-ticket-card">
                <div className="ticket-header">
                    <span className="ticket-id">#{ticket.ticket_id}</span>
                    <div className="ticket-badges">
                        <span className={`badge ${priorityColor}`}>
                            {ticket.priority_id?.name || "Medium"}
                        </span>
                        <span className={`badge ${statusColor}`}>
                            {ticket.status_id?.name || "Open"}
                        </span>
                    </div>
                </div>
                <div className="ticket-body">
                    <h4 className="ticket-title">{ticket.title}</h4>
                    <div className="ticket-meta">
                        <span className="ticket-user">
                            {ticket.raised_by?.name || "Unknown"}
                        </span>
                        <span className="ticket-date">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="professional-loading">
                <div className="loading-spinner"></div>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="professional-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">System Overview</p>
                </div>
                <div className="header-right">
                    <div className="header-stat">
                        <span className="stat-value">{animatedCounts.Total || 0}</span>
                        <span className="stat-label">Tickets</span>
                    </div>
                    <div className="header-stat">
                        <span className="stat-value">{animatedCounts.Users || 0}</span>
                        <span className="stat-label">Users</span>
                    </div>
                    <div className="header-stat">
                        <span className="stat-value">{animatedCounts.Companies || 0}</span>
                        <span className="stat-label">Companies</span>
                    </div>
                </div>
            </header>

            {/* Main Grid Layout */}
            <main className="dashboard-main">
                {/* Top Row - Master Data */}
                <section className="dashboard-section stats-section">
                    <div className="section-title">
                        <Icons.Grid />
                        <span>Master Data</span>
                    </div>
                    <div className="stats-grid">
                        <StatCard title="Companies" count={companies.length} Icon={Icons.Building} color="blue" onClick={() => navigate("/company/show-company")} />
                        <StatCard title="Users" count={users.length} Icon={Icons.Users} color="purple" onClick={() => navigate("/user/show-user")} />
                        <StatCard title="Departments" count={departments.length} Icon={Icons.Department} color="green" onClick={() => navigate("/department/show-department")} />
                        <StatCard title="Designations" count={designations.length} Icon={Icons.Briefcase} color="orange" onClick={() => navigate("/designation/show-designation")} />
                        <StatCard title="Priorities" count={priorities.length} Icon={Icons.Flag} color="red" onClick={() => navigate("/priority/show-priority")} />
                    </div>
                </section>

                {/* Middle Row - Status and Metrics */}
                <div className="middle-row">
                    {/* Ticket Status */}
                    <section className="dashboard-section status-section">
                        <div className="section-title">
                            <Icons.Activity />
                            <span>Ticket Status</span>
                        </div>
                        <div className="status-grid">
                            <StatCard title="Total Tickets" count={tickets.length} Icon={Icons.Ticket} color="blue" onClick={() => navigate("/ticket/show-ticket")} />
                            {Object.entries(statusCounts).map(([statusName, count]) => (
                                <StatCard
                                    key={statusName}
                                    title={statusName}
                                    count={count}
                                    Icon={statusName.toLowerCase().includes('closed') || statusName.toLowerCase().includes('resolved') 
                                        ? Icons.CheckCircle 
                                        : Icons.Activity}
                                    color={statusName.toLowerCase().includes('closed') || statusName.toLowerCase().includes('resolved') ? "green" : "orange"}
                                    onClick={() => navigate(`/ticket/show-ticket?status=${encodeURIComponent(statusName)}`)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Key Metrics */}
                    <section className="dashboard-section metrics-section">
                        <div className="section-title">
                            <Icons.BarChart />
                            <span>Key Metrics</span>
                        </div>
                        <div className="metrics-list">
                            <MetricCard 
                                label="Avg. Tickets per User" 
                                value={users.length > 0 ? (tickets.length / users.length).toFixed(2) : "0.00"}
                                icon={<Icons.TrendingUp />}
                                change={12}
                            />
                            <MetricCard 
                                label="Active Users" 
                                value={users.length}
                                icon={<Icons.Users />}
                                change={8}
                            />
                            <MetricCard 
                                label="Total Companies" 
                                value={companies.length}
                                icon={<Icons.Building />}
                                change={5}
                            />
                            <MetricCard 
                                label="Total Departments" 
                                value={departments.length}
                                icon={<Icons.Department />}
                                change={3}
                            />
                        </div>
                    </section>
                </div>

                {/* Charts Row */}
                <div className="charts-row">
                    {/* Status Distribution Chart */}
                    <section className="dashboard-section chart-section">
                        <div className="section-title">
                            <Icons.PieChart />
                            <span>Status Distribution</span>
                        </div>
                        <div className="chart-container">
                            <Pie data={statusChartData} options={pieOptions} />
                        </div>
                    </section>

                    {/* Priority Distribution Chart */}
                    <section className="dashboard-section chart-section">
                        <div className="section-title">
                            <Icons.Flag />
                            <span>Priority Distribution</span>
                        </div>
                        <div className="chart-container">
                            <Doughnut data={priorityChartData} options={pieOptions} />
                        </div>
                    </section>
                </div>

                {/* Trend Chart Row */}
                <section className="dashboard-section trend-section">
                    <div className="section-title">
                        <Icons.Calendar />
                        <span>Ticket Trends</span>
                        <div className="time-range-selector">
                            <button 
                                className={`time-range-btn ${timeRange === 'week' ? 'active' : ''}`}
                                onClick={() => setTimeRange('week')}
                            >
                                Week
                            </button>
                            <button 
                                className={`time-range-btn ${timeRange === 'month' ? 'active' : ''}`}
                                onClick={() => setTimeRange('month')}
                            >
                                Month
                            </button>
                            <button 
                                className={`time-range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
                                onClick={() => setTimeRange('quarter')}
                            >
                                Quarter
                            </button>
                            <button 
                                className={`time-range-btn ${timeRange === 'year' ? 'active' : ''}`}
                                onClick={() => setTimeRange('year')}
                            >
                                Year
                            </button>
                        </div>
                    </div>
                    <div className="chart-container large">
                        <Line data={trendChartData} options={barOptions} />
                    </div>
                </section>

                {/* Department Chart Row */}
                <section className="dashboard-section department-section">
                    <div className="section-title">
                        <Icons.Department />
                        <span>Tickets by Department</span>
                    </div>
                    <div className="chart-container">
                        <Bar data={departmentChartData} options={barOptions} />
                    </div>
                </section>

                {/* Bottom Row - Recent Tickets */}
                <section className="dashboard-section tickets-section">
                    <div className="section-title">
                        <Icons.Ticket />
                        <span>Recent Tickets</span>
                    </div>
                    <div className="tickets-grid">
                        {tickets.length > 0 ? (
                            tickets.slice(0, 6).map((ticket) => (
                                <CompactTicketCard key={ticket._id || ticket.ticket_id} ticket={ticket} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <Icons.AlertCircle />
                                <h3>No Tickets Found</h3>
                                <p>Create your first ticket to get started</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfessionalDashboard;