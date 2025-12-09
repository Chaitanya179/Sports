
import React, { useEffect, useState } from 'react';
import { fetchBookings, cancelBooking } from '../services/api.js';

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    fetchBookings({ userId: 1 }).then(res => setBookings(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    try {
      setMessage('');
      const res = await cancelBooking(id);
      setMessage(res.data.message + (res.data.promotedWaitlistBookingId ? ` | Promoted booking ${res.data.promotedWaitlistBookingId}` : ''));
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error cancelling booking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-3">My Bookings</h2>
      {message && <div className="text-sm text-green-600 mb-2">{message}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">ID</th>
              <th className="px-2 py-1 border">Court</th>
              <th className="px-2 py-1 border">Coach</th>
              <th className="px-2 py-1 border">Start</th>
              <th className="px-2 py-1 border">End</th>
              <th className="px-2 py-1 border">Status</th>
              <th className="px-2 py-1 border">Total</th>
              <th className="px-2 py-1 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td className="px-2 py-1 border">{b.id}</td>
                <td className="px-2 py-1 border">{b.Court?.name}</td>
                <td className="px-2 py-1 border">{b.Coach?.name || '-'}</td>
                <td className="px-2 py-1 border">{new Date(b.startTime).toLocaleString()}</td>
                <td className="px-2 py-1 border">{new Date(b.endTime).toLocaleString()}</td>
                <td className="px-2 py-1 border">{b.status}{b.waitlistPosition ? ` (#${b.waitlistPosition})` : ''}</td>
                <td className="px-2 py-1 border">
                  {b.pricingBreakdown?.total ? `$${b.pricingBreakdown.total.toFixed(2)}` : '-'}
                </td>
                <td className="px-2 py-1 border">
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  )}
                  {b.status !== 'confirmed' && <span className="text-xs text-gray-400">N/A</span>}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td className="px-2 py-2 border text-center text-gray-500" colSpan="8">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
