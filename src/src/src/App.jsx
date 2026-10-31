import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  Phone,
  MessageCircle,
  MapPin,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Bike,
  ShieldCheck,
  Printer,
  Share2,
  Settings,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Trash2,
  IndianRupee,
  QrCode,
  Camera,
  Calendar,
  History,
  Globe,
  AlertCircle,
  Check,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

// ==========================================
// YOUR FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAhzdaFZqLHvdadVlO6pYHlMfQ1LIJjp5A",
  authDomain: "lokesh-motors-e378c.firebaseapp.com",
  projectId: "lokesh-motors-e378c",
  storageBucket: "lokesh-motors-e378c.firebasestorage.app",
  messagingSenderId: "643828015102",
  appId: "1:643828015102:web:f6d9debe2b77e4fed2aaaf",
  measurementId: "G-ZPJC322FQ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// DEFAULT WORKSHOP SETTINGS
// ==========================================
const DEFAULT_SETTINGS = {
  shopName: 'Lokesh Motors',
  ownerName: 'Shekar',
  phone: '9866296443',
  address: 'Don Bosco Post Office Rd, Abhyudaya Nagar, Kalimandir, Bandlaguda Jagir, Hyderabad, Telangana 500086',
  tagline: 'Trusted Two-Wheeler Servicing & Genuine Repairs',
  taglineTe: 'నమ్మకమైన టూ-వీలర్ సర్వీసింగ్ & రిపేర్లు',
  mapLink: 'https://www.google.com/maps/place/LOKESH+MOTORS/@17.3484488,78.3779924,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb956fcc6779d9:0xfd19ef65db9097db!8m2!3d17.3484488!4d78.3779924!16s%2Fg%2F11mhv7pdy0?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D',
  upiId: '9866296443@ybl',
  adminUsername: 'admin',
  adminPassword: 'lokesh123',
  staffUsername: 'staff',
  staffPassword: 'worker123',
  presetServices: [
    { id: 'srv-1', name: 'General Servicing', nameTe: 'జనరల్ సర్వీసింగ్', price: 450 },
    { id: 'srv-2', name: 'Water Wash', nameTe: 'వాటర్ వాష్', price: 150 },
    { id: 'srv-3', name: 'Engine Oil Change', nameTe: 'ఇంజిన్ ఆయిల్ మార్పు', price: 420 },
    { id: 'srv-4', name: 'Brake Shoe / Pad Repair', nameTe: 'బ్రేక్ రిపేర్', price: 220 },
    { id: 'srv-5', name: 'Chain Set / Lubing', nameTe: 'చైన్ సెట్ / లూబింగ్', price: 120 },
    { id: 'srv-6', name: 'Battery Check / Charging', nameTe: 'బ్యాటరీ చెక్ / ఛార్జింగ్', price: 150 },
    { id: 'srv-7', name: 'Tyre / Tube Repair', nameTe: 'టైర్ / ట్యూబ్ రిపేర్', price: 180 },
    { id: 'srv-8', name: 'Engine Work / Tuning', nameTe: 'ఇంజిన్ పని', price: 850 },
  ],
};

const STATUS_FLOW = ['Received', 'In Progress', 'Work Completed', 'Ready for Delivery', 'Delivered'];

const STATUS_LABELS = {
  en: {
    Received: 'Received',
    'In Progress': 'In Progress',
    'Work Completed': 'Work Completed',
    'Ready for Delivery': 'Ready for Delivery',
    Delivered: 'Delivered',
  },
  te: {
    Received: 'వాహనం తీసుకున్నాము',
    'In Progress': 'రిపేర్ జరుగుతోంది',
    'Work Completed': 'పని పూర్తయింది',
    'Ready for Delivery': 'డెలివరీకి సిద్ధం',
    Delivered: 'డెలివరీ చేయబడింది',
  },
};

