import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Transaction } from '../types/Transaction';
import { showSuccess, showError } from '../utils/toast';
import { supabase } from '../integrations/supabase/client';
import { useSession } from './SessionContext';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => Promise<boolean>;
  updateTransaction: (id: string, updatedTransaction: Partial<Omit<Transaction, 'id' | 'user_id'>>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  deleteAllTransactions: () => Promise<boolean>;
  getBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  refetchTransactions: () => Promise<void>; // New refetch function
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { session } = useSession();

  const fetchTransactions = async () => {
    if (session?.user) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        showError('Gagal mengambil data transaksi.');
        setTransactions([]);
      } else if (data) {
        setTransactions(data as Transaction[]);
      }
    } else {
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions();

    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session?.user?.id}` }, payload => {
        if (payload.eventType === 'INSERT') {
          setTransactions(prev => [payload.new as Transaction, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setTransactions(prev => prev.map(t => t.id === payload.old.id ? payload.new as Transaction : t));
        } else if (payload.eventType === 'DELETE') {
          setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
    if (!session?.user) {
      showError('Anda harus login untuk menambahkan transaksi.');
      return false;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: session.user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      showError('Gagal menambahkan transaksi.');
      return false;
    } else {
      showSuccess('Transaksi berhasil ditambahkan!');
      return true;
    }
  };

  const updateTransaction = async (id: string, updatedTransaction: Partial<Omit<Transaction, 'id' | 'user_id'>>) => {
    if (!session?.user) {
      showError('Anda harus login untuk memperbarui transaksi.');
      return false;
    }

    const { error } = await supabase
      .from('transactions')
      .update(updatedTransaction)
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating transaction:', error);
      showError('Gagal memperbarui transaksi.');
      return false;
    } else {
      showSuccess('Transaksi berhasil diperbarui!');
      return true;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!session?.user) {
      showError('Anda harus login untuk menghapus transaksi.');
      return false;
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting transaction:', error);
      showError('Gagal menghapus transaksi.');
      return false;
    } else {
      showSuccess('Transaksi berhasil dihapus!');
      return true;
    }
  };

  const deleteAllTransactions = async () => {
    if (!session?.user) {
      showError('Anda harus login untuk menghapus semua transaksi.');
      return false;
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting all transactions:', error);
      showError('Gagal menghapus semua transaksi.');
      return false;
    } else {
      showSuccess('Semua transaksi berhasil dihapus!');
      setTransactions([]);
      return true;
    }
  };

  const getBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  const contextValue = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    getBalance,
    getTotalIncome,
    getTotalExpense,
    refetchTransactions: fetchTransactions, // Expose refetch function
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};