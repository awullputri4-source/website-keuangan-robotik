import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingCart, 
  Tag, 
  FileText, 
  Calendar, 
  User, 
  DollarSign, 
  Upload,
  Layers,
  Calculator
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { EventExpenseItem, ExpenseCategory } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
  editExpense?: EventExpenseItem | null;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Komponen Robot',
  'Alat & Bahan',
  'Konsumsi',
  'Transportasi & Akomodasi',
  'Sewa Venue/Alat',
  'Publikasi & Percetakan',
  'Hadiah & Plakat',
  'Lain-lain',
];

const COMMON_UNITS = ['pcs', 'unit', 'set', 'roll', 'kotak', 'porsi', 'keping', 'paket', 'meter', 'lembar'];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventName,
  editExpense,
}) => {
  const { addExpenseItem, updateExpenseItem } = useFinance();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Komponen Robot');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('pcs');
  const [unitPrice, setUnitPrice] = useState<number>(50000);
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [purchasedBy, setPurchasedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');

  useEffect(() => {
    if (editExpense) {
      setName(editExpense.name);
      setCategory(editExpense.category);
      setQuantity(editExpense.quantity);
      setUnit(editExpense.unit);
      setUnitPrice(editExpense.unitPrice);
      setPurchaseDate(editExpense.purchaseDate);
      setPurchasedBy(editExpense.purchasedBy);
      setNotes(editExpense.notes || '');
      setReceiptImage(editExpense.receiptUrl || '');
    } else {
      setName('');
      setCategory('Komponen Robot');
      setQuantity(1);
      setUnit('pcs');
      setUnitPrice(50000);
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setPurchasedBy('');
      setNotes('');
      setReceiptImage('');
    }
  }, [editExpense, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatedTotal = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || quantity <= 0 || unitPrice < 0) {
      alert('Mohon isi nama barang, kuantitas, dan harga satuan yang valid.');
      return;
    }

    const payload = {
      name,
      category,
      quantity: Number(quantity),
      unit,
      unitPrice: Number(unitPrice),
      purchaseDate,
      purchasedBy: purchasedBy || 'Anggota Tim',
      notes,
      receiptUrl: receiptImage || undefined,
    };

    if (editExpense) {
      updateExpenseItem(eventId, editExpense.id, payload);
    } else {
      addExpenseItem(eventId, payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editExpense ? 'Edit Pengeluaran Barang' : 'Catat Pengeluaran Barang'}
              </h2>
              <p className="text-xs text-cyan-400 font-medium truncate max-w-sm">
                Untuk Acara: {eventName}
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
              Nama Barang / Kebutuhan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
              placeholder="Contoh: Sensor Ultrasonik HC-SR04 / Konsumsi Rapat"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Kategori Pengeluaran
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Qty, Unit, Unit Price */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jumlah (Qty)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Satuan
              </label>
              <input
                type="text"
                list="unit-options"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="pcs / roll"
                required
              />
              <datalist id="unit-options">
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Harga Satuan (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-semibold"
                required
              />
            </div>
          </div>

          {/* Calculated Total Highlight */}
          <div className="p-3.5 bg-gradient-to-r from-slate-800 to-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-rose-400" />
              <div>
                <span className="text-xs text-slate-400">Total Harga Pengeluaran</span>
                <p className="text-[11px] text-slate-500">
                  {quantity} {unit} × {formatRupiah(unitPrice)}
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-rose-400">
              {formatRupiah(calculatedTotal)}
            </span>
          </div>

          {/* Date & Buyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Tanggal Pembelian
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Pembeli / Penanggung Jawab
              </label>
              <input
                type="text"
                value={purchasedBy}
                onChange={(e) => setPurchasedBy(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Nama anggota yang belanja"
              />
            </div>
          </div>

          {/* Receipt / Nota Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              Foto Nota / Struk Pembelian (Opsional)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition">
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Upload Foto Nota</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {receiptImage && (
                <div className="flex items-center gap-2">
                  <img
                    src={receiptImage}
                    alt="Nota"
                    className="w-10 h-10 object-cover rounded-lg border border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setReceiptImage('')}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan / Toko Pembelian
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Contoh: Beli di Toko Robotik Glodok / Nota No. 892"
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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-900/40 transition active:scale-95"
            >
              {editExpense ? 'Perbarui Pengeluaran' : 'Catat Pengeluaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

