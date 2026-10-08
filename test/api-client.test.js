import assert from 'node:assert/strict';
import { test } from 'node:test';
import { api } from '../ui/api-client.js';

function stubFetch(status, body) {
  globalThis.fetch = async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

test('api() returns the parsed body unchanged on a successful response', async (t) => {
  stubFetch(201, { id: '1', title: 'Design review' });
  t.after(() => { delete globalThis.fetch; });
  const result = await api('/bookings', { method: 'POST' });
  assert.deepEqual(result, { id: '1', title: 'Design review' });
});

test('api() attaches the conflicts array to the thrown Error on a 409 response', async (t) => {
  const conflicts = [{
    id: '1', roomId: 'cedar', title: 'Design review', organizer: 'Sam Rivera',
    startTime: '2030-06-12T09:00:00.000Z', endTime: '2030-06-12T10:00:00.000Z',
  }];
  stubFetch(409, { error: 'This room is already booked for the requested time.', conflicts });
  t.after(() => { delete globalThis.fetch; });
  await assert.rejects(
    () => api('/bookings', { method: 'POST' }),
    (error) => {
      assert.equal(error.message, 'This room is already booked for the requested time.');
      assert.deepEqual(error.conflicts, conflicts);
      return true;
    }
  );
});

test('api() does not attach a conflicts property when the error response has none', async (t) => {
  stubFetch(400, { error: 'End time must be after start time.' });
  t.after(() => { delete globalThis.fetch; });
  await assert.rejects(
    () => api('/bookings', { method: 'POST' }),
    (error) => {
      assert.equal(error.message, 'End time must be after start time.');
      assert.equal('conflicts' in error, false);
      return true;
    }
  );
});

test('api() falls back to a generic message when the error body has none', async (t) => {
  stubFetch(500, {});
  t.after(() => { delete globalThis.fetch; });
  await assert.rejects(
    () => api('/bookings'),
    (error) => {
      assert.equal(error.message, 'Unable to complete the request.');
      return true;
    }
  );
});
