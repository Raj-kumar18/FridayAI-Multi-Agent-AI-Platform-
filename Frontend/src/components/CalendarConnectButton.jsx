import { useEffect, useState } from "react";
import { getCalendarStatus, disconnectCalendar, getConnectUrl } from "../features/calendar";

const CalendarConnectButton = ({ userId }) => {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Redirect se wapas aane par query param already batata hai connected hai
                const params = new URLSearchParams(window.location.search);
                if (params.get("calendar") === "connected") {
                    setConnected(true);
                    setLoading(false);
                    // URL clean kar do taaki refresh pe dobara na dikhe
                    window.history.replaceState({}, "", window.location.pathname);
                    return;
                }

                const status = await getCalendarStatus(userId);
                setConnected(status);
            } catch (err) {
                console.error("Status check failed:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) checkStatus();
    }, [userId]);

    const handleConnect = () => {
        window.location.href = getConnectUrl(userId);
    };

    const handleDisconnect = async () => {
        setActionLoading(true);
        try {
            await disconnectCalendar(userId);
            setConnected(false);
        } catch (err) {
            console.error("Disconnect failed:", err);
        } finally {
            setActionLoading(false);
        }
    };


    return connected ? (
        <div className="flex items-center gap-3">
            <span className="text-green-600 text-sm font-medium">✅ Google Calendar Connected</span>
            <button
                onClick={handleDisconnect}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition"
            >
                {actionLoading ? "Disconnecting..." : "Disconnect"}
            </button>
        </div>
    ) : (
        <button
            onClick={handleConnect}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm transition"
        >
            🔗 Connect Google Calendar
        </button>
    );
};

export default CalendarConnectButton;