const TRANSLATIONS = {
  en: {
    trackVehicle: 'Customer: Track My Vehicle',
    staffLogin: 'Staff Login (Workshop)',
    adminLogin: 'Admin Login (Owner)',
    callShop: 'Call Shekar',
    whatsapp: 'WhatsApp',
    directions: 'View Location',
    owner: 'Owner',
    enterDetailsToTrack: 'Enter your Vehicle Plate Number, Job ID, or Phone Number to see live repair status & bill.',
    plateOrJobId: 'Vehicle Number Plate or Job ID',
    phoneOptional: 'Phone Number (10 digits)',
    checkStatus: 'Track Vehicle Status',
    todaysJobs: "Today's Jobs",
    pendingJobs: 'Pending Jobs',
    todaysEarnings: "Today's Earnings",
    paymentHistory: 'Daily Payment History',
    newJob: 'Add New Job',
    searchPlaceholder: 'Search name, phone, plate number...',
    allStatuses: 'All Statuses',
    customerName: 'Customer Name',
    phoneNumber: 'Phone Number (10 digits)',
    plateNumber: 'Vehicle Number Plate',
    vehicleType: 'Vehicle Type',
    bike: 'Bike',
    scooty: 'Scooty',
    vehicleModel: 'Vehicle Name / Model',
    complaint: 'Customer Complaint / Notes',
    nextServiceDue: 'Next Service Due Date',
    saveJob: 'Create Job Card',
    statusTimeline: 'Repair Progress Timeline',
    servicesAndParts: 'Services & Spare Parts',
    subtotal: 'Subtotal',
    discount: 'Discount',
    grandTotal: 'Grand Total',
    amountPaid: 'Advance / Paid',
    balanceDue: 'Balance Due',
    payViaUpi: 'Pay Now via UPI App',
    printBill: 'Print / Download PDF',
    shareWhatsapp: 'Send Bill on WhatsApp',
    questionsCall: 'Questions? Call Shekar',
    settings: 'Shop Settings',
    logout: 'Logout',
    visitHistory: 'Previous Visit History',
  },
  te: {
    trackVehicle: 'కస్టమర్: నా వాహనాన్ని ట్రాక్ చేయండి',
    staffLogin: 'స్టాఫ్ లాగిన్ (వర్క్‌షాప్)',
    adminLogin: 'అడ్మిన్ లాగిన్ (యజమాని)',
    callShop: 'శేఖర్ గారికి కాల్ చేయండి',
    whatsapp: 'వాట్సాప్',
    directions: 'లొకేషన్ చూడండి',
    owner: 'యజమాని',
    enterDetailsToTrack: 'మీ వాహనం నంబర్ ప్లేట్, జాబ్ ID లేదా ఫోన్ నంబర్ ఎంటర్ చేసి రిపేర్ స్టేటస్ & బిల్ చూడండి.',
    plateOrJobId: 'వాహనం నంబర్ ప్లేట్ లేదా జాబ్ ID',
    phoneOptional: 'ఫోన్ నంబర్ (10 అంకెలు)',
    checkStatus: 'స్టేటస్ చూడండి',
    todaysJobs: 'ఈరోజు వాహనాలు',
    pendingJobs: 'పెండింగ్ వాహనాలు',
    todaysEarnings: 'ఈరోజు ఆదాయం',
    paymentHistory: 'రోజువారీ పేమెంట్ వివరాలు',
    newJob: 'కొత్త జాబ్ కార్డ్',
    searchPlaceholder: 'పేరు, ఫోన్, నంబర్ ప్లేట్ వెతకండి...',
    allStatuses: 'అన్నీ',
    customerName: 'కస్టమర్ పేరు',
    phoneNumber: 'ఫోన్ నంబర్ (10 అంకెలు)',
    plateNumber: 'వాహనం నంబర్ ప్లేట్',
    vehicleType: 'వాహనం రకం',
    bike: 'బైక్ (Bike)',
    scooty: 'స్కూటీ (Scooty)',
    vehicleModel: 'వాహనం మోడల్ (ఉదా: Activa, Splendor)',
    complaint: 'రిపేర్ వివరాలు / కంప్లైంట్',
    nextServiceDue: 'తదుపరి సర్వీస్ తేదీ',
    saveJob: 'జాబ్ కార్డ్ సేవ్ చేయండి',
    statusTimeline: 'రిపేర్ ప్రోగ్రెస్ వివరాలు',
    servicesAndParts: 'సర్వీసులు & విడిభాగాలు',
    subtotal: 'మొత్తం',
    discount: 'డిస్కౌంట్',
    grandTotal: 'నికర మొత్తం (Grand Total)',
    amountPaid: 'చెల్లించిన మొత్తం',
    balanceDue: 'బాకీ (Balance Due)',
    payViaUpi: 'UPI యాప్ ద్వారా పే చేయండి',
    printBill: 'బిల్లు ప్రింట్ / PDF డౌన్‌లోడ్',
    shareWhatsapp: 'వాట్సాప్‌లో బిల్లు పంపండి',
    questionsCall: 'సందేహాలా? శేఖర్ గారికి కాల్ చేయండి',
    settings: 'షాప్ సెట్టింగ్స్',
    logout: 'లాగ్ అవుట్',
    visitHistory: 'గత సర్వీస్ వివరాలు',
  },
};

