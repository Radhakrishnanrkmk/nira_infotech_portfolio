import React, { useState } from 'react';
import { Service } from '../../types/index.ts';
import { saveService, deleteServiceApi } from '../../services/api.ts';
import {
  Plus,
  Trash2,
  Globe,
  Briefcase,
  Building2,
  Zap,
  Layers,
  Wrench,
  Code,
  X,
  AlertTriangle
} from 'lucide-react';

interface ServicesManagerProps {
  services: Service[];
  onRefresh: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Globe', label: 'Globe / Web' },
  { name: 'Briefcase', label: 'Briefcase / Portfolio' },
  { name: 'Building2', label: 'Building / Corporate' },
  { name: 'Zap', label: 'Zap / Landing' },
  { name: 'Layers', label: 'Layers / Full-Stack' },
  { name: 'Wrench', label: 'Wrench / Maintenance' },
  { name: 'Code', label: 'Code / General' }
];

export const ServicesManager: React.FC<ServicesManagerProps> = ({ services, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingService({
      title: '',
      description: '',
      icon: 'Globe',
      active: true,
      display_order: services.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService({ ...s });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    try {
      setSaving(true);
      await saveService(editingService);
      setIsModalOpen(false);
      setEditingService(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceApi(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting service: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Services Management</h2>
          <p className="text-xs text-slate-300">Add, customize, reorder, or toggle active services</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_20px_rgba(25,81,252,0.45)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4 text-[#cbe9fd]" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid with Frosted Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-xl ${
              service.active
                ? 'bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border-[#3781fc]/25 shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] hover:border-[#3781fc]/60 hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)]'
                : 'bg-[#03091e]/50 border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#cbe9fd] font-bold">Icon: {service.icon}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono ${
                  service.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {service.active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">{service.description}</p>
            </div>

            <div className="pt-4 border-t border-[#3781fc]/20 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">Order: {service.display_order}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="px-3 py-1.5 text-xs text-[#cbe9fd] hover:text-white bg-[#0b2cb1]/40 hover:bg-[#1951fc]/40 border border-[#3781fc]/35 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(service.id)}
                  className="px-3 py-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded-xl transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020614]/80 backdrop-blur-xl">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#07163c]/90 via-[#0a1e4e]/85 to-[#07163c]/90 border border-rose-800/50 p-6 space-y-4 text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-white">Delete Service?</h4>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this service from your website?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs text-slate-300 bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/30 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020614]/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-[#07163c]/90 via-[#0a1e4e]/85 to-[#07163c]/90 border border-[#3781fc]/35 shadow-[0_20px_60px_rgba(3,25,91,0.65)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.3)] backdrop-blur-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#3781fc]/20 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-[#08173d]/60 border border-[#3781fc]/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Full Stack Applications"
                  className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
                  Icon
                </label>
                <select
                  value={editingService.icon || 'Globe'}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] cursor-pointer"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic.name} value={ic.name} className="bg-[#03091e] text-white">
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
                  Service Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Explain what is included in this service package..."
                  className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingService.active)}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1951fc] bg-[#03091e] border-[#3781fc]/40"
                  />
                  <span className="text-xs text-slate-200">Active (Visible on public site)</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-[#cbe9fd]">Order:</label>
                  <input
                    type="number"
                    value={editingService.display_order ?? 0}
                    onChange={(e) => setEditingService({ ...editingService, display_order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded-lg bg-[#03091e] border border-[#3781fc]/30 text-xs text-white text-center"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3781fc]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/30 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] disabled:opacity-50 rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_15px_rgba(25,81,252,0.4)]"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
