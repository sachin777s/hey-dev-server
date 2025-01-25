// Date Regex
export const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

// Check it date is less then current date or not
export const isLessThanCurrentDate = (dateString) => {
  if (!DATE_REGEX.test(dateString)) return false;

  const [day, month, year] = dateString.split("/").map(Number);

  const inputDate = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate <= today;
};
