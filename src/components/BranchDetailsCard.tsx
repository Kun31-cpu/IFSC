import React, { useState } from "react";
import { BranchDetail } from "../types";
import { Copy, Check, MapPin, Share2, Phone, Briefcase, Landmark, Info, Sparkles } from "lucide-react";

interface BranchDetailsCardProps {
  detail: BranchDetail;
  isAiResult?: boolean;
  onToggleFavorite?: (ifsc: string) => void;
  isFavorite?: boolean;
}

export const BranchDetailsCard: React.FC<BranchDetailsCardProps> = ({
  detail,
  isAiResult = false,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShare = () => {
    const textToShare = `Bank: ${detail.bank || "N/A"}\nBranch: ${detail.branch}\nIFSC: ${detail.ifsc}\nMICR: ${detail.micr || "N/A"}\nAddress: ${detail.address}\nContact: ${detail.contact || "N/A"}`;
    navigator.clipboard.writeText(textToShare);
    setCopiedField("share");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getBankInitial = () => {
    const bankName = detail.bank || typeof detail.bank === "string" ? detail.bank : "Bank";
    const cleanBank = bankName.replace(/(bank|ltd|limited|india|cooperative)/gi, "").trim();
    if (cleanBank.length > 0) {
      return cleanBank.slice(0, 2).toUpperCase();
    }
    return "BK";
  };

  const mapsQuery = encodeURIComponent(`${detail.bank || ""} ${detail.branch} branch ${detail.city}`);

  return (
    <div className="space-y-3 animate-fade-up">
      {/* 1. Bank Issuer Card (Gradient Box) */}
      <div className="col-span-2 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-5 flex flex-col justify-between shadow-lg shadow-sky-900/20 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-4 -translate-y-4"></div>
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-100 flex items-center gap-1">
              <Landmark size={12} />
              Bank Issuer
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                {detail.ifsc.slice(0, 4)}
              </span>
              {isAiResult && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 flex items-center gap-1 font-sans">
                  <Sparkles size={10} />
                  AI Resolved
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center font-black text-white italic text-lg select-none border border-white/10">
              {getBankInitial()}
            </div>
            
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(detail.ifsc)}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-md border border-white/10 cursor-pointer"
                title={isFavorite ? "Remove from favorite" : "Save to favorites"}
                id={`fav-btn-${detail.ifsc}`}
              >
                <svg
                  className={`w-5 h-5 ${isFavorite ? "fill-amber-400 text-amber-400" : "text-white"}`}
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.192-.373.714-.373.908 0l2.124 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.514-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-6 z-10">
          <h2 className="text-xl font-bold tracking-tight">{detail.bank || "Registered Indian Bank"}</h2>
          <p className="text-xs text-sky-200 mt-1 font-semibold">{detail.branch}</p>
        </div>
      </div>

      {/* Grid wrapper for secondary bento boxes */}
      <div className="grid grid-cols-2 gap-3">
        {/* 2. IFSC Code Card */}
        <div className="col-span-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4 relative group">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block mb-1 font-semibold">IFSC Code</span>
          <span className="text-sm md:text-base font-mono font-bold text-sky-600 dark:text-sky-400 block">{detail.ifsc}</span>
          <button
            onClick={() => handleCopy(detail.ifsc, "ifsc")}
            className="absolute top-3 right-3 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 opacity-60 group-hover:opacity-100 hover:opacity-100 transition-opacity cursor-pointer"
            title="Copy IFSC"
            id={`copy-ifsc-btn-${detail.ifsc}`}
          >
            {copiedField === "ifsc" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-500" />}
          </button>
        </div>

        {/* 3. MICR Card */}
        <div className="col-span-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4 relative group">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block mb-1 font-semibold">MICR Code</span>
          <span className="text-sm md:text-base font-mono font-bold text-slate-700 dark:text-slate-200 block">{detail.micr || "N/A"}</span>
          {detail.micr && (
            <button
              onClick={() => handleCopy(detail.micr, "micr")}
              className="absolute top-3 right-3 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 opacity-60 group-hover:opacity-100 hover:opacity-100 transition-opacity cursor-pointer"
              title="Copy MICR"
              id={`copy-micr-btn-${detail.ifsc}`}
            >
              {copiedField === "micr" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-500" />}
            </button>
          )}
        </div>

        {/* 4. Address Card */}
        <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block mb-1 font-semibold font-sans">Branch Address</span>
          <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{detail.address}</p>
        </div>

        {/* Map Preview Card */}
        {detail.address && (
          <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl overflow-hidden h-44 relative group shadow-sm">
            <span className="absolute top-2.5 left-3 z-10 text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white/95 dark:bg-slate-900/95 px-2.5 py-0.5 rounded-lg font-bold select-none border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-xs flex items-center gap-1 shadow-sm">
              <MapPin size={10} className="text-rose-500 animate-pulse" />
              Interactive Location Map
            </span>
            <iframe
              title="Branch Location Map Preview"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${detail.bank || "Bank"} ${detail.branch} ${detail.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%] dark:invert-[90%] dark:hue-rotate-[180deg] opacity-90 hover:opacity-100 transition-opacity"
            ></iframe>
          </div>
        )}

        {/* 5. Branch Name Card */}
        <div className="col-span-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block mb-1 font-semibold">Branch</span>
          <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 block">{detail.branch}</span>
        </div>

        {/* 6. Contact phone Card */}
        <div className="col-span-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block mb-1 font-semibold">Contact Assistance</span>
          <span className="text-[11px] md:text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 block truncate">{detail.contact || "N/A"}</span>
        </div>

        {/* 7. Geographical parameters row */}
        <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block mb-2 font-semibold">Location Specifications</span>
          <div className="grid grid-cols-3 gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <div>
              <span className="text-[9px] uppercase tracking-wide text-slate-400 dark:text-slate-500 block">City</span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">{detail.city}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wide text-slate-400 dark:text-slate-500 block">District</span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">{detail.district}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wide text-slate-400 dark:text-slate-500 block">State</span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">{detail.state}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Actions card bar */}
      <div className="flex gap-2.5 pt-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800/30 flex items-center justify-center gap-1.5 transition-all"
        >
          <MapPin size={13} className="text-rose-500" />
          Navigate Maps
        </a>

        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10 transition-all cursor-pointer"
          id={`share-btn-${detail.ifsc}`}
        >
          {copiedField === "share" ? (
            <>
              <Check size={13} />
              Copied Info!
            </>
          ) : (
            <>
              <Share2 size={13} />
              Share Branch
            </>
          )}
        </button>
      </div>
    </div>
  );
};
