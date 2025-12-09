
import React, { useState } from 'react';
import BookingPage from './pages/BookingPage.jsx';
import BookingHistoryPage from './pages/BookingHistoryPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  const [view, setView] = useState('booking');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Sports Facility Booking</h1>
        <nav className="space-x-4 text-sm">
          <button
            onClick={() => setView('booking')}
            className={view === 'booking' ? 'font-bold underline' : 'hover:underline'}
          >
            Book Court
          </button>
          <button
            onClick={() => setView('history')}
            className={view === 'history' ? 'font-bold underline' : 'hover:underline'}
          >
            My Bookings
          </button>
          <button
            onClick={() => setView('admin')}
            className={view === 'admin' ? 'font-bold underline' : 'hover:underline'}
          >
            Admin
          </button>
        </nav>
      </header>
      <main className="p-4 flex-1">
        {view === 'booking' && <BookingPage />}
        {view === 'history' && <BookingHistoryPage />}
        {view === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}
