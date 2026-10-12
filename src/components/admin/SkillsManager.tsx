import React, { useState } from 'react';
import { Skill } from '../../types/index.ts';
import { saveSkill, deleteSkillApi } from '../../services/api.ts';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  Code,
  Palette,
  FileCode,
  Atom,
  Sparkles,
  Smartphone,
  Server,
  Cpu,
  Network,
  Database,
  HardDrive,
  GitBranch,
  Terminal,
  Layers,
  Wrench,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SkillsManagerProps {
  skills: Skill[];
  onRefresh: () => void;
}

const CATEGORIES: Skill['category'][] = [
  'Frontend',
  'Backend',
  'Database & Cloud',
  'Tools & DevOps'
];

const AVAILABLE_ICONS = [
  { name: 'Code', label: 'Code (General)' },
  { name: 'Palette', label: 'Palette (CSS/Design)' },
  { name: 'FileCode', label: 'FileCode (JavaScript)' },
  { name: 'Atom', label: 'Atom (React)' },
  { name: 'Sparkles', label: 'Sparkles (Tailwind/UI)' },
  { name: 'Smartphone', label: 'Smartphone (Responsive/Mobile)' },
  { name: 'Server', label: 'Server (Node.js)' },
  { name: 'Cpu', label: 'Cpu (Express/APIs)' },
  { name: 'Network', label: 'Network (REST API)' },
  { name: 'Database', label: 'Database (Supabase)' },
  { name: 'HardDrive', label: 'HardDrive (PostgreSQL)' },
  { name: 'GitBranch', label: 'GitBranch (Git/GitHub)' },
  { name: 'Terminal', label: 'Terminal (CLI/DevOps)' },
  { name: 'Layers', label: 'Layers (Full Stack)' },
  { name: 'Wrench', label: 'Wrench (Tools)' }
];

export const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingSkill({
      name: '',
      description: '',
      icon: 'Code',
      category: 'Frontend',
      active: true,
      display_order: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sk: Skill) => {
    setEditingSkill({ ...sk });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (sk: Skill) => {
    try {
      setTogglingId(sk.id);
      await saveSkill({
        ...sk,
        active: !sk.active
      });
      onRefresh();
    } catch (err: any) {
      alert('Error updating skill status: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name?.trim()) return;

    try {
      setSaving(true);
      await saveSkill(editingSkill);
      setIsModalOpen(false);
      setEditingSkill(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving skill: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (sk: Skill) => {
    setSkillToDelete(sk);
    setDeleteConfirmId(sk.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkillApi(id);
      setDeleteConfirmId(null);
      setSkillToDelete(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting skill: ' + err.message);
    }
  };

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Skills & Tech Stack Management</h2>
          <p className="text-xs text-slate-300">
            Add, edit, reorder, and delete skills displayed on your public portfolio
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_20px_rgba(25,81,252,0.45)] transition-all cursor-pointer self-start sm:self-auto hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4 text-[#cbe9fd]" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-[#08173d]/60 border border-[#3781fc]/30 rounded-xl max-w-xl backdrop-blur-md">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#1951fc] to-[#3781fc] text-white border border-[#cbe9fd]/35 shadow-[0_0_12px_rgba(25,81,252,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1951fc]/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Responsive Table with Frosted Glass */}
      <div className="rounded-3xl border border-[#3781fc]/25 bg-gradient-to-br from-[#07163c]/75 via-[#0a1e4e]/60 to-[#07163c]/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 min-w-[650px]">
            <thead className="bg-[#03091e]/80 text-xs font-mono text-[#cbe9fd] uppercase border-b border-[#3781fc]/20">
              <tr>
                <th className="px-4 py-3.5">Skill Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Order</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3781fc]/15">
              {filteredSkills.map((sk) => (
                <tr key={sk.id} className="hover:bg-[#1951fc]/10 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3781fc] shadow-[0_0_8px_#3781fc]" />
                      <span>{sk.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono text-[#cbe9fd] font-bold whitespace-nowrap">
                    {sk.category}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-300 max-w-xs truncate">
                    {sk.description || '—'}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(sk)}
                      disabled={togglingId === sk.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                        sk.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                      title="Click to toggle active on public website"
                    >
                      {sk.active ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Disabled</span>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono text-slate-400 text-center whitespace-nowrap">
                    {sk.display_order}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(sk)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#cbe9fd] hover:text-white bg-[#0b2cb1]/40 hover:bg-[#1951fc]/40 border border-[#3781fc]/35 rounded-xl transition-all cursor-pointer shadow-xs"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#3781fc]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDelete(sk)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded-xl transition-all cursor-pointer"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSkills.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-slate-400">
                    No skills found under {selectedCategory}. Click "Add New Skill" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020614]/80 backdrop-blur-xl">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#07163c]/90 via-[#0a1e4e]/85 to-[#07163c]/90 border border-rose-800/50 p-6 space-y-4 text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-white">Delete Skill?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white">{skillToDelete?.name}</span>?
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

      {/* Add / Edit Skill Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020614]/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[#07163c]/90 via-[#0a1e4e]/85 to-[#07163c]/90 border border-[#3781fc]/35 shadow-[0_20px_60px_rgba(3,25,91,0.65)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.3)] backdrop-blur-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#3781fc]/20 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingSkill.id ? `Edit Skill: ${editingSkill.name}` : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-[#08173d]/60 border border-[#3781fc]/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
                  Skill / Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. React.js, Supabase, Node.js"
                  className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
                  Category *
                </label>
                <select
                  value={editingSkill.category || 'Frontend'}
                  onChange={(e: any) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#03091e] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
                  Icon
                </label>
                <select
                  value={editingSkill.icon || 'Code'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
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
                  Description / Focus Area
                </label>
                <input
                  type="text"
                  value={editingSkill.description || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  placeholder="e.g. Component architecture, hooks, state management"
                  className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingSkill.active)}
                    onChange={(e) => setEditingSkill({ ...editingSkill, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1951fc] bg-[#03091e] border-[#3781fc]/40 cursor-pointer"
                  />
                  <span className="text-xs text-slate-200">Active (Visible on public site)</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-[#cbe9fd]">Order:</label>
                  <input
                    type="number"
                    value={editingSkill.display_order ?? 0}
                    onChange={(e) => setEditingSkill({ ...editingSkill, display_order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded-lg bg-[#03091e] border border-[#3781fc]/30 text-xs text-white text-center"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3781fc]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/30 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] disabled:opacity-50 rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_15px_rgba(25,81,252,0.4)] transition-colors cursor-pointer"
                >
                  {saving ? 'Saving...' : editingSkill.id ? 'Save Changes' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
