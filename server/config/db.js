/**
 * Database Configuration - MySQL with Sequelize
 * Handles database connection and configuration
 */

import { Sequelize } from 'sequelize';
import { defineUserModel } from '../models/User.js';
import { defineAdminModel } from '../models/Admin.js';
import { defineComplaintModel } from '../models/Complaint.js';

// Get database configuration from environment variables
const getDbConfig = () => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'complaint_management',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    dialect: 'mysql'
  };
};

// Create Sequelize instance
let sequelize = null;

// Initialize database connection
export const connectDB = async () => {
  try {
    const config = getDbConfig();
    console.log('🔌 Connecting to MySQL database...');
    
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );
    
    // Test the connection
    await sequelize.authenticate();
    
    console.log(' MySQL database connected successfully');
    console.log(` Database: ${config.database} on ${config.host}:${config.port}`);
    
    // Initialize models
    const User = defineUserModel(sequelize);
    const Admin = defineAdminModel(sequelize);
    const Complaint = defineComplaintModel(sequelize);
    
    // Set up associations
    User.hasMany(Complaint, { foreignKey: 'userId', as: 'complaints' });
    Complaint.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    
    Admin.hasMany(Complaint, { foreignKey: 'assignedTo', as: 'assignedComplaints' });
    Complaint.belongsTo(Admin, { foreignKey: 'assignedTo', as: 'assignedAdmin' });
    
    // Sync models with database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');
    
    // Handle connection events
    sequelize.addHook('afterConnect', (connection) => {
      console.log(' New database connection established');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      if (sequelize) {
        await sequelize.close();
        console.log('🔌 Database connection closed');
      }
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error.message);
    console.log('Using mock data instead...');
    
    // For development, we can continue with mock data
    if (process.env.NODE_ENV === 'development') {
      console.log('Running in development mode with mock data');
      return true;
    }
    
    process.exit(1);
  }
};

// Disconnect from database
export const disconnectDB = async () => {
  try {
    if (sequelize) {
      await sequelize.close();
      console.log('🔌 Database disconnected');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
};

// Check database connection status
export const isConnected = () => {
  return sequelize && sequelize.authenticate().then(() => true).catch(() => false);
};

// Get database stats
export const getDbStats = () => {
  return {
    connected: sequelize !== null,
    host: getDbConfig().host,
    port: getDbConfig().port,
    database: getDbConfig().database,
    dialect: getDbConfig().dialect
  };
};

// Get Sequelize instance
export const getSequelize = () => {
  return sequelize;
};

export default {
  connectDB,
  disconnectDB,
  isConnected,
  getDbStats,
  getSequelize
}; 