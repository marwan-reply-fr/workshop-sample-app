export const today = () => new Date().toISOString().slice(0, 10);
export const timeLabel = (value) => value.slice(11, 16);
export const dateLabel = (value) => new Date(`${value}T12:00:00Z`).toLocaleDateString('en', {
  weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
});
