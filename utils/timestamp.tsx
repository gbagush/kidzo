const getDailyTimestamps = () => {
  const now = new Date();

  const startOfDay = new Date(now);

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);

  endOfDay.setHours(23, 59, 59, 999);

  return {
    startTimestamp: startOfDay.getTime(),
    endTimestamp: endOfDay.getTime(),
  };
};

const getWeeklyTimestamps = () => {
  const now = new Date();

  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const startOfWeek = new Date(now);

  startOfWeek.setDate(now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);

  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startTimestamp: startOfWeek.getTime(),
    endTimestamp: endOfWeek.getTime(),
  };
};

const getMonthlyTimestamps = () => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  endOfMonth.setHours(23, 59, 59, 999);

  return {
    startTimestamp: startOfMonth.getTime(),
    endTimestamp: endOfMonth.getTime(),
  };
};

function calculateDaysBetweenTimestamps(
  timestamp1: string,
  timestamp2: string
): number {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

  const daysBetween = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  return daysBetween;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTimestamp = (timestamp: string) => {
  var date = new Date(timestamp);

  return (
    String(date.getDate()).padStart(2, "0") +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    date.getFullYear() +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0")
  );
};

export {
  getDailyTimestamps,
  getWeeklyTimestamps,
  getMonthlyTimestamps,
  calculateDaysBetweenTimestamps,
  formatDate,
  formatTimestamp,
};
