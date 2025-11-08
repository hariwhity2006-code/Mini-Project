
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Student } from '../types';
import Header from '../components/Header';

const FeeStatusBadge: React.FC<{ status: 'Paid' | 'Pending' | 'Partial' }> = ({ status }) => {
    const colorClasses = {
        Paid: 'bg-green-100 text-green-800',
        Pending: 'bg-red-100 text-red-800',
        Partial: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const AdminDashboard: React.FC = () => {
    const { students } = useAuth();

    const totalFees = students.reduce((acc, s) => acc + s.totalFees, 0);
    const totalCollected = students.reduce((acc, s) => acc + s.paidAmount, 0);
    const totalDue = totalFees - totalCollected;

    const getStatus = (student: Student): 'Paid' | 'Pending' | 'Partial' => {
        if (student.paidAmount >= student.totalFees) return 'Paid';
        if (student.paidAmount === 0) return 'Pending';
        return 'Partial';
    };

    const exportToCSV = () => {
        const headers = ['Roll Number', 'Name', 'Email', 'Total Fees', 'Paid Amount', 'Due Amount', 'Status'];
        const csvRows = [headers.join(',')];

        students.forEach(student => {
            const due = student.totalFees - student.paidAmount;
            const status = getStatus(student);
            const row = [student.id, student.name, student.email, student.totalFees, student.paidAmount, due, status];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_fees_report.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Admin Dashboard - SEC Fees" />
            <main className="flex-grow p-4 sm:p-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-lg">Total Fees</p>
                        <p className="text-4xl font-bold">₹{totalFees.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-lg">Total Collected</p>
                        <p className="text-4xl font-bold">₹{totalCollected.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-lg">Total Due</p>
                        <p className="text-4xl font-bold">₹{totalDue.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">All Students</h2>
                        <button onClick={exportToCSV} className="bg-sec-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                            Export to CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Roll No</th>
                                    <th className="p-4 font-semibold text-gray-600">Name</th>
                                    <th className="p-4 font-semibold text-gray-600">Total Fees</th>
                                    <th className="p-4 font-semibold text-gray-600">Paid</th>
                                    <th className="p-4 font-semibold text-gray-600">Due</th>
                                    <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => {
                                    const due = student.totalFees - student.paidAmount;
                                    const status = getStatus(student);
                                    return (
                                        <tr key={student.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-800">{student.id}</td>
                                            <td className="p-4 text-gray-700">{student.name}</td>
                                            <td className="p-4 text-gray-700">₹{student.totalFees.toLocaleString('en-IN')}</td>
                                            <td className="p-4 text-green-600 font-semibold">₹{student.paidAmount.toLocaleString('en-IN')}</td>
                                            <td className="p-4 text-red-600 font-semibold">₹{due.toLocaleString('en-IN')}</td>
                                            <td className="p-4 text-center"><FeeStatusBadge status={status} /></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
