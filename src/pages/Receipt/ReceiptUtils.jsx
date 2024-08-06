export function formatDateTime(dateString) {
  try {
    const date = new Date(dateString);

    const options = {
      weekday: "long", // "Monday"
      year: "numeric", // "2024"
      month: "long", // "August"
      day: "numeric", // "6"
      hour: "2-digit", // "06"
      minute: "2-digit", // "43"
      second: "2-digit", // "10"
      hour12: true // "AM" or "PM"
    };

    return date.toLocaleString("vi-VN", options);
  } catch (error) {
    return dateString;
  }
}

export function formatDate(dateString) {
  try {
    const date = new Date(dateString);

    const options = {
      weekday: "long", // "Monday"
      year: "numeric", // "2024"
      month: "long", // "August"
      day: "numeric" // "6"
    };

    return date.toLocaleString("vi-VN", options);
  } catch (error) {
    return dateString;
  }
}
