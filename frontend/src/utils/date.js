import { format, isToday, isYesterday, differenceInMinutes, differenceInDays } from "date-fns";

export const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Never";

    const date = new Date(lastSeen);
    const now = new Date();

    const mins = differenceInMinutes(now, date);

    if (mins < 1) return "Online";

    if (mins < 2) return "Last seen just now";

    if (isToday(date)) return `Last seen today at ${format(date, "hh:mm a")}`;

    if (isYesterday(date)) return `Last seen yesterday at ${format(date, "hh:mm a")}`;

    const days = differenceInDays(now, date);

    if (days < 7) return `Last seen ${format(date, "EEEE 'at' hh:mm a")}`;

    return `Last seen on ${format(date, "dd MMM yyyy")}`;
}