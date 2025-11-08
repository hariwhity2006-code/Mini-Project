
import { Student, Admin } from './types';

export const STUDENTS_DATA: Student[] = [
    { id: '23UCS001', name: 'G.Akash', email: 'g.akash@example.com', phone: '9876543210', password: 'sec@2025', totalFees: 55000, paidAmount: 0, feeBreakdown: { tuition: 40000, hostel: 10000, library: 2000, lab: 3000 } },
    { id: '23UCS002', name: 'P.Dharshan', email: 'p.dharshan@example.com', phone: '9876543211', password: 'sec@2025', totalFees: 52000, paidAmount: 20000, feeBreakdown: { tuition: 38000, hostel: 9000, library: 2000, lab: 3000 } },
    { id: '23UCS003', name: 'P.Dinesh', email: 'p.dinesh@example.com', phone: '9876543212', password: 'sec@2025', totalFees: 48000, paidAmount: 48000, feeBreakdown: { tuition: 35000, hostel: 8000, library: 2000, lab: 3000 } },
    { id: '23UCS004', name: 'S.Hariharan', email: 's.hariharan@example.com', phone: '9876543213', password: 'sec@2025', totalFees: 49500, paidAmount: 10000, feeBreakdown: { tuition: 36500, hostel: 8000, library: 2000, lab: 3000 } },
    { id: '23UCS005', name: 'E.Kaviyarasu', email: 'e.kaviyarasu@example.com', phone: '9876543214', password: 'sec@2025', totalFees: 55500, paidAmount: 0, feeBreakdown: { tuition: 41000, hostel: 9500, library: 2000, lab: 3000 } },
    { id: '23UCS006', name: 'M.Mukunthan', email: 'm.mukunthan@example.com', phone: '9876543215', password: 'sec@2025', totalFees: 50500, paidAmount: 50500, feeBreakdown: { tuition: 37500, hostel: 8000, library: 2000, lab: 3000 } },
    { id: '23UCS007', name: 'S.Navaprashanth', email: 's.navaprashanth@example.com', phone: '9876543216', password: 'sec@2025', totalFees: 49000, paidAmount: 0, feeBreakdown: { tuition: 36000, hostel: 8000, library: 2000, lab: 3000 } },
    { id: '23UCS008', name: 'P.Vignesh', email: 'p.vignesh@example.com', phone: '9876543217', password: 'sec@2025', totalFees: 52500, paidAmount: 25000, feeBreakdown: { tuition: 39000, hostel: 8500, library: 2000, lab: 3000 } },
    { id: '23UCS009', name: 'M.Thulasi Dass', email: 'm.thulasidass@example.com', phone: '9876543218', password: 'sec@2025', totalFees: 50000, paidAmount: 50000, feeBreakdown: { tuition: 37000, hostel: 8000, library: 2000, lab: 3000 } },
    { id: '23UCS010', name: 'Ramachandhiran', email: 'ramachandhiran@example.com', phone: '9876543219', password: 'sec@2025', totalFees: 49800, paidAmount: 0, feeBreakdown: { tuition: 36800, hostel: 8000, library: 2000, lab: 3000 } },
];

export const ADMIN_DATA: Admin = {
    username: 'admin',
    password: 'admin@123'
};
