import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Eye, 
  Download, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  LogOut, 
  RefreshCw, 
  Plus, 
  Save, 
  X, 
  CreditCard,
  Check,
  ShieldCheck,
  MessageSquare,
  Settings,
  Layers,
  Image as GalleryIcon,
  MessageCircleQuestion,
  Star
} from 'lucide-react';
import { AdminAppointmentSummary, AdminAppointmentDetail, BookingStatus, PaymentStatus } from '../types';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { AdminServicesTab } from '../components/admin/AdminServicesTab';
import { AdminGalleryTab } from '../components/admin/AdminGalleryTab';
import { AdminReviewsTab } from '../components/admin/AdminReviewsTab';
import { AdminFaqsTab } from '../components/admin/AdminFaqsTab';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

export const AdminDashboardPage: React.FC = () => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kiva_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Section Navigation
  const [adminSection, setAdminSection] = useState<
    'appointments' | 'settings' | 'services' | 'gallery' | 'reviews' | 'faqs'
  >('appointments');

  // Dashboard Data State
  const [appointments, setAppointments] = useState<AdminAppointmentSummary[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AdminAppointmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Detail Modal State
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);
  const [apptDetail, setApptDetail] = useState<AdminAppointmentDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Edit / Action State inside Modal
  const [editStatus, setEditStatus] = useState<BookingStatus>('NEW');
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('PENDING_VERIFICATION');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editVideoLink, setEditVideoLink] = useState('');
  const [statusChangeNote, setStatusChangeNote] = useState('');
  const [newAdminNote, setNewAdminNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Screenshot viewer modal
  const [viewingFileId, setViewingFileId] = useState<{ id: string; name: string; mime: string } | null>(null);

  // Fetch appointments on login or refresh
  useEffect(() => {
    if (token) {
      loadAppointments();
    }
  }, [token]);

  // Filter effect
  useEffect(() => {
    let list = [...appointments];
    if (statusFilter !== 'ALL') {
      list = list.filter((a) => a.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.full_name.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    }
    setFilteredAppointments(list);
  }, [appointments, statusFilter, searchQuery]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('kiva_admin_token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kiva_admin_token');
    setToken(null);
    setAppointments([]);
    setSelectedApptId(null);
  };

  const loadAppointments = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openAppointmentDetail = async (id: string) => {
    setSelectedApptId(id);
    setIsLoadingDetail(true);
    setActionSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: AdminAppointmentDetail = await res.json();
      setApptDetail(data);
      setEditStatus(data.appointment.status);
      setEditPaymentStatus(data.payment?.status || 'PENDING_VERIFICATION');
      setEditDate(data.appointment.confirmed_date || '');
      setEditTime(data.appointment.confirmed_time || '');
      setEditVideoLink(data.appointment.video_link || '');
      setStatusChangeNote('');
    } catch (err) {
      console.error('Failed to fetch appointment detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleUpdateAppointment = async () => {
    if (!selectedApptId || !token) return;
    setIsSaving(true);
    setActionSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/appointments/${selectedApptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editStatus,
          paymentStatus: editPaymentStatus,
          confirmedDate: editDate.trim() || null,
          confirmedTime: editTime.trim() || null,
          videoLink: editVideoLink.trim() || null,
          note: statusChangeNote.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update appointment');
      }

      setActionSuccessMsg('Appointment details updated successfully.');
      loadAppointments();
      // Reload current detail
      openAppointmentDetail(selectedApptId);
    } catch (err: any) {
      alert(err.message || 'Error updating appointment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminNote.trim() || !selectedApptId || !token) return;

    try {
      const res = await fetch(`/api/admin/appointments/${selectedApptId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ noteText: newAdminNote.trim() }),
      });

      if (res.ok) {
        setNewAdminNote('');
        openAppointmentDetail(selectedApptId);
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  // Helper to get authorized file download url
  const viewFile = (fileId: string, name: string, mime: string) => {
    setViewingFileId({ id: fileId, name, mime });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs">Confirmed</span>;
      case 'PAYMENT VERIFICATION':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full text-xs">Payment Verification</span>;
      case 'RESCHEDULED':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-2.5 py-0.5 rounded-full text-xs">Rescheduled</span>;
      case 'COMPLETED':
        return <span className="bg-slate-200 text-slate-800 border border-slate-300 font-bold px-2.5 py-0.5 rounded-full text-xs">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2.5 py-0.5 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-xs">New</span>;
    }
  };

  // LOGIN SCREEN
  if (!token) {
    const adminCanonical = getCanonicalUrl('/admin');
    const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center px-4">
        <Helmet>
          <title>Clinic Admin Login | Kiva Physiotherapy Clinic</title>
          <meta name="title" content="Clinic Admin Login | Kiva Physiotherapy Clinic" />
          <meta name="description" content="Administrative portal login for clinic staff and management." />
          <link rel="canonical" href={adminCanonical} />
          <meta name="robots" content="noindex, nofollow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Clinic Admin Login | Kiva Physiotherapy Clinic" />
          <meta property="og:description" content="Administrative portal login for clinic staff and management." />
          <meta property="og:url" content={adminCanonical} />
          <meta property="og:image" content={ogImageUrl} />
          <meta name="twitter:card" content="summary" />
        </Helmet>
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden aspect-square shrink-0 border-2 border-teal-600/30 shadow-md">
              <img
                src="/kiva-logo.svg"
                alt="Kiva Physiotherapy Clinic Logo"
                className="w-full h-full object-contain aspect-square block"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Clinic Admin Portal</h1>
            <p className="text-xs text-slate-500">
              Kiva Physiotherapy Clinic • Authorized Staff Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              {isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Helper button for Demo evaluation */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Demo Credentials</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Click below to autofill the default demonstration password:
            </p>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('kiva-clinic-2026');
              }}
              className="w-full py-1.5 bg-white border border-teal-300 hover:bg-teal-100/50 rounded-lg text-teal-800 font-semibold text-xs transition-colors"
            >
              Autofill: admin / kiva-clinic-2026
            </button>
          </div>

        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  const adminCanonical = getCanonicalUrl('/admin');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      <Helmet>
        <title>Staff Administration Portal | Kiva Physiotherapy Clinic</title>
        <meta name="title" content="Staff Administration Portal | Kiva Physiotherapy Clinic" />
        <meta name="description" content="Internal clinical administration portal for Kiva Physiotherapy Clinic staff." />
        <link rel="canonical" href={adminCanonical} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Staff Administration Portal | Kiva Physiotherapy Clinic" />
        <meta property="og:description" content="Internal clinical administration portal for Kiva Physiotherapy Clinic staff." />
        <meta property="og:url" content={adminCanonical} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      
      {/* Admin Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden aspect-square shrink-0 border border-slate-200 shadow-xs">
              <img
                src="/kiva-logo.svg"
                alt="Kiva Logo"
                className="w-full h-full object-contain aspect-square block"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Clinic Management & Content Portal
              </h1>
              <p className="text-[11px] text-slate-500">
                Logged in as <strong className="text-teal-800">{username}</strong> • Kiva Physiotherapy Clinic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminSection === 'appointments' && (
              <button
                onClick={loadAppointments}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-rose-50 hover:text-rose-700 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setAdminSection('appointments')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              adminSection === 'appointments'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setAdminSection('settings')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              adminSection === 'settings'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Clinic Settings</span>
          </button>

          <button
            onClick={() => setAdminSection('services')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              adminSection === 'services'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services CMS</span>
          </button>

          <button
            onClick={() => setAdminSection('gallery')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              adminSection === 'gallery'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GalleryIcon className="w-4 h-4" />
            <span>Gallery CMS</span>
          </button>

          <button
            onClick={() => setAdminSection('reviews')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              adminSection === 'reviews'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Patient Reviews</span>
          </button>

          <button
            onClick={() => setAdminSection('faqs')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              adminSection === 'faqs'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageCircleQuestion className="w-4 h-4" />
            <span>FAQs CMS</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Dynamic Section Switcher */}
        {adminSection === 'settings' && <AdminSettingsTab token={token} />}
        {adminSection === 'services' && <AdminServicesTab token={token} />}
        {adminSection === 'gallery' && <AdminGalleryTab token={token} />}
        {adminSection === 'reviews' && <AdminReviewsTab token={token} />}
        {adminSection === 'faqs' && <AdminFaqsTab token={token} />}

        {adminSection === 'appointments' && (
          <div className="space-y-6">
            {/* KPI / Metric Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block uppercase">Total Requests</span>
            <span className="text-2xl font-extrabold text-slate-900">{appointments.length}</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-amber-600 font-semibold block uppercase">Payment Verification</span>
            <span className="text-2xl font-extrabold text-amber-600">
              {appointments.filter((a) => a.status === 'PAYMENT VERIFICATION').length}
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-emerald-700 font-semibold block uppercase">Confirmed Consultations</span>
            <span className="text-2xl font-extrabold text-emerald-700">
              {appointments.filter((a) => a.status === 'CONFIRMED').length}
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-teal-700 font-semibold block uppercase">Fee Received</span>
            <span className="text-2xl font-extrabold text-teal-800">
              ₹{appointments.filter((a) => a.payment_status === 'VERIFIED').length * 500}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Patient Name, Phone, Email, or Request ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['ALL', 'PAYMENT VERIFICATION', 'NEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>

        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Patient Name & Age</th>
                  <th className="py-3.5 px-4">Contact (WhatsApp)</th>
                  <th className="py-3.5 px-4">Pain Level</th>
                  <th className="py-3.5 px-4">Preferred Slot</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      {isLoading ? 'Loading appointment records...' : 'No appointments matching your search/filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-900">
                        {appt.id}
                        {appt.is_demo === 1 && (
                          <span className="block text-[10px] font-sans font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded mt-0.5 w-max">
                            Demo
                          </span>
                        )}
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{appt.full_name}</span>
                        <span className="text-xs text-slate-500">{appt.age} yrs • {appt.gender}</span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <a
                          href={`https://wa.me/91${appt.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{appt.phone}</span>
                        </a>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                          {appt.email}
                        </span>
                      </td>

                      {/* Pain */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          appt.pain_level <= 3
                            ? 'bg-teal-50 text-teal-800'
                            : appt.pain_level <= 6
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-rose-800'
                        }`}>
                          Level {appt.pain_level}/10
                        </span>
                      </td>

                      {/* Preferred slot */}
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {appt.preferred_time}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          appt.payment_status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {appt.payment_status === 'VERIFIED' ? 'Verified (₹500)' : 'Pending Verification'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(appt.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openAppointmentDetail(appt.id)}
                          className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Review & Schedule
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

      </div>

      {/* DETAILED APPOINTMENT DRAWER / MODAL */}
      {selectedApptId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl h-full sm:h-[95vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-teal-900">{selectedApptId}</span>
                  {apptDetail?.appointment.is_demo === 1 && (
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      [DEMO DATA - CLINIC PREVIEW]
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Detailed Patient Assessment & Clinical Schedule Manager
                </p>
              </div>
              <button
                onClick={() => setSelectedApptId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              {isLoadingDetail ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span>Loading full appointment record...</span>
                </div>
              ) : apptDetail ? (
                <>
                  {actionSuccessMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{actionSuccessMsg}</span>
                    </div>
                  )}

                  {/* Patient Profile Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Patient Profile
                      </span>
                      <a
                        href={`https://wa.me/91${apptDetail.appointment.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Full Name:</span>
                        <strong className="text-slate-900 text-sm font-bold">{apptDetail.appointment.full_name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Age & Gender:</span>
                        <span className="text-slate-800 font-semibold">{apptDetail.appointment.age} yrs • {apptDetail.appointment.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">WhatsApp / Phone:</span>
                        <span className="text-slate-800 font-semibold">{apptDetail.appointment.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Email:</span>
                        <span className="text-slate-800 font-semibold">{apptDetail.appointment.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block">City / Country:</span>
                        <span className="text-slate-800 font-semibold">{apptDetail.appointment.city_country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reported Problem & Pain */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Reported Musculoskeletal Symptoms
                    </span>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                      {apptDetail.appointment.problem_description}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block">Problem Duration:</span>
                        <strong className="text-slate-900">{apptDetail.appointment.problem_duration}</strong>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block">Pain Severity:</span>
                        <strong className="text-slate-900">
                          {apptDetail.appointment.pain_level} / 10
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Medical Reports */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Uploaded Medical Reports
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {apptDetail.medicalReports.length} files provided
                      </span>
                    </div>

                    {apptDetail.medicalReports.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No medical reports uploaded with this request.</p>
                    ) : (
                      <div className="space-y-2">
                        {apptDetail.medicalReports.map((rep) => (
                          <div
                            key={rep.id}
                            className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                              <span className="font-semibold text-slate-800 truncate max-w-xs">{rep.original_name}</span>
                              <span className="text-[10px] text-slate-400">({(rep.file_size / (1024 * 1024)).toFixed(2)} MB)</span>
                            </div>
                            <button
                              onClick={() => viewFile(rep.file_id, rep.original_name, rep.mime_type)}
                              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View File</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment Verification Card */}
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900 block">
                      Payment Verification (₹500 Fee)
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Payment Method:</span>
                        <strong className="text-slate-900">{apptDetail.payment?.method || 'PhonePe / Paytm / GPay'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Clinic Number Paid:</span>
                        <strong className="text-slate-900">9875138912</strong>
                      </div>
                    </div>

                    {/* Screenshot Proof */}
                    {apptDetail.payment?.screenshot_file_id ? (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => viewFile(
                            apptDetail.payment!.screenshot_file_id!,
                            apptDetail.payment?.screenshot_original_name || 'Payment Proof',
                            'image/jpeg'
                          )}
                          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-teal-900 border border-teal-300 font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs"
                        >
                          <CreditCard className="w-4 h-4 text-teal-600" />
                          <span>View Uploaded Payment Proof</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-800 italic">No payment proof uploaded.</p>
                    )}
                  </div>

                  {/* Action Section: Booking Status & Scheduling */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-teal-600 space-y-4 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>Consultation Status & Scheduling</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Booking status */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">Booking Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500/20"
                        >
                          <option value="NEW">NEW</option>
                          <option value="PAYMENT VERIFICATION">PAYMENT VERIFICATION</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="RESCHEDULED">RESCHEDULED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>

                      {/* Payment Status */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">Payment Status</label>
                        <select
                          value={editPaymentStatus}
                          onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500/20"
                        >
                          <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>

                      {/* Confirmed Date */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">Confirmed Date</label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>

                      {/* Confirmed Time */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">Confirmed Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 11:00 AM IST"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>

                      {/* Video Link */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block font-bold text-slate-700">Video Consultation Link</label>
                        <input
                          type="url"
                          placeholder="e.g. https://meet.google.com/xyz-abcd-efg"
                          value={editVideoLink}
                          onChange={(e) => setEditVideoLink(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>

                      {/* Status Change Note */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block font-bold text-slate-700">Change Note (Internal / Log)</label>
                        <input
                          type="text"
                          placeholder="e.g. Payment verified via UPI, appointment scheduled."
                          value={statusChangeNote}
                          onChange={(e) => setStatusChangeNote(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleUpdateAppointment}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Consultation Updates'}</span>
                    </button>
                  </div>

                  {/* Clinical & Administrative Notes Feed */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Admin & Clinical Notes
                    </span>

                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add clinical observation or follow-up note..."
                        value={newAdminNote}
                        onChange={(e) => setNewAdminNote(e.target.value)}
                        className="flex-1 p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500/20"
                      />
                      <button
                        type="submit"
                        className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Add Note
                      </button>
                    </form>

                    <div className="space-y-2 pt-1">
                      {apptDetail.notes.map((n) => (
                        <div key={n.id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span className="font-semibold text-slate-700">{n.author}</span>
                            <span>{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-800">{n.note_text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Log / Status History */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Status History & Audit Log
                    </span>
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      {apptDetail.statusHistory.map((h) => (
                        <div key={h.id} className="flex justify-between py-1 border-b border-slate-200/50">
                          <div>
                            <span className="font-bold text-slate-800">{h.status}</span> — {h.notes}
                          </div>
                          <span className="text-slate-400 shrink-0 ml-2">
                            {new Date(h.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </>
              ) : null}
            </div>

          </div>
        </div>
      )}

      {/* Authenticated File Viewer Modal */}
      {viewingFileId && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800 truncate">
                {viewingFileId.name}
              </span>
              <button
                onClick={() => setViewingFileId(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-2">
              <img
                src={`/api/admin/files/${viewingFileId.id}`}
                alt="File preview"
                className="max-h-[65vh] object-contain rounded"
                onError={(e) => {
                  // If not an image (e.g. PDF), show download button
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="p-6 text-center space-y-2">
                <p className="text-xs text-slate-600">Click below to open or download this file:</p>
                <a
                  href={`/api/admin/files/${viewingFileId.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={viewingFileId.name}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Open File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
