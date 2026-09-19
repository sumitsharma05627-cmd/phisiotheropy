import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, XCircle, RefreshCw, Star, AlertCircle, ShieldCheck, UserCheck, MessageSquare, X } from 'lucide-react';
import { PatientReview } from '../../types';
import { useClinic } from '../../context/ClinicContext';

interface AdminReviewsTabProps {
  token: string;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({ token }) => {
  const { refreshContent } = useClinic();
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add review modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formRating, setFormRating] = useState('5');
  const [formText, setFormText] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<'APPROVED' | 'PENDING_APPROVAL'>('APPROVED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [token]);

  const loadReviews = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
      } else {
        throw new Error(data.error || 'Failed to fetch reviews');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        setSuccessMsg(`Review marked as ${newStatus}`);
        refreshContent();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update review status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this patient review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        setSuccessMsg('Review deleted.');
        refreshContent();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete review');
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formText.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        patient_name: formName.trim(),
        city: formCity.trim(),
        age: formAge ? Number(formAge) : null,
        rating: Number(formRating) || 5,
        review_text: formText.trim(),
        photo_url: formPhotoUrl.trim(),
        status: formStatus,
        is_featured: formIsFeatured ? 1 : 0
      };

      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add review');

      setIsModalOpen(false);
      setSuccessMsg('Review added successfully!');
      loadReviews();
      refreshContent();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReviewPending = (status?: string) => {
    if (!status) return true;
    const s = status.toLowerCase();
    return s === 'pending' || s === 'pending_approval';
  };

  const isReviewApproved = (status?: string) => {
    if (!status) return false;
    return status.toUpperCase() === 'APPROVED';
  };

  const filteredReviews = reviews.filter(r => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING_APPROVAL') return isReviewPending(r.status);
    if (statusFilter === 'APPROVED') return isReviewApproved(r.status);
    if (statusFilter === 'REJECTED') return r.status?.toUpperCase() === 'REJECTED';
    return true;
  });

  const pendingCount = reviews.filter(r => isReviewPending(r.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Patient Stories & Reviews</h2>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-300">
                {pendingCount} Pending Approval
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Moderate public patient feedback. Patient submissions require admin approval before going live.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReviews}
            className="p-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setFormName('');
              setFormCity('');
              setFormAge('');
              setFormRating('5');
              setFormText('');
              setFormPhotoUrl('');
              setFormIsFeatured(false);
              setFormStatus('APPROVED');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === st
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? 'All Reviews' : st.replace('_', ' ')}
            {st === 'PENDING_APPROVAL' && pendingCount > 0 && ` (${pendingCount})`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
          No reviews in this category.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${
                rev.status === 'PENDING_APPROVAL'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                    {rev.patient_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{rev.patient_name}</h3>
                    <p className="text-[11px] text-slate-500">
                      {[rev.city, rev.age ? `${rev.age} yrs` : null].filter(Boolean).join(' • ') || 'Patient'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (rev.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {isReviewApproved(rev.status) ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Approved
                    </span>
                  ) : isReviewPending(rev.status) ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending Approval
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                      Rejected
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{rev.review_text}"
              </p>

              {rev.photo_url && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <span className="font-semibold text-slate-700">Attached Photo:</span>
                  <a
                    href={rev.photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 underline hover:text-teal-900"
                  >
                    View Patient Attachment
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400">
                  Submitted: {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {isReviewPending(rev.status) && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                        title="Approve and make public"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'REJECTED')}
                        className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                        title="Reject review"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {isReviewApproved(rev.status) && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'REJECTED')}
                      className="text-slate-500 hover:text-rose-600 text-xs font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                      title="Unpublish this review"
                    >
                      Unpublish
                    </button>
                  )}

                  {rev.status?.toUpperCase() === 'REJECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                      className="text-teal-700 hover:underline text-xs font-semibold"
                    >
                      Re-Approve
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Patient Experience</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ramesh S."
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City / Location</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Delhi"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Age</label>
                  <input
                    type="number"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Rating (1 to 5 Stars)</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="5">5 Stars ★★★★★</option>
                    <option value="4">4 Stars ★★★★☆</option>
                    <option value="3">3 Stars ★★★☆☆</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publish Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="APPROVED">Approved (Live)</option>
                    <option value="PENDING_APPROVAL">Pending Review</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Patient Review / Story *</label>
                <textarea
                  rows={4}
                  required
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Patient's experience with the consultation and exercises..."
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rev-feat"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="rev-feat" className="font-bold text-slate-700 cursor-pointer">
                  Feature on Homepage Snippet
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
