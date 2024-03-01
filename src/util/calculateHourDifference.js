export function calculateHourDifference(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const date1 = new Date(0, 0, 0, hours1, minutes1);
    const date2 = new Date(0, 0, 0, hours2, minutes2);

    const timeDiff = Math.abs(date2 - date1);
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff;
}