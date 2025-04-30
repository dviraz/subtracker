import { createEdgeRouter } from 'next-connect';
import { NextRequest } from 'next/server';
import { get, set } from '@vercel/edge-config';

const router = createEdgeRouter<NextRequest>();

router.get(async (req) => {
  const subscriptions = await get('subscriptions') || [];
  return new Response(JSON.stringify(subscriptions), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

router.post(async (req) => {
  const newSubscription = await req.json();
  const currentSubscriptions = await get('subscriptions') || [];
  const updatedSubscriptions = [...currentSubscriptions, newSubscription];
  await set('subscriptions', updatedSubscriptions);
  
  return new Response(JSON.stringify(newSubscription), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

router.delete(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return new Response('Missing subscription ID', { status: 400 });
  }

  const currentSubscriptions = await get('subscriptions') || [];
  const updatedSubscriptions = currentSubscriptions.filter(
    (sub: any) => sub.id !== id
  );
  
  await set('subscriptions', updatedSubscriptions);
  
  return new Response(null, { status: 204 });
});

export default router.handler();

export const config = {
  runtime: 'edge',
};