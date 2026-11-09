import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  CreditCard, 
  Banknote, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  Users, 
  Trash2, 
  Edit, 
  FileCheck, 
  Receipt, 
  CheckCircle2, 
  Printer,
  X,
  Building2,
  Calendar
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { KasPayment, PaymentMethod, DivisionType } from '../types';
import { formatRupiah, formatDate, downloadCSV } from '../utils/formatters';

interface KasManagementProps {
  onOpenKasModal: (payment?: KasPayment) => void;
  onOpenMemberModal: () => void;
}

export const KasManagement: React.FC<KasManagementProps> = ({
  onOpenKasModal,
  onOpenMemberModal,
}) => {
  const { kasPayments, deleteKasPayment, summary, members } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);
  const [receiptItem, setReceiptItem] = useState<KasPayment | null>(null);

  // Extract unique periods
  const uniquePeriods = useMemo(() => {
    const list = Array.from(new Set(kasPayments.map((p) => p.period)));
    return list;
  }, [kasPayments]);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return kasPayments.filter((p) => {
      const matchesSearch = 
        p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
      const matchesDivision = divisionFilter === 'all' || p.division === divisionFilter;
      const matchesPeriod = periodFilter === 'all' || p.period === periodFilter;

      return matchesSearch && matchesMethod && matchesDivision && matchesPeriod;
    });
  }, [kasPayments, searchQuery, methodFilter, divisionFilter, periodFilter]);

  const filteredTotal = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleExportCSV = () => {
    const headers = [
      'No',
      'Tanggal Setor',
      'Nama Anggota',
      'NIM',
      'Divisi',
      'Periode',
      'Nominal (Rp)',
      'Metode',
      'Bank/E-Wallet',
      'No Referensi',
      'Diterima Oleh',
      'Catatan',
    ];

    const rows = filteredPayments.map((p, idx) => [
      idx + 1,
      p.paymentDate,
      p.memberName,
      p.nim,
      p.division,
      p.period,
      p.amount,
      p.paymentMethod.toUpperCase(),
      p.bankOrWallet || '-',
      p.referenceNumber || '-',
      p.verifiedBy,
      p.notes || '-',
    ]);

    downloadCSV('Rekap-Uang-Kas-Robotik.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-emerald-400" />
            Pendataan Penyetoran Uang Kas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mencatat setoran iuran kas anggota robotika secara tunai (cash) maupun transfer perbankan / e-wallet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMemberModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Data Anggota</span>
          </button>

          <button
            onClick={() => onOpenKasModal()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Setoran</span>
          </button>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Kas Terkumpul</span>
            <div className="text-xl font-bold text-white mt-1">
              {formatRupiah(summary.totalKasIn)}
            </div>
            <span className="text-[11px] text-slate-500">{kasPayments.length} transaksi pembayaran</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-emerald-900/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-medium">Setoran Tunai (Cash)</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {formatRupiah(summary.totalCashKas)}
            </div>
            <span className="text-[11px] text-slate-500">
              {kasPayments.filter((p) => p.paymentMethod === 'cash').length} transaksi langsung
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Banknote className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-cyan-900/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-cyan-400 font-medium">Setoran Transfer & E-Wallet</span>
            <div className="text-xl font-bold text-cyan-400 mt-1">
              {formatRupiah(summary.totalTransferKas)}
            </div>
            <span className="text-[11px] text-slate-500">
              {kasPayments.filter((p) => p.paymentMethod === 'transfer').length} transaksi transfer
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama anggota, NIM, no referensi, catatan..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Payment Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Metode (Cash & Transfer)</option>
              <option value="cash">Hanya Tunai (Cash)</option>
              <option value="transfer">Hanya Transfer / E-Wallet</option>
            </select>

            {/* Division Filter */}
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Divisi</option>
              <option value="Mekanik & Hardware">Mekanik & Hardware</option>
              <option value="Elektronika & PCB">Elektronika & PCB</option>
              <option value="Pemrograman & AI">Pemrograman & AI</option>
              <option value="Desain & Kreatif">Desain & Kreatif</option>
              <option value="Manajemen & Humas">Manajemen & Humas</option>
            </select>

            {/* Period Filter */}
            {uniquePeriods.length > 0 && (
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Semua Periode</option>
                {uniquePeriods.map((per) => (
                  <option key={per} value={per}>{per}</option>
                ))}
              </select>
            )}

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
              title="Unduh Data Kas CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

          </div>
        </div>

        {/* Quick summary of filtered results */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
          <span>
            Menampilkan <strong className="text-white">{filteredPayments.length}</strong> riwayat setoran
          </span>
          <span>
            Subtotal: <strong className="text-emerald-400 font-bold">{formatRupiah(filteredTotal)}</strong>
          </span>
        </div>
      </div>

      {/* Kas Payments Table */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        {filteredPayments.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Wallet className="w-12 h-12 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">Tidak ada data setoran kas ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800 text-slate-300 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Tgl Setor</th>
                  <th className="py-3 px-4">Anggota & NIM</th>
                  <th className="py-3 px-4">Divisi</th>
                  <th className="py-3 px-4">Periode</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4">Ref / Keterangan</th>
                  <th className="py-3 px-4">Diterima Oleh</th>
                  <th className="py-3 px-4 text-center">Bukti</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    
                    {/* Date */}
                    <td className="py-3.5 px-4 font-medium text-slate-300 whitespace-nowrap">
                      {formatDate(p.paymentDate)}
                    </td>

                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{p.memberName}</div>
                      <div className="text-[11px] text-cyan-400 font-mono">{p.nim}</div>
                    </td>

                    {/* Division */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] text-slate-400">
                        {p.division}
                      </span>
                    </td>

                    {/* Period */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-medium">
                        {p.period}
                      </span>
                    </td>

                    {/* Nominal Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-emerald-400 text-sm">
                      {formatRupiah(p.amount)}
                    </td>

                    {/* Payment Method Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {p.paymentMethod === 'cash' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                          <Banknote className="w-3.5 h-3.5" />
                          Tunai (Cash)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                          <CreditCard className="w-3.5 h-3.5" />
                          Transfer • {p.bankOrWallet || 'Bank'}
                        </span>
                      )}
                    </td>

                    {/* Reference / Notes */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {p.referenceNumber && (
                        <div className="font-mono text-[10px] text-slate-400">
                          Ref: {p.referenceNumber}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-300 truncate">
                        {p.notes || '-'}
                      </div>
                    </td>

                    {/* Verified By */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                      {p.verifiedBy}
                    </td>

                    {/* Proof image */}
                    <td className="py-3.5 px-4 text-center">
                      {p.proofImageUrl ? (
                        <button
                          onClick={() => setPreviewProofUrl(p.proofImageUrl!)}
                          className="p-1 rounded bg-slate-700/80 hover:bg-slate-600 text-cyan-400 border border-cyan-800 transition"
                          title="Lihat Bukti Transfer"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setReceiptItem(p)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded transition"
                          title="Cetak Kuitansi Kas"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenKasModal(p)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data setoran kas ${p.memberName} sebesar ${formatRupiah(p.amount)}?`)) {
                              deleteKasPayment(p.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proof Preview Modal */}
      {previewProofUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <button
              onClick={() => setPreviewProofUrl(null)}
              className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-white mb-3">Bukti Pembayaran Transfer</h4>
            <img
              src={previewProofUrl}
              alt="Bukti Transfer"
              className="w-full max-h-[70vh] object-contain rounded-xl border border-slate-700"
            />
          </div>
        </div>
      )}

      {/* Kuitansi Digital / Print Slip Modal */}
      {receiptItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setReceiptItem(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
                Tanda Terima Pembayaran Kas
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                UKM ROBOTIKA KAMPUS
              </h3>
              <p className="text-[11px] text-slate-500">
                Lab Robotika Gedung Pusat Riset Mahasiswa
              </p>
            </div>

            {/* Receipt Details */}
            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Transaksi</span>
                <span className="font-mono font-bold">{receiptItem.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Bayar</span>
                <span className="font-semibold">{formatDate(receiptItem.paymentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Anggota</span>
                <span className="font-bold">{receiptItem.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NIM / Divisi</span>
                <span>{receiptItem.nim} ({receiptItem.division})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Untuk Periode</span>
                <span className="font-semibold">{receiptItem.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode</span>
                <span className="font-semibold uppercase">
                  {receiptItem.paymentMethod === 'cash' ? 'Tunai (Cash)' : `Transfer ${receiptItem.bankOrWallet || ''}`}
                </span>
              </div>
              {receiptItem.referenceNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Referensi</span>
                  <span className="font-mono">{receiptItem.referenceNumber}</span>
                </div>
              )}
              {receiptItem.notes && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Catatan</span>
                  <span>{receiptItem.notes}</span>
                </div>
              )}

              <div className="pt-3 border-t border-dashed border-slate-300 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">Jumlah Disetor:</span>
                <span className="text-lg font-black text-emerald-700">
                  {formatRupiah(receiptItem.amount)}
                </span>
              </div>
            </div>

            {/* Sign off */}
            <div className="pt-4 border-t border-dashed border-slate-300 flex justify-between text-[11px] text-slate-600">
              <div>
                <p>Status:</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                  LUNAS / DITERIMA
                </span>
              </div>
              <div className="text-right">
                <p>Penerima (Bendahara):</p>
                <p className="font-bold mt-3 underline">{receiptItem.verifiedBy}</p>
              </div>
            </div>

            {/* Print button */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Cetak Bukti Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

