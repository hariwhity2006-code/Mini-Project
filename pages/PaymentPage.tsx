import React, { useState } from 'react';
import { Student, PaymentMethod } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface PaymentPageProps {
    student: Student;
    dueAmount: number;
    onPaymentSuccess: (amount: number, transactionId: string, method: PaymentMethod) => void;
    onBack: () => void;
}

const PaymentMethodButton: React.FC<{ method: PaymentMethod, selected: boolean, onClick: () => void, children: React.ReactNode }> = ({ method, selected, onClick, children }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 w-full ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
        {children}
        <span className={`mt-2 font-semibold ${selected ? 'text-blue-600' : 'text-gray-700'}`}>{method}</span>
    </button>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8 text-blue-500" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const GooglePayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24"><path fill="#4285F4" d="M19.6,9.44c0,0.39-0.03,0.77-0.08,1.15H12.2v-2.19h4.22c-0.18-0.71-0.53-1.34-1.04-1.83v-1.42h1.8c1.04,1.02,1.63,2.44,1.63,4.06L19.6,9.44z"/><path fill="#34A853" d="M12.2,20c2.26,0,4.16-0.75,5.55-2.04l-1.8-1.42c-0.75,0.5-1.7,0.8-2.75,0.8c-2.13,0-3.92-1.44-4.57-3.37H4.44v1.46C5.88,18.01,8.79,20,12.2,20z"/><path fill="#FBBC05" d="M7.63,13.96c-0.15-0.45-0.24-0.93-0.24-1.43s0.09-0.98,0.24-1.43V9.64H4.44c-0.43,0.86-0.67,1.82-0.67,2.86s0.24,2,0.67,2.86L7.63,13.96z"/><path fill="#EA4335" d="M12.2,7.47c1.22,0,2.33,0.42,3.2,1.27l1.59-1.59C15.39,5.71,13.89,5,12.2,5C8.79,5,5.88,6.99,4.44,9.64l3.19,2.46C8.28,8.91,10.07,7.47,12.2,7.47z"/></svg>);

const PaymentPage: React.FC<PaymentPageProps> = ({ student, dueAmount, onPaymentSuccess, onBack }) => {
    const [amountToPay, setAmountToPay] = useState(dueAmount);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.GOOGLE_PAY);
    const [upiId, setUpiId] = useState(`${student.name.split(' ').join('').toLowerCase()}${student.id.slice(-4)}@gmail.com`);
    const [cardNumber, setCardNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { updateStudentFee } = useAuth();

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\s/g, '');
        if (/^\d*$/.test(rawValue) && rawValue.length <= 16) {
            const formattedValue = rawValue.match(/.{1,4}/g)?.join(' ') || '';
            setCardNumber(formattedValue);
        }
    };

    const handlePayment = async () => {
        if (amountToPay <= 0 || amountToPay > dueAmount) {
            setError(`Please enter an amount between ₹1 and ₹${dueAmount}`);
            return;
        }
        setError('');

        if (paymentMethod === PaymentMethod.CREDIT_CARD) {
            const cleanedCardNumber = cardNumber.replace(/\s/g, '');
            if (cleanedCardNumber.length !== 16) {
                setError('Please enter a valid 16-digit credit card number.');
                return;
            }
        }

        setIsLoading(true);

        const result = await api.processPayment(student.id, amountToPay);
        if (result.success) {
            updateStudentFee(student.id, amountToPay);
            onPaymentSuccess(amountToPay, result.transactionId, paymentMethod);
        } else {
            setError('Payment failed. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <button onClick={onBack} className="mb-6 text-sec-blue font-semibold hover:underline">
                &larr; Back to Dashboard
            </button>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Summary</h2>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-lg">Due Amount:</span>
                        <span className="text-red-500 font-bold text-2xl">₹{dueAmount.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">Amount to Pay</label>
                        <input
                            id="amount"
                            type="number"
                            value={amountToPay}
                            onChange={(e) => setAmountToPay(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            max={dueAmount}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Select Payment Method</label>
                        <div className="grid grid-cols-3 gap-4">
                            <PaymentMethodButton method={PaymentMethod.CREDIT_CARD} selected={paymentMethod === PaymentMethod.CREDIT_CARD} onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}>
                                <CreditCardIcon />
                            </PaymentMethodButton>
                            <PaymentMethodButton method={PaymentMethod.GOOGLE_PAY} selected={paymentMethod === PaymentMethod.GOOGLE_PAY} onClick={() => setPaymentMethod(PaymentMethod.GOOGLE_PAY)}>
                                <GooglePayIcon/>
                            </PaymentMethodButton>
                            <PaymentMethodButton method={PaymentMethod.PHONEPE} selected={paymentMethod === PaymentMethod.PHONEPE} onClick={() => setPaymentMethod(PaymentMethod.PHONEPE)}>
                                <PhoneIcon />
                            </PaymentMethodButton>
                        </div>
                    </div>

                    { paymentMethod === PaymentMethod.CREDIT_CARD &&
                        <div>
                            <label htmlFor="cardNumber" className="block text-gray-700 font-semibold mb-2">Credit Card Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="cardNumber"
                                    type="tel"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
                                    required
                                />
                            </div>
                        </div>
                    }

                    { (paymentMethod === PaymentMethod.GOOGLE_PAY || paymentMethod === PaymentMethod.PHONEPE) &&
                        <div>
                            <label htmlFor="upiId" className="block text-gray-700 font-semibold mb-2">UPI ID</label>
                            <input
                                id="upiId"
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-blue-800 font-mono"
                                readOnly
                            />
                        </div>
                    }

                    <button onClick={handlePayment} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg">
                        {isLoading ? 'Processing...' : `Pay ₹${amountToPay.toLocaleString('en-IN')}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;