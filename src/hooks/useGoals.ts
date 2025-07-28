import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../context/SessionContext';
import { Goal } from '../types/Goal';
import { showSuccess, showError } from '../utils/toast';
import { useTransactions } from './useTransactions';
import { parseISO, startOfMonth } from 'date-fns';

export const useGoals = () => {
  const { session } = useSession();
  const { transactions } = useTransactions();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [exceededSpendingGoal, setExceededSpendingGoal] = useState<Goal | null>(null);
  const [currentSpendingForExceededGoal, setCurrentSpendingForExceededGoal] = useState<number>(0);

  const calculateCurrentSpending = (goal: Goal) => {
    if (goal.type !== 'spending_limit' || goal.period !== 'monthly') return 0;

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    
    return transactions
      .filter(t => t.type === 'expense' &&
                   parseISO(t.date) >= startOfCurrentMonth &&
                   parseISO(t.date) <= now)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const fetchGoals = async () => {
    if (session?.user) {
      setIsLoadingGoals(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        showError('Gagal mengambil target keuangan.');
        setGoals([]);
      } else if (data) {
        setGoals(data as Goal[]);
      }
      setIsLoadingGoals(false);
    } else {
      setGoals([]);
      setIsLoadingGoals(false);
    }
  };

  useEffect(() => {
    fetchGoals();

    const channel = supabase
      .channel('public:goals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${session?.user?.id}` }, payload => {
        if (payload.eventType === 'INSERT') {
          setGoals(prev => [payload.new as Goal, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setGoals(prev => prev.map(goal => goal.id === payload.old.id ? payload.new as Goal : goal));
        } else if (payload.eventType === 'DELETE') {
          setGoals(prev => prev.filter(goal => goal.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  useEffect(() => {
    let foundExceeded = false;
    for (const goal of goals) {
      if (goal.type === 'spending_limit' && goal.period === 'monthly') {
        const currentSpending = calculateCurrentSpending(goal);
        if (currentSpending > goal.target_amount) {
          setExceededSpendingGoal(goal);
          setCurrentSpendingForExceededGoal(currentSpending);
          foundExceeded = true;
          break;
        }
      }
    }
    if (!foundExceeded) {
      setExceededSpendingGoal(null);
      setCurrentSpendingForExceededGoal(0);
    }
  }, [goals, transactions]);

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    if (!session?.user) {
      showError('Anda harus login untuk menambahkan target.');
      return false;
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, user_id: session.user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding goal:', error);
      showError('Gagal menambahkan target keuangan.');
      return false;
    } else {
      showSuccess('Target keuangan berhasil ditambahkan!');
      return true;
    }
  };

  const updateGoal = async (id: string, updatedData: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>) => {
    if (!session?.user) {
      showError('Anda harus login untuk memperbarui target.');
      return false;
    }

    const { error } = await supabase
      .from('goals')
      .update(updatedData)
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating goal:', error);
      showError('Gagal memperbarui target keuangan.');
      return false;
    } else {
      showSuccess('Target keuangan berhasil diperbarui!');
      return true;
    }
  };

  const deleteGoal = async (id: string) => {
    if (!session?.user) {
      showError('Anda harus login untuk menghapus target.');
      return false;
    }

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting goal:', error);
      showError('Gagal menghapus target keuangan.');
      return false;
    } else {
      showSuccess('Target keuangan berhasil dihapus!');
      return true;
    }
  };

  return { 
    goals, 
    isLoadingGoals, 
    addGoal, 
    updateGoal, 
    deleteGoal,
    exceededSpendingGoal,
    currentSpendingForExceededGoal,
    refetchGoals: fetchGoals, // Expose refetch function
  };
};