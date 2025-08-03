import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

export default function Layout({ children }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { adminUser, isAuthenticated, logoutAdmin } = useAdmin();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin-login';

  if (isAuthPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-card/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
           style={{background: 'linear-gradient(145deg, hsl(var(--card) / 0.8) 0%, hsl(217.2 32.6% 12% / 0.9) 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform text-white shadow-2xl" 
                     style={{background: 'linear-gradient(145deg, hsl(var(--primary)) 0%, hsl(142 71% 45%) 100%)'}}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">ComplaintHub</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated && adminUser ? (
                // Admin navigation
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-foreground">{adminUser.department}</p>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-2xl" 
                         style={{background: 'linear-gradient(145deg, hsl(var(--primary)) 0%, hsl(142 71% 45%) 100%)'}}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{adminUser.name}</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                  </div>
                  <button
                    onClick={logoutAdmin}
                    className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out group"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                // Regular navigation
                <div className="flex items-center space-x-6">
                  <Link 
                    to="/dashboard" 
                    className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out group"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin-login" 
                    className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out group"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Login
                  </Link>
                  <div className="h-8 w-px bg-white/20"></div>
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-primary/30 focus:outline-none text-primary-foreground"
                    style={{background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(217 91% 70%) 100%)'}}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-6 border-t border-white/10 space-y-4">
              {isAuthenticated && adminUser ? (
                // Admin mobile navigation
                <div className="space-y-4">
                  <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 rounded-xl"
                       style={{background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(217.2 32.6% 12%) 100%)'}}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-2xl" 
                           style={{background: 'linear-gradient(145deg, hsl(var(--primary)) 0%, hsl(142 71% 45%) 100%)'}}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{adminUser.name}</p>
                        <p className="text-sm text-muted-foreground">{adminUser.department}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logoutAdmin}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 border border-white/10 backdrop-blur-sm w-full justify-center flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                // Regular mobile navigation
                <div className="space-y-4">
                  <Link 
                    to="/dashboard" 
                    className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out w-full justify-start flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin-login" 
                    className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out w-full justify-start flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Login
                  </Link>
                  <div className="border-t border-white/10 pt-4">
                    <Link
                      to="/login"
                      className="px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-primary/30 focus:outline-none text-primary-foreground w-full justify-center flex items-center"
                      style={{background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(217 91% 70%) 100%)'}}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
