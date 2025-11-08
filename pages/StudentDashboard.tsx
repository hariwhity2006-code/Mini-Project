import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Student, PaymentMethod } from '../types';
import Header from '../components/Header';
import UserIcon from '../components/icons/UserIcon';
import EmailIcon from '../components/icons/EmailIcon';
import IdCardIcon from '../components/icons/IdCardIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import PaymentPage from './PaymentPage';
import ReceiptPage from './ReceiptPage';

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4">
        <div className="bg-sec-light-blue p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

const FeeSummaryCard: React.FC<{ title: string; amount: number; color: string; }> = ({ title, amount, color }) => (
    <div className={`text-white p-6 rounded-xl shadow-lg ${color}`}>
        <p className="text-lg">{title}</p>
        <p className="text-4xl font-bold">₹{amount.toLocaleString('en-IN')}</p>
    </div>
);

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [view, setView] = useState<'dashboard' | 'payment' | 'receipt'>('dashboard');
    const [paymentDetails, setPaymentDetails] = useState<{ amount: number; transactionId: string; method: PaymentMethod; } | null>(null);

    if (!user || !('id' in user)) return null;
    const student = user as Student;
    const dueAmount = student.totalFees - student.paidAmount;

    const handlePaymentSuccess = (amount: number, transactionId: string, method: PaymentMethod) => {
        setPaymentDetails({ amount, transactionId, method });
        setView('receipt');
    };

    const MainDashboard = () => (
        <>
            <div className="p-4 sm:p-8 space-y-8">
                {/* Student Information */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoItem icon={<UserIcon className="w-6 h-6 text-blue-500" />} label="Name" value={student.name} />
                        <InfoItem icon={<IdCardIcon className="w-6 h-6 text-green-500" />} label="Roll Number" value={student.id} />
                        <InfoItem icon={<EmailIcon className="w-6 h-6 text-orange-500" />} label="Email" value={student.email} />
                        <InfoItem icon={<PhoneIcon className="w-6 h-6 text-purple-500" />} label="Phone" value={student.phone} />
                    </div>
                </div>

                {/* Fee Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeeSummaryCard title="Total Fees" amount={student.totalFees} color="bg-blue-500" />
                    <FeeSummaryCard title="Paid Amount" amount={student.paidAmount} color="bg-green-500" />
                    <FeeSummaryCard title="Due Amount" amount={dueAmount} color="bg-red-500" />
                </div>

                {/* Fee Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Fee Breakdown</h2>
                    <div className="space-y-4">
                        {Object.entries(student.feeBreakdown).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-4 border-b">
                                <p className="text-gray-600 capitalize">{key} Fee</p>
                                <p className="font-semibold text-gray-800">₹{value.toLocaleString('en-IN')}</p>
                            </div>
                        ))}
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                            <p className="font-bold text-blue-800 text-lg">Total</p>
                            <p className="font-bold text-blue-800 text-lg">₹{student.totalFees.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="sticky bottom-0 bg-white p-4 shadow-top flex justify-center">
                {dueAmount > 0 ? (
                    <button onClick={() => setView('payment')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-12 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                        Pay Now - ₹{dueAmount.toLocaleString('en-IN')}
                    </button>
                ) : (
                    <button disabled className="bg-green-500 text-white font-bold py-3 px-12 rounded-lg shadow-lg opacity-75 cursor-not-allowed">
                        All Fees Paid
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="SEC Fee Management" />
            <main className="flex-grow">
                {view === 'dashboard' && <MainDashboard />}
                {view === 'payment' && <PaymentPage student={student} dueAmount={dueAmount} onPaymentSuccess={handlePaymentSuccess} onBack={() => setView('dashboard')} />}
                {view === 'receipt' && paymentDetails && <ReceiptPage student={student} paymentDetails={paymentDetails} onBack={() => setView('dashboard')} />}
            </main>
        </div>
    );
};

export default StudentDashboard;