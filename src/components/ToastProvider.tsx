"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#10B981', // Emerald-500
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444', // Red-500
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
      }}
      clickToDismiss={true} // Menambahkan ini agar notifikasi bisa ditutup dengan klik
    />
  );
};

export default ToastProvider;