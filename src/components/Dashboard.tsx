import React from 'react';
import { 
  Wallet, 
  CreditCard, 
  Banknote, 
  ShoppingCart, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  TrendingUp, 
  PlusCircle, 
  CalendarPlus, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, formatDate } from '../utils/formatters';

interface DashboardProps {
  onOpenKasModal: () => void;
  onOpenEventModal: () => void;
  onOpenMemberModal: () => void;
  onNavigateTab: (tab: 'dashboard' | 'kas' | 'events' | 'reports') => void;
  onViewEventDetail: (event: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenKasModal,
  onOpenEventModal,
  onOpenMemberModal,
  onNavigateTab,
  onViewEventDetail,
}) => {
  const { summary, kasPayments, events, members } = useFinance();

  // Combine recent transactions (both kas in and event expenses out)
  const recentKas = kasPayments.slice(0, 5).map((k) => ({
    type: 'in' as const,
    id: k.id,
    title: `Setoran Kas - ${k.memberName}`,
    subtitle: `${k.period} • ${k.paymentMethod === 'cash' ? 'Tunai (Cash)' : `Transfer (${k.bankOrWallet || 'Bank'})`}`,
    amount: k.amount,
    date: k.paymentDate,
    category: k.paymentMethod === 'cash' ? 'Cash' : 'Transfer',
    isCash: k.paymentMethod === 'cash',
  }));

  const allExpenses = events.flatMap((ev) => 
    (ev.expenses || []).map((exp) => ({
      type: 'out' as const,
      id: exp.id,
      title: exp.name,
      subtitle: `${ev.name} • ${exp.purchasedBy || 'Anggota'}`,
      amount: exp.totalPrice,
      date: exp.purchaseDate,
      category: exp.category,
      isCash: false,
    }))
  );

  const recentExpenses = allExpenses.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-6 sm:p-8 border border-slate-700/80 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Keuangan Organisasi Robotik Kampus
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Transparansi & Efisiensi Anggaran Robotika
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Kelola pencatatan iuran kas anggota (Cash / Transfer perbankan) serta alokasi pengeluaran barang untuk lomba robot, workshop, dan proyek divisi secara akuntabel.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onOpenKasModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Catat Uang Kas Masuk
            </button>
            <button
              onClick={onOpenEventModal}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950/40 transition active:scale-95"
            >
              <CalendarPlus className="w-4 h-4" />
              Buat Acara Baru
            </button>
            <button
              onClick={onOpenMemberModal}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              Kelola Anggota ({members.length})
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Saldo Kas Tersedia */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Kas Bersih Organisasi</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${summary.currentBalance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 tracking-tight ${summary.currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatRupiah(summary.currentBalance)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Total Pemasukan Kas - Belanja Acara</span>
          </p>
        </div>

        {/* Card 2: Total Kas Terkumpul (Cash vs Transfer) */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pemasukan Kas</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 tracking-tight">
            {formatRupiah(summary.totalKasIn)}
          </div>
          <div className="flex items-center gap-3 text-[11px] mt-2 pt-2 border-t border-slate-700/70">
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Banknote className="w-3 h-3" />
              Cash: {formatRupiah(summary.totalCashKas)}
            </span>
            <span className="text-cyan-400 flex items-center gap-1 font-semibold">
              <CreditCard className="w-3 h-3" />
              Transfer: {formatRupiah(summary.totalTransferKas)}
            </span>
          </div>
        </div>

        {/* Card 3: Total Pengeluaran Acara */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pengeluaran Kegiatan</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2 tracking-tight">
            {formatRupiah(summary.totalEventExpenses)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Dari total {events.length} kegiatan & proyek divisi
          </p>
        </div>

        {/* Card 4: Total Anggota & Keaktifan */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Anggota & Proyek</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 tracking-tight">
            {members.length} <span className="text-xs font-normal text-slate-400">Anggota</span>
          </div>
          <p className="text-[11px] text-purple-400 mt-1 font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {summary.activeEventsCount} Acara Sedang Berjalan / Direncanakan
          </p>
        </div>

      </div>

      {/* Visual Analysis & Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Event Cards with Budget Realization */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Progres Anggaran Acara & Proyek
            </h2>
            <button
              onClick={() => onNavigateTab('events')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Lihat Semua Acara
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => {
              const totalSpent = (ev.expenses || []).reduce((s, it) => s + it.totalPrice, 0);
              const percent = ev.allocatedBudget > 0 ? Math.round((totalSpent / ev.allocatedBudget) * 100) : 0;
              const remaining = ev.allocatedBudget - totalSpent;

              return (
                <div
                  key={ev.id}
                  onClick={() => onViewEventDetail(ev)}
                  className="bg-slate-800/60 border border-slate-700/80 hover:border-cyan-500/50 rounded-2xl p-5 shadow-sm transition hover:shadow-cyan-950/30 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {ev.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        ev.status === 'Selesai' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : ev.status === 'Sedang Berjalan'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {ev.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white hover:text-cyan-400 transition line-clamp-1">
                      {ev.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {ev.description || 'Tidak ada deskripsi'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400">Realisasi / Pagu</span>
                      <span className="font-bold text-white">
                        {formatRupiah(totalSpent)} <span className="text-slate-400 font-normal">/ {formatRupiah(ev.allocatedBudget)}</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percent > 90 ? 'bg-rose-500' : percent > 60 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-2">
                      <span className="text-slate-400">
                        {(ev.expenses || []).length} item barang dibeli
                      </span>
                      <span className={`font-semibold ${remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Sisa: {formatRupiah(remaining)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 Col): Payment Methods Breakdown & Quick Summary */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            Distribusi Pemasukan Kas
          </h2>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Cash Card */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Tunai (Cash)</span>
                    <p className="text-[10px] text-slate-400">Diserahkan langsung ke bendahara</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  {formatRupiah(summary.totalCashKas)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {kasPayments.filter((p) => p.paymentMethod === 'cash').length} transaksi tunai
              </div>
            </div>

            {/* Transfer Card */}
            <div className="p-4 bg-cyan-950/30 border border-cyan-900/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Transfer & E-Wallet</span>
                    <p className="text-[10px] text-slate-400">BCA, Mandiri, Dana, GoPay, dll.</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-cyan-400">
                  {formatRupiah(summary.totalTransferKas)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {kasPayments.filter((p) => p.paymentMethod === 'transfer').length} transaksi transfer
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Catatan Bendahara:
              </div>
              Pastikan setiap penerimaan uang transfer selalu dicek mutasi rekening dan disimpan nomor referensinya.
            </div>

          </div>
        </div>

      </div>

      {/* Recent Activity: Side-by-Side Latest Kas & Latest Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Kas Deposits */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              Setoran Uang Kas Terbaru
            </h3>
            <button
              onClick={() => onNavigateTab('kas')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2.5">
            {recentKas.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-800/90 rounded-xl border border-slate-700/70 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.isCash ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {item.isCash ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">
                    +{formatRupiah(item.amount)}
                  </div>
                  <div className="text-[10px] text-slate-500">{formatDate(item.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Expenses */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              Pengeluaran Belanja Barang Terbaru
            </h3>
            <button
              onClick={() => onNavigateTab('events')}
              className="text-xs text-rose-400 hover:underline"
            >
              Lihat Acara
            </button>
          </div>

          <div className="space-y-2.5">
            {recentExpenses.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Belum ada pengeluaran belanja.</p>
            ) : (
              recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 bg-slate-800/90 rounded-xl border border-slate-700/70 hover:border-slate-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{exp.title}</div>
                      <div className="text-[11px] text-slate-400">{exp.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-400">
                      -{formatRupiah(exp.amount)}
                    </div>
                    <div className="text-[10px] text-slate-500">{formatDate(exp.date)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

