
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LogoutIcon from './icons/LogoutIcon';

const Header: React.FC<{ title: string }> = ({ title }) => {
    const { logout } = useAuth();
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
            <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-sec-blue transition-colors duration-200"
            >
                <LogoutIcon className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
            </button>
        </header>
    );
};

export default Header;
