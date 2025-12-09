
import React, { useEffect, useState } from 'react';
import {
  fetchCourts,
  fetchCoaches,
  fetchEquipment,
  quotePrice,
  createBooking
} from '../services/api.js';
import PriceBreakdown from '../components/PriceBreakdown.jsx';

export default function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({
    userId: 1,
    courtId: '',
    coachId: '',
    date: '',
    startTime: '18:00',
    endTime: '19:00',
    allowWaitlist: true
  });
  const [selectedEquipment, setSelectedEquipment] = useState({});
  const [price, setPrice] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourts().then(res => setCourts(res.data));
    fetchCoaches().then(res => setCoaches(res.data));
    fetchEquipment().then(res => setEquipment(res.data));
  }, []);

  const buildDateTime = (date, time) => new Date(`${date}T${time}:00`);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEquipmentChange = (id, qty) => {
    setSelectedEquipment(prev => ({ ...prev, [id]: qty }));
  };

  const payloadBase = () => {
    const equipmentPayload = Object.entries(selectedEquipment)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ equipmentId: Number(id), quantity: Number(qty) }));
    const start = buildDateTime(form.date, form.startTime);
    const end = buildDateTime(form.date, form.endTime);
    return {
      courtId: Number(form.courtId),
      coachId: form.coachId ? Number(form.coachId) : null,
      equipment: equipmentPayload,
      startTime: start,
      endTime: end
    };
  };

  const handleQuote = async () => {
    try {
      setMessage('');
      setPrice(null);
      const payload = payloadBase();
      const res = await quotePrice(payload);
      setPrice(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error getting price');
    }
  };

  const handleBook = async () => {
    try {
      setMessage('');
      const payload = payloadBase();
      const res = await createBooking({
        ...payload,
        userId: form.userId,
        allowWaitlist: form.allowWaitlist
      });
      if (res.data.status === 'waitlist') {
        setMessage('Slot is full. You have been added to waitlist. Position: ' + res.data.waitlistPosition);
      } else {
        setMessage('Booking confirmed with id ' + res.data.id);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || err.response?.data?.message || 'Error creating booking');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Book a Court</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Court</label>
          <select
            name="courtId"
            value={form.courtId}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-sm"
          >
            <option value="">Select court</option>
            {courts.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Coach (optional)</label>
          <select
            name="coachId"
            value={form.coachId}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-sm"
          >
            <option value="">No coach</option>
            {coaches.map(coach => (
              <option key={coach.id} value={coach.id}>
                {coach.name} (${coach.hourlyRate}/hr)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1">Equipment</h3>
        <div className="grid grid-cols-2 gap-2">
          {equipment.map(eq => (
            <div key={eq.id} className="border rounded p-2 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{eq.name}</div>
                <div className="text-xs text-gray-500">
                  Stock: {eq.totalStock} | ${eq.pricePerUnit}/unit/hr
                </div>
              </div>
              <input
                type="number"
                min="0"
                max={eq.totalStock}
                className="w-16 border rounded p-1 text-sm"
                value={selectedEquipment[eq.id] || ''}
                onChange={e => handleEquipmentChange(eq.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="allowWaitlist"
          checked={form.allowWaitlist}
          onChange={handleChange}
        />
        Allow waitlist if slot is full
      </label>

      <div className="flex gap-2">
        <button
          onClick={handleQuote}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Get Price
        </button>
        <button
          onClick={handleBook}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          Confirm Booking
        </button>
      </div>

      {message && <div className="text-sm text-red-600">{message}</div>}

      {price && (
        <PriceBreakdown breakdown={price} />
      )}
    </div>
  );
}
