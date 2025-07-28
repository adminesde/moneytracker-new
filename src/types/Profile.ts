export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
}