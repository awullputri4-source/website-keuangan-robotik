import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Member, 
  KasPayment, 
  OrganizationEvent, 
  EventExpenseItem, 
  CashFlowSummary 
} from '../types';
import { initialMembers, initialKasPayments, initialEvents } from '../data/mockData';

interface FinanceContextType {
  members: Member[];
  kasPayments: KasPayment[];
  events: OrganizationEvent[];
  summary: CashFlowSummary;
  
  // Kas Methods
  addKasPayment: (payment: Omit<KasPayment, 'id' | 'createdAt'>) => void;
  deleteKasPayment: (id: string) => void;
  updateKasPayment: (id: string, payment: Partial<KasPayment>) => void;
  
  // Member Methods
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Event Methods
  addEvent: (event: Omit<OrganizationEvent, 'id' | 'createdAt' | 'expenses'>) => void;
  updateEvent: (id: string, event: Partial<OrganizationEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Expense Methods
  addExpenseItem: (eventId: string, item: Omit<EventExpenseItem, 'id' | 'eventId' | 'createdAt' | 'totalPrice'>) => void;
  updateExpenseItem: (eventId: string, itemId: string, item: Partial<EventExpenseItem>) => void;
  deleteExpenseItem: (eventId: string, itemId: string) => void;
  
  // Reset & Backup
  resetToDefaultData: () => void;
  importAllData: (data: { members?: Member[]; kasPayments?: KasPayment[]; events?: OrganizationEvent[] }) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEMBERS: 'ukm_robotik_members_v1',
  KAS: 'ukm_robotik_kas_v1',
  EVENTS: 'ukm_robotik_events_v1',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : initialMembers;
    } catch {
      return initialMembers;
    }
  });

  const [kasPayments, setKasPayments] = useState<KasPayment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KAS);
      return saved ? JSON.parse(saved) : initialKasPayments;
    } catch {
      return initialKasPayments;
    }
  });

  const [events, setEvents] = useState<OrganizationEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KAS, JSON.stringify(kasPayments));
  }, [kasPayments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  // Derived financial summary
  const summary: CashFlowSummary = useMemo(() => {
    const totalKasIn = kasPayments.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCashKas = kasPayments
      .filter((p) => p.paymentMethod === 'cash')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalTransferKas = kasPayments
      .filter((p) => p.paymentMethod === 'transfer')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalEventExpenses = events.reduce((acc, ev) => {
      const evTotal = (ev.expenses || []).reduce((expAcc, item) => expAcc + item.totalPrice, 0);
      return acc + evTotal;
    }, 0);

    // Initial base capital / kas awal can be factored or net
    // Let's set a realistic starting balance or just totalKasIn - totalEventExpenses
    // To make it look realistic and positive, we can assume kas total
    const currentBalance = totalKasIn - totalEventExpenses;

    const activeEventsCount = events.filter(
      (e) => e.status === 'Perencanaan' || e.status === 'Sedang Berjalan'
    ).length;

    return {
      totalKasIn,
      totalCashKas,
      totalTransferKas,
      totalEventExpenses,
      currentBalance,
      totalMembers: members.length,
      activeEventsCount,
    };
  }, [kasPayments, events, members]);

  // Kas Actions
  const addKasPayment = (paymentData: Omit<KasPayment, 'id' | 'createdAt'>) => {
    const newPayment: KasPayment = {
      ...paymentData,
      id: `kas-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setKasPayments((prev) => [newPayment, ...prev]);
  };

  const deleteKasPayment = (id: string) => {
    setKasPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const updateKasPayment = (id: string, paymentData: Partial<KasPayment>) => {
    setKasPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...paymentData } : p))
    );
  };

  // Member Actions
  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: `m-${Date.now()}`,
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const updateMember = (id: string, memberData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...memberData } : m))
    );
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Event Actions
  const addEvent = (eventData: Omit<OrganizationEvent, 'id' | 'createdAt' | 'expenses'>) => {
    const newEvent: OrganizationEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      expenses: [],
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, eventData: Partial<OrganizationEvent>) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...eventData } : ev))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Expense Actions
  const addExpenseItem = (
    eventId: string, 
    item: Omit<EventExpenseItem, 'id' | 'eventId' | 'createdAt' | 'totalPrice'>
  ) => {
    const totalPrice = item.quantity * item.unitPrice;
    const newItem: EventExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`,
      eventId,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            expenses: [newItem, ...(ev.expenses || [])],
          };
        }
        return ev;
      })
    );
  };

  const updateExpenseItem = (
    eventId: string,
    itemId: string,
    itemData: Partial<EventExpenseItem>
  ) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const updatedExpenses = (ev.expenses || []).map((exp) => {
            if (exp.id === itemId) {
              const merged = { ...exp, ...itemData };
              merged.totalPrice = merged.quantity * merged.unitPrice;
              return merged;
            }
            return exp;
          });
          return { ...ev, expenses: updatedExpenses };
        }
        return ev;
      })
    );
  };

  const deleteExpenseItem = (eventId: string, itemId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            expenses: (ev.expenses || []).filter((exp) => exp.id !== itemId),
          };
        }
        return ev;
      })
    );
  };

  const resetToDefaultData = () => {
    setMembers(initialMembers);
    setKasPayments(initialKasPayments);
    setEvents(initialEvents);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.KAS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
  };

  return (
    <FinanceContext.Provider
      value={{
        members,
        kasPayments,
        events,
        summary,
        addKasPayment,
        deleteKasPayment,
        updateKasPayment,
        addMember,
        updateMember,
        deleteMember,
        addEvent,
        updateEvent,
        deleteEvent,
        addExpenseItem,
        updateExpenseItem,
        deleteExpenseItem,
        resetToDefaultData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

