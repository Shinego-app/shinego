import assert from 'node:assert/strict';
import test from 'node:test';

const originalKey = process.env.RESEND_API_KEY;
const originalFetch = globalThis.fetch;

test('mail routes can import without a key; sends fail closed or forward the SDK result', async () => {
  try {
    delete process.env.RESEND_API_KEY;
    let requests = [];
    globalThis.fetch = async (...args) => {
      requests.push(args);
      return new Response(JSON.stringify({ id: 'mock-email-id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    const { resend } = await import('../lib/resend.ts');
    const payload = { from: 'test@example.invalid', to: 'recipient@example.invalid', subject: 'Test', html: '<p>Test</p>' };
    const missing = await resend.emails.send(payload);
    assert.equal(missing.data, null);
    assert.equal(missing.error.name, 'missing_api_key');
    assert.equal(requests.length, 0);

    process.env.RESEND_API_KEY = 're_test_only_not_a_real_key';
    const sent = await resend.emails.send(payload, { idempotencyKey: 'mock-only' });
    assert.equal(sent.error, null);
    assert.equal(sent.data.id, 'mock-email-id');
    assert.equal(requests.length, 1);
    assert.deepEqual(JSON.parse(requests[0][1].body), payload);
    assert.equal(new Headers(requests[0][1].headers).get('Idempotency-Key'), 'mock-only');

    globalThis.fetch = async () => new Response(JSON.stringify({ name: 'validation_error', message: 'Mock rejection' }), { status: 422, headers: { 'Content-Type': 'application/json' } });
    const rejected = await resend.emails.send(payload);
    assert.equal(rejected.data, null);
    assert.equal(rejected.error.message, 'Mock rejection');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
  }
});
