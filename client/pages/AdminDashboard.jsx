import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminDashboard() {
  const { adminUser, isAuthenticated, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sentimentFilter, setSentimentFilter] = useState('All Priority');
  const [isUpdating, setIsUpdating] = useState(null);

  // Redirect to admin login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, navigate]);

  // Enhanced mock complaints data with more departments
  const [complaints, setComplaints] = useState([
    // Water Management complaints
    {
      id: '1',
      text: 'Water supply has been interrupted in Sector 15 for the past 3 days. Residents are facing severe water shortage.',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=150&h=150&fit=crop&crop=center',
      category: 'Water Supply',
      department: 'Water Management',
      departmentEmail: 'admin@water.gov',
      status: 'In Progress',
      sentiment: 'High',
      submittedAt: '2024-01-15T10:30:00Z',
      submittedBy: 'Rajesh Kumar'
    },
    {
      id: '2',
      text: 'Poor water quality in our area. Water appears muddy and has a strange smell.',
      category: 'Water Quality',
      department: 'Water Management',
      departmentEmail: 'admin@water.gov',
      status: 'Pending',
      sentiment: 'High',
      submittedAt: '2024-01-14T14:22:00Z',
      submittedBy: 'Priya Sharma'
    },
    {
      id: '3',
      text: 'Water pipeline burst on main road causing flooding. Urgent repair needed.',
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=150&h=150&fit=crop&crop=center',
      category: 'Pipeline Issues',
      department: 'Water Management',
      departmentEmail: 'admin@water.gov',
      status: 'Resolved',
      sentiment: 'High',
      submittedAt: '2024-01-13T09:15:00Z',
      submittedBy: 'Municipal Worker'
    },

    // Road & Safety complaints
    {
      id: '4',
      text: 'Large pothole on Highway 42 causing accidents. Multiple vehicles damaged.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=150&h=150&fit=crop&crop=center',
      category: 'Road Maintenance',
      department: 'Road & Safety',
      departmentEmail: 'admin@roads.gov',
      status: 'In Progress',
      sentiment: 'High',
      submittedAt: '2024-01-15T16:45:00Z',
      submittedBy: 'Amit Singh'
    },
    {
      id: '5',
      text: 'Traffic lights not working at main intersection. Creating traffic chaos.',
      category: 'Traffic Management',
      department: 'Road & Safety',
      departmentEmail: 'admin@roads.gov',
      status: 'Pending',
      sentiment: 'Medium',
      submittedAt: '2024-01-14T08:20:00Z',
      submittedBy: 'Traffic Police'
    },
    {
      id: '6',
      text: 'Road construction debris blocking the road for 2 weeks. No cleanup done.',
      category: 'Road Maintenance', 
      department: 'Road & Safety',
      departmentEmail: 'admin@roads.gov',
      status: 'Pending',
      sentiment: 'Medium',
      submittedAt: '2024-01-12T11:30:00Z',
      submittedBy: 'Local Resident'
    },

    // Public Health complaints
    {
      id: '7',
      text: 'Garbage not collected for over a week. Health hazard in residential area.',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&h=150&fit=crop&crop=center',
      category: 'Waste Management',
      department: 'Public Health',
      departmentEmail: 'admin@health.gov',
      status: 'In Progress',
      sentiment: 'High',
      submittedAt: '2024-01-15T12:00:00Z',
      submittedBy: 'Society Secretary'
    },
    {
      id: '8',
      text: 'Stray dogs creating nuisance and safety concerns in the locality.',
      category: 'Animal Control',
      department: 'Public Health',
      departmentEmail: 'admin@health.gov',
      status: 'Pending',
      sentiment: 'Medium',
      submittedAt: '2024-01-13T15:30:00Z',
      submittedBy: 'Concerned Citizen'
    },

    // Electricity Board complaints
    {
      id: '9',
      text: 'Power outage in entire block for 8+ hours. No update from electricity board.',
      category: 'Power Outage',
      department: 'Electricity Board',
      departmentEmail: 'admin@power.gov',
      status: 'In Progress',
      sentiment: 'High',
      submittedAt: '2024-01-15T18:00:00Z',
      submittedBy: 'Apartment Association'
    },
    {
      id: '10',
      text: 'Electricity meter reading incorrect. Overcharged in bill.',
      category: 'Billing Issues',
      department: 'Electricity Board',
      departmentEmail: 'admin@power.gov',
      status: 'Pending',
      sentiment: 'Medium',
      submittedAt: '2024-01-14T10:45:00Z',
      submittedBy: 'Household Consumer'
    },

    // Sanitation complaints
    {
      id: '11',
      text: 'Sewer overflow in residential area. Immediate cleaning required.',
      category: 'Sewage Management',
      department: 'Sanitation',
      departmentEmail: 'admin@sanitation.gov',
      status: 'Pending',
      sentiment: 'High',
      submittedAt: '2024-01-15T07:30:00Z',
      submittedBy: 'Locality Representative'
    }
  ]);

  // Filter complaints by admin's department
  const departmentComplaints = useMemo(() => {
    if (!adminUser) return [];
    
    return complaints.filter(complaint => 
      complaint.department === adminUser.department
    );
  }, [complaints, adminUser]);

  // Apply additional filters
  const filteredComplaints = useMemo(() => {
    return departmentComplaints.filter(complaint => {
      const searchMatch = complaint.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All Status' || complaint.status === statusFilter;
      const sentimentMatch = sentimentFilter === 'All Priority' || complaint.sentiment === sentimentFilter;
      
      return searchMatch && statusMatch && sentimentMatch;
    });
  }, [departmentComplaints, searchTerm, statusFilter, sentimentFilter]);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    setIsUpdating(complaintId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const total = departmentComplaints.length;
    const pending = departmentComplaints.filter(c => c.status === 'Pending').length;
    const inProgress = departmentComplaints.filter(c => c.status === 'In Progress').length;
    const resolved = departmentComplaints.filter(c => c.status === 'Resolved').length;
    const high = departmentComplaints.filter(c => c.sentiment === 'High').length;
    
    return { total, pending, inProgress, resolved, high };
  };

  if (!isAuthenticated || !adminUser) {
    return null; // Will redirect in useEffect
  }

  const stats = getStats();

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8" 
             style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {adminUser.department}
              </h1>
              <p className="text-xl text-muted-foreground">
                Welcome back, {adminUser.name}
              </p>
              <p className="text-muted-foreground">
                Manage and track complaints for your department
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-medium text-foreground">{adminUser.email}</p>
              </div>
              <button
                onClick={logoutAdmin}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 border border-white/10 backdrop-blur-sm group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-card/90 group"
               style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl group-hover:scale-110 transition-transform text-white shadow-2xl" 
                   style={{background: 'linear-gradient(145deg, hsl(var(--primary)) 0%, hsl(142 71% 45%) 100%)'}}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-card/90 group"
               style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-card/90 group"
               style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-400">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-card/90 group"
               style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-500/20 text-green-400 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-card/90 group"
               style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold text-red-400">{stats.high}</p>
              </div>
              <div className="p-3 bg-red-500/20 text-red-400 rounded-xl group-hover:scale-110 transition-transform animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6"
             style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Complaints
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-background/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="Search by complaint text, category, or submitter..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:w-1/2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 backdrop-blur-sm text-foreground"
                >
                  <option value="All Status">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 backdrop-blur-sm text-foreground"
                >
                  <option value="All Priority">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All Status');
                    setSentimentFilter('All Priority');
                  }}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 border border-white/10 backdrop-blur-sm w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
             style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {adminUser.department} Complaints
              </h2>
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium">
                {filteredComplaints.length} complaints
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-16">
                <div className="animate-bounce">
                  <svg className="mx-auto h-16 w-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No complaints found</h3>
                <p className="text-muted-foreground">
                  No complaints for {adminUser.department} match your current filters.
                </p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="bg-muted/20 px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider backdrop-blur-sm border-b border-white/10">Complaint Details</th>
                    <th className="bg-muted/20 px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider backdrop-blur-sm border-b border-white/10">Category</th>
                    <th className="bg-muted/20 px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider backdrop-blur-sm border-b border-white/10">Priority</th>
                    <th className="bg-muted/20 px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider backdrop-blur-sm border-b border-white/10">Status</th>
                    <th className="bg-muted/20 px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider backdrop-blur-sm border-b border-white/10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 border-b border-white/5">
                        <div className="flex items-start space-x-4">
                          {complaint.image && (
                            <div className="relative">
                              <img 
                                src={complaint.image} 
                                alt="Complaint" 
                                className="w-16 h-16 rounded-xl object-cover border border-white/20 group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-2">
                            <p className="text-sm font-medium text-foreground leading-relaxed">
                              {complaint.text}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {complaint.submittedBy}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatDate(complaint.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-white/5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-white/5">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                          complaint.sentiment === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                          complaint.sentiment === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                          'bg-green-500/20 text-green-300 border-green-500/30'
                        }`}>
                          {complaint.sentiment}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-white/5">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                          complaint.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                          complaint.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                          'bg-green-500/20 text-green-300 border-green-500/30'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-white/5">
                        <div className="flex items-center space-x-3">
                          <select
                            value={complaint.status}
                            onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                            disabled={isUpdating === complaint.id}
                            className="text-sm py-1.5 min-w-[120px] px-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 backdrop-blur-sm text-foreground"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          {isUpdating === complaint.id && (
                            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full text-primary"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
