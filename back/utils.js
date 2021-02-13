// Adapted from Elian Ebbing's https://stackoverflow.com/a/6178341

// Validates that the input string is a valid date formatted as "yyyy-mm-dd"
var isValidDate = (dateString) => {
  // First check for the pattern
  if (!/^\d{4}\-\d{2}\-\d{2}$/.test(dateString)) return false;

  // Parse the date parts to integers
  var parts = dateString.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);
  console.log(day + " " + month + " " + year);
  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
};

module.exports = { isValidDate };
