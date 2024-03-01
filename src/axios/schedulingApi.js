import request from './index'

export const getSchedulingByID = (id) => request.post('/getSchedulingByID', { id: id })

export const getListByID = (id, startDate, endDate) => request.post('/getListByID', { id: id, startDate: startDate, endDate: endDate })

export const getStatisticById = (uId, startTime, endTime) => request.post('/getStatisticById', { uId: uId, startTime: startTime, endTime, endTime });

export const getWorkById = (uId) => request.post('/getWorkById', { uId: uId });

export const setSchedulingByID = (uId, wId, date, time, hour, hourlyRate) => request.post('/setSchedulingByID', {
    uId: uId,
    wId: wId,
    date: date,
    time: time,
    hour: hour,
    hourlyRate: hourlyRate
})

export const getWorkIdByName = (workName) => request.post('/getWorkIdByName', { workName: workName })

export const deleteSchedulingByDateTime = (date, time) => request.post('/deleteSchedulingByDateTime', { date: date, time: time })

export const getWorkTemplateByID = (uId) => request.post('/getWorkTemplateByID', { uId: uId });

export const setWorkTemplate = (uId, wId, workName, hourlyRate) => request.post('/setWorkTemplate', { uId: uId, wId: wId, workName: workName, hourlyRate: hourlyRate })

export const deleteWorkTemplateByID = (wId) => request.post('deleteWorkTemplateByID', { wId: wId });

export const editSchedulingBySchedulingId = (SchedulingId, newScheduling) => request.post('editSchedulingBySchedulingId', { SchedulingId: SchedulingId, newScheduling: newScheduling });

export const test = () => request.get('/test')