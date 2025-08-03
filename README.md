# Complaint Management System

A full-stack complaint management system with React frontend and Node.js/MySQL backend.

## Features

- **User Authentication**: Register, login, and profile management
- **Admin Dashboard**: Department-specific complaint management
- **Complaint Submission**: Submit complaints with images and location details
- **Real-time Updates**: Track complaint status and progress
- **MySQL Database**: Persistent data storage with Sequelize ORM
- **Responsive Design**: Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ComplaintBackend(Builder)
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MySQL Database**
   - Install MySQL Server
   - Create a database named `complaint_management`
   - Update the database credentials in `.env` file (see below)

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=8080
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=complaint_management
   DB_USER=root
   DB_PASSWORD=your_mysql_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173

   # API Configuration
   API_VERSION=v1
   API_PREFIX=/api
   ```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:both
```

### Option 2: Run Separately

**Backend (Port 8080):**
```bash
npm run dev:server
```

**Frontend (Port 5173):**
```bash
npm run dev
```

## Database Setup

The application uses MySQL with Sequelize ORM. Tables will be automatically created when you first run the application.

### Manual Database Setup (Optional)
If you want to set up the database manually:

1. **Create Database:**
   ```sql
   CREATE DATABASE complaint_management;
   ```

2. **Tables will be auto-created** when the application starts due to Sequelize sync.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/departments` - Get all departments

### Complaints
- `GET /api/complaints` - Get complaints (filtered)
- `GET /api/complaints/:id` - Get specific complaint
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/:id` - Update complaint status
- `DELETE /api/complaints/:id` - Delete complaint
- `GET /api/complaints/stats` - Get complaint statistics

### System
- `GET /api/ping` - Health check
- `GET /api/health` - Detailed health status
- `GET /api` - API documentation

## Default Credentials

### Admin Users
- **Water Management**: admin@water.gov / admin123
- **Road & Safety**: admin@roads.gov / admin123
- **Public Health**: admin@health.gov / admin123
- **Electricity Board**: admin@power.gov / admin123
- **Sanitation**: admin@sanitation.gov / admin123

### Regular Users
- **John Doe**: john@example.com / password123
- **Jane Smith**: jane@example.com / password123

## Development

### Project Structure
```
├── client/                 # React frontend
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   └── lib/              # Utilities and API service
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Sequelize models
│   └── routes/           # API routes
├── shared/               # Shared utilities
└── package.json          # Dependencies and scripts
```

### Database Models

#### Users Table
- id (Primary Key)
- name, email, password
- phone, address (optional)
- role (user/admin)
- timestamps

#### Admins Table
- id (Primary Key)
- name, email, password
- department, departmentId
- role (admin/super_admin)
- timestamps

#### Complaints Table
- id (Primary Key)
- text, image (optional)
- category, department, departmentEmail
- status, sentiment, priority
- submittedBy, userId (Foreign Key)
- location, contactNumber (optional)
- timestamps

## Troubleshooting

### Port Already in Use
If you get "address already in use" error:
1. Check if another process is using port 8080 or 5173
2. Kill the process or change ports in configuration

### Database Connection Issues
1. Ensure MySQL server is running
2. Check database credentials in `.env`
3. Verify database exists: `complaint_management`

### Frontend Not Connecting to Backend
1. Ensure backend is running on port 8080
2. Check CORS configuration
3. Verify API proxy settings in `vite.config.ts`

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set environment variables for production**

3. **Deploy to your preferred hosting platform**

## License

This project is licensed under the MIT License. 