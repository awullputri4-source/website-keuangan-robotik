import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { KasManagement } from './components/KasManagement';
import { EventManagement } from './components/EventManagement';
import { FinancialReports } from './components/FinancialReports';
import { KasModal } from './components/KasModal';
import { MemberModal } from './components/MemberModal';
import { EventModal } from './components/EventModal';
import { ExpenseModal } from './components/ExpenseModal';
import { EventDetailModal } from './components/EventDetailModal';
import { KasPayment, OrganizationEvent, EventExpenseItem } from './types';
import { Bot, Heart } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kas' | 'events' | 'reports'>('dashboard');

  // Modals state
  const [isKasModalOpen, setIsKasModalOpen] = useState(false);
  const [editKasPayment, setEditKasPayment] = useState<KasPayment | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<OrganizationEvent | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseEventId, setExpenseEventId] = useState('');
  const [expenseEventName, setExpenseEventName] = useState('');
  const [editExpenseItem, setEditExpenseItem] = useState<EventExpenseItem | null>(null);

  const [detailEvent, setDetailEvent] = useState<OrganizationEvent | null>(null);

  // Handlers
  const handleOpenKasModal = (payment?: KasPayment) => {
    setEditKasPayment(payment || null);
    setIsKasModalOpen(true);
  };

  const handleOpenEventModal = (event?: OrganizationEvent) => {
    setEditEvent(event || null);
    setIsEventModalOpen(true);
  };

  const handleOpenAddExpense = (eventId: string, eventName: string) => {
    setExpenseEventId(eventId);
    setExpenseEventName(eventName);
    setEditExpenseItem(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (eventId: string, eventName: string, item: EventExpenseItem) => {
    setExpenseEventId(eventId);
    setExpenseEventName(eventName);
    setEditExpenseItem(item);
    setIsExpenseModalOpen(true);
  };

  const handleViewEventDetail = (event: OrganizationEvent) => {
    setDetailEvent(event);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKasModal={() => handleOpenKasModal()}
        onOpenEventModal={() => handleOpenEventModal()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onOpenKasModal={() => handleOpenKasModal()}
            onOpenEventModal={() => handleOpenEventModal()}
            onOpenMemberModal={() => setIsMemberModalOpen(true)}
            onNavigateTab={setActiveTab}
            onViewEventDetail={handleViewEventDetail}
          />
        )}

        {activeTab === 'kas' && (
          <KasManagement
            onOpenKasModal={handleOpenKasModal}
            onOpenMemberModal={() => setIsMemberModalOpen(true)}
          />
        )}

        {activeTab === 'events' && (
          <EventManagement
            onOpenEventModal={handleOpenEventModal}
            onOpenAddExpense={handleOpenAddExpense}
            onViewEventDetail={handleViewEventDetail}
          />
        )}

        {activeTab === 'reports' && <FinancialReports />}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">RoboFinance UKM Robotika</span>
            <span className="text-slate-600">|</span>
            <span>Sistem Keuangan & Anggaran Acara</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dirancang untuk kemudahan bendahara organisasi kampus</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <KasModal
        isOpen={isKasModalOpen}
        onClose={() => setIsKasModalOpen(false)}
        editPayment={editKasPayment}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        editEvent={editEvent}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        eventId={expenseEventId}
        eventName={expenseEventName}
        editExpense={editExpenseItem}
      />

      <EventDetailModal
        isOpen={!!detailEvent}
        onClose={() => setDetailEvent(null)}
        event={detailEvent}
        onOpenAddExpense={handleOpenAddExpense}
        onOpenEditExpense={handleOpenEditExpense}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

