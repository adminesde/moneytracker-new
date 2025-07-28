import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../context/SessionContext';
import { Profile } from '../types/Profile';
import { showSuccess, showError } from '../utils/toast';

export const useProfile = () => {
  const { session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        setIsLoadingProfile(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          showError('Gagal mengambil data profil.');
          setProfile(null);
        } else if (data) {
          setProfile(data);
        }
        setIsLoadingProfile(false);
      } else {
        setProfile(null);
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [session]);

  const updateProfile = async (updatedData: Partial<Omit<Profile, 'id'>>) => {
    if (!session?.user) {
      showError('Anda harus login untuk memperbarui profil.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating profile:', error);
      showError('Gagal memperbarui profil.');
      return false;
    } else {
      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      showSuccess('Profil berhasil diperbarui!');
      return true;
    }
  };

  return { profile, isLoadingProfile, updateProfile };
};