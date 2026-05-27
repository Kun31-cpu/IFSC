import { BranchDetail, BankGroup } from "./types";

export const POPULAR_BANKS: BankGroup[] = [
  { id: "sbi", name: "State Bank of India", code: "SBIN", logoBg: "bg-sky-600", accentColor: "#00a5ec" },
  { id: "hdfc", name: "HDFC Bank Ltd", code: "HDFC", logoBg: "bg-blue-800", accentColor: "#1c3f94" },
  { id: "icici", name: "ICICI Bank Ltd", code: "ICIC", logoBg: "bg-orange-800", accentColor: "#b02a30" },
  { id: "axis", name: "Axis Bank Ltd", code: "UTIB", logoBg: "bg-rose-950", accentColor: "#971842" },
  { id: "pnb", name: "Punjab National Bank", code: "PUNB", logoBg: "bg-amber-800", accentColor: "#a31d24" },
  { id: "bob", name: "Bank of Baroda", code: "BARB", logoBg: "bg-orange-600", accentColor: "#f3511f" },
  { id: "canara", name: "Canara Bank", code: "CNRB", logoBg: "bg-blue-600", accentColor: "#056fc1" },
  { id: "kotak", name: "Kotak Mahindra Bank", code: "KKBK", logoBg: "bg-red-700", accentColor: "#ed1c24" },
  { id: "union", name: "Union Bank of India", code: "UBIN", logoBg: "bg-indigo-700", accentColor: "#044baa" },
  { id: "indusind", name: "IndusInd Bank", code: "INDB", logoBg: "bg-amber-950", accentColor: "#7e1a2d" },
];

