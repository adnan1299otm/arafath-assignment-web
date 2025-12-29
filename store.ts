import { AppState, UserAccount, AccountStatus, Transaction, TransactionType, Screen } from './types';

const STORAGE_KEY = 'arafath_assignment_data';

export const getStoredData = (): AppState => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  return {
    currentUser: null,
    allAccounts: [],
    isDarkMode: false,
    isLoggedIn: false,
  };
};

export const saveData = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const generateAccountId = () => {
  return '1000' + Math.floor(100000 + Math.random() * 900000).toString();
};

export const createTransaction = (type: TransactionType, amount: number, description: string): Transaction => ({
  id: Math.random().toString(36).substr(2, 9).toUpperCase(),
  type,
  amount,
  description,
  date: new Date().toISOString(),
  status: 'COMPLETED'
});