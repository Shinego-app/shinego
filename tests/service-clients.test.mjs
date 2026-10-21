import test from 'node:test';
import assert from 'node:assert/strict';

test('Stripe imports without credentials, rejects use without them, and verifies signatures locally', async () => {
  const previous = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  try {
    const { getStripe } = await import('../lib/stripe.ts');
    assert.throws(getStripe, /STRIPE_SECRET_KEY/);
    process.env.STRIPE_SECRET_KEY = 'sk_test_offline_placeholder';
    const stripe = getStripe();
    assert.equal(getStripe(), stripe);
    const payload = JSON.stringify({ id: 'evt_local_only', type: 'checkout.session.completed' });
    const secret = 'whsec_local_only';
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
    assert.equal(stripe.webhooks.constructEvent(payload, header, secret).id, 'evt_local_only');
    assert.throws(() => stripe.webhooks.constructEvent(payload, header, 'wrong_secret'));
  } finally {
    if (previous === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = previous;
  }
});

test('Supabase server import is safe without credentials and preserves query binding and auth', async () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SECRET_KEY;
  const originalFetch = globalThis.fetch;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SECRET_KEY;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return new Response(JSON.stringify([{ id: 'local-only' }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const { supabaseAdmin } = await import('../lib/supabaseAdmin.ts');
    assert.throws(() => supabaseAdmin.from('boekingen'), /serverconfiguratie/);
    assert.equal(calls.length, 0);
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:1';
    process.env.SUPABASE_SECRET_KEY = 'offline-test';
    const { data, error } = await supabaseAdmin.from('boekingen').select('id').eq('id', 'local-only');
    assert.equal(error, null);
    assert.deepEqual(data, [{ id: 'local-only' }]);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /rest\/v1\/boekingen/);
    assert.equal(typeof supabaseAdmin.auth.getUser, 'function');
  } finally {
    globalThis.fetch = originalFetch;
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SECRET_KEY; else process.env.SUPABASE_SECRET_KEY = previousKey;
  }
});
