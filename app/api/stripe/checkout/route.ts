import {  NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Proizvod iz korpe',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: process.env.success_url || 'https://web-trgovina.vercel.app/success',
      cancel_url: process.env.cancel_url || 'https://web-trgovina.vercel.app/cancel',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}