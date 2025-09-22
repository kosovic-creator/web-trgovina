'use client';

import React from 'react';

const StripeButton: React.FC = () => {
  const handleClick = async () => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Greška pri kreiranju Stripe sesije.');
    }

  };

  return (
   
     <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded font-bold mb-2" onClick={handleClick}>
            {/* Stripe logo SVG */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#fff" />
              <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#635BFF">Stripe</text>
            </svg>
            Stripe
          </button>
  );
};

export default StripeButton;