"use client";
import { useState, useEffect } from "react";

type Loan = {
  id: string;
  customer_name: string;
  amount: number;
  status: string;
  due_date: string;
  phone?: string;
};

export default function Dashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ customer_name: "", amount: "", phone: "", due_date: "" });

  const fetchLoans = async () => {
    const res = await fetch("/api/loan");
    const data = await res.json();
    if (Array.isArray(data)) setLoans(data);
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleSave = async () => {
    if (!form.customer_name ||!form.amount) return alert("Jaza jina na kiasi");
    await fetch("/api/loan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.customer_name,
        amount: Number(form.amount),
        phone: form.phone,
        due_date: form.due_date || new Date().toISOString(),
        status: "unpaid"
      }),
    });
    setShowModal(false);
    setForm({ customer_name: "", amount: "", phone: "", due_date: "" });
    fetchLoans();
  };

  const totalDeni = loans.filter(l => l.status!== 'paid').reduce((s, l) => s + l.amount, 0);
  const filtered = loans.filter(l => l.customer_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f6f6f3] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Pesa True - Deni Book</h1>
          <button onClick={() => setShowModal(true)} className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-zinc-800">+ Andika Deni</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded- shadow-sm"><p className="text-sm text-zinc-500">Jumla ya Deni</p><p className="text-3xl font-black">KES {totalDeni.toLocaleString()}</p></div>
          <div className="bg-white p-6 rounded- shadow-sm"><p className="text-sm text-zinc-500">Wateja</p><p className="text-3xl font-black">{loans.length}</p></div>
          <div className="bg-white p-6 rounded- shadow-sm"><p className="text-sm text-zinc-500">Walio-chelewa</p><p className="text-3xl font-black text-red-500">{loans.filter(l => l.status === 'unpaid').length}</p></div>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tafuta Jane, Musa..." className="w-full p-4 rounded-full border mb-6 outline-none" />

        <div className="bg-white rounded- p-2">
          {filtered.map(loan => (
            <div key={loan.id} className="flex justify-between items-center p-4 border-b last:border-0">
              <div><p className="font-bold">{loan.customer_name}</p><p className="text-sm text-zinc-500">{loan.phone}</p></div>
              <div className="text-right"><p className="font-black">KES {loan.amount}</p><p className={`text-xs px-2 py-1 rounded-full ${loan.status === 'paid'? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{loan.status}</p></div>
            </div>
          ))}
          {filtered.length === 0 && <p className="p-8 text-center text-zinc-400">Hakuna deni. Andika ya kwanza!</p>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded- p-6">
            <h2 className="text-xl font-black mb-4">Andika Deni Jipya</h2>
            <input placeholder="Jina - e.g Jane" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="w-full p-3 border rounded-xl mb-3" />
            <input placeholder="Kiasi - e.g 500" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full p-3 border rounded-xl mb-3" />
            <input placeholder="Phone - e.g 0712..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 border rounded-xl mb-3" />
            <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full p-3 border rounded-xl mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 p-3 bg-zinc-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 p-3 bg-black text-white rounded-xl font-bold">Save Deni</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}