export const STATES_AND_CITIES: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
  "Delhi": ["New Delhi", "Dwarka"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "West Bengal": ["Kolkata", "Howrah"],
  "Telangana": ["Hyderabad", "Secunderabad"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur"],
  "Bihar": ["Patna", "Gaya"],
  "Kerala": ["Kochi", "Trivandrum"],
};

// Generates high-fidelity offline lookup branch details for 10 banks x multiple cities
export const OFFLINE_BRANCH_DATA: Record<string, Record<string, BranchDetail[]>> = {
  "sbi": {
    "Mumbai": [
      {
        branch: "MUMBAI MAIN",
        ifsc: "SBIN0000001",
        micr: "400002002",
        address: "MUMBAI MAIN BRANCH, BOMBAY SAMACHAR MARG, FORT, MUMBAI - 400001",
        city: "Mumbai",
        state: "Maharashtra",
        district: "Mumbai City",
        contact: "022-22661559"
      },
      {
        branch: "BANDRA KURLA COMPLEX",
        ifsc: "SBIN0004233",
        micr: "400002058",
        address: "C-17, G-BLOCK, SYNERGY BUILDING, BKC, BANDRA (EAST), MUMBAI - 400051",
        city: "Mumbai",
        state: "Maharashtra",
        district: "Mumbai Suburban",
        contact: "022-26445100"
      }
    ],
    "Bengaluru": [
      {
        branch: "BANGALORE MAIN",
        ifsc: "SBIN0000813",
        micr: "560002002",
        address: "POST BAG NO.12, STATE BANK RD, AMBEDKAR VEEDHI, BENGALURU - 560001",
        city: "Bengaluru",
        state: "Karnataka",
        district: "Bengaluru Urban",
        contact: "080-22271011"
      },
      {
        branch: "INDIRANAGAR",
        ifsc: "SBIN0003303",
        micr: "560002023",
        address: "NO. 1047, 12TH MAIN, HAL 2ND STAGE, INDIRANAGAR, BENGALURU - 560008",
        city: "Bengaluru",
        state: "Karnataka",
        district: "Bengaluru Urban",
        contact: "080-25251433"
      }
    ],
    "New Delhi": [
      {
        branch: "NEW DELHI MAIN",
        ifsc: "SBIN0000691",
        micr: "110002087",
        address: "11, PAR संसद MARG, SANSAD MARG, NEW DELHI - 110001",
        city: "New Delhi",
        state: "Delhi",
        district: "New Delhi",
        contact: "011-23374201"
      }
    ],
    "Chennai": [
      {
        branch: "CHENNAI MAIN",
        ifsc: "SBIN0000800",
        micr: "600002002",
        address: "NO.22, RAJAJI SALAI, GEORGE TOWN, CHENNAI - 600001",
        city: "Chennai",
        state: "Tamil Nadu",
        district: "Chennai",
        contact: "044-25345672"
      }
    ]
  },
  "hdfc": {
    "Mumbai": [
      {
        branch: "SANDOZ HOUSE - WORLI",
        ifsc: "HDFC0000240",
        micr: "400240015",
        address: "SANDOZ HOUSE, DR ANNIE BESANT ROAD, WORLI, MUMBAI - 400018",
        city: "Mumbai",
        state: "Maharashtra",
        district: "Mumbai City",
        contact: "022-61606161"
      },
      {
        branch: "LINKING ROAD",
        ifsc: "HDFC0000047",
        micr: "400240009",
        address: "NO 311, 4TH ROAD, JUNCTION OF INT. ROAD, BANDRA (WEST), MUMBAI - 400050",
        city: "Mumbai",
        state: "Maharashtra",
        district: "Mumbai Suburban",
        contact: "022-61606161"
      }
    ],
    "Bengaluru": [
      {
        branch: "RICHMOND ROAD",
        ifsc: "HDFC0000002",
        micr: "560240002",
        address: "N0 8/12, SALCO CENTRE, RICHMOND ROAD, BENGALURU - 560025",
        city: "Bengaluru",
        state: "Karnataka",
        district: "Bengaluru Urban",
        contact: "080-61606161"
      },
      {
        branch: "KORAMANGALA",
        ifsc: "HDFC0000058",
        micr: "560240006",
        address: "NO 52, 100 FEET ROAD, 4TH BLOCK, KORAMANGALA, BENGALURU - 560034",
        city: "Bengaluru",
        state: "Karnataka",
        district: "Bengaluru Urban",
        contact: "080-61606161"
      }
    ],
    "New Delhi": [
      {
        branch: "K G MARG",
        ifsc: "HDFC0000003",
        micr: "110240001",
        address: "SURYA KIRAN BUILDING, 19, KASTURBA GANDHI MARG, NEW DELHI - 110001",
        city: "New Delhi",
        state: "Delhi",
        district: "Central Delhi",
        contact: "011-61606161"
      }
    ],
    "Chennai": [
      {
        branch: "NUNGAMBAKKAM",
        ifsc: "HDFC0000009",
        micr: "600240002",
        address: "ITC CENTRE, NO 759, ANNA SALAI, CHENNAI - 600002",
        city: "Chennai",
        state: "Tamil Nadu",
        district: "Chennai",
        contact: "044-61606161"
      }
    ]
  },
  "icici": {
    "Mumbai": [
      {
        branch: "NARIAMAN POINT",
        ifsc: "ICIC0000004",
        micr: "400229002",
        address: "HOTEL OBEROI TOWERS, NARIMAN POINT, MUMBAI - 400021",
        city: "Mumbai",
        state: "Maharashtra",
        district: "Mumbai City",
        contact: "022-33667777"
      }
    ],
    "Bengaluru": [
      {
        branch: "M G ROAD",
        ifsc: "ICIC0000002",
        micr: "560229002",
        address: "NO 113-115, ITI BUILDING, M G ROAD, BENGALURU - 560001",
        city: "Bengaluru",
        state: "Karnataka",
        district: "Bengaluru Urban",
        contact: "080-33667777"
      }
    ],
    "New Delhi": [
      {
        branch: "CONNAUGHT PLACE",
        ifsc: "ICIC0000007",
        micr: "110229002",
        address: "9-A, PHELPS BUILDING, INNER CIRCLE, CONNAUGHT PLACE, NEW DELHI - 110001",
        city: "New Delhi",
        state: "Delhi",
        district: "New Delhi",
        contact: "011-33667777"
      }
    ],
    "Kolkata": [
      {
        branch: "CHOWRINGHEE",
        ifsc: "ICIC0000006",
        micr: "700229002",
        address: "NO 22, R N MUKHERJEE ROAD, KOLKATA - 700001",
        city: "Kolkata",
        state: "West Bengal",
        district: "Kolkata",
        contact: "033-33667777"
      }
    ]
  },
  "axis": {
    "Mumbai": [
      {
        branch: "FORT - MUMBAI",
        ifsc: "UTIB0000004",
        micr: "400211003",
        address: "GROUND FLOOR, SIR P M ROAD, FORT, MUMBAI - 400001",
        city: "Mumbai",
        state: "Maharashtra",
        district: "Mumbai City",
        contact: "022-22660004"
      }
    ],
    "Bengaluru": [
      {
        branch: "JAYANAGAR",
        ifsc: "UTIB0000010",
        micr: "560211002",
        address: "NO. 9, 9TH MAIN ROAD, 3RD BLOCK, JAYANAGAR, BENGALURU - 560011",
        city: "Bengaluru",
        state: "Karnataka",
        district: "Bengaluru Urban",
        contact: "080-26590010"
      }
    ],
    "New Delhi": [
      {
        branch: "SANSAD MARG",
        ifsc: "UTIB0000007",
        micr: "110211003",
        address: "STATE ENTRY ROAD, SANSAD MARG, NEW DELHI - 110001",
        city: "New Delhi",
        state: "Delhi",
        district: "New Delhi",
        contact: "011-23311007"
      }
    ]
  },
  "bob": {
    "Mumbai": [
      {
        branch: "BACKBAY RECLAMATION",
        ifsc: "BARB0BACKBA",
        micr: "400012003",
        address: "EXPRESS TOWERS, NARIMAN POINT, MUMBAI - 400021",
        city: "Mumbai",
        state: "Maharashtra",
        district: "Mumbai City",
        contact: "1800223344"
      }
    ],
    "Bengaluru": [
      {
        branch: "METRO CORPORATION BR",
        ifsc: "BARB0BJMULM",
        micr: "560012002",
        address: "PO NO. 9692, LALBAGH ROAD, BENGALURU - 560027",
        city: "Bengaluru",
        state: "Karnataka",
        district: "Bengaluru Urban",
        contact: "1800223344"
      }
    ],
    "Patna": [
      {
        branch: "PATNA MAIN",
        ifsc: "BARB0PATNAX",
        micr: "800012002",
        address: "S P VERMA ROAD, PATNA, BIHAR - 800001",
        city: "Patna",
        state: "Bihar",
        district: "Patna",
        contact: "1800223344"
      }
    ]
  }
};

// Fallback lookup function in case inputs are outside hardcoded data
export function getOfflineBranches(bankId: string, state: string, city: string): BranchDetail[] {
  const bankData = OFFLINE_BRANCH_DATA[bankId];
  if (!bankData) return [];
  
  // Find matched city inside that bank details
  const matchedBranches = bankData[city] || [];
  return matchedBranches.filter(br => br.state.toLowerCase() === state.toLowerCase() || !state);
}
