import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDateTime(t: string | undefined,formatStr: string = "YYYY-MM-DD HH:mm:ss") {
    if (!t) {
        return "-"
    }
    return dayjs(t).tz('Asia/Shanghai').format(formatStr)
}