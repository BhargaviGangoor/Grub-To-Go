import { useState, useEffect } from "react";

interface DCTDisplayProps {
  token: string;
  expiresIn: number;
  onExpire?: () => void;
}

export default function DCTDisplay({ token, expiresIn, onExpire }: DCTDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(expiresIn);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeLeft(expiresIn);
  }, [expiresIn, token]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const percentage = (timeLeft / expiresIn) * 100;
  const isUrgent = timeLeft < 120;

  return (
    <div className="w-full mt-6 animate-slide-up">
      <h2 className="text-xs font-bold text-brand/80 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isUrgent ? "bg-red-500 animate-ping" : "bg-brand-orange"}`}></span>
        V. Cryptographic Dining Lease Secured
      </h2>

      <div className={`rounded-2xl p-5 border bg-white ${
        isUrgent
          ? "border-rose-300 shadow-sm bg-rose-50/20"
          : "border-zinc-200 shadow-sm"
      }`}>

        {/* Token copy section */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-50 border border-zinc-150 rounded-xl p-4">
          <div className="flex-1 overflow-hidden">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
              Active Capability Lease Token
            </span>
            <code className="text-sm font-mono text-brand break-all select-all font-bold tracking-wide">
              {token}
            </code>
          </div>
          <button
            onClick={copyToClipboard}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              copied
                ? "bg-brand text-white border-brand"
                : "bg-white border-zinc-200 hover:border-brand/40 text-brand/80 hover:text-brand"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy Token</span>
              </>
            )}
          </button>
        </div>

        {/* Live Timer Meter */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-zinc-500 font-bold">Lease Expiry Timer:</span>
            <span className={`text-sm font-bold ${isUrgent ? "text-rose-600 animate-pulse" : "text-brand"}`}>
              ⏱️ {timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}
            </span>
          </div>

          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                isUrgent ? "bg-rose-500 animate-pulse" : "bg-brand"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Capabilities list */}
        <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-bold">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Inventory Reservation Lock</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-bold">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Fixed Price Lock Agreement</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-bold">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Kitchen Slot Allocation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
