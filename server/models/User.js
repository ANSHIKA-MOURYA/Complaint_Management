/**
 * User Model - manages user data and operations with MySQL
 */

import { DataTypes } from 'sequelize';

// Define User model function that takes sequelize instance
export const defineUserModel = (sequelize) => {
  const User = sequelize.define('User', {
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};

// Mock data for development when database is not available
let mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "+1234567890",
    address: "123 Main St, City",
    role: "user",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    phone: "+1234567891",
    address: "456 Oak Ave, Town",
    role: "user",
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class UserModel {
  static async findAll() {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const users = await User.findAll({
          attributes: { exclude: ['password'] }
        });
        return users.map(user => user.toJSON());
      } else {
        return mockUsers.map(user => ({ ...user, password: undefined }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return mockUsers.map(user => ({ ...user, password: undefined }));
    }
  }

  static async findById(id) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const user = await User.findByPk(id, {
          attributes: { exclude: ['password'] }
        });
        return user ? user.toJSON() : null;
      } else {
        const user = mockUsers.find(u => u.id === parseInt(id));
        return user ? { ...user, password: undefined } : null;
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      const user = mockUsers.find(u => u.id === parseInt(id));
      return user ? { ...user, password: undefined } : null;
    }
  }

  static async findByEmail(email) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const user = await User.findOne({
          where: { email },
          attributes: { exclude: ['password'] }
        });
        return user ? user.toJSON() : null;
      } else {
        const user = mockUsers.find(u => u.email === email);
        return user ? { ...user, password: undefined } : null;
      }
    } catch (error) {
      console.error('Error fetching user by email:', error);
      const user = mockUsers.find(u => u.email === email);
      return user ? { ...user, password: undefined } : null;
    }
  }

  static async create(userData) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const user = await User.create(userData);
        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
      } else {
        const newUser = {
          id: mockUsers.length + 1,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockUsers.push(newUser);
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateById(id, updates) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const user = await User.findByPk(id);
        if (!user) return null;
        
        await user.update(updates);
        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
      } else {
        const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
        if (userIndex === -1) return null;
        
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };
        const { password, ...userWithoutPassword } = mockUsers[userIndex];
        return userWithoutPassword;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const user = await User.findByPk(id);
        if (!user) return false;
        
        await user.destroy();
        return true;
      } else {
        const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
        if (userIndex === -1) return false;
        
        mockUsers.splice(userIndex, 1);
        return true;
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async validateCredentials(email, password) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const user = await User.findOne({
          where: { email, isActive: true }
        });
        
        if (!user) return null;
        
        // Simple password comparison (in production, use bcrypt)
        if (user.password === password) {
          const userJson = user.toJSON();
          delete userJson.password;
          return userJson;
        }
        
        return null;
      } else {
        const user = mockUsers.find(u => u.email === email && u.isActive);
        if (!user) return null;
        
        if (user.password === password) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        
        return null;
      }
    } catch (error) {
      console.error('Error validating credentials:', error);
      return null;
    }
  }

  static async emailExists(email) {
    try {
      const { getSequelize } = await import('../config/db.js');
      const sequelize = getSequelize();
      
      if (sequelize) {
        const User = defineUserModel(sequelize);
        const count = await User.count({ where: { email } });
        return count > 0;
      } else {
        return mockUsers.some(u => u.email === email);
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
      return mockUsers.some(u => u.email === email);
    }
  }

  // Utility methods for development
  static getAllUsers() {
    return mockUsers.map(user => ({ ...user, password: undefined }));
  }

  static resetUsers() {
    mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "+1234567890",
        address: "123 Main St, City",
        role: "user",
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        phone: "+1234567891",
        address: "456 Oak Ave, Town",
        role: "user",
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}
