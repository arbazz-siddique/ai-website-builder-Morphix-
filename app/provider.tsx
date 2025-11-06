'use client'
import { OnSaveContext } from '@/context/OnSaveContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Provider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState<any>(null);
  const [onSaveData, setOnSaveData] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) createNewUser();
  }, [isLoaded, user]);

  const createNewUser = async () => {
    try {
      const result = await axios.post('/api/users', {});
      setUserDetail(result.data?.user);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <OnSaveContext.Provider value={{ onSaveData, setOnSaveData }}>
        {children}
      </OnSaveContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider;
