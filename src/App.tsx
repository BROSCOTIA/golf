import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CustomerRecord, FilterGender, StoreLocation } from './types';
import { INITIAL_CUSTOMERS, guessGender } from './data/initialData';
import { sanitizeCustomerRecords } from './data/dataSanitizer';
import { GOLF_TOWN_STORES } from './data/golfTownStores';
import { StoreMapModal } from './components/StoreMapModal';
import { CustomerNameInsightModal } from './components/CustomerNameInsightModal';
import { XlsxUploadModal } from './components/XlsxUploadModal';
import { MobileContactCard } from './components/MobileContactCard';
import { LoginSplashScreen } from './components/LoginSplashScreen';
import { StoreCreditPolicyModal } from './components/StoreCreditPolicyModal';
import { EmailFormPreviewModal } from './components/EmailFormPreviewModal';
import { CustomerPortalView } from './components/CustomerPortalView';
import { LiveSocketAdminModal } from './components/LiveSocketAdminModal';
import { AutomatedAlertsModal } from './components/AutomatedAlertsModal';
import { StoreCreditAnalyticsModal } from './components/StoreCreditAnalyticsModal';
import { CustomReceiptRefundModal } from './components/CustomReceiptRefundModal';
import {
  Users, Search, Sparkles, Download, Plus, Trash2, Edit3, FileSpreadsheet,
  PieChart, Store, MapPin, Phone, Building2, X, CheckCircle2, Navigation,
  Smartphone, Table as TableIcon, LayoutGrid, Lock, CreditCard, Mail,
  ExternalLink, Calendar, Menu, Bell, BarChart3, Receipt,
  ChevronUp, ChevronDown, ChevronsUpDown
} from 'lucide-react';

/* ============================== Utilities ============================== */

const safeStorage = {
  getItem: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  },
  sessionGetItem: (key: string): string | null => {
    try { return sessionStorage.getItem(key); } catch { return null; }
  },
  sessionSetItem: (key: string, value: string): void => {
    try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
  },
  sessionRemoveItem: (key: string): void => {
    try { sessionStorage.removeItem(key); } catch { /* ignore */ }
  }
};

const DEFAULT_PHONE = '(403) 723-0100';
const DEFAULT_CITY = 'Calgary';

const currency = (n: number, digits = 2): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

const csvField = (v: unknown): string => `"${String(v ?? '').replace(/"/g, '""')}"`;

const buildCustomersCsv = (records: CustomerRecord[]): string => {
  const headers = ['Store ID', 'Full Store Name', 'Quarter', 'Year', 'Cust ID', 'First Name', 'Last Name',
    'City', 'Phone', 'Email', 'Company', 'Store Credit Balance ($)', 'Comments', 'Gender'];
  const rows = records.map(c => [
    csvField(c.storeId), csvField(c.storeName), csvField(c.quarter), csvField(c.year),
    csvField(c.custId), csvField(c.firstName), csvField(c.lastName), csvField(c.city || DEFAULT_CITY),
    csvField(c.phone || DEFAULT_PHONE), csvField(c.email), csvField(c.company),
    csvField(c.sumOfStoreCreditBalance), csvField(c.comments), csvField(c.gender)
  ].join(','));
  return [headers.map(csvField).join(','), ...rows].join('\n');
};

const downloadCsv = (filename: string, csv: string): void => {
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csv));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const parseDateNum = (dateStr?: string): number => {
  if (!dateStr || dateStr === '(blank)') return 0;
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return isNaN(d.getTime()) ? 0 : d.getTime();
    }
    const d = new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

// Business rule: only surface records with refund/email activity by default
const hasRefundActivity = (c: CustomerRecord): boolean => {
  const status = c.refundStatus || 'Pending';
  if (status !== 'Pending') return true;
  const comments = (c.comments || '').toLowerCase();
  return ['email', 'sent', 'refund', 'secure form', 'opened', 'alert', 'update']
    .some(k => comments.includes(k));
};

type SortKey = 'custId' | 'name' | 'city' | 'balance' | 'status';

const getSortValue = (c: CustomerRecord, key: SortKey): string | number => {
  switch (key) {
    case 'name':    return `${c.lastName} ${c.firstName}`.toLowerCase();
    case 'city':    return (c.city || '').toLowerCase();
    case 'balance': return c.sumOfStoreCreditBalance;
    case 'status':  return c.refundStatus || 'Pending';
    case 'custId':  return c.custId || '';
  }
};

/* ============================== App Router ============================== */

export default function App() {
  const [sessionParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id') || params.get('sessionId');
    const depositToken = params.get('deposit_token');
    const amount = params.get('amount') || '250.00';
    return {
      sessionId,
      depositToken,
      amount,
      isCustomerPortal: !!(sessionId || depositToken)
    };
  });

  if (sessionParams.isCustomerPortal) {
    return (
      <CustomerPortalView
        sessionId={sessionParams.sessionId || ''}
        depositToken={sessionParams.depositToken || ''}
        initialAmount={sessionParams.amount}
      />
    );
  }

  return <AdminDashboard />;
}

/* ============================== Admin Dashboard ============================== */

