import React, { useState, useEffect } from 'react';
import { X, CalendarPlus, Calendar, User, MapPin, DollarSign, Tag, AlignLeft } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { OrganizationEvent, EventCategory, EventStatus } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  editEvent?: OrganizationEvent | null;
}

const EVENT_CATEGORIES: EventCategory[] = [
  'Kompetisi Robotika',
  'Workshop & Pelatihan',
  'Proyek Riset & Divisi',
  'Pameran & Sosialisasi',
  'Internal & Makrab',
];

const EVENT_STATUSES: EventStatus[] = [
  'Perencanaan',
  'Sedang Berjalan',
  'Selesai',
  'Dibatalkan',
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  editEvent,
}) => {
  const { addEvent, updateEvent } = useFinance();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<EventCategory>('Kompetisi Robotika');
  const [description, setDescription] = useState('');
  const [coordinator, setCoordinator] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<EventStatus>('Sedang Berjalan');
  const [allocatedBudget, setAllocatedBudget] = useState<number>(5000000);

  useEffect(() => {
    if (editEvent) {
      setName(editEvent.name);
      setCategory(editEvent.category);
      setDescription(editEvent.description);
      setCoordinator(editEvent.coordinator);
      setLocation(editEvent.location);
      setStartDate(editEvent.startDate);
      setEndDate(editEvent.endDate);
      setStatus(editEvent.status);
      setAllocatedBudget(editEvent.allocatedBudget);
    } else {
      setName('');
      setCategory('Kompetisi Robotika');
      setDescription('');
      setCoordinator('');
      setLocation('Lab Robotika Kampus');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
      setStatus('Perencanaan');
      setAllocatedBudget(3000000);
    }
  }, [editEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !coordinator) {
      alert('Nama acara dan penanggung jawab wajib diisi.');
      return;
    }

    if (editEvent) {
      updateEvent(editEvent.id, {
        name,
        category,
        description,
        coordinator,
        location,
        startDate,
        endDate,
        status,
        allocatedBudget: Number(allocatedBudget),
      });
    } else {
      addEvent({
        name,
        category,
        description,
        coordinator,
        location,
        startDate,
        endDate,
        status,
        allocatedBudget: Number(allocatedBudget),
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editEvent ? 'Edit Data Acara' : 'Buat Acara / Proyek Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                Data acara untuk mengelola alokasi anggaran dan pengeluaran barang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Nama Acara / Kegiatan / Lomba
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
              placeholder="Contoh: Kontes Robot SAR Wilayah II atau Workshop IoT"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kategori Kegiatan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Acara
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {EVENT_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Ketua Pelaksana / PJ
              </label>
              <input
                type="text"
                value={coordinator}
                onChange={(e) => setCoordinator(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Nama Penanggung Jawab"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Lokasi Pelaksanaan
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Lab / Gedung Kampus / Venue"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Alokasi Pagu Anggaran (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min="0"
                step="50000"
                value={allocatedBudget}
                onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold text-base focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Batas pagu dana yang dianggarkan organisasi untuk kegiatan ini.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-cyan-400" />
              Deskripsi Singkat Acara
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Jelaskan tujuan dan ruang lingkup kegiatan ini..."
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-900/40 transition active:scale-95"
            >
              {editEvent ? 'Simpan Perubahan' : 'Buat Acara'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

