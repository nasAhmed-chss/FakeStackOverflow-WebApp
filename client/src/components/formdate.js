export default function formatDate(date) {
    // formatDate implementation
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const now = new Date();
    const diffInSeconds = Math.round((now - date) / 1000);
    const diffInMinutes = Math.round(diffInSeconds / 60);
    const diffInHours = Math.round(diffInMinutes / 60);

    // Format the time as hh:mm AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const timeFormatted = `${hours}:${minutes} ${ampm}`;

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else if (now.getFullYear() === date.getFullYear()) {
        return `${monthNames[date.getMonth()]} ${date.getDate()} at ${timeFormatted}`;
    } else {
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${timeFormatted}`;
    }
}
