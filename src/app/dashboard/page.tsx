"use client";
import { useEffect, useState } from "react";

type Debt = {
  id: string;
  customer_name: string;
  phone: string;
  amount: number;
  status: string;
};

export default function Dashboard() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Debt | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/loan");
    const data = await res.json();
    if (Array.isArray(data)) setDebts(data);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (saving) return;
    if (!name || !amount) return alert("Jaza jina na pesa");
    setSaving(true);
    try {
      await fetch("/api/loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, amount: Number(amount) }),
      });
      setName(""); setPhone(""); setAmount("");
      setShowAdd(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const markPaid = async (id: string) => {
    await fetch(`/api/loan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    setSelected(null);
    load();
  };

  const deleteDeni = async (id: string) => {
    if (!confirm("Futa huyu mteja kabisa?")) return;
    await fetch(`/api/loan/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  const filtered = debts.filter(d => 
    d.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.includes(search)
  );

  const jumla = filtered.filter(d => d.status !== 'paid').reduce((s, d) => s + Number(d.amount), 0);
  const wateja = filtered.length;
  const chelewa = filtered.filter(d => d.status === 'unpaid').length;

  return (
    <div className="min-h-screen bg-[#fcfaf3] p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black">Pesa True - Deni Book</h1>
        <button onClick={() => setShowAdd(true)} className="bg-black text-white px-6 py-3 rounded-full font-bold">+ Andika Deni</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 shadow"><p className="text-gray-500">Jumla ya Deni</p><p className="text-3xl font-black">KES {jumla.toLocaleString()}</p></div>
        <div className="bg-white p-6 shadow"><p className="text-gray-500">Wateja</p><p className="text-3xl font-black">{wateja}</p></div>
        <div className="bg-white p-6 shadow"><p className="text-gray-500">Walio-chelewa</p><p className="text-3xl font-black text-red-600">{chelewa}</p></div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tafuta Jane, Musa..." className="w-full p-4 rounded-full border border-black mb-6 bg-transparent" />

      <div className="bg-white shadow">
        {filtered.map((d) => (
          <div key={d.id} onClick={() => setSelected(d)} className="flex justify-between items-center p-5 border-b last:border-0 cursor-pointer hover:bg-gray-50">
            <div><p className="font-bold">{d.customer_name}</p><p className="text-gray-500 text-sm">{d.phone}</p></div>
            <div className="text-right"><p className="font-black">KES {Number(d.amount).toLocaleString()}</p><span className={`text-xs px-3 py-1 rounded-full ${d.status==='paid'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{d.status}</span></div>
          </div>
        ))}
        {filtered.length===0 && <p className="p-10 text-center text-gray-400">Hakuna madeni</p>}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="font-black text-xl mb-4">Andika Deni Mpya</h2>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jina - e.g Juma" className="w-full p-3 border rounded-xl mb-3" />
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Simu - 079..." className="w-full p-3 border rounded-xl mb-3" />
            <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="Kiasi - 1000" className="w-full p-3 border rounded-xl mb-4" />
            <div className="flex gap-2">
              <button onClick={()=>setShowAdd(false)} className="flex-1 p-3 border rounded-xl">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="flex-1 p-3 bg-black text-white rounded-xl disabled:opacity-50">{saving?'Inahifadhi...':'Save Deni'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL WHEN YOU CLICK DEBTOR */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
            <h2 className="font-black text-xl">{selected.customer_name}</h2>
            <p className="text-gray-500 mb-1">{selected.phone}</p>
            <p className="font-black text-lg mb-6">KES {Number(selected.amount).toLocaleString()} - {selected.status}</p>
            <div className="grid gap-2">
              <a href={`tel:${selected.phone}`} className="p-3 bg-blue-600 text-white rounded-xl text-center font-bold">Piga Simu</a>
              <a href={`https://wa.me/${selected.phone?.replace(/^0/,'254')}`} target="_blank" className="p-3 bg-green-600 text-white rounded-xl text-center font-bold">WhatsApp</a>
              {selected.status!=='paid' && <button onClick={()=>markPaid(selected.id)} className="p-3 bg-black text-white rounded-xl font-bold">Mark Lipa</button>}
              <button onClick={()=>deleteDeni(selected.id)} className="p-3 bg-red-100 text-red-600 rounded-xl font-bold">Futa Deni</button>
              <button onClick={()=>setSelected(null)} className="p-3 border rounded-xl">Funga</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}