function formatDateDDMMYYYY(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const datePart = formatDateDDMMYYYY(isoString);
  const timePart = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

function getDefaultNextServiceDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().split('T')[0];
}

function sanitizePlate(val) {
  return (val || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function calculateJobTotals(job) {
  if (!job) return { subtotal: 0, discount: 0, grandTotal: 0, paid: 0, balance: 0 };
  const items = job.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );
  const discount = Math.max(0, Number(job.discount || 0));
  const grandTotal = Math.max(0, subtotal - discount);
  const paid = Math.max(0, Number(job.amountPaid || 0));
  const balance = Math.max(0, grandTotal - paid);
  return { subtotal, discount, grandTotal, paid, balance };
}

function buildUpiUri({ upiId, shopName, amount, jobId }) {
  const cleanUpi = (upiId || '9866296443@ybl').trim();
  const cleanName = encodeURIComponent(shopName || 'Lokesh Motors');
  const cleanNote = encodeURIComponent(`Bill ${jobId || ''}`);
  const amtParam = amount > 0 ? `&am=${Number(amount).toFixed(2)}` : '';
  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}${amtParam}&cu=INR&tn=${cleanNote}`;
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];

  const [userRole, setUserRole] = useState(null);
  const [loginRoleTarget, setLoginRoleTarget] = useState('staff');
  const [view, setView] = useState('landing');
  const [adminSection, setAdminSection] = useState('jobs');
  const [paymentDateFilter, setPaymentDateFilter] = useState('all');

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [jobs, setJobs] = useState([]);
  const [activeJobId, setActiveJobId] = useState(null);
  const [toast, setToast] = useState(null);

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [trackPlateOrId, setTrackPlateOrId] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [trackError, setTrackError] = useState('');

  const [newJobForm, setNewJobForm] = useState({
    customerName: '',
    phone: '',
    plateNumber: '',
    vehicleType: 'Bike',
    vehicleModel: '',
    complaint: '',
    conditionNote: '',
    photoData: '',
    nextServiceDate: getDefaultNextServiceDate(),
  });
  const [newJobError, setNewJobError] = useState('');
  const [adminTab, setAdminTab] = useState('status');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.warn('Auth issue:', err));

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;

      const settingsRef = doc(db, 'settings', 'shop_config');
      const unsubSettings = onSnapshot(settingsRef, (snap) => {
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snap.data() });
        } else {
          setDoc(settingsRef, DEFAULT_SETTINGS).catch(() => {});
        }
      });

      const jobsColRef = collection(db, 'jobs');
      const unsubJobs = onSnapshot(jobsColRef, (snap) => {
        const loadedJobs = [];
        snap.forEach((d) => loadedJobs.push(d.data()));
        loadedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(loadedJobs);
      });

      return () => {
        unsubSettings();
        unsubJobs();
      };
    });

    return () => unsubAuth();
  }, []);

  const saveJobToCloud = async (updatedJob) => {
    try {
      await setDoc(doc(db, 'jobs', updatedJob.jobId), updatedJob);
    } catch (e) {
      console.warn('Save error:', e);
    }
  };

  const deleteJobFromCloud = async (jobId) => {
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      showToast(`Job ${jobId} deleted`);
      setView(userRole === 'admin' ? 'admin-dashboard' : 'staff-dashboard');
    } catch (e) {
      console.warn('Delete error:', e);
    }
  };

  const saveSettingsToCloud = async (newSettings) => {
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'shop_config'), newSettings);
      showToast('Shop settings updated!');
    } catch (e) {
      console.warn('Settings save error:', e);
    }
  };

  const activeJob = useMemo(
    () => jobs.find((j) => j.jobId === activeJobId) || null,
    [jobs, activeJobId]
  );

  const getPlateHistory = (plateNumber, excludeJobId = null) => {
    const clean = sanitizePlate(plateNumber);
    if (!clean || clean.length < 4) return [];
    return jobs.filter((j) => sanitizePlate(j.plateNumber) === clean && j.jobId !== excludeJobId);
  };

  const dashboardStats = useMemo(() => {
    const todayStr = formatDateDDMMYYYY(new Date().toISOString());
    let todaysJobsCount = 0;
    let pendingJobsCount = 0;
    let completedTodayCount = 0;
    let todaysEarnings = 0;
    let totalCollectedAllTime = 0;
    let totalPendingBalance = 0;

    jobs.forEach((j) => {
      const isToday = formatDateDDMMYYYY(j.createdAt) === todayStr;
      const { balance } = calculateJobTotals(j);
      const paid = Number(j.amountPaid || 0);
      const paidDateStr = formatDateDDMMYYYY(j.lastPaymentAt || j.createdAt);

      if (isToday) todaysJobsCount += 1;
      if (j.status !== 'Delivered') pendingJobsCount += 1;
      if (isToday && (j.status === 'Work Completed' || j.status === 'Ready for Delivery' || j.status === 'Delivered')) {
        completedTodayCount += 1;
      }
      if (paidDateStr === todayStr) todaysEarnings += paid;
      totalCollectedAllTime += paid;
      totalPendingBalance += balance;
    });

    return {
      todaysJobsCount,
      pendingJobsCount,
      completedTodayCount,
      todaysEarnings,
      totalCollectedAllTime,
      totalPendingBalance,
    };
  }, [jobs]);

  const paymentLedger = useMemo(() => {
    const todayStr = formatDateDDMMYYYY(new Date().toISOString());
    const list = [];

    jobs.forEach((job) => {
      const { grandTotal, paid, balance } = calculateJobTotals(job);
      if (paid > 0 || grandTotal > 0) {
        const txDateIso = job.lastPaymentAt || job.createdAt;
        const isToday = formatDateDDMMYYYY(txDateIso) === todayStr;
        if (paymentDateFilter === 'today' && !isToday) return;

        list.push({
          jobId: job.jobId,
          customerName: job.customerName,
          phone: job.phone,
          plateNumber: job.plateNumber,
          vehicleModel: job.vehicleModel,
          timestamp: txDateIso,
          paymentMode: job.paymentMode || 'UPI',
          grandTotal,
          amountPaid: paid,
          balance,
        });
      }
    });

    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [jobs, paymentDateFilter]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStatus;
      return (
        matchesStatus &&
        ((job.customerName || '').toLowerCase().includes(q) ||
          (job.phone || '').toLowerCase().includes(q) ||
          (job.plateNumber || '').toLowerCase().includes(q) ||
          (job.jobId || '').toLowerCase().includes(q) ||
          (job.vehicleModel || '').toLowerCase().includes(q))
      );
    });
  }, [jobs, searchQuery, statusFilter]);

  const handleCustomerLookup = (e) => {
    e.preventDefault();
    setTrackError('');
    const cleanInput = sanitizePlate(trackPlateOrId);
    const cleanPhone = trackPhone.replace(/\D/g, '');

    if (!cleanInput && !cleanPhone) {
      setTrackError('Please enter your Vehicle Plate Number, Job ID, or 10-digit Phone Number.');
      return;
    }

    const matched = jobs.find((j) => {
      const plateMatch = cleanInput && sanitizePlate(j.plateNumber) === cleanInput;
      const idMatch = cleanInput && sanitizePlate(j.jobId) === cleanInput;
      const phoneMatch = cleanPhone && j.phone === cleanPhone;
      return plateMatch || idMatch || phoneMatch;
    });

    if (matched) {
      setActiveJobId(matched.jobId);
      setView('customer-view');
    } else {
      setTrackError('No matching vehicle record found. Please verify details or call Shekar at 9866296443.');
    }
  };

  const handleAdminOrStaffLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const enteredUser = loginUser.trim().toLowerCase();
    const adminUser = (settings.adminUsername || 'admin').toLowerCase();
    const adminPass = settings.adminPassword || 'lokesh123';
    const staffUser = (settings.staffUsername || 'staff').toLowerCase();
    const staffPass = settings.staffPassword || 'worker123';

    if (loginRoleTarget === 'admin') {
      if (enteredUser === adminUser && loginPass === adminPass) {
        setUserRole('admin');
        setView('admin-dashboard');
      } else {
        setLoginError('Invalid Admin credentials.');
      }
    } else {
      if (enteredUser === staffUser && loginPass === staffPass) {
        setUserRole('staff');
        setView('staff-dashboard');
      } else {
        setLoginError('Invalid Staff credentials.');
      }
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setNewJobError('');
    const cleanPhone = newJobForm.phone.replace(/\D/g, '');
    const cleanPlate = sanitizePlate(newJobForm.plateNumber);

    if (!newJobForm.customerName.trim() || cleanPhone.length !== 10 || cleanPlate.length < 4) {
      setNewJobError('Please fill out all required fields with valid details.');
      return;
    }

    const maxNum = jobs.reduce((max, j) => {
      const num = parseInt((j.jobId || '').replace(/\D/g, ''), 10);
      return !Number.isNaN(num) && num > max ? num : max;
    }, 1000);
    const nextJobId = `LM-${maxNum + 1}`;
    const nowIso = new Date().toISOString();

    const newJobObj = {
      jobId: nextJobId,
      customerName: newJobForm.customerName.trim(),
      phone: cleanPhone,
      plateNumber: cleanPlate,
      vehicleType: newJobForm.vehicleType,
      vehicleModel: newJobForm.vehicleModel.trim(),
      complaint: newJobForm.complaint.trim(),
      conditionNote: newJobForm.conditionNote.trim(),
      photoData: newJobForm.photoData || '',
      createdAt: nowIso,
      nextServiceDate: newJobForm.nextServiceDate || getDefaultNextServiceDate(),
      status: 'Received',
      statusHistory: [
        {
          status: 'Received',
          timestamp: nowIso,
          note: newJobForm.complaint.trim() || 'Vehicle received at workshop.',
        },
      ],
      items: [],
      discount: 0,
      amountPaid: 0,
      paymentMode: 'UPI',
      paymentStatus: 'Pending',
    };

    await saveJobToCloud(newJobObj);
    setActiveJobId(nextJobId);
    setAdminTab('status');
    setNewJobForm({
      customerName: '',
      phone: '',
      plateNumber: '',
      vehicleType: 'Bike',
      vehicleModel: '',
      complaint: '',
      conditionNote: '',
      photoData: '',
      nextServiceDate: getDefaultNextServiceDate(),
    });
    setView('job-detail');
  };

  const shareBillOnWhatsApp = (job) => {
    const { grandTotal, paid, balance } = calculateJobTotals(job);
    const customerPhone = `91${job.phone.replace(/\D/g, '').slice(-10)}`;
    const trackingUrl = `${window.location.origin}${window.location.pathname}?job=${job.jobId}`;

    const msg = [
      `*${settings.shopName}* (${settings.ownerName})`,
      `📋 *Job ID:* ${job.jobId}`,
      `🏍️ *Vehicle:* ${job.vehicleModel} (${job.plateNumber})`,
      `📌 *Status:* ${job.status}`,
      `💰 *Total Bill:* ₹${grandTotal}`,
      `✅ *Paid:* ₹${paid}`,
      `🔸 *Balance Due:* ₹${balance}`,
      `🔗 *Track Bill Online:* ${trackingUrl}`,
      `📍 *Shop Location:* ${settings.mapLink}`,
      `📞 Questions? Call: ${settings.phone}`,
    ].join('\n');

    window.open(`https://wa.me/${customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Received: 'bg-gray-100 text-gray-800 border-gray-300',
      'In Progress': 'bg-orange-50 text-[#EA580C] border-orange-200',
      'Work Completed': 'bg-blue-50 text-blue-700 border-blue-200',
      'Ready for Delivery': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Delivered: 'bg-gray-900 text-white border-gray-900',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Received}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {STATUS_LABELS[lang]?.[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <button onClick={() => setView('landing')} className="flex items-center gap-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-none">
                {settings.shopName}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {t.owner}: <span className="font-medium text-gray-700">{settings.ownerName}</span> • {settings.phone}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {userRole && (
              <button
                onClick={() => setView(userRole === 'admin' ? 'admin-dashboard' : 'staff-dashboard')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border bg-gray-100"
              >
                {userRole === 'admin' ? 'Owner Admin' : 'Staff Mode'}
              </button>
            )}
            <button
              onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              <Globe className="w-3.5 h-3.5 text-[#EA580C]" />
              {lang === 'en' ? 'తెలుగు' : 'English'}
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => setView('admin-settings')}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Pages */}
      <main className="flex-1">
        {/* Landing View */}
        {view === 'landing' && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 text-[#EA580C] flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{settings.shopName}</h2>
              <p className="text-sm text-gray-500 mt-1.5">{lang === 'te' ? settings.taglineTe : settings.tagline}</p>

              <div className="mt-7 space-y-3">
                <button
                  onClick={() => setView('customer-lookup')}
                  className="w-full py-4 px-5 rounded-xl bg-[#EA580C] hover:bg-[#d94e07] text-white font-semibold flex items-center justify-between"
                >
                  <span className="flex items-center gap-3">
                    <Bike className="w-5 h-5" />
                    {t.trackVehicle}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => {
                      setLoginRoleTarget('staff');
                      setView('role-login');
                    }}
                    className="py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold text-xs border border-gray-200 flex items-center justify-between"
                  >
                    <span>{t.staffLogin}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => {
                      setLoginRoleTarget('admin');
                      setView('role-login');
                    }}
                    className="py-3 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-semibold text-xs border border-gray-200 flex items-center justify-between"
                  >
                    <span>{t.adminLogin}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-gray-400">Workshop Location</p>
              <h3 className="text-sm font-bold text-gray-900 mt-1">{settings.address}</h3>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <a href={`tel:${settings.phone}`} className="py-2.5 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-center flex items-center justify-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#EA580C]" /> Call
                </a>
                <a href={`https://wa.me/91${settings.phone}`} target="_blank" rel="noreferrer" className="py-2.5 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-center flex items-center justify-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-[#EA580C]" /> WhatsApp
                </a>
                <a href={settings.mapLink} target="_blank" rel="noreferrer" className="py-2.5 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-center flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#EA580C]" /> Location
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Customer Lookup */}
        {view === 'customer-lookup' && (
          <div className="max-w-md mx-auto px-4 py-8">
            <button onClick={() => setView('landing')} className="inline-flex items-center gap-1.5 text-sm text-gray-600 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t.trackVehicle}</h2>
              <form onSubmit={handleCustomerLookup} className="space-y-4">
                <input
                  type="text"
                  value={trackPlateOrId}
                  onChange={(e) => setTrackPlateOrId(e.target.value.toUpperCase())}
                  placeholder="Number Plate (e.g. TS09AB1234)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 uppercase"
                />
                <input
                  type="tel"
                  maxLength={10}
                  value={trackPhone}
                  onChange={(e) => setTrackPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Phone Number (10 digits)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                />
                {trackError && <p className="text-xs text-red-600">{trackError}</p>}
                <button type="submit" className="w-full py-3 rounded-xl bg-[#EA580C] text-white font-semibold text-sm">
                  {t.checkStatus}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Role Login */}
        {view === 'role-login' && (
          <div className="max-w-sm mx-auto px-4 py-10">
            <button onClick={() => setView('landing')} className="inline-flex items-center gap-1.5 text-sm text-gray-600 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {loginRoleTarget === 'admin' ? 'Owner Admin Login' : 'Staff Login'}
              </h2>
              <form onSubmit={handleAdminOrStaffLogin} className="space-y-4">
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Username"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
                {loginError && <p className="text-xs text-red-600">{loginError}</p>}
                <button type="submit" className="w-full py-3 rounded-xl bg-[#EA580C] text-white font-semibold text-sm">
                  Login
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Staff Dashboard */}
        {view === 'staff-dashboard' && (
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Workshop Staff Portal</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setView('add-job')} className="py-2 px-3 rounded-xl bg-[#EA580C] text-white text-xs font-semibold flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Job
                </button>
                <button onClick={() => { setUserRole(null); setView('landing'); }} className="p-2 rounded-xl border border-gray-200">
                  <LogOut className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500">Today's Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.todaysJobsCount}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500">Pending Jobs</p>
                <p className="text-2xl font-bold text-[#EA580C]">{dashboardStats.pendingJobsCount}</p>
              </div>
            </div>

            <div className="space-y-3">
              {filteredJobs.map((j) => (
                <div key={j.jobId} onClick={() => { setActiveJobId(j.jobId); setAdminTab('status'); setView('job-detail'); }} className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-[#EA580C]">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{j.plateNumber}</span> ({j.vehicleModel})
                      <p className="text-xs text-gray-500 mt-1">{j.customerName} - {j.phone}</p>
                    </div>
                    <div>{renderStatusBadge(j.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {view === 'admin-dashboard' && (
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Owner Admin Dashboard</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setView('add-job')} className="py-2 px-3 rounded-xl bg-[#EA580C] text-white text-xs font-semibold flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Job
                </button>
                <button onClick={() => { setUserRole(null); setView('landing'); }} className="p-2 rounded-xl border border-gray-200">
                  <LogOut className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500">Today's Jobs</p>
                <p className="text-xl font-bold text-gray-900">{dashboardStats.todaysJobsCount}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-xl font-bold text-[#EA580C]">{dashboardStats.pendingJobsCount}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500">Today's Revenue</p>
                <p className="text-xl font-bold text-emerald-700">₹{dashboardStats.todaysEarnings}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              <button onClick={() => setAdminSection('jobs')} className={`py-2 rounded-lg text-xs font-bold border ${adminSection === 'jobs' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
                Jobs ({jobs.length})
              </button>
              <button onClick={() => setAdminSection('payments')} className={`py-2 rounded-lg text-xs font-bold border ${adminSection === 'payments' ? 'bg-[#EA580C] text-white' : 'bg-white text-gray-700'}`}>
                Payment History
              </button>
            </div>

            {adminSection === 'payments' ? (
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <h3 className="text-xs font-bold uppercase text-gray-500">Recent Collections</h3>
                {paymentLedger.map((p) => (
                  <div key={p.jobId} className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{p.plateNumber} ({p.customerName})</p>
                      <p className="text-[11px] text-gray-400">{formatDateTime(p.timestamp)} via {p.paymentMode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">₹{p.amountPaid}</p>
                      <p className="text-[11px] text-gray-400">Bal: ₹{p.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((j) => (
                  <div key={j.jobId} onClick={() => { setActiveJobId(j.jobId); setAdminTab('status'); setView('job-detail'); }} className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-[#EA580C]">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{j.plateNumber}</span> ({j.vehicleModel})
                        <p className="text-xs text-gray-500 mt-1">{j.customerName} - {j.phone}</p>
                      </div>
                      <div className="text-right">
                        {renderStatusBadge(j.status)}
                        <p className="text-xs font-bold text-gray-900 mt-1">₹{calculateJobTotals(j).grandTotal}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Job */}
        {view === 'add-job' && (
          <div className="max-w-xl mx-auto px-4 py-6">
            <button onClick={() => setView(userRole === 'admin' ? 'admin-dashboard' : 'staff-dashboard')} className="inline-flex items-center gap-1.5 text-sm text-gray-600 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">New Job Card</h2>
              <form onSubmit={handleCreateJob} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Plate Number (TS09AB1234)"
                  value={newJobForm.plateNumber}
                  onChange={(e) => setNewJobForm({ ...newJobForm, plateNumber: sanitizePlate(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border uppercase font-bold"
                />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Customer Phone (10 digits)"
                  value={newJobForm.phone}
                  onChange={(e) => setNewJobForm({ ...newJobForm, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
                <input
                  type="text"
                  required
                  placeholder="Customer Name"
                  value={newJobForm.customerName}
                  onChange={(e) => setNewJobForm({ ...newJobForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
                <input
                  type="text"
                  required
                  placeholder="Vehicle Model (Activa / Splendor)"
                  value={newJobForm.vehicleModel}
                  onChange={(e) => setNewJobForm({ ...newJobForm, vehicleModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border"
                />
                <textarea
                  placeholder="Customer Complaint / Service Notes"
                  value={newJobForm.complaint}
                  onChange={(e) => setNewJobForm({ ...newJobForm, complaint: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                  rows={2}
                />
                {newJobError && <p className="text-xs text-red-600">{newJobError}</p>}
                <button type="submit" className="w-full py-3 rounded-xl bg-[#EA580C] text-white font-semibold text-sm">
                  Create Job
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Job Details & Bill */}
        {view === 'job-detail' && activeJob && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <button onClick={() => setView(userRole === 'admin' ? 'admin-dashboard' : 'staff-dashboard')} className="inline-flex items-center gap-1.5 text-sm text-gray-600 mb-4 print:hidden">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{activeJob.plateNumber}</h3>
                  <p className="text-xs text-gray-500">{activeJob.customerName} • {activeJob.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-[#EA580C]">{activeJob.jobId}</p>
                  {renderStatusBadge(activeJob.status)}
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="grid grid-cols-5 gap-1 pt-2">
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => saveJobToCloud({ ...activeJob, status: s })}
                    className={`py-2 px-1 rounded-lg text-[10px] font-bold border ${activeJob.status === s ? 'bg-[#EA580C] text-white' : 'bg-gray-50 text-gray-700'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Services Section */}
              <div className="pt-3 border-t">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Preset Services</p>
                <div className="grid grid-cols-2 gap-2">
                  {settings.presetServices.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => {
                        const items = activeJob.items || [];
                        saveJobToCloud({
                          ...activeJob,
                          items: [...items, { id: Date.now(), name: srv.name, qty: 1, price: srv.price }],
                        });
                      }}
                      className="p-2 rounded-lg border border-gray-200 text-left text-xs hover:border-[#EA580C]"
                    >
                      + {srv.name} (₹{srv.price})
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details */}
              <div className="pt-3 border-t">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Bill Items</p>
                {(activeJob.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1">
                    <span>{it.name}</span>
                    <span className="font-bold">₹{it.price}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm pt-2 border-t mt-2">
                  <span>Grand Total:</span>
                  <span>₹{calculateJobTotals(activeJob).grandTotal}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 print:hidden">
                <button onClick={() => shareBillOnWhatsApp(activeJob)} className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> WhatsApp Bill
                </button>
                <button onClick={() => window.print()} className="py-2.5 px-4 rounded-lg border border-gray-300 text-xs font-semibold">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
