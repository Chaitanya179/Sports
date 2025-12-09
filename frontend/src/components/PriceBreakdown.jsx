
import React from 'react';

export default function PriceBreakdown({ breakdown }) {
  return (
    <div className="mt-4 border rounded p-3 bg-gray-50 text-sm">
      <h3 className="font-semibold mb-2">Price Breakdown</h3>
      <div className="space-y-1">
        <div>Base court price: ${breakdown.baseCourtPrice.toFixed(2)}</div>
        <div>Equipment fee: ${breakdown.equipmentFee.toFixed(2)}</div>
        <div>Coach fee: ${breakdown.coachFee.toFixed(2)}</div>
        <div>Multiplier: x{breakdown.multiplier.toFixed(2)}</div>
        <div>Flat surcharge: ${breakdown.flatSurcharge.toFixed(2)}</div>
        <div className="font-bold">Total: ${breakdown.total.toFixed(2)}</div>
      </div>
    </div>
  );
}
