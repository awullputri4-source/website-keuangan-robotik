import React, { useState } from 'react';
import { X, Users, UserPlus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Member, DivisionType } from '../types';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIVISIONS: DivisionType[] = [
  'Mekanik & Hardware',
  'Elektronika & PCB',
  'Pemrograman & AI',
  'Desain & Kreatif',
  'Manajemen & Humas',
];

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose }) => {
  const { members, addMember, updateMember, deleteMember } = useFinance();
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [division, setDivision] = useState<DivisionType>('Pemrograman & AI');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Alumni' | 'Cuti'>('Aktif');
  const [joinedYear, setJoinedYear] = useState('2024');

  const resetForm = () => {
    setEditingMember(null);
    setNim('');
    setName('');
    setDivision('Pemrograman & AI');
    setPhone('');
    setEmail('');
    setStatus('Aktif');
    setJoinedYear('2024');
  };

  const handleEditClick = (m: Member) => {
    setEditingMember(m);
    setNim(m.nim);
    setName(m.name);
    setDivision(m.division);
    setPhone(m.phone);
    setEmail(m.email);
    setStatus(m.status);
    setJoinedYear(m.joinedYear);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nim) {
      alert('Nama dan NIM wajib diisi.');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, {
        nim,
        name,
        division,
        phone,
        email,
        status,
        joinedYear,
      });
    } else {
      addMember({
        nim,
        name,
        division,
        phone,
        email,
        status,
        joinedYear,
      });
    }

    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Kelola Anggota UKM Robotik</h2>
              <p className="text-xs text-slate-400">
                Total {members.length} anggota terdaftar dalam database keuangan
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6 max-h-[75vh] overflow-y-auto">
          
          {/* Add / Edit Form (2 cols) */}
          <div className="md:col-span-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              {editingMember ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Contoh: Muhammad Farhan"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">NIM Mahasiswa</label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Contoh: 21053461201"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Divisi / Bidang</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value as DivisionType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Angkatan</label>
                  <input
                    type="text"
                    value={joinedYear}
                    onChange={(e) => setJoinedYear(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Alumni' | 'Cuti')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Cuti">Cuti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">No. WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="08123456789"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                {editingMember && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Batal Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-900/40"
                >
                  {editingMember ? 'Perbarui Data' : '+ Simpan Anggota'}
                </button>
              </div>
            </form>
          </div>

          {/* Member List (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Daftar Anggota ({members.length})
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 hover:border-slate-600 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{m.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {m.nim}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{m.division}</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> {m.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditClick(m)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition"
                      title="Edit Anggota"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus anggota ${m.name}?`)) {
                          deleteMember(m.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
                      title="Hapus Anggota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

