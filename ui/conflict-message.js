import { timeLabel } from './time.js';

export function formatConflictIntervals(conflicts) {
  return conflicts.map(({ startTime, endTime }) => `${timeLabel(startTime)}–${timeLabel(endTime)}`);
}
