import React, { useState } from "react";
import { Info, HelpCircle, ArrowRight, BookOpen, AlertCircle, ShieldCheck } from "lucide-react";

export const BankGuides: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ifsc" | "micr" | "tips">("ifsc");

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-xs backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-455 font-semibold">
          <BookOpen size={18} />
        </div>
        <div>
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
            Quick Reference Guide
          </h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Learn the structural anatomy of Indian banking codes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <button
          onClick={() => setActiveTab("ifsc")}
          className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "ifsc" ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50 shadow-xs" : "hover:text-slate-800 dark:hover:text-slate-200"}`}
          id="tab-guide-ifsc"
        >
          IFSC Structure
        </button>
        <button
          onClick={() => setActiveTab("micr")}
          className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "micr" ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50 shadow-xs" : "hover:text-slate-800 dark:hover:text-slate-200"}`}
          id="tab-guide-micr"
        >
          MICR Anatomy
        </button>
        <button
          onClick={() => setActiveTab("tips")}
          className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "tips" ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50 shadow-xs" : "hover:text-slate-800 dark:hover:text-slate-200"}`}
          id="tab-guide-tips"
        >
          Safety Tips
        </button>
      </div>

      {/* Accordion Panels */}
      {activeTab === "ifsc" && (
        <div className="space-y-4 animate-fade-up">
          <div className="p-3 bg-sky-50/40 dark:bg-sky-950/10 rounded-2xl border border-sky-100/50 dark:border-sky-900/10">
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              An <strong>IFSC (Indian Financial System Code)</strong> is an 11-character alphanumeric code that uniquely references specific branches participating in electronic transfers (NEFT, RTGS, IMPS).
            </p>
          </div>

          {/* Graphical Anatomy Map */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
              ANATOMY OF IFSC (e.g. SBIN0000813)
            </span>
            <div className="grid grid-cols-11 gap-1 text-center font-mono font-bold text-xs">
              <div className="bg-sky-500/20 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 p-2 rounded-lg border border-sky-200/50 dark:border-sky-900/30">S</div>
              <div className="bg-sky-500/20 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 p-2 rounded-lg border border-sky-200/50 dark:border-sky-900/30">B</div>
              <div className="bg-sky-500/20 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 p-2 rounded-lg border border-sky-200/50 dark:border-sky-900/30">I</div>
              <div className="bg-sky-500/20 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 p-2 rounded-lg border border-sky-200/50 dark:border-sky-900/30">N</div>
              <div className="bg-amber-500/20 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 p-2 rounded-lg border border-amber-200/50 dark:border-amber-900/30">0</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-300 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">0</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-300 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">0</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-300 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">0</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-300 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">8</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-300 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">1</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-300 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">3</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                First 4 Characters:
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Represents the unique <strong>Bank identity</strong> name prefix (e.g., "SBIN" for SBI).
              </p>
            </div>
            <div>
              <span className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                5th Character:
              </span>
              <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed">
                Strictly <strong>0 (Zero)</strong>. Reserved by the central RBI for expanding bank names in the future.
              </p>
            </div>
            <div>
              <span className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                Last 6 Characters:
              </span>
              <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed">
                Uniquely allocates the standard physical bank <strong>branch identity</strong> identifier code.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "micr" && (
        <div className="space-y-4 animate-fade-up">
          <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/10">
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              An <strong>MICR (Magnetic Ink Character Recognition)</strong> code is a 9-digit code printed using safe magnet-receptive ink at the very bottom of valid cheques, designed for automated sorting machines.
            </p>
          </div>

          {/* Graphical Anatomy Map */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
              ANATOMY OF MICR (e.g. 560240002)
            </span>
            <div className="grid grid-cols-9 gap-1 text-center font-mono font-bold text-xs">
              <div className="bg-violet-500/20 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 p-2 rounded-lg border border-violet-200/50 dark:border-violet-900/30">5</div>
              <div className="bg-violet-500/20 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 p-2 rounded-lg border border-violet-200/50 dark:border-violet-900/30">6</div>
              <div className="bg-violet-500/20 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 p-2 rounded-lg border border-violet-200/50 dark:border-violet-900/30">0</div>
              <div className="bg-pink-500/20 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 p-2 rounded-lg border border-pink-200/50 dark:border-pink-900/30">2</div>
              <div className="bg-pink-500/20 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 p-2 rounded-lg border border-pink-200/50 dark:border-pink-900/30">4</div>
              <div className="bg-pink-500/20 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 p-2 rounded-lg border border-pink-200/50 dark:border-pink-900/30">0</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-350 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">0</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-350 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">0</div>
              <div className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/5 dark:text-slate-350 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">2</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                First 3 Digits:
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Represents the **City / Location Code** where the cheque clearance center is situated (e.g. "560" for Bengaluru).
              </p>
            </div>
            <div>
              <span className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                Middle 3 Digits:
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Represents the unique **Bank Code identifier** assigned to index institutions (e.g. "240" for HDFC Bank).
              </p>
            </div>
            <div>
              <span className="text-slate-900 dark:text-slate-100 font-bold flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Last 3 Digits:
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                References the explicit **branch index code** to map specific operational centers.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tips" && (
        <div className="space-y-3 text-xs animate-fade-up">
          <div className="flex gap-2.5 items-start p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/10">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">IFSC verification is safe</h5>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Verifying bank IFSC codes is public information. Knowing an IFSC does not grant third parties access to withdraw funds from any account.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start p-3 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl border border-amber-100/50 dark:border-amber-900/10">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">Check spelling prior to transfers</h5>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Always ensure that the 5th character is typed as numerical <strong>0 (Zero)</strong> and not alphabetical "O". A wrong IFSC can redirect or bounce your fund settlements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
