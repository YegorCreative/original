/**
 * Calculates the current streak and longest streak for a habit
 * given an array of log dates (strings like 'YYYY-MM-DD').
 */
function calculateStreak(logDates) {
  if (!logDates || logDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort descending
  const sorted = [...logDates].sort((a, b) => new Date(b) - new Date(a));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const toDateStr = (d) => d.toISOString().split('T')[0];

  // Current streak: count consecutive days from today or yesterday
  let currentStreak = 0;
  let cursor = new Date(today);

  // Allow streak to count if the user already completed today OR yesterday
  const mostRecent = new Date(sorted[0]);
  mostRecent.setHours(0, 0, 0, 0);
  const isActive = mostRecent.getTime() === today.getTime() || 
                   mostRecent.getTime() === yesterday.getTime();

  if (isActive) {
    cursor = new Date(mostRecent);
    const dateSet = new Set(sorted);
    while (dateSet.has(toDateStr(cursor))) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // Longest streak: scan all dates
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i]);
    const next = new Date(sorted[i + 1]);
    const diffDays = (curr - next) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

module.exports = { calculateStreak };
