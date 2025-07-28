CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  type TEXT NOT NULL, -- e.g., 'spending_limit', 'saving_goal'
  period TEXT NOT NULL, -- e.g., 'monthly', 'yearly', 'one-time'
  start_date DATE NOT NULL,
  end_date DATE, -- Optional for one-time goals, or end of period for recurring
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

alter table public.goals enable row level security;

create policy "Users can view their own goals." on goals for select using ( auth.uid() = user_id );

create policy "Users can insert their own goals." on goals for insert with check ( auth.uid() = user_id );

create policy "Users can update their own goals." on goals for update using ( auth.uid() = user_id );

create policy "Users can delete their own goals." on goals for delete using ( auth.uid() = user_id );