import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/Components/Api/TicketApi/ticketAPI";
import { getUsers } from "@/Components/Api/MasterApi/userApi";
import API_ENDPOINTS from "@/config/apiConfig";
import { getTicketStatuses } from "@/Components/Api/MasterApi/ticketStatusApi";
import "./dashboard.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const Icons = {
  Grid: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-3-3.87"></path><path d="M9 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  More: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
};

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [showAllUsers, setShowAllUsers] = useState(false);
  const STATUS_COLORS = ['#1a1a1a', '#ff9f67', '#10b981', '#3b82f6', '#cf14bc', '#17afd8', '#cf1414', '#e0ea1a'];
  
  // React Query Implementation for Instant Caching & Background Revalidation
  const { data: tickets = [], isLoading: loadingTickets } = useQuery({
    queryKey: ['dashboardTickets'],
    queryFn: async () => {
      const data = await getTickets();
      return Array.isArray(data) ? data : [];
    }
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['dashboardUsers'],
    queryFn: async () => {
      const data = await getUsers();
      return Array.isArray(data) ? data : [];
    }
  });

  const { data: ticketStatuses = [], isLoading: loadingStatuses } = useQuery({
    queryKey: ['dashboardStatuses'],
    queryFn: async () => {
      const data = await getTicketStatuses();
      return Array.isArray(data) ? data : [];
    }
  });

  const loading = loadingTickets || loadingUsers || loadingStatuses;

  // Memoize status counts to recalculate only when cached data changes
  const statusCounts = React.useMemo(() => {
    const counts = {};
    if (ticketStatuses.length > 0) {
      ticketStatuses.forEach((s) => {
        counts[s.status_name || s.name] = 0;
      });
    }
    
    if (tickets.length > 0) {
      tickets.forEach((ticket) => {
        const statusName = ticket.status_id?.status_name || 
                           ticket.status_id?.name || 
                           (ticket.status && (ticket.status.status_name || ticket.status.name)) || 
                           "Unknown";
        if (!counts.hasOwnProperty(statusName)) {
          counts[statusName] = 0;
        }
        counts[statusName]++;
      });
    }
    return counts;
  }, [tickets, ticketStatuses]);

  const statusKeys = Object.keys(statusCounts);
  const doughnutColors = statusKeys.map((_, idx) => STATUS_COLORS[idx % STATUS_COLORS.length]);
  const doughnutData = {
    labels: statusKeys.length > 0 ? statusKeys : ['No Data'],
    datasets: [{
      data: statusKeys.length > 0 ? statusKeys.map((k) => statusCounts[k]) : [0],
      backgroundColor: doughnutColors.length > 0 ? doughnutColors : ['#e5e7eb'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  const totalTickets = Object.values(statusCounts).reduce((s, v) => s + (Number(v) || 0), 0);

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      data: [30, 45, 35, 55, 75, 50, 65],
      borderColor: '#ffcf56',
      backgroundColor: 'rgba(255, 207, 86, 0.15)',
      fill: true,
      tension: 0.45,
      pointRadius: 0
    }]
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="professional-dashboard">
      <header className="dashboard-header">
        <h2 className="welcome-msg">Good Morning, Admin</h2>
        <div className="top-stats-grid">
          <div className="stat-card-new  yellow" onClick={() => navigate('/ticket/show-ticket')} style={{cursor: 'pointer', transition: 'all 0.2s'}} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.9)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
            <div className="stat-info">
              <span className="label">Total Tickets</span>
              <span className="value">{tickets.length} <span className="trend">↑ 12%</span></span>
            </div>
            <div className="stat-icon-circle"><Icons.Grid /></div>
          </div>
          <div className="stat-card-new pink">
            <div className="stat-info">
              <span className="label">Total Users</span>
              <span className="value">{users.length} <span className="trend">↑ 8%</span></span>
            </div>
            <div className="stat-icon-circle"><Icons.Users /></div>
          </div>
          <div className="stat-card-new orange">
            <div className="stat-info">
              <span className="label">Active Status</span>
              <span className="value">{statusCounts['Open'] || 0} <span className="trend">↑ 5%</span></span>
            </div>
            <div className="stat-icon-circle"><Icons.Calendar /></div>
          </div>
        </div>
      </header>

      <div className="dashboard-grid-layout">
        <div className="grid-column">
            
          <div className="glass-card">
            <div className="section-header">
              <h3>Ticket Statuses</h3>
            </div>
            <div className="status-grid">
              {Object.entries(statusCounts).length > 0 ? (
                Object.entries(statusCounts).map(([status, count], idx) => (
                  <div
                    key={status}
                    className="status-card"
                    onClick={() => navigate(`/ticket/show-ticket?status=${encodeURIComponent(status)}`)}
                    style={{
                      background: 'rgba(255,255,255,0.6)',
                      borderTop: `4px solid ${['#1a1a1a', '#ff9f67', '#10b981', '#3b82f6', '#cf14bc','#17afd8', '#cf1414','#e0ea1a'][idx % 8]}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <span style={{fontWeight: '600', color: '#333', fontSize: '14px'}}>{status}</span>
                    <span style={{
                      background: ['#1a1a1a', '#ff9f67', '#10b981', '#3b82f6', '#cf14bc','#17afd8', '#cf1414','#e0ea1a'][idx % 8],
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginTop: '8px'
                    }}>{count}</span>
                  </div>
                ))
              ) : (
                <p style={{color: '#999', textAlign: 'center', gridColumn: '1/-1'}}>No statuses available</p>
              )}
            </div>
          </div>

            <div className="glass-card">
            <div className="section-header">
              <h3>Users / Team Members</h3>
              <button onClick={() => setShowAllUsers(!showAllUsers)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '8px'}} title="Toggle users list">
                {showAllUsers ? 'Show less' : `View more (${Math.max(0, users.length - 6)})`}
              </button>
            </div>
            <div className="table-responsive" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table className="applicants-table" style={{ minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllUsers ? users : users.slice(0, 6)).map((user, idx) => {
                    // Find potential photo fields returned by different APIs
                    const photoField = user.photo || user.image || user.avatar || user.profileImage || user.profile_pic || user.profile || null;
                    const photoSrc = photoField && API_ENDPOINTS?.BASE_URL ? `${API_ENDPOINTS.BASE_URL}/${photoField}` : null;
                    const designation = user.designationId?.name || user.designation_id?.name || user.designation || 'N/A';

                    return (
                      <tr key={user._id || idx}>
                          <td>{String(idx + 1).padStart(2, '0')}</td>
                          <td>
                            {photoSrc ? (
                              <div className="user-avatar"><img src={photoSrc} alt={user.name || 'user'} className="user-avatar-img" /></div>
                            ) : (
                              <div className="user-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                            )}
                          </td>
                          <td style={{fontWeight: '500'}}>{user.name || 'N/A'}</td>
                          <td className="email-cell" title={user.email || ''}>{user.email || 'N/A'}</td>
                          <td>{designation}</td>
                          <td>{user.mobile || 'N/A'}</td>
                        </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="glass-card dark-card">
            <div className="section-header">
              <h3>Ticket Activity</h3>
              <select style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '4px 8px', fontSize: '12px'}}>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="chart-wrapper" style={{height: '140px'}}>
              <Line data={lineData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { display: false }, y: { display: false } },
                plugins: { legend: { display: false } }
              }} />
            </div>
          </div> */}
          
        </div>

        <div className="grid-column">
            <div className="glass-card">
            <div className="section-header">
              <h3><Icons.Grid /> Ticket Status Overview</h3>
            </div>
            <div className="circular-progress-container">
              <div style={{width: '180px', height: '180px'}}>
                <Doughnut data={doughnutData} options={{plugins: {legend: {display: false}}}} />
              </div>
              <div className="progress-legend">
                {Object.entries(statusCounts).map(([status, count], idx) => {
                  const color = STATUS_COLORS[idx % STATUS_COLORS.length];
                  const other = Math.max(0, totalTickets - (Number(count) || 0));
                  const miniData = {
                    datasets: [{ data: [Number(count) || 0, other], backgroundColor: [color, '#e5e7eb'], borderWidth: 0 }]
                  };

                  return (
                    <div className="legend-item" key={status}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <div className="mini-doughnut" style={{width: 40, height: 40}}>
                          <Doughnut data={miniData} options={{plugins: {legend: {display: false}, tooltip: {enabled: false}}, cutout: '70%'}} width={40} height={40} />
                        </div>
                        <span className="legend-label" style={{fontWeight: 600}}>{status}</span>
                      </div>
                      <span className="legend-value">{count} Tickets</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        

          <div className="glass-card">
            <div className="section-header">
              <h3>Performance Metrics</h3>
            </div>
            <div className="chart-wrapper" style={{height: '180px'}}>
              <Line data={{
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
                datasets: [{
                  label: 'Tickets Completed',
                  data: [12, 19, 15, 25, 22, 18, 20, 15],
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4
                }]
              }} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
                  y: { grid: { borderDash: [5, 5], color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } } 
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
