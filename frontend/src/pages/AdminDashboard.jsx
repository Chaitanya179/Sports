
import React, { useEffect, useState } from 'react';
import {
  fetchCourts,
  createCourt,
  updateCourt,
  deleteCourt,
  fetchCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  fetchEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  fetchPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule
} from '../services/api.js';

function SectionCard({ title, children }) {
  return (
    <div className="border rounded p-3 bg-white shadow-sm">
      <h3 className="font-semibold mb-2 text-sm">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rules, setRules] = useState([]);
  const [message, setMessage] = useState('');

  const [newCourt, setNewCourt] = useState({ name: '', type: 'indoor', basePricePerHour: 10 });
  const [newCoach, setNewCoach] = useState({ name: '', hourlyRate: 15 });
  const [newEquipment, setNewEquipment] = useState({ name: '', totalStock: 10, pricePerUnit: 2 });
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'custom',
    isActive: true,
    conditions: '{}',
    effect: '{"multiplier":1,"flatSurcharge":0}'
  });

  const loadAll = () => {
    fetchCourts().then(res => setCourts(res.data));
    fetchCoaches().then(res => setCoaches(res.data));
    fetchEquipment().then(res => setEquipment(res.data));
    fetchPricingRules().then(res => setRules(res.data));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateCourt = async () => {
    try {
      setMessage('');
      await createCourt(newCourt);
      setNewCourt({ name: '', type: 'indoor', basePricePerHour: 10 });
      loadAll();
    } catch {
      setMessage('Error creating court');
    }
  };

  const handleCreateCoach = async () => {
    try {
      setMessage('');
      await createCoach({ ...newCoach, availability: [] });
      setNewCoach({ name: '', hourlyRate: 15 });
      loadAll();
    } catch {
      setMessage('Error creating coach');
    }
  };

  const handleCreateEquipment = async () => {
    try {
      setMessage('');
      await createEquipment(newEquipment);
      setNewEquipment({ name: '', totalStock: 10, pricePerUnit: 2 });
      loadAll();
    } catch {
      setMessage('Error creating equipment');
    }
  };

  const handleCreateRule = async () => {
    try {
      setMessage('');
      const payload = {
        name: newRule.name,
        type: newRule.type,
        isActive: newRule.isActive,
        conditions: JSON.parse(newRule.conditions || '{}'),
        effect: JSON.parse(newRule.effect || '{"multiplier":1,"flatSurcharge":0}')
      };
      await createPricingRule(payload);
      setNewRule({
        name: '',
        type: 'custom',
        isActive: true,
        conditions: '{}',
        effect: '{"multiplier":1,"flatSurcharge":0}'
      });
      loadAll();
    } catch {
      setMessage('Error creating rule (check JSON)');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      {message && <div className="text-sm text-red-600">{message}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Courts">
          <div className="space-y-2 text-sm">
            {courts.map(c => (
              <div key={c.id} className="flex justify-between items-center border rounded px-2 py-1">
                <span>{c.name} ({c.type}) – ${c.basePricePerHour}/hr</span>
                <button
                  onClick={() => deleteCourt(c.id).then(loadAll)}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <input
              className="border rounded p-1 w-full"
              placeholder="Court name"
              value={newCourt.name}
              onChange={e => setNewCourt(prev => ({ ...prev, name: e.target.value }))}
            />
            <select
              className="border rounded p-1 w-full"
              value={newCourt.type}
              onChange={e => setNewCourt(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
            <input
              type="number"
              className="border rounded p-1 w-full"
              placeholder="Base price per hour"
              value={newCourt.basePricePerHour}
              onChange={e => setNewCourt(prev => ({ ...prev, basePricePerHour: Number(e.target.value) }))}
            />
            <button
              onClick={handleCreateCourt}
              className="mt-1 bg-blue-600 text-white text-xs px-3 py-1 rounded"
            >
              Add Court
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Coaches">
          <div className="space-y-2 text-sm">
            {coaches.map(c => (
              <div key={c.id} className="flex justify-between items-center border rounded px-2 py-1">
                <span>{c.name} – ${c.hourlyRate}/hr</span>
                <button
                  onClick={() => deleteCoach(c.id).then(loadAll)}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <input
              className="border rounded p-1 w-full"
              placeholder="Coach name"
              value={newCoach.name}
              onChange={e => setNewCoach(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="number"
              className="border rounded p-1 w-full"
              placeholder="Hourly rate"
              value={newCoach.hourlyRate}
              onChange={e => setNewCoach(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
            />
            <button
              onClick={handleCreateCoach}
              className="mt-1 bg-blue-600 text-white text-xs px-3 py-1 rounded"
            >
              Add Coach
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Equipment">
          <div className="space-y-2 text-sm">
            {equipment.map(eq => (
              <div key={eq.id} className="flex justify-between items-center border rounded px-2 py-1">
                <span>{eq.name} – stock {eq.totalStock} – ${eq.pricePerUnit}/unit</span>
                <button
                  onClick={() => deleteEquipment(eq.id).then(loadAll)}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <input
              className="border rounded p-1 w-full"
              placeholder="Equipment name"
              value={newEquipment.name}
              onChange={e => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="number"
              className="border rounded p-1 w-full"
              placeholder="Total stock"
              value={newEquipment.totalStock}
              onChange={e => setNewEquipment(prev => ({ ...prev, totalStock: Number(e.target.value) }))}
            />
            <input
              type="number"
              className="border rounded p-1 w-full"
              placeholder="Price per unit"
              value={newEquipment.pricePerUnit}
              onChange={e => setNewEquipment(prev => ({ ...prev, pricePerUnit: Number(e.target.value) }))}
            />
            <button
              onClick={handleCreateEquipment}
              className="mt-1 bg-blue-600 text-white text-xs px-3 py-1 rounded"
            >
              Add Equipment
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Pricing Rules">
          <div className="space-y-2 text-xs">
            {rules.map(r => (
              <div key={r.id} className="border rounded px-2 py-1 flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-gray-500">Type: {r.type} | Active: {r.isActive ? 'Yes' : 'No'}</div>
                </div>
                <button
                  onClick={() => deletePricingRule(r.id).then(loadAll)}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1 text-xs">
            <input
              className="border rounded p-1 w-full"
              placeholder="Rule name"
              value={newRule.name}
              onChange={e => setNewRule(prev => ({ ...prev, name: e.target.value }))}
            />
            <select
              className="border rounded p-1 w-full"
              value={newRule.type}
              onChange={e => setNewRule(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="peak_hours">peak_hours</option>
              <option value="weekend">weekend</option>
              <option value="indoor_premium">indoor_premium</option>
              <option value="holiday">holiday</option>
              <option value="custom">custom</option>
            </select>
            <textarea
              className="border rounded p-1 w-full"
              rows="2"
              placeholder='Conditions JSON, e.g. {"startHour":18,"endHour":21}'
              value={newRule.conditions}
              onChange={e => setNewRule(prev => ({ ...prev, conditions: e.target.value }))}
            />
            <textarea
              className="border rounded p-1 w-full"
              rows="2"
              placeholder='Effect JSON, e.g. {"multiplier":1.5,"flatSurcharge":0}'
              value={newRule.effect}
              onChange={e => setNewRule(prev => ({ ...prev, effect: e.target.value }))}
            />
            <button
              onClick={handleCreateRule}
              className="mt-1 bg-blue-600 text-white text-xs px-3 py-1 rounded"
            >
              Add Rule
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
