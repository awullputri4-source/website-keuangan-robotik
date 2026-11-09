import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  User, 
  DollarSign, 
  Plus, 
  Download, 
  Printer, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { OrganizationEvent, EventExpenseItem, ExpenseCategory } from '../types';
import { formatRupiah, formatDate, downloadCSV } from '../utils/formatters';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: OrganizationEvent | null;
  onOpenAddExpense: (eventId: string, eventName: string) => void;
  onOpenEditExpense: (eventId: string, eventName: string, item: EventExpenseItem) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onOpenAddExpense,
  onOpenEditExpense,
}) => {
  const { deleteExpenseItem } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const expenses = event.expenses || [];
  const totalExpenses = expenses.reduce((sum, item) => sum + item.totalPrice, 0);
  const remainingBudget = event.allocatedBudget - totalExpenses;
  const percentageUsed = event.allocatedBudget > 0 
    ? Math.min(100, Math.round((totalExpenses / event.allocatedBudget) * 100))
    : 0;

  // Filtered expenses
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.purchasedBy && item.purchasedBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['No', 'Tanggal', 'Nama Barang/Kebutuhan', 'Kategori', 'Qty', 'Satuan', 'Harga Satuan (Rp)', 'Total (Rp)', 'Pembeli', 'Keterangan'];
    const rows = expenses.map((item, index) => [
      index + 1,
      item.purchaseDate,
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.unitPrice,
      item.totalPrice,
      item.purchasedBy || '-',
      item.notes || '-',
    ]);

    downloadCSV(`Rincian-Pengeluaran-${event.name.replace(/\s+/g, '_')}.csv`, [headers, ...rows]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                {event.category}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                event.status === 'Selesai'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : event.status === 'Sedang Berjalan'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {event.status}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {formatDate(event.startDate)} s.d. {formatDate(event.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                PJ: {event.coordinator}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-900/50 border-b border-slate-800/80">
          
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Pagu Anggaran Disiapkan</span>
            <div className="text-xl font-bold text-white mt-1">
              {formatRupiah(event.allocatedBudget)}
            </div>
            <span className="text-[11px] text-slate-500">Batas pagu dana disetujui</span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4">
            <span className="text-xs text-rose-400 font-medium">Total Realisasi Belanja Barang</span>
            <div className="text-xl font-bold text-rose-400 mt-1">
              {formatRupiah(totalExpenses)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${percentageUsed > 90 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                  style={{ width: `${percentageUsed}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">{percentageUsed}%</span>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4">
            <span className="text-xs text-emerald-400 font-medium">Sisa Saldo Anggaran</span>
            <div className={`text-xl font-bold mt-1 ${remainingBudget >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              {formatRupiah(remainingBudget)}
            </div>
            <span className="text-[11px] text-slate-500">
              {remainingBudget >= 0 ? 'Anggaran masih surplus' : 'Peringatan: Anggaran defisit!'}
            </span>
          </div>

        </div>

        {/* Toolbar: Actions & Filters */}
        <div className="p-6 pb-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barang atau nama pembeli..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Semua Kategori</option>
                <option value="Komponen Robot">Komponen Robot</option>
                <option value="Alat & Bahan">Alat & Bahan</option>
                <option value="Konsumsi">Konsumsi</option>
                <option value="Transportasi & Akomodasi">Transportasi</option>
                <option value="Sewa Venue/Alat">Sewa Venue/Alat</option>
                <option value="Publikasi & Percetakan">Publikasi</option>
                <option value="Hadiah & Plakat">Hadiah/Plakat</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
              title="Unduh Excel/CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
              title="Cetak Rincian"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Cetak</span>
            </button>

            <button
              onClick={() => onOpenAddExpense(event.id, event.name)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-900/40 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Belanja</span>
            </button>
          </div>
        </div>

        {/* Expense Items Table */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {filteredExpenses.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Layers className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">Belum ada rincian belanja barang</p>
              <p className="text-xs text-slate-500 mt-1">
                Klik tombol "Tambah Belanja" di atas untuk mencatat pembelian komponen/kebutuhan acara.
              </p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/90 text-slate-300 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3">Barang / Kebutuhan</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-center">Qty</th>
                    <th className="py-3 px-3 text-right">Harga Satuan</th>
                    <th className="py-3 px-3 text-right">Total Biaya</th>
                    <th className="py-3 px-3">Tgl & Pembeli</th>
                    <th className="py-3 px-3 text-center">Nota</th>
                    <th className="py-3 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredExpenses.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{item.name}</div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-400">{item.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-white">
                        {item.quantity} <span className="text-[10px] text-slate-400">{item.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {formatRupiah(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-rose-400">
                        {formatRupiah(item.totalPrice)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-300">{formatDate(item.purchaseDate)}</div>
                        <div className="text-[11px] text-slate-500">{item.purchasedBy || '-'}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.receiptUrl ? (
                          <button
                            onClick={() => setPreviewReceiptUrl(item.receiptUrl!)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-800 transition"
                            title="Lihat Nota"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenEditExpense(event.id, event.name, item)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus pengeluaran "${item.name}"?`)) {
                                deleteExpenseItem(event.id, item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-800/80 font-bold border-t border-slate-700">
                  <tr>
                    <td colSpan={5} className="py-3 px-3 text-right text-slate-300">
                      Total Pengeluaran ({filteredExpenses.length} barang):
                    </td>
                    <td className="py-3 px-3 text-right text-rose-400 text-sm">
                      {formatRupiah(filteredExpenses.reduce((s, it) => s + it.totalPrice, 0))}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total {expenses.length} item barang tercatat untuk acara ini.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>

      </div>

      {/* Nota Image Zoom Modal */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <button
              onClick={() => setPreviewReceiptUrl(null)}
              className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-xs font-semibold text-slate-300 mb-2 px-2">Bukti Nota / Struk</h4>
            <img
              src={previewReceiptUrl}
              alt="Bukti Nota"
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};

