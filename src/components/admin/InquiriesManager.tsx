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
      {/* 4 Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)]">
          <p className="text-xs font-mono text-[#cbe9fd]">Total Inquiries</p>
          <p className="text-2xl font-bold text-white font-mono mt-1 drop-shadow-[0_2px_10px_rgba(25,81,252,0.4)]">{stats.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-emerald-500/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)]">
          <p className="text-xs font-mono text-emerald-400">New</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1 drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)]">{stats.new}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-amber-500/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)]">
          <p className="text-xs font-mono text-amber-400">In Progress</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{stats.inProgress}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/35 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)]">
          <p className="text-xs font-mono text-[#cbe9fd]">Completed</p>
          <p className="text-2xl font-bold text-[#cbe9fd] font-mono mt-1">{stats.completed}</p>
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
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#08173d]/60 border border-[#3781fc]/30 rounded-xl backdrop-blur-md">
          {['All', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#1951fc] to-[#3781fc] text-white border border-[#cbe9fd]/35 shadow-[0_0_12px_rgba(25,81,252,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#1951fc]/15'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table with Frosted Glass */}
      <div className="rounded-3xl border border-[#3781fc]/25 bg-gradient-to-br from-[#07163c]/75 via-[#0a1e4e]/60 to-[#07163c]/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#03091e]/80 text-xs font-mono text-[#cbe9fd] uppercase border-b border-[#3781fc]/20">
              <tr>
                <th className="px-4 py-3.5">Client & Contact</th>
                <th className="px-4 py-3.5">Service & Type</th>
                <th className="px-4 py-3.5">Budget</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3781fc]/15">
              {filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#1951fc]/10 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{inq.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{inq.email}</p>
                    {inq.company && (
                      <p className="text-[11px] text-slate-500">{inq.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono text-[#cbe9fd] font-bold">{inq.service}</p>
                    <p className="text-xs text-slate-400">{inq.project_type}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-emerald-400 font-bold">
                    {inq.budget || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={inq.status}
                      onChange={(e: any) => handleStatusChange(inq.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border focus:outline-none cursor-pointer ${
                        inq.status === 'New'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          : inq.status === 'Contacted'
                          ? 'bg-[#0b2cb1]/50 text-[#cbe9fd] border-[#3781fc]/40'
                          : inq.status === 'In Progress'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                          : inq.status === 'Completed'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50'
                          : 'bg-slate-900/80 text-slate-400 border-slate-700'
                      }`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#03091e] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingInquiry(inq)}
                        className="px-2.5 py-1 text-xs text-[#cbe9fd] hover:text-white bg-[#0b2cb1]/40 hover:bg-[#1951fc]/40 border border-[#3781fc]/35 rounded-lg transition-colors cursor-pointer shadow-xs"
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(inq.id)}
                        className="px-2.5 py-1 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded-lg transition-colors cursor-pointer"
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
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-slate-400">
                    No inquiries found matching criteria.
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
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#07163c]/90 via-[#0a1e4e]/85 to-[#07163c]/90 border border-rose-800/50 p-6 space-y-4 shadow-2xl backdrop-blur-2xl text-white">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-white">Delete Inquiry?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this client message?
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

      {/* View Inquiry Frosted Glass Modal */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020614]/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-[#07163c]/90 via-[#0a1e4e]/85 to-[#07163c]/90 border border-[#3781fc]/35 shadow-[0_20px_60px_rgba(3,25,91,0.65)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.3)] backdrop-blur-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#3781fc]/20 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Inquiry Details</h3>
                <p className="text-xs font-mono text-[#cbe9fd] mt-0.5">
                  Received on {new Date(viewingInquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={closeViewer}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-[#08173d]/60 border border-[#3781fc]/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Client Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#03091e]/80 border border-[#3781fc]/25">
                <div>
                  <p className="text-[11px] font-mono text-slate-400">Client Name</p>
                  <p className="text-sm font-semibold text-white">{viewingInquiry.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-400">Email</p>
                  <p className="text-xs text-[#cbe9fd] font-mono truncate">{viewingInquiry.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-400">Phone</p>
                  <p className="text-xs text-slate-200 font-mono">{viewingInquiry.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-400">Company</p>
                  <p className="text-xs text-slate-200">{viewingInquiry.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-400">Service</p>
                  <p className="text-xs text-[#cbe9fd] font-mono font-bold">{viewingInquiry.service}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-400">Budget</p>
                  <p className="text-xs text-emerald-400 font-mono font-bold">{viewingInquiry.budget}</p>
                </div>
              </div>

              {/* Message Box */}
              <div>
                <p className="text-xs font-mono text-[#cbe9fd] mb-2 font-semibold">Message & Project Scope:</p>
                <div className="p-4 rounded-2xl bg-[#03091e]/70 border border-[#3781fc]/25 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {viewingInquiry.message}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#03091e]/70 border border-[#3781fc]/25">
                <span className="text-xs font-mono text-slate-300">Current Pipeline Status:</span>
                <select
                  value={viewingInquiry.status}
                  onChange={(e: any) => handleStatusChange(viewingInquiry.id, e.target.value)}
                  disabled={updatingStatus}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-[#08173d] border border-[#3781fc]/40 text-white cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#03091e] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direct Reply Actions: WhatsApp & Email */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#3781fc]/20">
                <div className="flex items-center gap-2">
                  {viewingInquiry.phone && (
                    <a
                      href={`https://wa.me/${viewingInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${viewingInquiry.name}, this is NIRA Infotech regarding your inquiry for ${viewingInquiry.service}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600/90 hover:bg-emerald-500 rounded-xl border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
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
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_15px_rgba(25,81,252,0.3)] transition-all"
                  >
                    <Mail className="w-4 h-4 text-[#cbe9fd]" />
                    <span>Reply via Email</span>
                  </a>
                </div>

                <button
                  onClick={closeViewer}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/30 rounded-xl transition-colors"
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
