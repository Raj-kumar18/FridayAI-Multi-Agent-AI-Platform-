// features/calendar.js — simplified
import api from "../../utils/axios";

const BASE_URL = `/api/agent/calendar`;

export const getCalendarStatus = async () => {
    const res = await api.get(`${BASE_URL}/google/status`);
    console.log(res);
    return res.data.connected;
};

export const disconnectCalendar = async () => {
    const res = await api.post(`${BASE_URL}/google/disconnect`);
    return res.data;
};

export const getConnectUrl = () => `${api.defaults.baseURL}${BASE_URL}/google/connect`;