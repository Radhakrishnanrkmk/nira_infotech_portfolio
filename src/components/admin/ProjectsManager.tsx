import React, { useState } from 'react';
import { Project } from '../../types/index.ts';
import { saveProject, deleteProjectApi, uploadImageApi } from '../../services/api.ts';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Upload,
  X,
  Check,
  AlertTriangle,
  Search
} from 'lucide-react';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
  initialEditingProject?: Project | null;
  onClearInitialEditing?: () => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  onRefresh,
  initialEditingProject,
  onClearInitialEditing
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(Boolean(initialEditingProject));
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(
    initialEditingProject || null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [techInput, setTechInput] = useState(
    initialEditingProject ? initialEditingProject.technologies.join(', ') : ''
  );
  const [featureInput, setFeatureInput] = useState(
    initialEditingProject && initialEditingProject.features
      ? initialEditingProject.features.join('\n')
      : ''
  );

  const openAddModal = () => {
    setEditingProject({
      title: '',
      description: '',
      poster_url: '',
      category: 'Full Stack Web App',
      technologies: ['React.js', 'Node.js', 'Express.js', 'Supabase'],
      live_url: '',
      demo_url: '',
      github_url: '',
      details: '',
      features: [],
      featured: false,
      status: 'Completed',
      display_order: projects.length + 1
    });
    setTechInput('React.js, Node.js, Express.js, Supabase');
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject({ ...proj });
    setTechInput(proj.technologies ? proj.technologies.join(', ') : '');
    setFeatureInput(proj.features ? proj.features.join('\n') : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    if (onClearInitialEditing) onClearInitialEditing();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const uploadedUrl = await uploadImageApi(base64, file.name, 'project-posters');
          setEditingProject(prev => prev ? { ...prev, poster_url: uploadedUrl } : null);
        } catch (err: any) {
          alert('Failed to upload image: ' + err.message);
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    try {
      setSaving(true);
      const techArray = techInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const featuresArray = featureInput
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      await saveProject({
        ...editingProject,
        technologies: techArray,
        features: featuresArray
      });

      closeModal();
      onRefresh();
    } catch (err: any) {
      alert('Error saving project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProjectApi(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting project: ' + err.message);
    }
  };

  const filteredProjects = projects.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search projects by title, category, tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Responsive Table (Desktop) / Cards (Mobile) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/70 text-xs font-mono text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Poster</th>
                <th className="px-4 py-3.5">Project Title</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Technologies</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Featured</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="w-14 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-xs text-slate-500 font-mono">
                      {p.poster_url ? (
                        <img src={p.poster_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        'NIRA'
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-100">{p.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-xs">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-cyan-400">
                    {p.category}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {p.technologies?.slice(0, 3).map((t) => (
                        <span key={t} className="text-[11px] text-slate-400 font-mono">
                          {t} ·
                        </span>
                      ))}
                      {(p.technologies?.length || 0) > 3 && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          +{p.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                      p.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : p.status === 'In Progress'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.featured ? (
                      <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-2.5 py-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-slate-500">
                    No projects found. Click "Add New Project" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-slate-100">Delete Project?</h4>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently remove this project from your portfolio and database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e1626] border border-slate-700 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-xl font-bold text-slate-100">
                {editingProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. College Food QR Pass"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingProject.category || 'Full Stack Web App'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Full Stack Web App">Full Stack Web App</option>
                    <option value="Business Website">Business Website</option>
                    <option value="Portfolio Website">Portfolio Website</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Mobile Web App">Mobile Web App</option>
                    <option value="E-Commerce">E-Commerce</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="e.g. QR-based digital food pass management system for college events."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Poster Upload & URL with Live Preview */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <label className="block text-xs font-mono text-cyan-400 font-semibold">
                  Project Poster / Image
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview */}
                  <div className="w-32 h-20 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center text-xs text-slate-500 shrink-0">
                    {editingProject.poster_url ? (
                      <img
                        src={editingProject.poster_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      'No image'
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Paste Image URL directly or upload below"
                      value={editingProject.poster_url || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, poster_url: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    />

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      {editingProject.poster_url && (
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, poster_url: '' })}
                          className="text-xs text-rose-400 hover:underline"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies (comma separated) */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React.js, Node.js, Express.js, Supabase, Tailwind CSS"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Links: Live Demo, Demo URL, GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.demo_url || editingProject.live_url || ''}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      demo_url: e.target.value,
                      live_url: e.target.value
                    })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    GitHub Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.github_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={editingProject.status || 'Completed'}
                    onChange={(e: any) => setEditingProject({ ...editingProject, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>
              </div>

              {/* Key Features (One per line) */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Project Features (One feature per line)
                </label>
                <textarea
                  rows={3}
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Instant QR generation&#10;Sub-second camera scanning&#10;Real-time admin meal counts"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 resize-none font-mono"
                />
              </div>

              {/* Detailed Writeup */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Detailed Architecture & Case Study (Optional)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.details || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, details: e.target.value })}
                  placeholder="Explain the background, challenges solved, architecture, and impact..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Featured toggle & Display Order */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs text-slate-200">Featured Project (Show prominently on homepage)</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-slate-400">Order:</label>
                  <input
                    type="number"
                    value={editingProject.display_order ?? 0}
                    onChange={(e) => setEditingProject({ ...editingProject, display_order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 text-center"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl shadow-md cursor-pointer"
                >
                  {saving ? 'Saving Project...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