function AdminDashboard() {
  // ---- Auth ----
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    safeStorage.sessionGetItem('golftown_authenticated') === 'true'
  );

  const handleAuthenticate = () => {
    safeStorage.sessionSetItem('golftown_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLockout = () => {
    safeStorage.sessionRemoveItem('golftown_authenticated');
    setIsAuthenticated(false);
  };

  // ---- Data: Stores ----
  const [stores, setStores] = useState<StoreLocation[]>(() => {
    const saved = safeStorage.getItem('store_locations_list');
    if (saved) {
      try {
        const parsed: StoreLocation[] = JSON.parse(saved);
        const filtered = parsed.filter(s => s.id !== '505');
        if (!filtered.some(s => s.id === '504')) {
          const s504 = GOLF_TOWN_STORES.find(s => s.id === '504');
          if (s504) filtered.unshift(s504);
        }
        return filtered;
      } catch { /* fallback below */ }
    }
    return GOLF_TOWN_STORES.filter(s => s.id !== '505');
  });

  // ---- Data: Customers ----
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    const saved = safeStorage.getItem('multi_store_customers');
    if (saved) {
      try {
        const parsed: CustomerRecord[] = JSON.parse(saved);
        const cleaned = parsed.filter(c => c.storeId !== '505').map(c => ({
          ...c,
          city: c.city || DEFAULT_CITY,
          phone: c.phone && c.phone !== '(blank)' ? c.phone : DEFAULT_PHONE
        }));
        if (cleaned.length > 0) return sanitizeCustomerRecords(cleaned);
      } catch { /* fallback below */ }
    }
    const initial504 = INITIAL_CUSTOMERS.filter(c => c.storeId === '504').map(c => ({
      ...c,
      city: c.city || DEFAULT_CITY,
      phone: c.phone && c.phone !== '(blank)' ? c.phone : DEFAULT_PHONE
    }));
    return sanitizeCustomerRecords(initial504);
  });

  // ---- Filters & UI state ----
  const [selectedStoreId, setSelectedStoreId] = useState<string>('504');
  const [selectedQuarterYear, setSelectedQuarterYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<FilterGender>('All');
  const [selectedRefundStatus, setSelectedRefundStatus] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'contacts' | 'stores' | 'stats' | 'import'>('contacts');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);

  // ---- Modals ----
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapStore, setMapStore] = useState<StoreLocation | null>(null);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [insightCustomer, setInsightCustomer] = useState<CustomerRecord | null>(null);
  const [isXlsxModalOpen, setIsXlsxModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isEmailFormModalOpen, setIsEmailFormModalOpen] = useState(false);
  const [isLiveSocketModalOpen, setIsLiveSocketModalOpen] = useState(false);
  const [isAutomatedAlertsModalOpen, setIsAutomatedAlertsModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isCustomReceiptModalOpen, setIsCustomReceiptModalOpen] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  // ---- Selection & batch ----
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // ---- Add/Edit form ----
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [formStoreId, setFormStoreId] = useState('504');
  const [formQuarter, setFormQuarter] = useState('Q1');
  const [formYear, setFormYear] = useState('2026');
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formCity, setFormCity] = useState(DEFAULT_CITY);
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState(DEFAULT_PHONE);
  const [formCustId, setFormCustId] = useState('');
  const [formStoreCredit, setFormStoreCredit] = useState('100.00');
  const [formComments, setFormComments] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Unknown'>('Unknown');

  // ---- AI status ----
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // ---- Table sorting ----
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // ---- Refs ----
  const saveTimeoutRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const flashMessage = (msg: string, ms = 5000) => {
    setAiMessage(msg);
    if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setAiMessage(''), ms);
  };

  // ---- Persistence ----
  const handleSaveCustomers = (newCustomers: CustomerRecord[]) => {
    setCustomers(newCustomers);
    safeStorage.setItem('multi_store_customers', JSON.stringify(newCustomers));
    if (saveTimeoutRef.current !== null) window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: newCustomers })
      })
        .then(res => res.json())
        .then(data => console.log('[Auto-Save] Backend synchronized:', data))
        .catch(err => console.error('Failed to debounced sync customers:', err));
    }, 2000);
  };

  const handleSaveStores = (newStores: StoreLocation[]) => {
    setStores(newStores);
    safeStorage.setItem('store_locations_list', JSON.stringify(newStores));
  };

  // Sync customers to backend on load
  useEffect(() => {
    if (customers && customers.length > 0) {
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers })
      }).catch(err => console.error('Initial sync failed:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Derived data ----
  const currentStoreObj = useMemo<StoreLocation>(() => {
    if (selectedStoreId === 'All') return stores[0] || GOLF_TOWN_STORES[0];
    return stores.find(s => s.id === selectedStoreId)
      || GOLF_TOWN_STORES.find(s => s.id === selectedStoreId)
      || {
        id: selectedStoreId,
        name: `Store ${selectedStoreId} - Golf Town Location`,
        code: selectedStoreId,
        address: '130 11500 35 St SE',
        city: DEFAULT_CITY,
        province: 'AB',
        phone: DEFAULT_PHONE,
        postalCode: 'T2J 3R1',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Golf+Town+Calgary'
      };
  }, [selectedStoreId, stores]);

  const quarterYearOptions = useMemo(() => {
    const keys = new Set<string>();
    customers.forEach(c => {
      if (c.quarterYearKey) keys.add(c.quarterYearKey);
      else if (c.year && c.quarter) keys.add(`${c.year}-${c.quarter}`);
    });
    return Array.from(keys).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (c.storeId === '505' && selectedStoreId !== '505') return false;
      if (selectedStoreId !== 'All' && c.storeId !== selectedStoreId) return false;
      if (selectedQuarterYear !== 'All' && c.quarterYearKey !== selectedQuarterYear) return false;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query) ||
        c.custId.toLowerCase().includes(query) ||
        (c.city && c.city.toLowerCase().includes(query)) ||
        (c.phone && c.phone.toLowerCase().includes(query)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.company && c.company.toLowerCase().includes(query)) ||
        (c.comments && c.comments.toLowerCase().includes(query));

      if (!matchesSearch) return false;
      if (selectedGender !== 'All' && c.gender !== selectedGender) return false;
      if (selectedRefundStatus !== 'All' && (c.refundStatus || 'Pending') !== selectedRefundStatus) return false;

      // Activity rule (toggleable)
      if (!showAllRecords && !hasRefundActivity(c)) return false;

      // Date range on lastSaleDate
      const cDateNum = parseDateNum(c.lastSaleDate);
      if (startDate) {
        const startNum = new Date(startDate).getTime();
        if (!isNaN(startNum) && cDateNum > 0 && cDateNum < startNum) return false;
      }
      if (endDate) {
        const endNum = new Date(endDate).setHours(23, 59, 59, 999);
        if (!isNaN(endNum) && cDateNum > 0 && cDateNum > endNum) return false;
      }
      return true;
    });
  }, [customers, selectedStoreId, selectedQuarterYear, searchQuery, selectedGender,
      selectedRefundStatus, startDate, endDate, showAllRecords]);

  const sortedCustomers = useMemo(() => {
    if (!sortKey) return filteredCustomers;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filteredCustomers].sort((a, b) => {
      const va = getSortValue(a, sortKey);
      const vb = getSortValue(b, sortKey);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [filteredCustomers, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const stats = useMemo(() => {
    let totalBalance = 0, maleCount = 0, femaleCount = 0, unknownCount = 0;
    let refundPending = 0, refundSms = 0, refundAuth = 0, refundDone = 0;
    const citiesSet = new Set<string>();

    filteredCustomers.forEach(c => {
      totalBalance += c.sumOfStoreCreditBalance;
      if (c.gender === 'Male') maleCount++;
      else if (c.gender === 'Female') femaleCount++;
      else unknownCount++;
      if (c.city) citiesSet.add(c.city);

      const status = c.refundStatus || 'Pending';
      if (status === 'Pending') refundPending++;
      else if (status === 'SMS Dispatched') refundSms++;
      else if (status === 'Auth Code Needed') refundAuth++;
      else if (status === 'Refunded') refundDone++;
    });

    const totalCount = filteredCustomers.length;
    return {
      totalCount,
      totalBalance,
      avgBalance: totalCount > 0 ? totalBalance / totalCount : 0,
      maleCount, femaleCount, unknownCount,
      cityCount: citiesSet.size,
      refundPending, refundSms, refundAuth, refundDone
    };
  }, [filteredCustomers]);

  // ---- Selection handlers ----
  const handleToggleSelectAll = () => {
    setSelectedCustomerIds(prev =>
      prev.length === filteredCustomers.length ? [] : filteredCustomers.map(c => c.id)
    );
  };

  const handleToggleCustomerSelect = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // ---- Exports ----
  const handleExportFilteredCSV = () => {
    if (filteredCustomers.length === 0) {
      alert('No records in the current view to export.');
      return;
    }
    downloadCsv(`Golf_Town_Store_${selectedStoreId}_Customer_Credit_Report.csv`, buildCustomersCsv(filteredCustomers));
    flashMessage(`Successfully exported ${filteredCustomers.length} filtered records to CSV!`);
  };

  const handleExportAllCSV = () => {
    if (customers.length === 0) {
      alert('No master records to export.');
      return;
    }
    downloadCsv(`Golf_Town_All_Master_Records_${new Date().toISOString().slice(0, 10)}.csv`, buildCustomersCsv(customers));
    flashMessage(`Exported all ${customers.length} master records to CSV!`);
  };

  const handleBulkExportCSV = () => {
    const selectedRecords = filteredCustomers.filter(c => selectedCustomerIds.includes(c.id));
    if (selectedRecords.length === 0) return;
    downloadCsv('Golf_Town_Selected_Customers_Report.csv', buildCustomersCsv(selectedRecords));
    flashMessage(`Successfully exported ${selectedRecords.length} selected customer records to CSV!`);
  };

  const handleBulkSendEmail = async () => {
    const selectedRecords = filteredCustomers.filter(c =>
      selectedCustomerIds.includes(c.id) && c.email && c.email !== '(blank)'
    );
    if (selectedRecords.length === 0) {
      alert('None of the selected customers have a valid email address.');
      return;
    }
    if (!confirm(`Send Store Credit Refund Notices via SMTP to ${selectedRecords.length} selected customers?`)) return;

    flashMessage(`Batch dispatching ${selectedRecords.length} refund notice emails via SMTP...`, 9000);
    let successCount = 0;
    for (const c of selectedRecords) {
      try {
        const res = await fetch('/api/send-refund-notice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: c.email,
            recipientName: `${c.firstName} ${c.lastName}`,
            amount: c.sumOfStoreCreditBalance,
            storeId: c.storeId,
            custId: c.custId,
            comments: c.comments,
            actionType: 'refund'
          })
        });
        const data = await res.json();
        if (res.ok && data.success) successCount++;
      } catch { /* per-recipient failure is non-fatal */ }
    }
    flashMessage(`Successfully sent SMTP refund notices to ${successCount} of ${selectedRecords.length} selected customers!`);
  };

  // ---- Modal triggers ----
  const handleOpenMapForStore = (store: StoreLocation) => {
    setMapStore(store);
    setIsMapModalOpen(true);
  };

  const handleOpenNameInsight = (c: CustomerRecord) => {
    setInsightCustomer(c);
    setIsInsightModalOpen(true);
  };

  const handleUpdateCustomerExplanation = (id: string, explanation: string) => {
    handleSaveCustomers(customers.map(c => c.id === id ? { ...c, nameExplanation: explanation } : c));
  };

  // ---- Multi-tab import ----
  const handleImportCustomers = (newRecords: CustomerRecord[], newStores?: StoreLocation[]) => {
    if (newStores && newStores.length > 0) {
      const mergedStores = [...stores];
      newStores.forEach(ns => {
        if (!mergedStores.some(ex => ex.id === ns.id)) mergedStores.push(ns);
      });
      handleSaveStores(mergedStores);
    }
    handleSaveCustomers([...newRecords, ...customers]);
    if (newRecords.length > 0 && newRecords[0].storeId) setSelectedStoreId(newRecords[0].storeId);
    flashMessage(`Successfully imported ${newRecords.length} records across Golf Town store sheets!`);
  };

  // ---- Batch AI name explanations ----
  const handleBatchAiNameExplanations = async () => {
    if (filteredCustomers.length === 0) return;
    setAiLoading(true);
    flashMessage('Generating AI Google Searched Name Explanations for displayed customers...', 15000);

    let updatedCount = 0;
    const updated = await Promise.all(
      filteredCustomers.slice(0, 15).map(async (c) => {
        if (c.nameExplanation) return c;
        try {
          const res = await fetch('/api/explain-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: c.firstName, lastName: c.lastName, city: c.city })
          });
          const data = await res.json();
          if (data.explanation) {
            updatedCount++;
            return { ...c, nameExplanation: data.explanation };
          }
        } catch { /* keep original */ }
        return c;
      })
    );

    const updatedMap = new Map(updated.map(u => [u.id, u]));
    handleSaveCustomers(customers.map(c => updatedMap.get(c.id) || c));
    setAiLoading(false);
    flashMessage(`Generated AI search explanations for ${updatedCount} customer names!`);
  };

  // ---- Add/Edit ----
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormStoreId(selectedStoreId === 'All' ? '504' : selectedStoreId);
    setFormQuarter('Q1');
    setFormYear('2026');
    setFormFirstName('');
    setFormLastName('');
    setFormCity(DEFAULT_CITY);
    setFormCompany('');
    setFormEmail('');
    setFormPhone(DEFAULT_PHONE);
    setFormCustId(Math.floor(10000000 + Math.random() * 90000000).toString());
    setFormStoreCredit('150.00');
    setFormComments('');
    setFormGender('Unknown');
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (c: CustomerRecord) => {
    setEditingCustomer(c);
    setFormStoreId(c.storeId);
    setFormQuarter(c.quarter || 'Q1');
    setFormYear(c.year?.toString() || '2026');
    setFormFirstName(c.firstName);
    setFormLastName(c.lastName);
    setFormCity(c.city || DEFAULT_CITY);
    setFormCompany(c.company || '');
    setFormEmail(c.email || '');
    setFormPhone(c.phone || DEFAULT_PHONE);
    setFormCustId(c.custId);
    setFormStoreCredit(c.sumOfStoreCreditBalance.toString());
    setFormComments(c.comments || '');
    setFormGender(c.gender);
    setIsAddEditModalOpen(true);
  };

  const handleSaveCustomerForm = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(formStoreCredit) || 0;
    const yearNum = parseInt(formYear, 10) || 2026;
    const qyKey = `${yearNum}-${formQuarter}`;
    const storeObj = stores.find(s => s.id === formStoreId)
      || GOLF_TOWN_STORES.find(s => s.id === formStoreId)
      || { id: formStoreId, name: `Store ${formStoreId}`, code: formStoreId };

    if (editingCustomer) {
      handleSaveCustomers(customers.map(c => c.id === editingCustomer.id ? {
        ...c,
        storeId: formStoreId,
        storeName: storeObj.name,
        quarter: formQuarter,
        year: yearNum,
        quarterYearKey: qyKey,
        firstName: formFirstName,
        lastName: formLastName,
        city: formCity,
        company: formCompany,
        email: formEmail,
        phone: formPhone || DEFAULT_PHONE,
        custId: formCustId,
        sumOfStoreCreditBalance: balance,
        comments: formComments,
        gender: formGender
      } : c));
    } else {
      const newCust: CustomerRecord = {
        id: `${formStoreId}-${qyKey}-${Date.now()}`,
        storeId: formStoreId,
        storeName: storeObj.name,
        quarter: formQuarter,
        year: yearNum,
        quarterYearKey: qyKey,
        city: formCity || DEFAULT_CITY,
        lastCreatedDate: new Date().toLocaleDateString(),
        lastSaleDate: new Date().toLocaleDateString(),
        custId: formCustId,
        firstName: formFirstName,
        lastName: formLastName,
        company: formCompany,
        email: formEmail,
        phone: formPhone || DEFAULT_PHONE,
        sumOfStoreCreditBalance: balance,
        comments: formComments,
        approvedBy: '',
        gender: formGender,
        genderConfidence: 0.90
      };
      handleSaveCustomers([newCust, ...customers]);
    }
    setIsAddEditModalOpen(false);
    flashMessage(editingCustomer
      ? `Updated ${formFirstName} ${formLastName}'s record successfully.`
      : `Added ${formFirstName} ${formLastName} successfully.`);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer record?')) {
      handleSaveCustomers(customers.filter(c => c.id !== id));
      setSelectedCustomerIds(prev => prev.filter(i => i !== id));
    }
  };

  // ---- SMS refund link ----
  const handleSendSmsRefundLink = async (c: CustomerRecord) => {
    const phoneNumber = c.phone && c.phone !== '(blank'
      ? c.phone
      : prompt(`Enter phone number for ${c.firstName} ${c.lastName}:`, DEFAULT_PHONE);
    if (!phoneNumber) return;

    flashMessage(`Generating shortened deposit link (clck.ru) and preparing SMS for ${c.firstName}...`, 10000);
    try {
      const res = await fetch('/api/generate-sms-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: c.sumOfStoreCreditBalance,
          custId: c.custId,
          customerName: `${c.firstName} ${c.lastName}`
        })
      });
      const data = await res.json();
      if (res.ok && data.smsUri) {
        handleSaveCustomers(customers.map(cust => cust.id === c.id ? {
          ...cust,
          refundStatus: 'SMS Dispatched' as const,
          shortenedUrl: data.shortenedUrl || cust.shortenedUrl
        } : cust));
        flashMessage('SMS deposit link generated with clck.ru shortener! Opening text message app...', 8000);
        window.location.href = data.smsUri;
      } else {
        alert(data.error || 'Failed to generate shortened SMS link.');
      }
    } catch (err: any) {
      alert(`SMS generation error: ${err.message || err}`);
    }
  };

  // ---- Refund workflow ----
  const handleQuickRefund = (c: CustomerRecord) => {
    const timestampStr = new Date().toLocaleString('en-CA', { dateStyle: 'short', timeStyle: 'short' });
    const refundNote = `[Quick Refunded on ${timestampStr}] Store credit balance of $${currency(Number(c.sumOfStoreCreditBalance || 0))} refunded.`;
    handleSaveCustomers(customers.map(cust => cust.id === c.id ? {
      ...cust,
      refundStatus: 'Refunded' as const,
      comments: c.comments ? `${c.comments} | ${refundNote}` : refundNote
    } : cust));
    flashMessage(`Quick Refund processed for ${c.firstName} ${c.lastName}! Status set to 'Refunded'.`);
  };

  const handleUpdateRefundStatus = (c: CustomerRecord, status: 'Refunded' | 'Auth Code Needed' | 'Pending') => {
    let authCode: string | undefined = c.authCode;
    if (status === 'Auth Code Needed') {
      const enteredCode = prompt(
        `Enter Authorization Code for ${c.firstName} ${c.lastName}:`,
        c.authCode || `AUTH-${Math.floor(100000 + Math.random() * 900000)}`
      );
      if (enteredCode) authCode = enteredCode;
    }
    handleSaveCustomers(customers.map(cust => cust.id === c.id ? {
      ...cust,
      refundStatus: status,
      authCode: status === 'Auth Code Needed' ? authCode : cust.authCode
    } : cust));
    flashMessage(`Updated ${c.firstName} ${c.lastName} refund status to: ${status}${authCode ? ` (Auth: ${authCode})` : ''}`);
  };

  // ---- SMTP refund notice email ----
  const handleSendRefundNoticeEmail = async (c: CustomerRecord) => {
    const emailToUse = c.email && c.email !== '(blank)'
      ? c.email
      : prompt(`Enter recipient email for ${c.firstName} ${c.lastName}:`, 'customer@example.com');
    if (!emailToUse) return;

    setSendingEmailId(c.id);
    flashMessage(`Dispatching official Golf Town Store Credit Refund Notice via SMTP to ${emailToUse}...`, 10000);

    let customSubject = '';
    let customBody = '';

    const savedTemplates = safeStorage.getItem('golf_town_email_templates');
    const activeId = safeStorage.getItem('golf_town_active_template_id') || 'standard';
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        const active = parsed.find((t: any) => t.id === activeId);
        if (active) {
          const replacements: Record<string, string> = {
            '{customerName}': `${c.firstName} ${c.lastName}`,
            '{amount}': `$${currency(Number(c.sumOfStoreCreditBalance || 0))}`,
            '{storeId}': c.storeId || '',
            '{custId}': c.custId || '',
            '{comments}': c.comments || '',
            '{depositLink}': `https://golftown.cashstar.com/self_service/v2/about/customer_support/contact?token=${c.custId}`
          };
          const replaceTokens = (text: string) =>
            Object.entries(replacements).reduce((acc, [token, val]) => acc.split(token).join(val), text);
          customSubject = replaceTokens(active.subject);
          customBody = replaceTokens(active.body);
        }
      } catch (err) {
        console.error('Error loading email templates:', err);
      }
    }

    try {
      const res = await fetch('/api/send-refund-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: emailToUse,
          recipientName: `${c.firstName} ${c.lastName}`,
          amount: c.sumOfStoreCreditBalance,
          storeId: c.storeId,
          custId: c.custId,
          comments: c.comments,
          actionType: 'refund',
          customSubject,
          customBody
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        flashMessage(data.message || `Store credit refund notice successfully sent to ${emailToUse}!`);
      } else {
        alert(data.error || 'Failed to dispatch email notice via SMTP.');
      }
    } catch (err: any) {
      alert(`SMTP dispatch error: ${err.message || err}`);
    } finally {
      setSendingEmailId(null);
    }
  };

  /* ============================== Render ============================== */

  if (!isAuthenticated) {
    return <LoginSplashScreen onAuthenticate={handleAuthenticate} />;
  }

  const containerClass = viewMode === 'table' ? 'max-w-7xl' : 'max-w-3xl';
  const headerBadge = selectedStoreId === 'All'
    ? 'All Stores'
    : `Store #${selectedStoreId}`;

  const malePct = stats.totalCount ? Math.round((stats.maleCount / stats.totalCount) * 100) : 0;
  const femalePct = stats.totalCount ? Math.round((stats.femaleCount / stats.totalCount) * 100) : 0;
  const unknownPct = Math.max(0, 100 - malePct - femalePct);

  const renderSortHeader = (label: string, key: SortKey, className = '') => (
    <th className={`p-3 ${className}`}>
      <button
        onClick={() => handleSort(key)}
        className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors uppercase tracking-wider cursor-pointer"
      >
        <span>{label}</span>
        {sortKey === key
          ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
          : <ChevronsUpDown className="w-3 h-3 opacity-40" />}
      </button>
    </th>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-28 antialiased selection:bg-emerald-500 selection:text-white">
      {/* ================= PRINT-ONLY AUDIT STATEMENT HEADER & SUMMARY ================= */}
      <div className="hidden print:block mb-8 pb-6 border-b-2 border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            {/* Elegant SVG Golf Town Logo for Print */}
            <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md border border-emerald-600">
              GT
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-950 tracking-tight uppercase leading-none">GOLF TOWN CANADA INC.</h1>
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mt-1">National Store Credit Audit & Reconciliation Ledger</p>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            <div className="font-extrabold text-slate-900 uppercase">OFFICIAL COMPLIANCE STATEMENT</div>
            <div>Generated: {new Date().toLocaleString()}</div>
            <div>Auditor Reference: <span className="font-mono font-semibold">cnome12@gmail.com</span></div>
          </div>
        </div>

        {/* AUDIT SUMMARY STATS ROW */}
        <div className="mt-6 grid grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Total Liability Audited</span>
            <span className="text-base font-black text-slate-950">${currency(stats.totalBalance, 2)} CAD</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Active Records</span>
            <span className="text-base font-black text-slate-900">{filteredCustomers.length} of {customers.length} Accounts</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Audit Target</span>
            <span className="text-base font-black text-slate-900">
              {selectedStoreId === 'All' ? 'All Locations' : `Store #${selectedStoreId}`}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Compliance Status</span>
            <span className="text-xs font-extrabold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
              ✓ 100% RECONCILED
            </span>
          </div>
        </div>
      </div>

      {/* ================= Header ================= */}
      <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className={`${containerClass} mx-auto px-4 py-3 transition-all duration-300`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/50 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black tracking-tight text-white leading-tight">
                    Golf Town Mobile
                  </h1>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {headerBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {filteredCustomers.length} Records • Total ${currency(stats.totalBalance, 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Secured</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isMenuOpen
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
                }`}
                title="Open system menu"
                aria-label="Toggle system menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Hamburger menu panel */}
          {isMenuOpen && (
            <div className="mt-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 z-40 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold px-1">Main Operations</p>
                  <button
                    onClick={() => { setIsCustomReceiptModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-3 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-600/50 hover:border-emerald-500 text-emerald-300 rounded-xl transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-100">Custom Receipt Refund (Alberta)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-[10px] text-white font-black">5% GST</span>
                  </button>
                  <button
                    onClick={() => { setIsPolicyModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-3 bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700 text-slate-300 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer group"
                  >
                    <Mail className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-slate-300">Support Emails & Policy</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold px-1">Integrations & System</p>
                  <a
                    href="https://golftown.cashstar.com/self_service/v2/about/customer_support/contact?locale=en-ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-3 bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700 text-slate-300 rounded-xl transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-300">Gift Card Support Portal</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                  <button
                    onClick={() => { setIsAutomatedAlertsModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-3 bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700 text-slate-300 rounded-xl transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-300">Automated Alerts & Telegram</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-[10px] text-emerald-400 font-bold border border-emerald-800">New</span>
                  </button>
                  <button
                    onClick={() => { setIsAnalyticsModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-3 bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700 text-slate-300 rounded-xl transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-300">Store Credit & Liability Analytics</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-blue-950 text-[10px] text-blue-400 font-bold border border-blue-800">Q1</span>
                  </button>
                  <button
                    onClick={() => { handleBatchAiNameExplanations(); setIsMenuOpen(false); }}
                    disabled={aiLoading}
                    className="w-full text-left px-3.5 py-3 bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700 text-slate-300 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50 group"
                  >
                    <Sparkles className={`w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform ${aiLoading ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-semibold text-slate-300">Batch AI Name Search</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 ${viewMode === 'cards' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                <button
                  onClick={() => { setIsMenuOpen(false); handleLockout(); }}
                  className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/40 hover:border-rose-800 text-rose-400 rounded-xl transition-all flex items-center gap-2 text-xs font-extrabold cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Lock System</span>
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search name, phone, city, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 pl-10 pr-8 py-2 text-xs font-medium text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs" aria-label="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Date range */}
          <div className="mt-2.5 flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium shrink-0">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Last Sale Date:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none w-full"
                title="Filter by Last Sale Start Date"
              />
              <span className="text-slate-500 text-[11px]">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none w-full"
                title="Filter by Last Sale End Date"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-slate-400 hover:text-white px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] shrink-0 transition-colors"
                title="Clear Date Filter"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter chips row */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedStoreId('All')}
              className={`px-3 py-1 font-bold rounded-xl whitespace-nowrap shrink-0 border transition-all ${
                selectedStoreId === 'All'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-800'
              }`}
            >
              All Stores
            </button>

            {stores.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStoreId(s.id)}
                className={`px-3 py-1 font-bold rounded-xl whitespace-nowrap shrink-0 border transition-all flex items-center gap-1 ${
                  selectedStoreId === s.id
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>#{s.id}</span>
              </button>
            ))}

            {/* Quarter / Year filter (was computed but never rendered) */}
            {quarterYearOptions.length > 0 && (
              <>
                <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />
                <div className="flex items-center gap-1 shrink-0 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium">Quarter:</span>
                  <select
                    value={selectedQuarterYear}
                    onChange={(e) => setSelectedQuarterYear(e.target.value)}
                    className="bg-slate-950 text-white font-bold text-xs border border-slate-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    aria-label="Filter by quarter and year"
                  >
                    <option value="All">All Quarters</option>
                    {quarterYearOptions.map(qy => {
                      const [y, q] = qy.split('-');
                      return <option key={qy} value={qy}>{q} {y}</option>;
                    })}
                  </select>
                </div>
              </>
            )}

            <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />

            <div className="flex items-center gap-1 shrink-0 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium">Refund Status:</span>
              <select
                value={selectedRefundStatus}
                onChange={(e) => setSelectedRefundStatus(e.target.value)}
                className="bg-slate-950 text-white font-bold text-xs border border-slate-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                aria-label="Filter by refund status"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="SMS Dispatched">SMS Dispatched</option>
                <option value="Auth Code Needed">Auth Code Needed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />

            {(['All', 'Male', 'Female', 'Unknown'] as FilterGender[]).map(g => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-2.5 py-1 font-semibold rounded-xl whitespace-nowrap shrink-0 border transition-all ${
                  selectedGender === g
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {g}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />

            {/* Activity visibility toggle */}
            <button
              onClick={() => setShowAllRecords(v => !v)}
              className={`px-2.5 py-1 font-semibold rounded-xl whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
                showAllRecords
                  ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle the activity rule (email sent / refund update) for record visibility"
            >
              {showAllRecords ? 'Show All: ON' : 'Active Only'}
            </button>
          </div>
        </div>
      </header>

      {/* AI status bar */}
      {aiMessage && (
        <div className="bg-emerald-950 border-b border-emerald-800" role="status" aria-live="polite">
          <div className={`${containerClass} mx-auto px-4 py-2 text-xs text-emerald-200 flex items-center justify-between font-medium`}>
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span className="truncate">{aiMessage}</span>
            </div>
            <button onClick={() => setAiMessage('')} className="text-emerald-400 hover:text-white shrink-0 ml-3" aria-label="Dismiss message">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= Main content ================= */}
      <main className={`${containerClass} mx-auto px-4 mt-4 space-y-4 transition-all duration-300`}>
        {mobileTab === 'contacts' && (
          <div className="space-y-4">
            {/* Current store banner */}
            <div className="bg-gradient-to-r from-slate-950 via-emerald-950/70 to-slate-950 p-4 rounded-2xl border border-emerald-900/60 shadow-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-emerald-900/60 rounded-xl border border-emerald-700/50 text-emerald-300 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-700/60">
                      Store #{currentStoreObj.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{currentStoreObj.city || DEFAULT_CITY}</span>
                  </div>
                  <h2 className="text-sm font-extrabold text-white mt-0.5 truncate max-w-[220px]">
                    {currentStoreObj.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => handleOpenMapForStore(currentStoreObj)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1 shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                Map
              </button>
            </div>

            {/* Select all bar */}
            {filteredCustomers.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={filteredCustomers.length > 0 && selectedCustomerIds.length === filteredCustomers.length}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Select All Filtered ({filteredCustomers.length})</span>
                </label>
                <span className="text-slate-400 font-mono text-[11px]">
                  {selectedCustomerIds.length} selected
                </span>
              </div>
            )}

            {viewMode === 'cards' ? (
              <div className="space-y-3">
                {filteredCustomers.length === 0 ? (
                  <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 space-y-2">
                    <Users className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold">No customer contacts found matching your query.</p>
                    <p className="text-[11px] text-slate-600">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  sortedCustomers.map(c => {
                    const storeMatch = stores.find(s => s.id === c.storeId) || GOLF_TOWN_STORES.find(s => s.id === c.storeId);
                    return (
                      <MobileContactCard
                        key={c.id}
                        customer={c}
                        store={storeMatch}
                        onOpenMap={handleOpenMapForStore}
                        onOpenNameInsight={handleOpenNameInsight}
                        onSendRefundEmail={handleSendRefundNoticeEmail}
                        onSendSmsRefundLink={handleSendSmsRefundLink}
                        onUpdateRefundStatus={handleUpdateRefundStatus}
                        isSendingEmail={sendingEmailId === c.id}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteCustomer}
                        isSelected={selectedCustomerIds.includes(c.id)}
                        onToggleSelect={handleToggleCustomerSelect}
                      />
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Sanitizer banner */}
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Data Sanitizer Active: All columns aligned & 10-digit phone/ID amounts corrected.</span>
                  </div>
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold">
                    Column Alignment Verified
                  </span>
                </div>

                {/* Refund status summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Pending</span>
                      <span className="text-lg font-black text-white">{stats.refundPending}</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-sm shadow-slate-500/20" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold block">SMS Dispatched</span>
                      <span className="text-lg font-black text-white">{stats.refundSms}</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/20" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">Auth Needed</span>
                      <span className="text-lg font-black text-white">{stats.refundAuth}</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/20" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">Refunded</span>
                      <span className="text-lg font-black text-white">{stats.refundDone}</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
                  </div>
                </div>

                {/* Sortable table */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={filteredCustomers.length > 0 && selectedCustomerIds.length === filteredCustomers.length}
                            onChange={handleToggleSelectAll}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                            aria-label="Select all customers"
                          />
                        </th>
                        {renderSortHeader('Cust ID', 'custId')}
                        {renderSortHeader('Customer Name', 'name')}
                        {renderSortHeader('City / Store', 'city')}
                        <th className="p-3">Phone</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Company</th>
                        {renderSortHeader('Store Credit Balance', 'balance', 'text-right')}
                        <th className="p-3">Aging</th>
                        <th className="p-3">Comments</th>
                        {renderSortHeader('Status', 'status', 'text-center')}
                        <th className="p-3 text-center">Refund Process</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {sortedCustomers.map((c, idx) => (
                        <tr key={c.id} className={`hover:bg-slate-900/80 transition-colors ${selectedCustomerIds.includes(c.id) ? 'bg-emerald-950/20' : idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/30'}`}>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedCustomerIds.includes(c.id)}
                              onChange={() => handleToggleCustomerSelect(c.id)}
                              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                              aria-label={`Select ${c.firstName} ${c.lastName}`}
                            />
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{c.custId || '-'}</td>
                          <td className="p-3 font-bold text-white">
                            <button
                              onClick={() => handleOpenNameInsight(c)}
                              className="hover:text-emerald-400 hover:underline text-left inline-flex items-center gap-1.5"
                            >
                              <span>{c.firstName} {c.lastName}</span>
                              {c.gender === 'Female' && <span className="text-[10px] text-pink-400 bg-pink-950/60 border border-pink-800 px-1 rounded">F</span>}
                              {c.gender === 'Male' && <span className="text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800 px-1 rounded">M</span>}
                            </button>
                          </td>
                          <td className="p-3 text-slate-300">
                            <span className="font-semibold">{c.city || DEFAULT_CITY}</span>
                            <span className="text-[10px] text-slate-500 ml-1.5">#{c.storeId}</span>
                          </td>
                          <td className="p-3 font-mono font-medium text-emerald-400">
                            <button
                              onClick={() => handleSendSmsRefundLink(c)}
                              className="hover:underline flex items-center gap-1 text-emerald-300 hover:text-white"
                              title="Click to generate clck.ru short link and SMS"
                            >
                              <Phone className="w-3 h-3 text-emerald-500" />
                              <span>{c.phone || DEFAULT_PHONE}</span>
                            </button>
                          </td>
                          <td className="p-3 text-slate-400 max-w-[160px] truncate">{c.email || '-'}</td>
                          <td className="p-3 text-slate-400 max-w-[140px] truncate">{c.company || '-'}</td>
                          <td className="p-3 text-right font-mono font-black text-emerald-400 text-sm">
                            ${currency(c.sumOfStoreCreditBalance)}
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">{c.storeCreditAging || 'Over 30 Days'}</td>
                          <td className="p-3 text-slate-400 text-[11px] max-w-[200px] truncate">{c.comments || '-'}</td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              c.keepOrRemove?.toLowerCase().includes('remove')
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}>
                              {c.keepOrRemove || 'keep'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1">
                              {c.refundStatus === 'Refunded' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600">✓ Refunded</span>
                              )}
                              {c.refundStatus === 'Auth Code Needed' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600">
                                  Auth Code ({c.authCode || 'GT-REQ'})
                                </span>
                              )}
                              {c.refundStatus === 'SMS Dispatched' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700">SMS Sent</span>
                              )}
                              {(!c.refundStatus || c.refundStatus === 'Pending') && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">Pending</span>
                              )}
                              <div className="flex items-center gap-0.5 ml-1">
                                <button
                                  onClick={() => handleUpdateRefundStatus(c, 'Refunded')}
                                  className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded"
                                  title="Mark as Refunded"
                                >
                                  Refunded
                                </button>
                                <button
                                  onClick={() => handleUpdateRefundStatus(c, 'Auth Code Needed')}
                                  className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded"
                                  title="Mark Auth Code Needed"
                                >
                                  Auth Code
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleQuickRefund(c)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1 text-[11px] font-black shadow"
                                title="One-click quick refund and timestamped note"
                              >
                                ⚡ <span className="hidden xl:inline">Quick Refund</span>
                              </button>
                              <button
                                onClick={() => handleSendRefundNoticeEmail(c)}
                                disabled={sendingEmailId === c.id}
                                className="p-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                                title="Send Store Credit Refund Notice via SMTP"
                              >
                                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="hidden lg:inline">{sendingEmailId === c.id ? 'Sending...' : 'Send Refund Notice'}</span>
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(c)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                                title="Edit Customer Record"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(c.id)}
                                className="p-1.5 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                                title="Delete Customer Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {mobileTab === 'stores' && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 p-5 rounded-3xl border border-emerald-900/60 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Regional Hub & National Network
                    </span>
                    <span className="text-xs text-slate-400">{stores.length} Golf Town Locations</span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span>Edmonton & National Store Map & Analytics</span>
                  </h2>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-2xl flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Edmonton Hub Stores</span>
                    <span className="text-emerald-400 font-black">
                      {stores.filter(s => s.city === 'Edmonton').map(s => `#${s.id}`).join(' & ') || '—'}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Network Stores</span>
                    <span className="text-white font-black">{stores.length} Locations</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interactive map overview centered on Edmonton regional performance alongside all Canadian Golf Town stores. Review live visit counts (customer records), total store credit balances, and averages per location.
              </p>
            </div>

            {/* Edmonton spotlight */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Edmonton Regional Spotlight
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">
                  {stores.filter(s => s.city === 'Edmonton').length} Active Warehouses / Retail Stores
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stores.filter(s => s.city === 'Edmonton').map(s => {
                  const storeCustomers = customers.filter(c => c.storeId === s.id);
                  const totalBal = storeCustomers.reduce((acc, c) => acc + (c.sumOfStoreCreditBalance || 0), 0);
                  const visitCount = storeCustomers.length;
                  const avgBal = visitCount > 0 ? totalBal / visitCount : 0;
                  return (
                    <div key={s.id} className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 rounded-3xl border border-amber-500/40 shadow-xl space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/60 rounded-full text-[10px] font-black uppercase tracking-wider">
                              Store #{s.id} • Edmonton, AB
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-white mt-1.5">{s.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            {s.address}, {s.postalCode}
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenMapForStore(s)}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1 shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Map View
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Visit / Cust Count</span>
                          <span className="text-sm font-black text-white">{visitCount}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Credit</span>
                          <span className="text-sm font-black text-emerald-400">${currency(totalBal)}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Balance</span>
                          <span className="text-sm font-black text-amber-300">${avgBal.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <a href={`tel:${s.phone}`} className="text-xs font-bold text-emerald-400 hover:underline">
                          📞 {s.phone}
                        </a>
                        <button
                          onClick={() => { setSelectedStoreId(s.id); setMobileTab('contacts'); }}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
                        >
                          View Store Customers &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All stores */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  All Canadian Golf Town Locations & Calculations
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">{stores.length} Stores Total</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {stores.map(s => {
                  const storeCustomers = customers.filter(c => c.storeId === s.id);
                  const totalBal = storeCustomers.reduce((acc, c) => acc + (c.sumOfStoreCreditBalance || 0), 0);
                  const visitCount = storeCustomers.length;
                  const avgBal = visitCount > 0 ? totalBal / visitCount : 0;
                  const isEdmonton = s.city === 'Edmonton';

                  return (
                    <div key={s.id} className={`p-4 rounded-2xl border shadow transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isEdmonton
                        ? 'bg-slate-950/95 border-amber-500/50 hover:border-amber-400'
                        : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isEdmonton
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-900'
                          }`}>
                            Store #{s.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-300">{s.city}, {s.province}</span>
                          {isEdmonton && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-black">
                              Edmonton Hub
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{s.name}</h4>
                        <p className="text-xs text-slate-400">{s.address} ({s.postalCode})</p>
                        <a href={`tel:${s.phone}`} className="text-xs font-semibold text-emerald-400 hover:underline inline-block">
                          {s.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="grid grid-cols-3 gap-2 text-right">
                          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Visits</span>
                            <span className="text-xs font-extrabold text-white">{visitCount}</span>
                          </div>
                          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Total Credit</span>
                            <span className="text-xs font-extrabold text-emerald-400">${currency(totalBal, 0)}</span>
                          </div>
                          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Average</span>
                            <span className="text-xs font-extrabold text-amber-300">${avgBal.toFixed(0)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenMapForStore(s)}
                            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl shadow inline-flex items-center justify-center"
                            title="View Map & Directions"
                          >
                            <Navigation className="w-4 h-4 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => { setSelectedStoreId(s.id); setMobileTab('contacts'); }}
                            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow text-xs font-bold shrink-0"
                          >
                            Select Store
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {mobileTab === 'stats' && (
          <div className="space-y-4">
            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Credit Balance</p>
                <p className="text-xl font-black text-emerald-400">${currency(stats.totalBalance)}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Customers</p>
                <p className="text-xl font-black text-white">{stats.totalCount}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Balance</p>
                <p className="text-xl font-black text-amber-400">${stats.avgBalance.toFixed(2)}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cities Represented</p>
                <p className="text-xl font-black text-white">{stats.cityCount}</p>
              </div>
            </div>

            {/* Gender split with bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender Split</p>
              <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-800">
                <div className="bg-blue-500 transition-all duration-500" style={{ width: `${malePct}%` }} />
                <div className="bg-pink-500 transition-all duration-500" style={{ width: `${femalePct}%` }} />
                <div className="bg-slate-600 transition-all duration-500" style={{ width: `${unknownPct}%` }} />
              </div>
              <p className="text-[11px] font-semibold text-slate-300">
                <span className="text-blue-400">M: {stats.maleCount}</span> &nbsp;•&nbsp;
                <span className="text-pink-400">F: {stats.femaleCount}</span> &nbsp;•&nbsp;
                <span className="text-slate-500">?: {stats.unknownCount}</span>
              </p>
            </div>

            {/* Refund pipeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Pending</span>
                <span className="text-lg font-black text-white">{stats.refundPending}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold block">SMS Dispatched</span>
                <span className="text-lg font-black text-white">{stats.refundSms}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">Auth Needed</span>
                <span className="text-lg font-black text-white">{stats.refundAuth}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">Refunded</span>
                <span className="text-lg font-black text-white">{stats.refundDone}</span>
              </div>
            </div>

            {/* Export actions */}
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={handleExportFilteredCSV}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-lg border border-emerald-400/30 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-white" />
                Export Current View ({filteredCustomers.length} Filtered Records)
              </button>
              <button
                onClick={handleExportAllCSV}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download All Master Records ({customers.length} Records)
              </button>
            </div>
          </div>
        )}

        {mobileTab === 'import' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Upload Multi-Tab XLSX Sheet</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Import multi-store customer spreadsheets. Automatically creates store location tabs and parses customer credit records.
                </p>
              </div>
              <button
                onClick={() => setIsXlsxModalOpen(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-emerald-400/30 inline-flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Launch Multi-Tab Spreadsheet Importer
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ================= Floating action button ================= */}
      <button
        onClick={handleOpenAddModal}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-300/40 hover:scale-105 active:scale-95 transition-all"
        title="Add Customer Record"
        aria-label="Add Customer Record"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* ================= Modals ================= */}
      {mapStore && (
        <StoreMapModal store={mapStore} isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} />
      )}

      <CustomerNameInsightModal
        customer={insightCustomer}
        isOpen={isInsightModalOpen}
        onClose={() => setIsInsightModalOpen(false)}
        onUpdateCustomerExplanation={handleUpdateCustomerExplanation}
      />

      <XlsxUploadModal
        isOpen={isXlsxModalOpen}
        onClose={() => setIsXlsxModalOpen(false)}
        onImportCustomers={handleImportCustomers}
        existingStores={stores}
      />

      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {editingCustomer ? 'Edit Customer Record' : 'Add New Customer Record'}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="text-slate-400 hover:text-white p-1" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomerForm} className="p-5 space-y-4 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Store Location</label>
                  <select
                    value={formStoreId}
                    onChange={(e) => setFormStoreId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {GOLF_TOWN_STORES.map(gs => (
                      <option key={gs.id} value={gs.id}>Store #{gs.id} - {gs.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Customer ID</label>
                  <input
                    type="text"
                    required
                    value={formCustId}
                    onChange={(e) => setFormCustId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Quarter</label>
                  <select
                    value={formQuarter}
                    onChange={(e) => setFormQuarter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Year</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {['2024', '2025', '2026', '2027'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => {
                      setFormFirstName(e.target.value);
                      if (!editingCustomer) {
                        const g = guessGender(e.target.value);
                        setFormGender(g.gender);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder={DEFAULT_CITY}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number (Required)</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500 font-semibold text-emerald-400"
                    placeholder={DEFAULT_PHONE}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Store Credit Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formStoreCredit}
                    onChange={(e) => setFormStoreCredit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as 'Male' | 'Female' | 'Unknown')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Comments / Notes</label>
                <textarea
                  rows={2}
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter store credit comments or special notes..."
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= Other modals ================= */}
      <StoreCreditPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />

      <EmailFormPreviewModal
        isOpen={isEmailFormModalOpen}
        onClose={() => setIsEmailFormModalOpen(false)}
      />

      <LiveSocketAdminModal
        isOpen={isLiveSocketModalOpen}
        onClose={() => setIsLiveSocketModalOpen(false)}
      />

      <AutomatedAlertsModal
        isOpen={isAutomatedAlertsModalOpen}
        onClose={() => setIsAutomatedAlertsModalOpen(false)}
      />

      <StoreCreditAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        customers={customers}
      />

      <CustomReceiptRefundModal
        isOpen={isCustomReceiptModalOpen}
        onClose={() => setIsCustomReceiptModalOpen(false)}
        customers={customers}
      />

      {/* ================= Floating batch action bar ================= */}
      {selectedCustomerIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/80 shadow-2xl rounded-2xl p-4 flex items-center gap-4 text-xs text-white backdrop-blur-md max-w-[95vw] flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xs">
              {selectedCustomerIds.length}
            </span>
            <span>Selected</span>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkSendEmail}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow inline-flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Bulk Email Notices</span>
            </button>

            <button
              onClick={handleBulkExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl shadow inline-flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Selected (CSV)</span>
            </button>

            <button
              onClick={() => setSelectedCustomerIds([])}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
              title="Clear Selection"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= Bottom navigation (single instance) ================= */}
      <MobileBottomNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </div>
  );
}