"use client";
import { useState } from "react";

type Tx = { id: number; who: string; amount: number; raw: string; date: string };

function parseWhatsApp(text: string) {
  // Tries to understand "sent 1000 to John" or "tuma 2000 uganda"
  const amountMatch = text.match(/(\d+)/);
  const amount = amountMatch? Number(amountMatch[0]) : 0;
  const whoMatch = text.match(/to\s+([a-zA-Z\s]+)/i) || text.match(/kwa\s+([a-zA-Z\s]+)/i);
  const who = whoMatch? whoMatch[1].trim() : text.slice(0,20);
  return { amount, who };
}

export default function Dashboard() {
  const [txs, setTxs] = useState<Tx[]>([
    { id: 1, who: "John • Uganda", amount: 10000, raw: "Sent 10000 to John Uganda", date: "Today" },
  ]);
  const [input, setInput] = useState("");

  const addFromText = () => {
    if (!input) return;
    const { amount, who } = parseWhatsApp(input);
    if (!amount) { alert("Add amount e.g. 'sent 500 to Mama'"); return; }
    setTxs([{ id: Date.now(), who: who || "Unknown", amount, raw: input, date: "Just now" },...txs]);
    setInput("");
  };

  const total = txs.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#eef6ee] p-4 flex justify-center">
      <div className="w-full max-w- bg-white rounded- shadow-xl border overflow-hidden flex flex-col h-">
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black">P</div>
          <div><p className="font-bold">Pesa True Assistant</p><p className="text-xs opacity-80">online • For true ✓</p></div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-[#e5ddd5] p-3 space-y-3 overflow-auto">
          <div className="bg-white p-3 rounded-lg rounded-tl-none max-w-[80%] text-sm shadow">Karibu! Send message like: <br/><b>"Sent 1000 to John Uganda"</b> or <b>"Tuma 2000 kwa supplier"</b></div>
          {txs.map(t => (
            <div key={t.id} className="flex flex-col items-end">
              <div className="bg-[#dcf8c6] p-3 rounded-lg rounded-tr-none max-w-[85%] shadow text-sm">
                <p>{t.raw}</p><p className="text- text-right opacity-60 mt-1">{t.date}</p>
              </div>
              <div className="bg-black text-white text-xs mt-1 px-3 py-1 rounded-full">Saved: {t.who} • KSh {t.amount.toLocaleString()} ✓</div>
            </div>
          ))}
        </div>

        {/* Total Bar */}
        <div className="bg-black text-white p-3 flex justify-between text-sm"><span>Total: KSh {total.toLocaleString()}</span><span>{txs.length} transfers</span></div>

        {/* Input */}
        <div className="p-3 bg-[#f0f0f0] flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addFromText()} placeholder='Type: Sent 500 to...' className="flex-1 rounded-full px-4 py-3 border text-sm outline-none" />
          <button onClick={addFromText} className="bg-[#25D366] w-12 h-12 rounded-full font-black text-white">↑</button>
        </div>
      </div>
    </div>
  );
}