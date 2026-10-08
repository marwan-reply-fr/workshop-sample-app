import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatConflictIntervals } from '../ui/conflict-message.js';

test('formats a single conflicting interval as a UTC HH:MM range', () => {
  const result = formatConflictIntervals([
    { startTime: '2030-06-12T09:00:00.000Z', endTime: '2030-06-12T10:00:00.000Z' },
  ]);
  assert.deepEqual(result, ['09:00–10:00']);
});

test('formats every conflicting interval, in the order received, with no re-sort', () => {
  const result = formatConflictIntervals([
    { startTime: '2030-06-12T10:00:00.000Z', endTime: '2030-06-12T11:00:00.000Z' },
    { startTime: '2030-06-12T09:30:00.000Z', endTime: '2030-06-12T10:30:00.000Z' },
  ]);
  assert.deepEqual(result, ['10:00–11:00', '09:30–10:30']);
});

test('returns an empty list when there are no conflicts', () => {
  assert.deepEqual(formatConflictIntervals([]), []);
});
