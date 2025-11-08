import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserType, Student, NewStudentData } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    userType: UserType;
    students: Student[];
    login: (id: string, pass: string) => Promise<boolean>;
    logout: () => void;
    updateStudentFee: (studentId: string, amountPaid: number) => Promise<void>;
    register: (studentData: NewStudentData) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userType, setUserType] = useState<UserType>(null);
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        api.getStudents().then(setStudents);
    }, []);

    const login = async (id: string, pass: string): Promise<boolean> => {
        const { user: loggedInUser, userType: loggedInUserType } = await api.login(id, pass);
        if (loggedInUser) {
            setUser(loggedInUser);
            setUserType(loggedInUserType);
            if (loggedInUserType === 'admin') {
                api.getStudents().then(setStudents);
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setUserType(null);
    };

    const updateStudentFee = async (studentId: string, amountPaid: number) => {
        const updatedStudents = await api.updateFee(studentId, amountPaid);
        if (updatedStudents) {
            setStudents(updatedStudents);
            // If the currently logged in user is the student being updated, update the user state as well
            if (user && 'id' in user && user.id === studentId) {
                const updatedStudent = updatedStudents.find(s => s.id === studentId);
                if (updatedStudent) {
                    setUser(updatedStudent);
                }
            }
        }
    };

    const register = async (studentData: NewStudentData): Promise<{ success: boolean; message: string }> => {
        return await api.registerStudent(studentData);
    };


    return (
        <AuthContext.Provider value={{ user, userType, students, login, logout, updateStudentFee, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
