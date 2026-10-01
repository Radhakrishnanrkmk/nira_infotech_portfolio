import React, { useState } from 'react';
import { Inquiry } from '../../types/index.ts';
import { updateInquiryStatusApi, deleteInquiryApi } from '../../services/api.ts';
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  X,
  AlertTriangle,
  Clock,
  Eye,
  CheckCircle,
  Building2,
  DollarSign
} from 'lucide-react';

interface InquiriesManagerProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
  initialViewingInquiry?: Inquiry | null;
  onClearInitialViewing?: () => void;
}

const STATUS_OPTIONS: Inquiry['status'][] = [
  'New',
  'Contacted',
  'In Progress',
  'Completed',
  'Closed'
];

export const InquiriesManager: React.FC<InquiriesManagerProps> = ({
  inquiries,
  onRefresh,
  initialViewingInquiry,
  onClearInitialViewing
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(initialViewingInquiry || null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'New').length,
    inProgress: inquiries.filter(i => i.status === 'In Progress').length,
    completed: inquiries.filter(i => i.status === 'Completed').length
  };

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    try {
      setUpdatingStatus(true);
      const updated = await updateInquiryStatusApi(id, newStatus);
      if (viewingInquiry && viewingInquiry.id === id) {
        setViewingInquiry(updated);
      }
      onRefresh();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiryApi(id);
      setDeleteConfirmId(null);
      if (viewingInquiry && viewingInquiry.id === id) {
        setViewingInquiry(null);
      }
      onRefresh();
    } catch (err: any) {
      alert('Error deleting inquiry: ' + err.message);
    }
  };

  const closeViewer = () => {
    setViewingInquiry(null);
    if (onClearInitialViewing) onClearInitialViewing();
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      (i.company && i.company.toLowerCase().includes(search.toLowerCase())) ||
      (i.service && i.service.toLowerCase().includes(search.toLowerCase())) ||
      i.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards requested in Section 12 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-mono text-slate-400">Total Inquiries</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-mono text-emerald-400">New</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{stats.new}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-mono text-amber-400">In Progress</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{stats.inProgress}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-mono text-cyan-400">Completed</p>
          <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search inquiries by client name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {['All', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/70 text-xs font-mono text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Client & Contact</th>
                <th className="px-4 py-3.5">Service & Type</th>
                <th className="px-4 py-3.5">Budget</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-100">{inq.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{inq.email}</p>
                    {inq.company && (
                      <p className="text-[11px] text-slate-500">{inq.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono text-cyan-400">{inq.service}</p>
                    <p className="text-xs text-slate-400">{inq.project_type}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-emerald-400">
                    {inq.budget || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={inq.status}
                      onChange={(e: any) => handleStatusChange(inq.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-mono border focus:outline-none cursor-pointer ${
                        inq.status === 'New'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : inq.status === 'Contacted'
                          ? 'bg-blue-950 text-blue-400 border-blue-800'
                          : inq.status === 'In Progress'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : inq.status === 'Completed'
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingInquiry(inq)}
                        className="px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(inq.id)}
                        className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
                        title="Delete Inquiry"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-slate-500">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-slate-100">Delete Inquiry?</h4>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this client message?
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

      {/* View Inquiry Modal */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0e1626] border border-slate-700 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Inquiry Details</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Received on {new Date(viewingInquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={closeViewer}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Client Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Client Name</p>
                  <p className="text-sm font-semibold text-slate-100">{viewingInquiry.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Email</p>
                  <p className="text-xs text-cyan-400 font-mono truncate">{viewingInquiry.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Phone</p>
                  <p className="text-xs text-slate-200 font-mono">{viewingInquiry.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Company</p>
                  <p className="text-xs text-slate-200">{viewingInquiry.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Service</p>
                  <p className="text-xs text-cyan-300 font-mono">{viewingInquiry.service}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Budget</p>
                  <p className="text-xs text-emerald-400 font-mono font-bold">{viewingInquiry.budget}</p>
                </div>
              </div>

              {/* Message Box */}
              <div>
                <p className="text-xs font-mono text-slate-400 mb-2 font-semibold">Message & Project Scope:</p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {viewingInquiry.message}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-mono text-slate-300">Current Pipeline Status:</span>
                <select
                  value={viewingInquiry.status}
                  onChange={(e: any) => handleStatusChange(viewingInquiry.id, e.target.value)}
                  disabled={updatingStatus}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-100 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direct Reply Actions: WhatsApp & Email */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {viewingInquiry.phone && (
                    <a
                      href={`https://wa.me/${viewingInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${viewingInquiry.name}, this is NIRA Infotech regarding your inquiry for ${viewingInquiry.service}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${viewingInquiry.email}?subject=${encodeURIComponent(
                      `NIRA Infotech — ${viewingInquiry.service} Proposal`
                    )}&body=${encodeURIComponent(
                      `Hi ${viewingInquiry.name},\n\nThank you for reaching out to NIRA Infotech regarding your project.`
                    )}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-cyan-400 bg-cyan-950/50 hover:bg-cyan-950/80 border border-cyan-800/60 rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                </div>

                <button
                  onClick={closeViewer}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
