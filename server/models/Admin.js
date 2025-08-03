/**
 * Admin Model - manages admin user data and operations with MySQL
 */

import { DataTypes } from 'sequelize';

// Define Admin model function that takes sequelize instance
export const defineAdminModel = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255]
      }
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    departmentId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'super_admin'),
      defaultValue: 'admin'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Admin;
};

// Mock admin data for development when database is not available
let mockAdmins = [
  {
    id: 1,
    name: "Water Department Admin",
    email: "admin@water.gov",
    password: "admin123",
    department: "Water Management",
    departmentId: "WATER_001",
    role: "admin",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Road Safety Admin",
    email: "admin@roads.gov",
    password: "admin123",
    department: "Road & Safety",
    departmentId: "ROAD_001",
    role: "admin",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Health Department Admin",
    email: "admin@health.gov",
    password: "admin123",
    department: "Health & Sanitation",
    departmentId: "HEALTH_001",
    role: "admin",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "Electricity Department Admin",
    email: "admin@electricity.gov",
    password: "admin123",
    department: "Electricity & Power",
    departmentId: "ELECTRICITY_001",
    role: "admin",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: "Waste Management Admin",
    email: "admin@waste.gov",
    password: "admin123",
    department: "Waste Management",
    departmentId: "WASTE_001",
    role: "admin",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class AdminModel {
  static async findAll() {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const admins = await Admin.findAll({
          attributes: { exclude: ['password'] }
        });
        return admins.map(admin => admin.toJSON());
      } else {
        return mockAdmins.map(admin => ({ ...admin, password: undefined }));
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      return mockAdmins.map(admin => ({ ...admin, password: undefined }));
    }
  }

  static async findById(id) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const admin = await Admin.findByPk(id, {
          attributes: { exclude: ['password'] }
        });
        return admin ? admin.toJSON() : null;
      } else {
        const admin = mockAdmins.find(a => a.id === parseInt(id));
        return admin ? { ...admin, password: undefined } : null;
      }
    } catch (error) {
      console.error('Error fetching admin by ID:', error);
      const admin = mockAdmins.find(a => a.id === parseInt(id));
      return admin ? { ...admin, password: undefined } : null;
    }
  }

  static async findByEmail(email) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const admin = await Admin.findOne({
          where: { email },
          attributes: { exclude: ['password'] }
        });
        return admin ? admin.toJSON() : null;
      } else {
        const admin = mockAdmins.find(a => a.email === email);
        return admin ? { ...admin, password: undefined } : null;
      }
    } catch (error) {
      console.error('Error fetching admin by email:', error);
      const admin = mockAdmins.find(a => a.email === email);
      return admin ? { ...admin, password: undefined } : null;
    }
  }

  static async findByDepartment(department) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const admins = await Admin.findAll({
          where: { department },
          attributes: { exclude: ['password'] }
        });
        return admins.map(admin => admin.toJSON());
      } else {
        return mockAdmins
          .filter(a => a.department === department)
          .map(admin => ({ ...admin, password: undefined }));
      }
    } catch (error) {
      console.error('Error fetching admins by department:', error);
      return mockAdmins
        .filter(a => a.department === department)
        .map(admin => ({ ...admin, password: undefined }));
    }
  }

  static async validateCredentials(email, password) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const admin = await Admin.findOne({
          where: { email, isActive: true }
        });
        
        if (!admin) return null;
        
        // Simple password comparison (in production, use bcrypt)
        if (admin.password === password) {
          const adminJson = admin.toJSON();
          delete adminJson.password;
          return adminJson;
        }
        
        return null;
      } else {
        const admin = mockAdmins.find(a => a.email === email && a.isActive);
        if (!admin) return null;
        
        if (admin.password === password) {
          const { password, ...adminWithoutPassword } = admin;
          return adminWithoutPassword;
        }
        
        return null;
      }
    } catch (error) {
      console.error('Error validating admin credentials:', error);
      return null;
    }
  }

  static async getDepartments() {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const departments = await Admin.findAll({
          attributes: ['department', 'departmentId'],
          group: ['department', 'departmentId'],
          where: { isActive: true }
        });
        return departments.map(dept => dept.toJSON());
      } else {
        const departments = [...new Set(mockAdmins.map(a => a.department))];
        return departments.map(dept => {
          const admin = mockAdmins.find(a => a.department === dept);
          return {
            department: dept,
            departmentId: admin.departmentId
          };
        });
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      const departments = [...new Set(mockAdmins.map(a => a.department))];
      return departments.map(dept => {
        const admin = mockAdmins.find(a => a.department === dept);
        return {
          department: dept,
          departmentId: admin.departmentId
        };
      });
    }
  }

  static async getDepartmentByEmail(email) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const admin = await Admin.findOne({
          where: { email },
          attributes: ['department', 'departmentId']
        });
        return admin ? admin.toJSON() : null;
      } else {
        const admin = mockAdmins.find(a => a.email === email);
        return admin ? {
          department: admin.department,
          departmentId: admin.departmentId
        } : null;
      }
    } catch (error) {
      console.error('Error fetching department by email:', error);
      const admin = mockAdmins.find(a => a.email === email);
      return admin ? {
        department: admin.department,
        departmentId: admin.departmentId
      } : null;
    }
  }

  static async emailExists(email) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const Admin = defineAdminModel(sequelize);
        const count = await Admin.count({ where: { email } });
        return count > 0;
      } else {
        return mockAdmins.some(a => a.email === email);
      }
    } catch (error) {
      console.error('Error checking admin email existence:', error);
      return mockAdmins.some(a => a.email === email);
    }
  }

  // Utility methods for development
  static getAllAdmins() {
    return mockAdmins.map(admin => ({ ...admin, password: undefined }));
  }

  static resetAdmins() {
    mockAdmins = [
      {
        id: 1,
        name: "Water Department Admin",
        email: "admin@water.gov",
        password: "admin123",
        department: "Water Management",
        departmentId: "WATER_001",
        role: "admin",
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Road Safety Admin",
        email: "admin@roads.gov",
        password: "admin123",
        department: "Road & Safety",
        departmentId: "ROAD_001",
        role: "admin",
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: "Health Department Admin",
        email: "admin@health.gov",
        password: "admin123",
        department: "Health & Sanitation",
        departmentId: "HEALTH_001",
        role: "admin",
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        name: "Electricity Department Admin",
        email: "admin@electricity.gov",
        password: "admin123",
        department: "Electricity & Power",
        departmentId: "ELECTRICITY_001",
        role: "admin",
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        name: "Waste Management Admin",
        email: "admin@waste.gov",
        password: "admin123",
        department: "Waste Management",
        departmentId: "WASTE_001",
        role: "admin",
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}
