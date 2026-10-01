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
          <h2 className="text-xl font-bold text-slate-100">Services Management</h2>
          <p className="text-xs text-slate-400">Add, customize, reorder, or toggle active services</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              service.active
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-cyan-400">Icon: {service.icon}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  service.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {service.active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-2">{service.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{service.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">Order: {service.display_order}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(service.id)}
                  className="px-2.5 py-1 text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-slate-100">Delete Service?</h4>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this service from your website?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1626] border border-slate-700 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-slate-100">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Full Stack Applications"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Icon
                </label>
                <select
                  value={editingService.icon || 'Globe'}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic.name} value={ic.name}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Service Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Explain what is included in this service package..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingService.active)}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs text-slate-200">Active (Visible on public site)</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-slate-400">Order:</label>
                  <input
                    type="number"
                    value={editingService.display_order ?? 0}
                    onChange={(e) => setEditingService({ ...editingService, display_order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 text-center"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl"
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
