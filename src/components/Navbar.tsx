import React from 'react';
import { 
  Bot, 
  Wallet, 
  CalendarDays, 
  FileText, 
  LayoutDashboard, 
  PlusCircle, 
  PlusSquare,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

interface NavbarProps {
  activeTab: 'dashboard' | 'kas' | 'events' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'kas' | 'events' | 'reports') => void;
  onOpenKasModal: () => void;
  onOpenEventModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenKasModal,
  onOpenEventModal,
}) => {
  const { summary } = useFinance();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Org Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  RoboFinance
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  UKM Robotik
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Sistem Manajemen Kas & Anggaran Kegiatan
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/70 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('kas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kas'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Kas Anggota
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Acara & Pengeluaran
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reports'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Laporan LPJ
            </button>
          </nav>

          {/* Quick Info & Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Saldo Badge */}
            <div className="hidden lg:flex flex-col items-end px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-medium">Kas Bersih</span>
              <span className={`text-xs font-bold ${summary.currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatRupiah(summary.currentBalance)}
              </span>
            </div>

            {/* Quick Action Button: Setor Kas */}
            <button
              onClick={onOpenKasModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-900/40 transition active:scale-95"
              title="Catat Penyetoran Kas"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Setor Kas</span>
            </button>

            {/* Quick Action Button: Buat Acara */}
            <button
              onClick={onOpenEventModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-cyan-900/40 transition active:scale-95"
              title="Buat Acara Baru"
            >
              <PlusSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Acara Baru</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('kas')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'kas' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Kas</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'events' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Acara</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'reports' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laporan</span>
          </button>
        </div>
      </div>
    </header>
  );
};

