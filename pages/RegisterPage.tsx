import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NewStudentData } from '../types';
import UserIcon from '../components/icons/UserIcon';
import LockIcon from '../components/icons/LockIcon';
import EmailIcon from '../components/icons/EmailIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import IdCardIcon from '../components/icons/IdCardIcon';

interface RegisterPageProps {
    onSwitchToLogin: () => void;
}

const InputField: React.FC<{
    id: string;
    type: string;
    placeholder: string;
    value: string;
    icon: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, type, placeholder, value, icon, onChange }) => (
    <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
        </div>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sec-blue focus:border-transparent transition-colors"
            required
        />
    </div>
);


const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState<NewStudentData & { confirmPassword: string }>({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);
        const { password, confirmPassword, ...studentData } = formData;
        const result = await register({ ...studentData, password });
        
        if (result.success) {
            setSuccess(result.message);
            // Optionally clear form and switch to login after a delay
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-xl shadow-2xl p-8 sm:p-12 w-full max-w-md m-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h1>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{success}</p>}
                
                <form onSubmit={handleRegister}>
                    <InputField onChange={handleChange} id="name" type="text" placeholder="Full Name" value={formData.name} icon={<UserIcon className="h-5 w-5 text-gray-400" />} />
                    <InputField onChange={handleChange} id="id" type="text" placeholder="Roll Number" value={formData.id} icon={<IdCardIcon className="h-5 w-5 text-gray-400" />} />
                    <InputField onChange={handleChange} id="email" type="email" placeholder="Email Address" value={formData.email} icon={<EmailIcon className="h-5 w-5 text-gray-400" />} />
                    <InputField onChange={handleChange} id="phone" type="tel" placeholder="Phone Number" value={formData.phone} icon={<PhoneIcon className="h-5 w-5 text-gray-400" />} />
                    <InputField onChange={handleChange} id="password" type="password" placeholder="Password" value={formData.password} icon={<LockIcon className="h-5 w-5 text-gray-400" />} />
                    <InputField onChange={handleChange} id="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} icon={<LockIcon className="h-5 w-5 text-gray-400" />} />
                    
                    <button
                        type="submit"
                        disabled={isLoading || !!success}
                        className="w-full bg-sec-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-bold text-sec-blue hover:underline focus:outline-none">
                        Login Here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;