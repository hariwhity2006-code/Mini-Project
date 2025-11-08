import React from 'react';
import { Student, PaymentMethod } from '../types';

declare const jspdf: any;
declare const html2canvas: any;

interface ReceiptPageProps {
    student: Student;
    paymentDetails: {
        amount: number;
        transactionId: string;
        method: PaymentMethod;
    };
    onBack: () => void;
}

const ReceiptPage: React.FC<ReceiptPageProps> = ({ student, paymentDetails, onBack }) => {
    const receiptDate = new Date();
    const dueAmount = student.totalFees - student.paidAmount;

    const handleDownload = () => {
        const receiptElement = document.getElementById('receipt');
        if (receiptElement && typeof jspdf !== 'undefined' && typeof html2canvas !== 'undefined') {
            const { jsPDF } = jspdf;
            html2canvas(receiptElement, { scale: 2 }) // Increase scale for better quality
                .then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`SEC-Receipt-${student.id}.pdf`);
                });
        } else {
            console.error("PDF generation libraries not found or receipt element is missing.");
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
             <button onClick={onBack} className="mb-6 text-sec-blue font-semibold hover:underline print:hidden">
                &larr; Back to Dashboard
            </button>
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-200" id="receipt">
                <div className="text-center mb-8 border-b pb-6">
                    <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
                    <p className="text-gray-500 mt-2">Your fee payment has been processed successfully.</p>
                </div>

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Receipt</h2>
                        <p className="text-gray-500">SEC Fee Management</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Transaction ID:</p>
                        <p className="text-gray-600 text-sm break-all">{paymentDetails.transactionId}</p>
                        <p className="font-semibold mt-2">Date:</p>
                        <p className="text-gray-600 text-sm">{receiptDate.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-sec-light-blue p-6 rounded-lg mb-8">
                    <h3 className="font-semibold text-lg mb-4 text-sec-blue">Student Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><span className="font-medium text-gray-600">Name:</span> <span className="font-semibold text-sec-blue">{student.name}</span></div>
                        <div><span className="font-medium text-gray-600">Roll Number:</span> <span className="font-semibold text-sec-blue">{student.id}</span></div>
                        <div><span className="font-medium text-gray-600">Email:</span> <span className="font-semibold text-sec-blue">{student.email}</span></div>
                        <div><span className="font-medium text-gray-600">Course:</span> <span className="font-semibold text-sec-blue">BE Computer Science Engineering - 3rd Year</span></div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-4 text-sec-blue">Payment Summary</h3>
                    <table className="w-full text-left">
                        <tbody>
                            <tr className="border-b">
                                <td className="py-3 text-gray-600">Amount Paid</td>
                                <td className="py-3 text-right font-bold text-green-600 text-xl">₹{paymentDetails.amount.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 text-gray-600">Payment Method</td>
                                <td className="py-3 text-right font-semibold">{paymentDetails.method}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 text-gray-600">Total Fees</td>
                                <td className="py-3 text-right font-semibold">₹{student.totalFees.toLocaleString('en-IN')}</td>
                            </tr>
                             <tr className="border-b">
                                <td className="py-3 text-gray-600">Total Paid Amount</td>
                                <td className="py-3 text-right font-semibold">₹{student.paidAmount.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr className="bg-gray-100">
                                <td className="py-3 px-4 rounded-l-lg font-bold text-gray-800">Balance Due</td>
                                <td className="py-3 px-4 rounded-r-lg text-right font-bold text-red-500 text-xl">₹{dueAmount.toLocaleString('en-IN')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>An email receipt has been sent to {student.email}.</p>
                    <p>This is a computer-generated receipt and does not require a signature.</p>
                </div>
            </div>
            <div className="text-center mt-6 print:hidden">
                <button onClick={handleDownload} className="bg-sec-blue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
                    Download Receipt
                </button>
            </div>
        </div>
    );
};

export default ReceiptPage;