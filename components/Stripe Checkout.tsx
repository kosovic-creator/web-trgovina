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
    <button onClick={handleClick}>
      Plati Stripe
    </button>
  );
};

export default StripeButton;