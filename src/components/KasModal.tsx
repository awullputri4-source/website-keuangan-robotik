import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wallet, 
  CreditCard, 
  Banknote, 
  Upload, 
  Check, 
  Building2,
  Calendar,
  User,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { KasPayment, BankOrWallet, PaymentMethod, DivisionType } from '../types';

interface KasModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPayment?: KasPayment | null;
}

const PRESET_AMOUNTS = [10000, 20000, 25000, 50000, 100000];
const BANKS_WALLETS: BankOrWallet[] = [
  'BCA',
  'Mandiri',
  'BRI',
  'BNI',
  'BSI',
  'Dana',
  'GoPay',
  'OVO',
  'ShopeePay',
];

export const KasModal: React.FC<KasModalProps> = ({
  isOpen,
  onClose,
  editPayment,
}) => {
  const { members, addKasPayment, updateKasPayment } = useFinance();

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [nim, setNim] = useState('');
  const [division, setDivision] = useState<DivisionType>('Pemrograman & AI');
  const [period, setPeriod] = useState('November 2024');
  const [amount, setAmount] = useState<number>(25000);
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [bankOrWallet, setBankOrWallet] = useState<BankOrWallet>('BCA');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('Nabila Syahrani (Bendahara)');
  const [proofImage, setProofImage] = useState<string>('');

  useEffect(() => {
    if (editPayment) {
      setSelectedMemberId(editPayment.memberId);
      setMemberName(editPayment.memberName);
      setNim(editPayment.nim);
      setDivision(editPayment.division);
      setPeriod(editPayment.period);
      setAmount(editPayment.amount);
      setPaymentDate(editPayment.paymentDate);
      setPaymentMethod(editPayment.paymentMethod);
      setBankOrWallet(editPayment.bankOrWallet || 'BCA');
      setReferenceNumber(editPayment.referenceNumber || '');
      setNotes(editPayment.notes || '');
      setVerifiedBy(editPayment.verifiedBy);
      setProofImage(editPayment.proofImageUrl || '');
    } else {
      // Default to first member if available
      if (members.length > 0) {
        setSelectedMemberId(members[0].id);
        setMemberName(members[0].name);
        setNim(members[0].nim);
        setDivision(members[0].division);
      }
      setPeriod('November 2024');
      setAmount(25000);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('transfer');
      setBankOrWallet('BCA');
      setReferenceNumber('');
      setNotes('');
      setProofImage('');
    }
  }, [editPayment, members, isOpen]);

  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    const m = members.find((item) => item.id === id);
    if (m) {
      setMemberName(m.name);
      setNim(m.nim);
      setDivision(m.division);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !amount || amount <= 0) {
      alert('Mohon lengkapi nama anggota dan nominal kas.');
      return;
    }

    const payload = {
      memberId: selectedMemberId || 'custom',
      memberName,
      nim,
      division,
      period,
      amount: Number(amount),
      paymentDate,
      paymentMethod,
      bankOrWallet: paymentMethod === 'cash' ? 'Tunai (Cash)' : bankOrWallet,
      referenceNumber: paymentMethod === 'transfer' ? referenceNumber : undefined,
      proofImageUrl: proofImage || undefined,
      notes,
      verifiedBy,
    };

    if (editPayment) {
      updateKasPayment(editPayment.id, payload);
    } else {
      addKasPayment(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editPayment ? 'Edit Setoran Uang Kas' : 'Catat Penyetoran Uang Kas'}
              </h2>
              <p className="text-xs text-slate-400">
                Pilih metode pembayaran tunai (cash) atau transfer perbankan/e-wallet
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Member Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Pilih Anggota Robotik
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => handleMemberChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.nim} ({m.division})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                NIM
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="21053461201"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Divisi
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as DivisionType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Mekanik & Hardware">Mekanik & Hardware</option>
                <option value="Elektronika & PCB">Elektronika & PCB</option>
                <option value="Pemrograman & AI">Pemrograman & AI</option>
                <option value="Desain & Kreatif">Desain & Kreatif</option>
                <option value="Manajemen & Humas">Manajemen & Humas</option>
              </select>
            </div>
          </div>

          {/* Period & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Periode Kas
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Contoh: November 2024"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Penyetoran
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Amount and presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nominal Uang Kas (Rp)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                    amount === amt
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min="1000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold text-base focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector: CASH vs TRANSFER */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span>Tunai (Cash)</span>
                {paymentMethod === 'cash' && <Check className="w-4 h-4 text-emerald-400 ml-auto" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>Transfer Bank / E-Wallet</span>
                {paymentMethod === 'transfer' && <Check className="w-4 h-4 text-cyan-400 ml-auto" />}
              </button>
            </div>
          </div>

          {/* Conditional Transfer Details */}
          {paymentMethod === 'transfer' && (
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    Pilihan Bank / E-Wallet
                  </label>
                  <select
                    value={bankOrWallet}
                    onChange={(e) => setBankOrWallet(e.target.value as BankOrWallet)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {BANKS_WALLETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    No. Referensi / ID Transaksi
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Contoh: TRX-98231 atau No Ref Bank"
                  />
                </div>
              </div>

              {/* Upload Bukti Transfer */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  Lampiran Bukti Transfer (Opsional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium text-slate-200 transition">
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span>Pilih Foto Bukti</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {proofImage && (
                    <div className="flex items-center gap-2">
                      <img
                        src={proofImage}
                        alt="Bukti Transfer"
                        className="w-10 h-10 object-cover rounded-lg border border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setProofImage('')}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  )}
                  {!proofImage && (
                    <span className="text-xs text-slate-400">
                      Bisa screenshot struk m-banking / QRIS
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes & Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Diterima & Diverifikasi Oleh
              </label>
              <input
                type="text"
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Nama Bendahara"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catatan / Keterangan Tambahan
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Contoh: Lunas kas bulan Nov"
              />
            </div>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/40 transition active:scale-95"
            >
              {editPayment ? 'Simpan Perubahan' : 'Catat Penyetoran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

