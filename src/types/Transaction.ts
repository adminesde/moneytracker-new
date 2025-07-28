export interface Transaction {
  id: string;
  user_id: string; // Added user_id
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  description?: string;
}

export interface TransactionFormData {
  title: string;
  amount: string;
  category: string;
  type: 'income' | 'expense';
  description?: string;
}