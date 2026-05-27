export interface BranchDetail {
  branch: string;
  ifsc: string;
  micr: string;
  address: string;
  city: string;
  state: string;
  district: string;
  contact: string;
  bank?: string;
}

export interface SearchRecord {
  id: string;
  type: "ifsc" | "filters" | "ai";
  queryValue: string; // IFSC code or search string
  timestamp: string;
  result: BranchDetail;
  isFavorite?: boolean;
}

export interface BankGroup {
  id: string;
  name: string;
  code: string;
  logoBg: string; // Tailwind color name like 'bg-sky-600'
  accentColor: string; // Hex color like '#00a5ec'
}
