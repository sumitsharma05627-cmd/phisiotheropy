import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2, Star, Eye, EyeOff, Upload, Image as ImageIcon, X } from 'lucide-react';
import { GalleryImage } from '../../types';
import { useClinic } from '../../context/ClinicContext';

interface AdminGalleryTabProps {
  token: string;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({ token }) => {
  const { refreshContent } = useClinic();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Clinic Facility');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState('1');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadGallery();
  }, [token]);

  const loadGallery = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setImages(data.images || []);
      } else {
        throw new Error(data.error || 'Failed to fetch gallery');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo must be smaller than 10MB');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
      setFormImageUrl(''); // clear URL if local file is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setFormTitle('');
    setFormCategory('Clinic Facility');
    setFormDescription('');
    setFormImageUrl('');
    setFileBase64(null);
    setFileName(null);
    setFormIsFeatured(false);
    setFormIsPublished(true);
    setFormDisplayOrder(String(images.length + 1));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        setSuccessMsg('Photo deleted from gallery.');
        refreshContent();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete photo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Photo title is required');
      return;
    }
    if (!formImageUrl && !fileBase64) {
      alert('Please provide an image URL or upload a file.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        image_url: formImageUrl.trim(),
        imageBase64: fileBase64,
        imageName: fileName,
        is_featured: formIsFeatured ? 1 : 0,
        is_published: formIsPublished ? 1 : 0,
        display_order: Number(formDisplayOrder) || 1
      };

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add image');

      setIsModalOpen(false);
      setSuccessMsg('Photo added to gallery!');
      loadGallery();
      refreshContent();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clinic Gallery Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload and organize authentic clinic interior, equipment, and therapy photos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadGallery}
            className="p-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Photo</span>
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

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading photos...</div>
      ) : images.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
          No clinic photos added yet. Click "Add New Photo" to upload.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-100">
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                {img.is_featured ? (
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-white" /> Featured
                  </span>
                ) : null}
              </div>

              <div className="p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                  {img.category}
                </span>
                <h3 className="font-bold text-xs text-slate-900 truncate">{img.title}</h3>
                {img.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2">{img.description}</p>
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">Order: #{img.display_order}</span>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Clinic Photo</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Assessment Consultation Suite"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Clinic Facility">Clinic Facility</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Patient Care">Patient Care</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short caption describing the equipment or setting..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Upload or URL */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="font-bold text-slate-700 block">Photo Source</label>
                
                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px]">Option A: Image URL</span>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="text-center text-slate-400 text-[11px] font-semibold">— OR —</div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px]">Option B: Upload Photo File (Max 10MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  {fileName && (
                    <span className="text-emerald-700 text-[11px] font-medium block">
                      Selected: {fileName}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="gal-featured"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <label htmlFor="gal-featured" className="font-bold text-slate-700 cursor-pointer">
                    Feature on Homepage
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Order</label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
                  {isSubmitting ? 'Uploading...' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
