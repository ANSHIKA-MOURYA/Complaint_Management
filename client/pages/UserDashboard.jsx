import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/lib/api';

// Department configuration
const departments = [
  { name: 'Water Management', email: 'admin@water.gov' },
  { name: 'Road & Safety', email: 'admin@roads.gov' },
  { name: 'Public Health', email: 'admin@health.gov' },
  { name: 'Electricity Board', email: 'admin@power.gov' },
  { name: 'Sanitation', email: 'admin@sanitation.gov' },
  { name: 'General Administration', email: 'admin@general.gov' }
];

// Simple category prediction based on keywords
const predictCategory = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('water') || lowerText.includes('supply') || lowerText.includes('quality')) {
    return 'Water Management';
  }
  if (lowerText.includes('road') || lowerText.includes('traffic') || lowerText.includes('pothole')) {
    return 'Road & Safety';
  }
  if (lowerText.includes('garbage') || lowerText.includes('waste') || lowerText.includes('health')) {
    return 'Public Health';
  }
  if (lowerText.includes('power') || lowerText.includes('electricity') || lowerText.includes('outage')) {
    return 'Electricity Board';
  }
  if (lowerText.includes('sewer') || lowerText.includes('sanitation') || lowerText.includes('cleaning')) {
    return 'Sanitation';
  }
  
  return 'General Administration';
};

export default function UserDashboard() {
  const [formData, setFormData] = useState({
    text: '',
    image: null,
    category: '',
    department: '',
    departmentEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('submit');
  const [complaints, setComplaints] = useState([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load user's complaints
    loadComplaints();
  }, [navigate]);

  const loadComplaints = async () => {
    try {
      setIsLoadingComplaints(true);
      const response = await apiService.getComplaints({ userId: 'current' });
      setComplaints(response.complaints || []);
    } catch (error) {
      console.error('Failed to load complaints:', error);
      setComplaints([]);
    } finally {
      setIsLoadingComplaints(false);
    }
  };

  const handleTextChange = (text) => {
    const predictedCategory = predictCategory(text);
    const predictedDepartment = departments.find(d => d.name === predictedCategory) || departments[0];
    
    setFormData(prev => ({
      ...prev,
      text,
      category: predictedCategory,
      department: predictedDepartment.name,
      departmentEmail: predictedDepartment.email
    }));
  };

  const handleDepartmentChange = (departmentName) => {
    const department = departments.find(d => d.name === departmentName);
    if (department) {
      setFormData(prev => ({
        ...prev,
        department: departmentName,
        departmentEmail: department.email
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      setMessage({ type: 'error', text: 'Please describe your complaint.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Get current user info
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const complaintData = {
        text: formData.text.trim(),
        category: formData.category,
        department: formData.department,
        departmentEmail: formData.departmentEmail,
        submittedBy: user.name || 'Anonymous User',
        userId: user.id || 1,
        location: formData.location || '',
        contactNumber: formData.contactNumber || ''
      };

      // Upload image if provided
      if (formData.image) {
        try {
          const uploadResponse = await apiService.uploadFile(formData.image);
          complaintData.image = uploadResponse.url;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue without image
        }
      }

      // Submit complaint
      await apiService.createComplaint(complaintData);
      
      setMessage({ type: 'success', text: 'Complaint submitted successfully! You will receive updates via email.' });
      setFormData({
        text: '',
        image: null,
        category: '',
        department: '',
        departmentEmail: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reload complaints
      await loadComplaints();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit complaint. Please try again.' });
    } finally {
      setIsSubmitting(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complaint Dashboard</h1>
        <p className="mt-2 text-gray-600">Submit and track your complaints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Complaint Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Submit New Complaint</h2>
            
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your complaint *
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {departments.map((dept) => (
                      <option key={dept.name} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Water Supply, Road Maintenance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Sector 15, Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        </div>

        {/* Complaint History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Complaints</h2>
            
            {isLoadingComplaints ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading complaints...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No complaints submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {complaint.category}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {complaint.text}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{formatDate(complaint.submitted_at)}</span>
                      <span className={`px-2 py-1 rounded-full ${getSentimentColor(complaint.sentiment)}`}>
                        {complaint.sentiment} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
