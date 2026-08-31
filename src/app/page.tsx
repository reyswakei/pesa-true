export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fdf9] text-black">
      <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">P</div>
          Pesa True
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <span>How it works</span><span>Fees</span><span>Support</span>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-full text-sm">Get Started</button>
      </nav>

      <section className="px-6 md:px-20 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <div className="bg-green-100 text-green-700 inline-block px-4 py-1 rounded-full text-xs font-bold mb-4">
            ● LIVE IN KENYA, UGANDA, TANZANIA, RWANDA
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
            Send money <br /><span className="text-green-600">across East</span><br />Africa. For true.
          </h1>
          <p className="text-gray-600 mt-6 text-lg max-w-lg">
            Instant M-Pesa, Airtel Money & MTN transfers. No hidden fees. The rate you see is the money they get.
          </p>
          <div className="flex gap-3 mt-8">
            <button className="bg-green-600 text-white px-8 py-4 rounded-full font-bold">Send Money Now</button>
            <button className="bg-white border px-8 py-4 rounded-full font-bold">Check Rates</button>
          </div>
          <div className="flex gap-6 mt-10 text-sm">
            <div><b className="text-lg">10k+</b><br/>Users</div>
            <div><b className="text-lg">KSh 50M+</b><br/>Sent monthly</div>
            <div><b className="text-lg">2 mins</b><br/>Avg delivery</div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w- h- bg-black rounded- p-3 shadow-2xl">
            <div className="bg-white h-full rounded- p-6 flex flex-col">
              <p className="text-xs text-gray-400">Sending to...</p>
              <h2 className="font-bold text-xl">John • Uganda</h2>
              <div className="bg-gray-100 rounded-2xl p-4 mt-4"><p className="text-xs text-gray-500">You send</p><p className="font-black text-2xl">KSh 10,000</p></div>
              <div className="bg-green-600 text-white rounded-2xl p-4 mt-3"><p className="text-xs text-green-200">They receive</p><p className="font-black text-2xl">UGX 273,400</p><p className="text-xs mt-1">Fee: KSh 99 • Rate: 1 KSh = 27.34 UGX</p></div>
              <button className="bg-black text-white rounded-full py-4 mt-auto font-bold">Confirm & Send</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6 md:px-20">
        <h2 className="text-3xl font-black text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="border rounded-3xl p-8"><div className="text-4xl mb-4">1️⃣</div><h3 className="font-bold text-xl">Enter amount</h3><p className="text-gray-600 mt-2">Type how much you want to send. We show you the exact fee and what they get.</p></div>
          <div className="border rounded-3xl p-8"><div className="text-4xl mb-4">2️⃣</div><h3 className="font-bold text-xl">Add recipient</h3><p className="text-gray-600 mt-2">M-Pesa number, Airtel, MTN. No bank account needed. Takes 10 seconds.</p></div>
          <div className="border rounded-3xl p-8"><div className="text-4xl mb-4">3️⃣</div><h3 className="font-bold text-xl">Money arrives</h3><p className="text-gray-600 mt-2">In under 2 mins. They get SMS confirmation. You get receipt. Done.</p></div>
        </div>
      </section>

      <section className="bg-black text-white py-16 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-black">Ready to send for true?</h2>
        <button className="bg-green-600 px-8 py-4 rounded-full font-bold">Start sending now - it&apos;s free to check rates</button>
      </section>

      <footer className="py-10 text-center text-sm text-gray-400">© 2026 Pesa True • Built in Kisumu for East Africa • No hidden fees, for true.</footer>
    </div>
  );
}