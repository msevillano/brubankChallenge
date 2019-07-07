/**
 * Parses a date into the yyyy-MM-dd format.
 * @param {Date} date - Desired endpoint to call.
 *
 * @return {string} - Formatted date.
 */
function formatDate(date) {
  const month = (date.getMonth() + 1).toString();
  const day = (date.getDate()).toString();
  const year = date.getFullYear();

  return [year, month, day].join('-');
}

export default formatDate;
