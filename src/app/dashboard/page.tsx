"use client";
import { useEffect, useState } from "react";

type Debt = {
  id: string;
  customer_name: string;
  phone: string;
  amount: number;
  due_date: string | null;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [filter, setFilter] = useState<"all"|"unpaid"|"paid">("unpaid");
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await fetch("/api/loan");
    const data = await res.json();
    setDebts(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name || !amount) return alert("Name + Amount needed");
    await fetch("/api/loan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, amount, due_date: due || null }),
    });
    setName(""); setPhone(""); setAmount(""); setDue("");
    load();
  };
  const markPaid = async (id: string, current: string) => {
    const newStatus = current === "paid" ? "unpaid" : "paid";
    await fetch(`/api/loan/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this debt?")) return;
    await fetch(`/api/loan/${id}`, { method: "DELETE" });
    load();
  };
  const formatPhone = (p: string) => {
    if (!p) return "";
    let clean = p.replace(/\s/g, "");
    if (clean.startsWith("0")) return "254" + clean.slice(1);
    if (clean.startsWith("+")) return clean.slice(1);
    return clean;
  };
  const isOverdue = (d: Debt) => {
    if (!d.due_date || d.status === "paid") return false;
    return new Date(d.due_date) < new Date(new Date().setHours(0,0,0,0));
  };

  const totalUnpaid = debts.filter(d => d.status === "unpaid").reduce((s, d) => s + Number(d.amount), 0);
  const filtered = debts.filter(d => {
    if (filter !== "all" && d.status !== filter) return false;
    if (search && !d.customer_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", fontFamily: "Inter, sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Pesa True 💰</h1>
      <p style={{ color: "#666", marginTop: -10 }}>Smart Duka Deni Manager</p>

      <div style={{ background: "black", color: "white", padding: 20, borderRadius: 16, margin: "20px 0" }}>
        <div style={{ opacity: 0.7 }}>Total Owed (Unpaid)</div>
        <div style={{ fontSize: 36, fontWeight: 900 }}>KES {totalUnpaid.toLocaleString()}</div>
        <div style={{ opacity: 0.7 }}>{debts.filter(d=>d.status==="unpaid").length} debtors • {debts.filter(d=>isOverdue(d)).length} overdue</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <input placeholder="Customer Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }} />
        <input placeholder="Phone 07..." value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }} />
        <input placeholder="Amount KES" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }} />
        <input type="date" value={due} onChange={e => setDue(e.target.value)} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }} />
        <button onClick={add} style={{ gridColumn: "span 2", padding: 14, background: "black", color: "white", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer" }}>+ Add Debt</button>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "18px 0", alignItems: "center" }}>
        <input placeholder="Search name..." value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        <div style={{ display: "flex", gap: 4, background: "#f3f3f3", padding: 4, borderRadius: 10 }}>
          {(["all","unpaid","paid"] as const).map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: filter===f ? "white" : "transparent", fontWeight: filter===f ? 700 : 400, boxShadow: filter===f ? "0 1px 3px rgba(0,0,0,0.1)" : "none", textTransform: "capitalize", cursor:"pointer" }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.map(d => {
        const overdue = isOverdue(d);
        return (
          <div key={d.id} style={{ border: `1px solid ${overdue ? "#fecaca" : "#eee"}`, background: overdue ? "#fef2f2" : "white", padding: 14, borderRadius: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", opacity: d.status === "paid" ? 0.6 : 1 }}>
            <div>
              <b>{d.customer_name}</b> - KES {Number(d.amount).toLocaleString()} <span style={{ fontSize: 11, background: d.status==="paid" ? "#dcfce7" : overdue ? "#fee2e2" : "#fef3c7", padding: "3px 8px", borderRadius: 20, marginLeft: 6 }}>{overdue ? "OVERDUE" : d.status}</span>
              <div style={{ fontSize: 13, color: "#666" }}>{d.phone} {d.due_date ? `• Due: ${d.due_date}` : ""}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <a href={`https://wa.me/${formatPhone(d.phone)}?text=${encodeURIComponent(`Hi ${d.customer_name}, reminder you owe KES ${d.amount} to Pesa True. Due ${d.due_date || "soon"}. Thanks!`)}`} target="_blank" style={{ padding: "7px 10px", background: "#25D366", color: "white", borderRadius: 7, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>WhatsApp</a>
              <button onClick={() => markPaid(d.id, d.status)} style={{ padding: "7px 10px", border: "1px solid #ddd", borderRadius: 7, fontSize: 13, background: "white", cursor:"pointer" }}>{d.status==="paid" ? "Unpaid" : "Paid"}</button>
              <button onClick={() => del(d.id)} style={{ padding: "7px 10px", border: "none", color: "red", fontSize: 14, background: "transparent", cursor:"pointer" }}>X</button>
            </div>
          </div>
        )
      })}
      {filtered.length === 0 && <div style={{ textAlign:"center", color:"#999", padding: 20 }}>No debts here</div>}
    </div>
  );
}