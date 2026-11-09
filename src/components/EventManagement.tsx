import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  CalendarPlus, 
  Search, 
  Filter, 
  ShoppingCart, 
  DollarSign, 
  MapPin, 
  User, 
  Plus, 
  ChevronRight, 
  Trash2, 
  Edit, 
  Layers, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { OrganizationEvent, EventStatus, EventCategory } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';

interface EventManagementProps {
  onOpenEventModal: (event?: OrganizationEvent) => void;
  onOpenAddExpense: (eventId: string, eventName: string) => void;
  onViewEventDetail: (event: OrganizationEvent) => void;
}

export const EventManagement: React.FC<EventManagementProps> = ({
  onOpenEventModal,
  onOpenAddExpense,
  onViewEventDetail,
}) => {
  const { events, deleteEvent } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | EventCategory>('all');

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch = 
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.coordinator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.description && ev.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || ev.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [events, searchQuery, statusFilter, categoryFilter]);

  // Overall event stats
  const totalAllocated = events.reduce((sum, e) => sum + e.allocatedBudget, 0);
  const totalRealized = events.reduce((sum, e) => {
    const evSpent = (e.expenses || []).reduce((s, it) => s + it.totalPrice, 0);
    return sum + evSpent;
  }, 0);
  const totalItemCount = events.reduce((sum, e) => sum + (e.expenses || []).length, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-cyan-400" />
            Manajemen Acara & Pengeluaran Barang
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mendata seluruh agenda kegiatan, kompetisi, dan workshop lengkap dengan rincian belanja barang, harga satuan, dan kalkulasi total.
          </p>
        </div>

        <button
          onClick={() => onOpenEventModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950/40 transition active:scale-95 self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>+ Buat Acara Baru</span>
        </button>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Pagu Anggaran Semua Acara</span>
            <div className="text-xl font-bold text-white mt-1">
              {formatRupiah(totalAllocated)}
            </div>
            <span className="text-[11px] text-slate-500">{events.length} acara terdaftar</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-rose-900/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-400 font-medium">Total Realisasi Belanja Barang</span>
            <div className="text-xl font-bold text-rose-400 mt-1">
              {formatRupiah(totalRealized)}
            </div>
            <span className="text-[11px] text-slate-500">{totalItemCount} item belanja tercatat</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-emerald-900/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-medium">Sisa Alokasi Pagu</span>
            <div className={`text-xl font-bold mt-1 ${totalAllocated - totalRealized >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatRupiah(totalAllocated - totalRealized)}
            </div>
            <span className="text-[11px] text-slate-500">
              {totalAllocated > 0 ? `${Math.round((totalRealized / totalAllocated) * 100)}% terserap` : '0%'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama acara, ketua pelaksana, lokasi..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status</option>
            <option value="Sedang Berjalan">Sedang Berjalan</option>
            <option value="Perencanaan">Perencanaan</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="Kompetisi Robotika">Kompetisi Robotika</option>
            <option value="Workshop & Pelatihan">Workshop & Pelatihan</option>
            <option value="Proyek Riset & Divisi">Proyek Riset & Divisi</option>
            <option value="Pameran & Sosialisasi">Pameran & Sosialisasi</option>
            <option value="Internal & Makrab">Internal & Makrab</option>
          </select>

        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl py-16 text-center text-slate-500">
          <CalendarDays className="w-12 h-12 mx-auto mb-2 text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">Tidak ada acara yang cocok</p>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan pencarian atau tambahkan acara baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => {
            const expenses = ev.expenses || [];
            const totalSpent = expenses.reduce((s, it) => s + it.totalPrice, 0);
            const remaining = ev.allocatedBudget - totalSpent;
            const percent = ev.allocatedBudget > 0 ? Math.round((totalSpent / ev.allocatedBudget) * 100) : 0;

            return (
              <div
                key={ev.id}
                className="bg-slate-800/70 border border-slate-700/80 hover:border-cyan-500/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
              >
                <div>
                  
                  {/* Category and Status Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {ev.category}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                      ev.status === 'Selesai'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : ev.status === 'Sedang Berjalan'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {ev.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 
                    onClick={() => onViewEventDetail(ev)}
                    className="text-base font-bold text-white group-hover:text-cyan-400 transition cursor-pointer line-clamp-1"
                    title={ev.name}
                  >
                    {ev.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {ev.description || 'Agenda kegiatan organisasi robotik.'}
                  </p>

                  {/* Meta info: Date, Location, Coordinator */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-400 border-t border-slate-700/60 pt-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{formatDate(ev.startDate)} s.d. {formatDate(ev.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">PJ: {ev.coordinator}</span>
                    </div>
                  </div>

                </div>

                {/* Financial Summary & Action Strip */}
                <div className="mt-5 pt-3.5 border-t border-slate-700/70">
                  
                  {/* Budget numbers */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Pagu Anggaran:</span>
                    <span className="font-semibold text-white">{formatRupiah(ev.allocatedBudget)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-rose-400">Total Pengeluaran:</span>
                    <span className="font-bold text-rose-400">{formatRupiah(totalSpent)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percent > 95 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-4">
                    <span className="text-slate-400 font-medium">{expenses.length} barang dibeli</span>
                    <span className={`font-semibold ${remaining >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      Sisa: {formatRupiah(remaining)} ({percent}%)
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewEventDetail(ev)}
                      className="flex-1 py-2 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Rincian Barang</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenAddExpense(ev.id, ev.name)}
                      className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
                      title="Tambah Belanja Barang"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenEventModal(ev)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
                      title="Edit Acara"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus acara "${ev.name}" beserta seluruh rincian belanjanya?`)) {
                          deleteEvent(ev.id);
                        }
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl text-xs transition"
                      title="Hapus Acara"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

