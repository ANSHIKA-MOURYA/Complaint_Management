/**
 * Complaint Model - manages complaint data and operations with MySQL
 */

import { DataTypes } from 'sequelize';

// Define Complaint model function that takes sequelize instance
export const defineComplaintModel = (sequelize) => {
  const Complaint = sequelize.define('Complaint', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 2000]
      }
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    departmentEmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved', 'Rejected'),
      defaultValue: 'Pending'
    },
    sentiment: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Medium'
    },
    submittedBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id'
      }
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'Medium'
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'complaints',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Complaint;
};

// Mock complaint data for development when database is not available
let mockComplaints = [
  {
    id: 1,
    text: "There's a major water leak on Main Street near the intersection with Oak Avenue. Water is flowing onto the road and creating a hazard for drivers.",
    image: "https://example.com/water-leak.jpg",
    category: "Water Management",
    department: "Water Management",
    departmentEmail: "admin@water.gov",
    status: "In Progress",
    sentiment: "High",
    submittedBy: "John Doe",
    userId: 1,
    assignedTo: 1,
    priority: "High",
    location: "Main Street & Oak Avenue",
    contactNumber: "+1234567890",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    text: "Pothole on Elm Street causing damage to vehicles. Need immediate repair.",
    image: "https://example.com/pothole.jpg",
    category: "Road & Safety",
    department: "Road & Safety",
    departmentEmail: "admin@roads.gov",
    status: "Pending",
    sentiment: "Medium",
    submittedBy: "Jane Smith",
    userId: 2,
    assignedTo: 2,
    priority: "Medium",
    location: "Elm Street",
    contactNumber: "+1234567891",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    text: "Garbage collection missed on Pine Street. Bins are overflowing.",
    image: "https://example.com/garbage.jpg",
    category: "Waste Management",
    department: "Waste Management",
    departmentEmail: "admin@waste.gov",
    status: "Resolved",
    sentiment: "Low",
    submittedBy: "Mike Johnson",
    userId: 1,
    assignedTo: 5,
    priority: "Medium",
    location: "Pine Street",
    contactNumber: "+1234567892",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class ComplaintModel {
  static async findAll(filters = {}) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const whereClause = {};
        
        if (filters.status) whereClause.status = filters.status;
        if (filters.department) whereClause.department = filters.department;
        if (filters.userId) whereClause.userId = filters.userId;
        if (filters.assignedTo) whereClause.assignedTo = filters.assignedTo;
        
        const complaints = await Complaint.findAll({
          where: whereClause,
          order: [['created_at', 'DESC']]
        });
        return complaints.map(complaint => complaint.toJSON());
      } else {
        let filteredComplaints = [...mockComplaints];
        
        if (filters.status) {
          filteredComplaints = filteredComplaints.filter(c => c.status === filters.status);
        }
        if (filters.department) {
          filteredComplaints = filteredComplaints.filter(c => c.department === filters.department);
        }
        if (filters.userId) {
          filteredComplaints = filteredComplaints.filter(c => c.userId === parseInt(filters.userId));
        }
        if (filters.assignedTo) {
          filteredComplaints = filteredComplaints.filter(c => c.assignedTo === parseInt(filters.assignedTo));
        }
        
        return filteredComplaints.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return mockComplaints.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }

  static async findById(id) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const complaint = await Complaint.findByPk(id);
        return complaint ? complaint.toJSON() : null;
      } else {
        const complaint = mockComplaints.find(c => c.id === parseInt(id));
        return complaint || null;
      }
    } catch (error) {
      console.error('Error fetching complaint by ID:', error);
      const complaint = mockComplaints.find(c => c.id === parseInt(id));
      return complaint || null;
    }
  }

  static async findByUserId(userId) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const complaints = await Complaint.findAll({
          where: { userId },
          order: [['created_at', 'DESC']]
        });
        return complaints.map(complaint => complaint.toJSON());
      } else {
        return mockComplaints
          .filter(c => c.userId === parseInt(userId))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    } catch (error) {
      console.error('Error fetching complaints by user ID:', error);
      return mockComplaints
        .filter(c => c.userId === parseInt(userId))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }

  static async findByDepartment(department) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const complaints = await Complaint.findAll({
          where: { department },
          order: [['created_at', 'DESC']]
        });
        return complaints.map(complaint => complaint.toJSON());
      } else {
        return mockComplaints
          .filter(c => c.department === department)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    } catch (error) {
      console.error('Error fetching complaints by department:', error);
      return mockComplaints
        .filter(c => c.department === department)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }

  static async create(complaintData) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const complaint = await Complaint.create(complaintData);
        return complaint.toJSON();
      } else {
        const newComplaint = {
          id: mockComplaints.length + 1,
          ...complaintData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockComplaints.push(newComplaint);
        return newComplaint;
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  static async updateById(id, updates) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const complaint = await Complaint.findByPk(id);
        if (!complaint) return null;
        
        await complaint.update(updates);
        return complaint.toJSON();
      } else {
        const complaintIndex = mockComplaints.findIndex(c => c.id === parseInt(id));
        if (complaintIndex === -1) return null;
        
        mockComplaints[complaintIndex] = {
          ...mockComplaints[complaintIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };
        return mockComplaints[complaintIndex];
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const complaint = await Complaint.findByPk(id);
        if (!complaint) return false;
        
        await complaint.destroy();
        return true;
      } else {
        const complaintIndex = mockComplaints.findIndex(c => c.id === parseInt(id));
        if (complaintIndex === -1) return false;
        
        mockComplaints.splice(complaintIndex, 1);
        return true;
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      return false;
    }
  }

  static async getStats(filters = {}) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Complaint = defineComplaintModel(sequelize);
        const whereClause = {};
        
        if (filters.department) whereClause.department = filters.department;
        if (filters.userId) whereClause.userId = filters.userId;
        
        const complaints = await Complaint.findAll({ where: whereClause });
        
        const stats = {
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'Pending').length,
          inProgress: complaints.filter(c => c.status === 'In Progress').length,
          resolved: complaints.filter(c => c.status === 'Resolved').length,
          rejected: complaints.filter(c => c.status === 'Rejected').length,
          byDepartment: {},
          byPriority: {
            Low: complaints.filter(c => c.priority === 'Low').length,
            Medium: complaints.filter(c => c.priority === 'Medium').length,
            High: complaints.filter(c => c.priority === 'High').length,
            Critical: complaints.filter(c => c.priority === 'Critical').length
          }
        };
        
        // Group by department
        complaints.forEach(complaint => {
          const dept = complaint.department;
          if (!stats.byDepartment[dept]) {
            stats.byDepartment[dept] = {
              total: 0,
              pending: 0,
              inProgress: 0,
              resolved: 0,
              rejected: 0
            };
          }
          stats.byDepartment[dept].total++;
          stats.byDepartment[dept][complaint.status.toLowerCase().replace(' ', '')]++;
        });
        
        return stats;
      } else {
        let filteredComplaints = [...mockComplaints];
        
        if (filters.department) {
          filteredComplaints = filteredComplaints.filter(c => c.department === filters.department);
        }
        if (filters.userId) {
          filteredComplaints = filteredComplaints.filter(c => c.userId === parseInt(filters.userId));
        }
        
        const stats = {
          total: filteredComplaints.length,
          pending: filteredComplaints.filter(c => c.status === 'Pending').length,
          inProgress: filteredComplaints.filter(c => c.status === 'In Progress').length,
          resolved: filteredComplaints.filter(c => c.status === 'Resolved').length,
          rejected: filteredComplaints.filter(c => c.status === 'Rejected').length,
          byDepartment: {},
          byPriority: {
            Low: filteredComplaints.filter(c => c.priority === 'Low').length,
            Medium: filteredComplaints.filter(c => c.priority === 'Medium').length,
            High: filteredComplaints.filter(c => c.priority === 'High').length,
            Critical: filteredComplaints.filter(c => c.priority === 'Critical').length
          }
        };
        
        // Group by department
        filteredComplaints.forEach(complaint => {
          const dept = complaint.department;
          if (!stats.byDepartment[dept]) {
            stats.byDepartment[dept] = {
              total: 0,
              pending: 0,
              inProgress: 0,
              resolved: 0,
              rejected: 0
            };
          }
          stats.byDepartment[dept].total++;
          stats.byDepartment[dept][complaint.status.toLowerCase().replace(' ', '')]++;
        });
        
        return stats;
      }
    } catch (error) {
      console.error('Error getting complaint stats:', error);
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
        byDepartment: {},
        byPriority: { Low: 0, Medium: 0, High: 0, Critical: 0 }
      };
    }
  }

  static predictSentiment(text) {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['good', 'great', 'excellent', 'wonderful', 'amazing', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'broken', 'damaged'];
    
    const words = text.toLowerCase().split(' ');
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    if (negativeCount > positiveCount) return 'High';
    if (positiveCount > negativeCount) return 'Low';
    return 'Medium';
  }

  // Utility methods for development
  static getAllComplaints() {
    return mockComplaints;
  }

  static resetComplaints() {
    mockComplaints = [
      {
        id: 1,
        text: "There's a major water leak on Main Street near the intersection with Oak Avenue. Water is flowing onto the road and creating a hazard for drivers.",
        image: "https://example.com/water-leak.jpg",
        category: "Water Management",
        department: "Water Management",
        departmentEmail: "admin@water.gov",
        status: "In Progress",
        sentiment: "High",
        submittedBy: "John Doe",
        userId: 1,
        assignedTo: 1,
        priority: "High",
        location: "Main Street & Oak Avenue",
        contactNumber: "+1234567890",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        text: "Pothole on Elm Street causing damage to vehicles. Need immediate repair.",
        image: "https://example.com/pothole.jpg",
        category: "Road & Safety",
        department: "Road & Safety",
        departmentEmail: "admin@roads.gov",
        status: "Pending",
        sentiment: "Medium",
        submittedBy: "Jane Smith",
        userId: 2,
        assignedTo: 2,
        priority: "Medium",
        location: "Elm Street",
        contactNumber: "+1234567891",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        text: "Garbage collection missed on Pine Street. Bins are overflowing.",
        image: "https://example.com/garbage.jpg",
        category: "Waste Management",
        department: "Waste Management",
        departmentEmail: "admin@waste.gov",
        status: "Resolved",
        sentiment: "Low",
        submittedBy: "Mike Johnson",
        userId: 1,
        assignedTo: 5,
        priority: "Medium",
        location: "Pine Street",
        contactNumber: "+1234567892",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}
