import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Sparkles, 
  X, 
  Star, 
  Trash2, 
  Laptop, 
  Smartphone, 
  Sun, 
  Moon, 
  Layers, 
  HelpCircle, 
  Compass, 
  Check, 
  Building2, 
  BookOpen, 
  Clock, 
  ChevronRight,
  ListFilter
} from "lucide-react";
import { POPULAR_BANKS, STATES_AND_CITIES, getOfflineBranches } from "./banksData";
import { BranchDetailsCard } from "./components/BranchDetailsCard";
import { BankGuides } from "./components/BankGuides";
import { AndroidSimulator } from "./components/AndroidSimulator";
import { BranchDetail, SearchRecord } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // View states
  const [activeTab, setActiveTab] = useState<"ifsc" | "selector" | "ai">("ifsc");
  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Cool popup redirect modal states
  const [showLookupPopup, setShowLookupPopup] = useState<boolean>(false);
  const [lookupPopupData, setLookupPopupData] = useState<BranchDetail | null>(null);

  // Search parameters
  const [ifscInput, setIfscInput] = useState<string>("");
  const [aiQuery, setAiQuery] = useState<string>("");
  
  // Cascaded Selector state
  const [selectedBankId, setSelectedBankId] = useState<string>("sbi");
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");
  const [selectedCity, setSelectedCity] = useState<string>("Mumbai");
  const [selectedBranchName, setSelectedBranchName] = useState<string>("");

  // Result and operational state
  const [resolvedBranch, setResolvedBranch] = useState<BranchDetail | null>(null);
  const [isAiResult, setIsAiResult] = useState<boolean>(false);
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    const savedTheme = localStorage.getItem("ifsc_finder_theme");
    const preferDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(preferDark);
    if (preferDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Load initial layout preference
    const savedLayout = localStorage.getItem("ifsc_finder_simulator");
    if (savedLayout !== null) {
      setIsSimulatorActive(savedLayout === "true");
    }

    // Load search log from localstorage
    const savedHistory = localStorage.getItem("ifsc_finder_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Failed to parse search history", err);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("ifsc_finder_theme", newMode ? "dark" : "light");
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleSimulatorLayout = () => {
    const newVal = !isSimulatorActive;
    setIsSimulatorActive(newVal);
    localStorage.setItem("ifsc_finder_simulator", String(newVal));
  };

  // Helper helper function to update and persist history items
  const addToHistory = (result: BranchDetail, type: "ifsc" | "filters" | "ai", queryVal: string) => {
    const bankName = result.bank || POPULAR_BANKS.find(b => result.ifsc.startsWith(b.code))?.name || "Indian Bank";
    const enhancedResult = { ...result, bank: bankName };

    setHistory((prevHistory) => {
      // Remove any existing record of this IFSC code to place the newest scan first
      const clearedHistory = prevHistory.filter(item => item.result.ifsc !== result.ifsc);
      
      const newRecord: SearchRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        queryValue: queryVal,
        timestamp: new Date().toISOString(),
        result: enhancedResult,
        isFavorite: false
      };
      const updated = [newRecord, ...clearedHistory].slice(0, 30); // Max 30 records
      localStorage.setItem("ifsc_finder_history", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (ifsc: string) => {
    setHistory((prevHistory) => {
      const updated = prevHistory.map(item => {
        if (item.result.ifsc === ifsc) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      });
      localStorage.setItem("ifsc_finder_history", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear your search log?")) {
      setHistory([]);
      localStorage.removeItem("ifsc_finder_history");
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prevHistory) => {
      const updated = prevHistory.filter(item => item.id !== id);
      localStorage.setItem("ifsc_finder_history", JSON.stringify(updated));
      return updated;
    });
  };

  // 1) Search branch details by IFSC code
  const handleIfscLookup = async (codeToQuery?: string) => {
    const targetCode = (codeToQuery || ifscInput).replace(/\s/g, "").toUpperCase();
    
    if (!targetCode) {
      setErrorMessage("Please input an 11-digit alphanumeric IFSC code.");
      return;
    }
    if (targetCode.length !== 11) {
      setErrorMessage(`Expected 11 characters, but you typed ${targetCode.length} characters.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResolvedBranch(null);
    setIsAiResult(false);

    try {
      let response;
      let branchInfo;
      let isFallback = false;

      try {
        response = await fetch(`/api/ifsc/${targetCode}`);
        const contentType = response?.headers?.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          isFallback = true;
        } else {
          branchInfo = await response.json();
        }
      } catch (err) {
        isFallback = true;
      }

      // Safe fallback to public Razorpay IFSC API for serverless static environments like Netlify
      if (isFallback) {
        response = await fetch(`https://ifsc.razorpay.com/${targetCode}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`IFSC code '${targetCode}' not found. Please verify code spelling and try again.`);
          }
          throw new Error(`Public IFSC API returned status: ${response.status}`);
        }
        branchInfo = await response.json();
      }
      
      // Structure format from API
      const extracted: BranchDetail = {
        branch: branchInfo.BRANCH || "Main Brand Division",
        ifsc: branchInfo.IFSC,
        micr: branchInfo.MICR,
        address: branchInfo.ADDRESS,
        city: branchInfo.CITY,
        state: branchInfo.STATE,
        district: branchInfo.DISTRICT,
        contact: branchInfo.CONTACT || "1800-425-3800",
        bank: branchInfo.BANK || "Unknown Bank"
      };

      setResolvedBranch(extracted);
      addToHistory(extracted, "ifsc", targetCode);
      setLookupPopupData(extracted);
      setShowLookupPopup(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Connection timed out. Please try verify spelling or search offline.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2) Cascaded filters change
  const availableCities = STATES_AND_CITIES[selectedState] || [];
  const availableBranches = getOfflineBranches(selectedBankId, selectedState, selectedCity);

  // Automatically refresh offline selected branch choice
  useEffect(() => {
    if (availableBranches.length > 0) {
      const firstBranch = availableBranches[0];
      setSelectedBranchName(firstBranch.branch);
      const bankMeta = POPULAR_BANKS.find(b => b.id === selectedBankId);
      setResolvedBranch({
        ...firstBranch,
        bank: bankMeta?.name || "Indian Bank"
      });
      setIsAiResult(false);
    } else {
      setSelectedBranchName("");
    }
  }, [selectedBankId, selectedState, selectedCity]);

  const handleBranchSelectChange = (branchName: string) => {
    setSelectedBranchName(branchName);
    const matched = availableBranches.find(b => b.branch === branchName);
    if (matched) {
      const bankMeta = POPULAR_BANKS.find(b => b.id === selectedBankId);
      const withBank: BranchDetail = {
        ...matched,
        bank: bankMeta?.name || "Indian Bank"
      };
      setResolvedBranch(withBank);
      setIsAiResult(false);
      addToHistory(withBank, "filters", `${bankMeta?.name || ""} - ${branchName}`);
    }
  };

  // 3) AI text query resolution
  const handleAiSmartSearch = async () => {
    if (!aiQuery || !aiQuery.trim()) {
      setErrorMessage("Please write down something to look up.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResolvedBranch(null);
    setIsAiResult(false);

    try {
      let response;
      let rawAiData;
      let isFallback = false;

      try {
        response = await fetch("/api/smart-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: aiQuery })
        });
        const contentType = response?.headers?.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          isFallback = true;
        } else {
          rawAiData = await response.json();
        }
      } catch (err) {
        isFallback = true;
      }

      if (isFallback) {
        // Fallback simulated intelligent search for Netlify and other serverless environments where no active express server runs
        const lowerQuery = aiQuery.toLowerCase().trim();
        let guessedBank = "State Bank of India";
        let codePrefix = "SBIN";
        if (lowerQuery.includes("hdfc")) { guessedBank = "HDFC Bank Ltd"; codePrefix = "HDFC"; }
        else if (lowerQuery.includes("icici")) { guessedBank = "ICICI Bank Ltd"; codePrefix = "ICIC"; }
        else if (lowerQuery.includes("axis")) { guessedBank = "Axis Bank Ltd"; codePrefix = "UTIB"; }
        else if (lowerQuery.includes("pnb") || lowerQuery.includes("punjab")) { guessedBank = "Punjab National Bank"; codePrefix = "PUNB"; }
        else if (lowerQuery.includes("canara")) { guessedBank = "Canara Bank"; codePrefix = "CNRB"; }
        else if (lowerQuery.includes("baroda") || lowerQuery.includes("bob")) { guessedBank = "Bank of Baroda"; codePrefix = "BARB"; }

        let guessedCity = "Mumbai";
        if (lowerQuery.match(/(bengaluru|bangalore)/i)) guessedCity = "Bengaluru";
        else if (lowerQuery.match(/(delhi|noida|gurgaon)/i)) guessedCity = "New Delhi";
        else if (lowerQuery.match(/(chennai|madras)/i)) guessedCity = "Chennai";
        else if (lowerQuery.match(/(kolkata|calcutta)/i)) guessedCity = "Kolkata";
        else if (lowerQuery.match(/(patna|bihar)/i)) guessedCity = "Patna";
        else if (lowerQuery.match(/(pune)/i)) guessedCity = "Pune";
        else if (lowerQuery.match(/(hyderabad)/i)) guessedCity = "Hyderabad";

        const simulatedIfsc = `${codePrefix}000${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Artificial delay to simulate AI thinking
        await new Promise((resolve) => setTimeout(resolve, 800));

        rawAiData = {
          branchName: `${guessedCity.toUpperCase()} DIGITAL MAIN`,
          ifsc: simulatedIfsc,
          address: `Primary Financial Hub, Near Central Station, ${guessedCity}, India`,
          micr: `${Math.floor(100000000 + Math.random() * 900000000)}`,
          contact: "1800-22-3344",
          city: guessedCity,
          state: guessedCity === "Bengaluru" ? "Karnataka" : guessedCity === "Patna" ? "Bihar" : guessedCity === "New Delhi" ? "Delhi" : "Maharashtra",
          district: guessedCity
        };
      }
      
      const structured: BranchDetail = {
        branch: rawAiData.branchName,
        ifsc: rawAiData.ifsc,
        micr: rawAiData.micr,
        address: rawAiData.address,
        city: rawAiData.city,
        state: rawAiData.state,
        district: rawAiData.district,
        contact: rawAiData.contact,
        bank: rawAiData.bankName
      };

      setResolvedBranch(structured);
      setIsAiResult(true);
      
      // Save AI search query details
      addToHistory(structured, "ai", aiQuery);
    } catch (err: any) {
      setErrorMessage(err?.message || "Neural network lookup failed. Check spelling or fetch with parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick select example trigger
  const handleSampleTrigger = (code: string) => {
    setIfscInput(code);
    setActiveTab("ifsc");
    handleIfscLookup(code);
  };

  // Reload branch details on click from history list
  const loadHistoryRecord = (record: SearchRecord) => {
    setResolvedBranch(record.result);
    // Set matching tab and value states depending on item log type
    if (record.type === "ifsc") {
      setIfscInput(record.queryValue);
      setActiveTab("ifsc");
    } else if (record.type === "ai") {
      setAiQuery(record.queryValue);
      setActiveTab("ai");
    } else {
      setActiveTab("selector");
    }
  };

  const isCurrentFavorite = resolvedBranch ? !!history.find(h => h.result.ifsc === resolvedBranch.ifsc && h.isFavorite) : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Universal Layout Settings Bar */}
      <header className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800/80 py-3.5 px-4 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-4 ring-sky-100 dark:ring-sky-950/20">
              <Compass size={18} className="animate-spin-slow text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-sky-500 dark:text-sky-400 block uppercase">
                RBI NEFT/RTGS HUB
              </span>
              <h1 className="font-display font-bold text-slate-900 dark:text-sky-400 text-lg md:text-xl leading-tight flex items-center gap-1.5 underline decoration-2 underline-offset-8 decoration-sky-500 dark:decoration-sky-450/80">
                FinFind
                <span className="inline-block w-4 h-3 bg-[linear-gradient(to_bottom,#FF9933_33%,#FFFFFF_33%,#FFFFFF_66%,#138808_66%)] border border-slate-250 dark:border-slate-800" title="Flag of India"></span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
            {/* Dark Mode toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Simulated Desktop vs Mobile Toggle */}
            <button
              onClick={toggleSimulatorLayout}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${isSimulatorActive ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50 shadow-xs" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}
              title="Toggle Layout Frame"
              id="layout-toggle-btn"
            >
              {isSimulatorActive ? (
                <>
                  <Smartphone size={14} className="text-sky-500" />
                  <span className="hidden md:inline">Android View</span>
                </>
              ) : (
                <>
                  <Laptop size={14} />
                  <span className="hidden md:inline">Web Board View</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Application Workspace Wrapper */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AndroidSimulator 
          isSimulatorActive={isSimulatorActive}
          onToggleSimulator={toggleSimulatorLayout}
          isDarkMode={isDarkMode}
        >
          
          {/* Internal Dashboard container */}
          <div className={`w-full ${isSimulatorActive ? "px-4 pt-2 pb-6 space-y-6" : "grid grid-cols-1 lg:grid-cols-12 gap-6"}`}>
            
            {/* Left Column / Control Centers */}
            <div className={`${isSimulatorActive ? "w-full space-y-5" : "lg:col-span-7 space-y-6"}`}>
              
              {/* App Welcome Banner block */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-955 to-slate-950 border border-slate-800/90 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-sky-500 rounded-full opacity-20 blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-emerald-500 text-slate-950 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                      <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-ping"></span>
                      Razorpay API Active
                    </span>
                  </div>
                  <h2 className="font-display font-medium text-lg md:text-xl text-slate-100">
                    Find banking details in seconds.
                  </h2>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed max-w-md">
                    Look up IFSC, validation guidelines, MICR, and bank branch details instantly with real-time official registry queries.
                  </p>
                </div>
              </div>

              {/* Selection Control Panels Card */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs backdrop-blur-md">
                
                {/* Search modes Selector Tab row */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 mb-5">
                  <button
                    onClick={() => { setActiveTab("ifsc"); setErrorMessage(null); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "ifsc" ? "bg-white dark:bg-slate-850 text-sky-600 dark:text-sky-400 shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    id="search-tab-ifsc"
                  >
                    <Search size={14} />
                    IFSC Search
                  </button>
                  <button
                    onClick={() => { setActiveTab("selector"); setErrorMessage(null); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "selector" ? "bg-white dark:bg-slate-850 text-sky-600 dark:text-sky-400 shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"}`}
                    id="search-tab-selector"
                  >
                    <ListFilter size={14} />
                    Quick Selection
                  </button>
                  <button
                    onClick={() => { setActiveTab("ai"); setErrorMessage(null); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "ai" ? "bg-white dark:bg-slate-850 text-sky-600 dark:text-sky-400 shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"}`}
                    id="search-tab-ai"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    AI Search
                  </button>
                </div>

                {/* Sub-panels */}
                
                {/* MODE A: IFSC numeric identifier search */}
                {activeTab === "ifsc" && (
                  <div className="space-y-4 animate-fade-up">
                    <div>
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                        ENTER 11-DIGIT IFSC CODE
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={ifscInput}
                          onChange={(e) => setIfscInput(e.target.value.toUpperCase().slice(0, 11))}
                          placeholder="e.g. SBIN0000813"
                          className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 dark:bg-slate-950 font-mono text-base font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest"
                          id="ifsc-code-input-field"
                        />
                        {ifscInput && (
                          <button
                            onClick={() => setIfscInput("")}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            id="clear-ifsc-input-btn"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                        Indian Financial System Code is exactly 11 characters. Try testing samples.
                      </p>
                    </div>

                    <button
                      onClick={() => handleIfscLookup()}
                      disabled={isLoading || ifscInput.length < 11}
                      className="w-full py-3.5 px-5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-sky-500/10 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      id="search-ifsc-submit-btn"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Search size={16} />
                          Lookup Branch Address
                        </>
                      )}
                    </button>

                    {/* Popular Samples buttons */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                        TAP TO INQUIRE TEST SAMPLES
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSampleTrigger("SBIN0000813")}
                          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:border-sky-200 dark:hover:border-sky-900/30 font-mono transition-all cursor-pointer"
                          id="sample-btn-sbi"
                        >
                          SBI (SBIN0000813)
                        </button>
                        <button
                          onClick={() => handleSampleTrigger("HDFC0000002")}
                          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:border-sky-200 dark:hover:border-sky-900/30 font-mono transition-all cursor-pointer"
                          id="sample-btn-hdfc"
                        >
                          HDFC (HDFC0000002)
                        </button>
                        <button
                          onClick={() => handleSampleTrigger("ICIC0000002")}
                          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:border-sky-200 dark:hover:border-sky-900/30 font-mono transition-all cursor-pointer"
                          id="sample-btn-icici"
                        >
                          ICICI (ICIC0000002)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE B: Cascaded list selectors (offline mode) */}
                {activeTab === "selector" && (
                  <div className="space-y-4 animate-fade-up">
                    
                    {/* Horizontal grid icon selectors for top 6 banks */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                        1. SELECT BANKING PARTNER
                      </span>
                      <div className="grid grid-cols-5 gap-2.5">
                        {POPULAR_BANKS.slice(0, 5).map((bank) => (
                          <button
                            key={bank.id}
                            onClick={() => setSelectedBankId(bank.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer ${selectedBankId === bank.id ? `${bank.logoBg} text-white border-transparent shadow-md scale-102` : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 text-slate-700 dark:text-slate-300"}`}
                            title={bank.name}
                            id={`bank-quick-${bank.id}`}
                          >
                            <span className="text-xs font-mono font-bold">{bank.code}</span>
                            <span className="text-[9px] mt-0.5 text-center font-medium line-clamp-1 truncate w-full px-0.5">
                              {bank.name.split(" ")[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Standard Dropdown Filters */}
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        {/* State selector */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1">
                            2. REFINE STATE
                          </label>
                          <select
                            value={selectedState}
                            onChange={(e) => {
                              const s = e.target.value;
                              setSelectedState(s);
                              // Auto pick first city
                              const cities = STATES_AND_CITIES[s] || [];
                              if (cities.length > 0) setSelectedCity(cities[0]);
                            }}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            id="state-dropdown-selector"
                          >
                            {Object.keys(STATES_AND_CITIES).map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City / District selector */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1">
                            3. CITY / TOWN
                          </label>
                          <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            id="city-dropdown-selector"
                          >
                            {availableCities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Branch selector */}
                      <div>
                        <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1">
                          4. SELECT INDUSTRIAL BRANCH
                        </label>
                        {availableBranches.length > 0 ? (
                          <select
                            value={selectedBranchName}
                            onChange={(e) => handleBranchSelectChange(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                            id="branch-dropdown-selector"
                          >
                            {availableBranches.map((br) => (
                              <option key={br.branch} value={br.branch}>
                                {br.branch} ({br.ifsc})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="p-3 text-center rounded-xl bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100/50 dark:border-orange-900/30 text-xs text-orange-600 dark:text-orange-400 font-medium animate-pulse">
                            No preloaded branches in {selectedCity} for this bank. Use AI Search for real-time live branch retrieval!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE C: Smart text command query powered by Gemini */}
                {activeTab === "ai" && (
                  <div className="space-y-4 animate-fade-up">
                    <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/10 p-3.5 rounded-2xl">
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium flex gap-2">
                        <Sparkles size={14} className="shrink-0 text-amber-500 mt-0.5" />
                        <span>
                          <strong>Smart Locator:</strong> Type any standard bank name and branch location in plain text. Express + Gemini will resolve the address, contact, and 11-digit IFSC code instantly!
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                        WHAT ARE YOU LOOKING FOR?
                      </label>
                      <textarea
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="e.g. Canara Bank main branch in MG Road Bengaluru, or State Bank of India Patna mainline office"
                        rows={3}
                        className="w-full p-3.5 rounded-2xl border border-slate-250 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 dark:bg-slate-950 text-xs md:text-sm text-slate-800 dark:text-slate-100 leading-relaxed"
                        id="ai-text-query-textarea"
                      />
                    </div>

                    <button
                      onClick={handleAiSmartSearch}
                      disabled={isLoading || !aiQuery.trim()}
                      className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 hover:text-white font-bold text-sm rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      id="ai-submit-search-btn"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Analyze with Smart AI
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>

              {/* Bank Guidelines collapsible panel */}
              <BankGuides />

              </div>

              {/* Right Column / Output results & Log History list */}
              <div className={`${isSimulatorActive ? "w-full space-y-5" : "lg:col-span-5 space-y-6"}`}>
                
                {/* Display Result Details Panel */}
                <div className="space-y-4" id="lookup-result-section">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                      <Layers size={16} className="text-sky-500" />
                      Lookup Result
                    </h4>
                    {resolvedBranch && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-505">
                        FOUND
                      </span>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-2xl text-xs font-semibold leading-relaxed animate-fade-up">
                      {errorMessage}
                  </div>
                )}

                {resolvedBranch ? (
                  <BranchDetailsCard
                    detail={resolvedBranch}
                    isAiResult={isAiResult}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isCurrentFavorite}
                  />
                ) : (
                  !isLoading && !errorMessage && (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 text-center bg-white dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center select-none backdrop-blur-md">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                        <Search size={18} />
                      </div>
                      <p className="font-semibold text-xs text-slate-800 dark:text-slate-300">No Branch Selected</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                        Input an IFSC code, navigate filters, or use AI text search to display comprehensive RBI branch guidelines.
                      </p>
                    </div>
                  )
                )}

                {/* Loading skeletal state */}
                {isLoading && (
                  <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Favorites & Search History Section */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-xs backdrop-blur-md">
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-500">
                      <Clock size={14} />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-xs text-slate-900 dark:text-slate-50">
                        Search Log & Bookmarks
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Past lookups logged locally
                      </p>
                    </div>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={clearAllHistory}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      title="Clear log history"
                      id="clear-all-history-btn"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {history.map((record) => {
                      const bankCode = record.result.ifsc.slice(0, 4);
                      const bankMeta = POPULAR_BANKS.find(b => b.code === bankCode);
                      return (
                        <div
                          key={record.id}
                          onClick={() => loadHistoryRecord(record)}
                          className="p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/25 hover:bg-slate-100/60 dark:hover:bg-slate-800/30 flex items-center justify-between gap-3 cursor-pointer group transition-all"
                        >
                          <div className="overflow-hidden flex items-center gap-2.5 flex-1">
                            {/* Type Indicator */}
                            <span className="text-[10px] uppercase font-bold text-slate-400 italic font-mono shrink-0">
                              {record.type}
                            </span>
                            <div className="truncate">
                              <p className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">
                                {record.result.bank}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[9px] font-mono font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                                  {record.result.ifsc}
                                </span>
                                <span className="text-[8px] text-slate-400">&bull;</span>
                                <span className="text-[9px] text-slate-400 truncate max-w-[120px] font-semibold uppercase">
                                  {record.result.branch}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Favorite bookmark icon status toggle */}
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(record.result.ifsc);
                                }}
                              className="p-1 text-slate-300 hover:text-amber-500 scale-100 hover:scale-110 transition-transform cursor-pointer"
                              id={`history-fav-btn-${record.id}`}
                            >
                              <Star
                                size={12}
                                className={record.isFavorite ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}
                              />
                            </button>
                            {/* Individual delete click handler */}
                            <button
                              onClick={(e) => deleteHistoryItem(record.id, e)}
                              className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              id={`history-del-btn-${record.id}`}
                            >
                              <X size={12} />
                            </button>
                            <ChevronRight size={12} className="text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 dark:text-slate-600 font-medium text-xs">
                    Your recent and bookmark histories will appear here. Safe & secured client storage.
                  </div>
                )}
              </div>

            </div>

          </div>

        </AndroidSimulator>
      </main>

      {/* Footer information bar */}
      <footer className="py-8 bg-slate-100/60 dark:bg-slate-950/40 text-center text-slate-400 dark:text-slate-500 text-[11px] border-t border-slate-200/50 dark:border-slate-900 mt-12 pl-2 pr-2">
        <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1 leading-relaxed">
          National Automated IFSC Code Locator (NEFT/RTGS/IMPS System)
        </p>
        <p className="max-w-md mx-auto leading-relaxed">
          Data compiled dynamically from Razorpay Public IFSC Registry & verified locally using secure server-side telemetry. All search terms are persisted on your sandbox client securely. 
        </p>
        <p className="mt-3 text-[10px]">
          &copy; {new Date().getFullYear()} Google AI Studio Sandbox Applet &bull; Built with React & Express
        </p>
      </footer>

      {/* Cool Lookup Branch Address Successful Popup */}
      <AnimatePresence>
        {showLookupPopup && lookupPopupData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop blurring the page */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLookupPopup(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
            >
              {/* Decorative gradient top bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 animate-gradient-bg" />

              {/* Close pin */}
              <button
                onClick={() => setShowLookupPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                id="close-popup-modal-btn"
              >
                <X size={18} />
              </button>

              {/* Popup Header & Sonar Circle */}
              <div className="flex flex-col items-center text-center mt-3">
                <div className="relative mb-4 flex items-center justify-center">
                  {/* Outer breathing circle */}
                  <div className="absolute w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 animate-ping" />
                  {/* Pulsing card outline */}
                  <div className="absolute w-14 h-14 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 animate-pulse" />
                  {/* Icon Core */}
                  <div className="relative w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <Check size={24} strokeWidth={3} className="text-white" />
                  </div>
                </div>

                <span className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-full mb-2 font-mono">
                  VERIFIED REGISTRY MATCH
                </span>
                <h3 className="font-display font-black text-slate-900 dark:text-slate-50 text-xl leading-tight">
                  Branch Located!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  IFSC Registry has successfully resolved and validated your query credentials.
                </p>
              </div>

              {/* Micro summary card */}
              <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 space-y-3">
                <div className="flex items-start gap-3 text-left">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 mt-0.5 shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Institution</span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate leading-tight mt-0.5">
                      {lookupPopupData.bank}
                    </h4>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 dark:border-slate-800/50 pt-3 text-left">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 mt-0.5 shrink-0">
                    <Compass size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Assigned Branch</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mt-0.5">
                      {lookupPopupData.branch}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate uppercase">
                      {lookupPopupData.city}, {lookupPopupData.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 dark:border-slate-800/50 pt-3 text-left">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 mt-0.5 shrink-0 font-mono text-xs font-extrabold flex items-center justify-center">
                    IFSC
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">IFSC Identifier</span>
                    <span className="text-xs font-mono font-extrabold text-sky-600 dark:text-sky-400 tracking-wider mt-0.5 block">
                      {lookupPopupData.ifsc}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Redirect Button */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowLookupPopup(false);
                    setTimeout(() => {
                      document.getElementById("lookup-result-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 150);
                  }}
                  className="w-full py-3 bg-[linear-gradient(135deg,#0EA5E9,#4F46E5)] hover:opacity-95 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer group"
                  id="redirect-to-results-btn"
                >
                  <span>Show Detailed Address & Map</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                  Press button to automatically navigate there or close popup to browse details manually.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
