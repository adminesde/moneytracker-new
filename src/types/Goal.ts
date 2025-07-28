export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  type: 'spending_limit' | 'saving_goal'; // For now, only spending_limit is fully supported
  period: 'monthly' | 'yearly' | 'one-time';
  start_date: string; // ISO string
  end_date: string | null; // ISO string, null for ongoing monthly/yearly
  created_at: string; // ISO string
}

export interface GoalFormData {
  name: string;
  target_amount: string; // As string for input
  type: 'spending_limit' | 'saving_goal';
  period: 'monthly' | 'yearly' | 'one-time';
  start_date: string;
  end_date?: string;
}