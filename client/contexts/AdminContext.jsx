import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

// Department credentials - in real app, this would be handled by backend
const DEPARTMENT_CREDENTIALS = {
  'water': {
    email: 'admin@water.gov',
    password: 'water123',
    department: 'Water Management',
    name: 'Water Department Admin'
  },
  'roads': {
    email: 'admin@roads.gov', 
    password: 'roads123',
    department: 'Road & Safety',
    name: 'Road & Safety Admin'
  },
  'health': {
    email: 'admin@health.gov',
    password: 'health123', 
    department: 'Public Health',
    name: 'Health Department Admin'
  },
  'electricity': {
    email: 'admin@power.gov',
    password: 'power123',
    department: 'Electricity Board',
    name: 'Electricity Admin'
  },
  'sanitation': {
    email: 'admin@sanitation.gov',
    password: 'clean123',
    department: 'Sanitation',
    name: 'Sanitation Admin'
  },
  'general': {
    email: 'admin@general.gov',
    password: 'admin123',
    department: 'General Administration',
    name: 'General Admin'
  }
};

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const savedAdmin = localStorage.getItem('adminUser');
    if (savedAdmin) {
      const admin = JSON.parse(savedAdmin);
      setAdminUser(admin);
      setIsAuthenticated(true);
    }
  }, []);

  const loginAdmin = (email, password) => {
    // Find matching department credentials
    const department = Object.entries(DEPARTMENT_CREDENTIALS).find(
      ([key, creds]) => creds.email === email && creds.password === password
    );

    if (department) {
      const [deptId, adminData] = department;
      const admin = {
        id: deptId,
        ...adminData
      };
      
      setAdminUser(admin);
      setIsAuthenticated(true);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      return { success: true, admin };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminUser');
  };

  const value = {
    adminUser,
    isAuthenticated,
    loginAdmin,
    logoutAdmin,
    availableDepartments: Object.entries(DEPARTMENT_CREDENTIALS).map(([id, data]) => ({
      id,
      name: data.department,
      email: data.email
    }))
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
