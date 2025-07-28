import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ToastProvider from './components/ToastProvider.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { SessionContextProvider } from './context/SessionContext.tsx';
import { TransactionProvider } from './context/TransactionContext.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Explicitly import jsPDF
import 'jspdf-autotable'; // Import ini setelah jsPDF untuk memastikan ekstensi global bekerja

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <SessionContextProvider>
          <TransactionProvider>
            <ToastProvider />
            <App />
          </TransactionProvider>
        </SessionContextProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>
);