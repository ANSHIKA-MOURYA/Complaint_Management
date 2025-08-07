/**
 * Main Server - Complaint Management API
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import database configuration
import { connectDB } from "./config/db.js";

// Import models (needed for database sync)
import "./models/User.js";
import "./models/Admin.js";
import "./models/Complaint.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging middleware (development)
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  // Health check endpoints
  app.get("/api/ping", (req, res) => {
    res.json({ 
      message: "Complaint Management API v1.0", 
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: "1.0.0"
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/complaints", complaintRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api", demoRoutes); // Legacy demo routes

  // API documentation endpoint
  app.get("/api", (req, res) => {
    res.json({
      name: "Complaint Management API",
      version: "1.0.0",
      description: "RESTful API for managing government department complaints",
      endpoints: {
        auth: {
          "POST /api/auth/login": "User login",
          "POST /api/auth/register": "User registration",
          "GET /api/auth/profile": "Get user profile",
          "PUT /api/auth/profile": "Update user profile"
        },
        admin: {
          "POST /api/admin/login": "Admin login",
          "GET /api/admin/profile": "Get admin profile",
          "GET /api/admin/departments": "Get all departments"
        },
        complaints: {
          "GET /api/complaints": "Get complaints (filtered)",
          "GET /api/complaints/:id": "Get specific complaint",
          "POST /api/complaints": "Create new complaint",
          "PUT /api/complaints/:id": "Update complaint status",
          "DELETE /api/complaints/:id": "Delete complaint",
          "GET /api/complaints/stats": "Get complaint statistics"
        },
        upload: {
          "POST /api/upload": "Upload file",
          "GET /api/upload/config": "Get upload configuration"
        },
        system: {
          "GET /api/ping": "Health check",
          "GET /api/health": "Detailed health status",
          "GET /api": "API documentation"
        }
      }
    });
  });

  // 404 handler for API routes
  app.use("/api/*", notFoundHandler);

  // Global error handling middleware
  app.use(errorHandler);

  return app;
}

// For direct execution (not when imported)
if (process.env.NODE_ENV !== 'test') {
  const app = createServer();
  const PORT = process.env.PORT || 9090;
  
  // Connect to database and start server
  const startServer = async () => {
    try {
      // Connect to database (will use mock data if connection fails)
      await connectDB();
      
      app.listen(PORT, () => {
        console.log(` Complaint Management API server running on port ${PORT}`);
        console.log(` API Documentation: http://localhost:${PORT}/api`);
        console.log(` Health Check: http://localhost:${PORT}/api/health`);
        console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}
