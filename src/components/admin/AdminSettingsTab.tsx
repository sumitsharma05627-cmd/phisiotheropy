import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle2, AlertCircle, Building, Phone, DollarSign, UserCheck, ShieldCheck } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface AdminSettingsTabProps {
  token: string;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ token }) => {
  const { refreshContent } = useClinic();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, [token]);

  const loadSettings = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings || {});
      } else {
        throw new Error(data.error || 'Failed to load settings');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ settings })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setSuccessMsg('Clinic settings saved and updated live across the website!');
      refreshContent();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
        <span>Loading clinic settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clinic Profile & Global Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage clinic identity, consultation fees, payment numbers, and therapist credentials without touching code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadSettings}
            className="p-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Basic Clinic Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
          <Building className="w-4 h-4" />
          <span>1. Clinic Identity & Contact</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Clinic Name</label>
            <input
              type="text"
              value={settings.clinic_name || 'Kiva Physiotherapy Clinic'}
              onChange={(e) => handleChange('clinic_name', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Phone / WhatsApp Number</label>
            <input
              type="text"
              value={settings.phone_number || '9875138912'}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={settings.email_address || 'consult@kivaphysio.com'}
              onChange={(e) => handleChange('email_address', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Opening / Consultation Hours</label>
            <input
              type="text"
              value={settings.opening_hours || 'Monday – Saturday: 9:00 AM – 8:00 PM'}
              onChange={(e) => handleChange('opening_hours', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700">Clinic Address / Base Location</label>
            <input
              type="text"
              value={settings.address || 'Kiva Physiotherapy Clinic, Tele-Rehabilitation Service'}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Fees & Payments */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
          <DollarSign className="w-4 h-4" />
          <span>2. Consultation Fee & UPI Payment Channels</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Standard Consultation Fee (₹)</label>
            <input
              type="number"
              value={settings.consultation_fee || '500'}
              onChange={(e) => handleChange('consultation_fee', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-bold text-teal-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Payment Number (PhonePe/Paytm/GPay)</label>
            <input
              type="text"
              value={settings.payment_number || '9875138912'}
              onChange={(e) => handleChange('payment_number', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Supported Payment Methods</label>
            <input
              type="text"
              value={settings.payment_methods || 'PhonePe, Paytm, Google Pay'}
              onChange={(e) => handleChange('payment_methods', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Meet the Physiotherapist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
          <UserCheck className="w-4 h-4" />
          <span>3. Physiotherapist Profile (Displayed on About & Home)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Therapist Name</label>
            <input
              type="text"
              value={settings.therapist_name || 'Lead Clinical Physiotherapist'}
              onChange={(e) => handleChange('therapist_name', e.target.value)}
              placeholder="e.g. Dr. / Lead Physiotherapist"
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Degree & Qualifications</label>
            <input
              type="text"
              value={settings.therapist_qualification || 'Bachelor / Master of Physiotherapy (PT)'}
              onChange={(e) => handleChange('therapist_qualification', e.target.value)}
              placeholder="e.g. BPT, MPT (Musculoskeletal)"
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Experience Scope</label>
            <input
              type="text"
              value={settings.therapist_experience || 'Clinical Experience in Musculoskeletal & Postural Rehabilitation'}
              onChange={(e) => handleChange('therapist_experience', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Key Specializations</label>
            <input
              type="text"
              value={settings.therapist_specializations || 'Spine Care, Knee & Joint Rehabilitation, Ergonomics'}
              onChange={(e) => handleChange('therapist_specializations', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700">Therapist Profile Photo URL</label>
            <input
              type="url"
              value={settings.therapist_photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
              onChange={(e) => handleChange('therapist_photo', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700">Clinical Bio & Philosophy</label>
            <textarea
              rows={3}
              value={settings.therapist_bio || 'Dedicated to conservative, movement-first rehabilitation. Focusing on functional testing, movement biomechanics, ergonomic coaching, and empowering patients with actionable home exercises.'}
              onChange={(e) => handleChange('therapist_bio', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            ></textarea>
          </div>
        </div>
      </div>

      {/* 4. Homepage Hero Customization */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>4. Hero Headlines & Messaging</span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Hero Headline</label>
            <input
              type="text"
              value={settings.hero_headline || 'Move Better. Recover Better. Live Better.'}
              onChange={(e) => handleChange('hero_headline', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Hero Subheadline / Description</label>
            <textarea
              rows={2}
              value={settings.hero_description || 'Professional physiotherapy consultation and personalized rehabilitation guidance designed around your individual pain, movement, and daily functional needs.'}
              onChange={(e) => handleChange('hero_description', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Hero Banner Image URL</label>
            <input
              type="url"
              value={settings.hero_image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'}
              onChange={(e) => handleChange('hero_image_url', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save & Publish All Settings'}</span>
        </button>
      </div>
    </form>
  );
};
