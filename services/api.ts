import { Student, Admin, User, UserType, NewStudentData } from '../types';
import { ADMIN_DATA, STUDENTS_DATA } from '../constants';

// This is a mock API. It holds the student data in-memory.
let students: Student[] = [...STUDENTS_DATA]; // Start with initial data, create a mutable copy

const login = (id: string, pass: string): Promise<{ user: User | null, userType: UserType }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check for admin login
            if (id === ADMIN_DATA.username && pass === ADMIN_DATA.password) {
                resolve({ user: ADMIN_DATA, userType: 'admin' });
                return;
            }

            // Check for student login
            const student = students.find(s => s.id === id && s.password === pass);
            if (student) {
                resolve({ user: student, userType: 'student' });
            } else {
                resolve({ user: null, userType: null });
            }
        }, 500); // Simulate network delay
    });
};

const registerStudent = (studentData: NewStudentData): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const studentExists = students.some(s => s.id === studentData.id || s.email === studentData.email);
            if (studentExists) {
                resolve({ success: false, message: 'A student with this Roll Number or Email already exists.' });
                return;
            }

            const newStudent: Student = {
                ...studentData,
                totalFees: 51000,
                paidAmount: 0,
                feeBreakdown: { tuition: 38000, hostel: 8000, library: 2000, lab: 3000 }
            };

            students.push(newStudent);
            resolve({ success: true, message: 'Registration successful! Please login.' });
        }, 500);
    });
};

const getStudents = (): Promise<Student[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...students]); // Return a copy
        }, 100);
    });
};

const updateFee = (studentId: string, amountPaid: number): Promise<Student[] | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const studentIndex = students.findIndex(s => s.id === studentId);
            if (studentIndex > -1) {
                students[studentIndex] = { ...students[studentIndex], paidAmount: students[studentIndex].paidAmount + amountPaid };
                resolve([...students]); // Return updated list
            } else {
                resolve(null);
            }
        }, 100);
    });
};

const processPayment = (studentId: string, amount: number): Promise<{ success: boolean, transactionId: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate a successful payment
            console.log(`Processing payment of ${amount} for student ${studentId}`);
            const transactionId = `TXN${Date.now()}`;
            resolve({ success: true, transactionId });
        }, 1500); // Simulate payment gateway delay
    });
};

export const api = {
    login,
    registerStudent,
    getStudents,
    updateFee,
    processPayment,
};
