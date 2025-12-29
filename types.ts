
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  LOCKED = 'LOCKED'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  location: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  pin: string;
  balance: number;
  status: AccountStatus;
  transactions: Transaction[];
  securityLogs: SecurityLog[];
  role: 'USER' | 'ADMIN';
  createdAt: string;
  failedLoginAttempts: number;
}

export interface AppState {
  currentUser: UserAccount | null;
  allAccounts: UserAccount[];
  isDarkMode: boolean;
  isLoggedIn: boolean;
}

export type Screen = 
  | 'SPLASH' 
  | 'ONBOARDING' 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'DASHBOARD' 
  | 'DEPOSIT' 
  | 'WITHDRAW' 
  | 'HISTORY' 
  | 'PROFILE' 
  | 'ADMIN'
  | 'SECURITY_LOGS';
