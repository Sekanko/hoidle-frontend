const options = {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export function getDateFromWarsaw() {
  const now = new Date();
  const warsawDate = now.toLocaleDateString("pl-PL", options);
  return warsawDate;
}

export function isDateSameInWarsaw(dateString) {
  const warsawDate = getDateFromWarsaw();
  return warsawDate === dateString;
}

export function getTimeToNextMidnight() {
  const now = new Date();
  const warsawNow = new Date(
    now.toLocaleString("en-EN", { timeZone: "Europe/Warsaw" })
  );

  const nextMidnight = new Date(warsawNow);
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight - warsawNow;
}
