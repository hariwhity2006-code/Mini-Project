import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/RegisterPage';

const AppContent: React.FC = () => {
    const { user, userType } = useAuth();
    const [authView, setAuthView] = useState<'login' | 'register'>('login');

    if (!user) {
        if (authView === 'login') {
            return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
        }
        return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }

    if (userType === 'student') {
        return <StudentDashboard />;
    }

    if (userType === 'admin') {
        return <AdminDashboard />;
    }

    // Fallback to login if userType is somehow invalid
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop')" }}>
                <div className="min-h-screen bg-gray-50/95 backdrop-blur-sm">
                    <AppContent />
                </div>
            </div>
        </AuthProvider>
    );
};

export default App;