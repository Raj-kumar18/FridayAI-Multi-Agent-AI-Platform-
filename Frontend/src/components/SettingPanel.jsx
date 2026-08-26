// components/SettingsPanel.jsx
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import CalendarConnectButton from "./CalendarConnectButton";


function SettingsPanel({ showSettings, setShowSettings }) {
    const { userData } = useSelector(state => state.user);

    if (!showSettings) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[420px] max-w-[90vw] rounded-2xl bg-[#0d0f14] border border-white/[0.06] p-5">

                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[16px] font-semibold text-slate-100">Settings</h2>
                    <button
                        onClick={() => setShowSettings(false)}
                        className="flex items-center justify-center w-7 h-7 rounded-lg border-none bg-transparent text-slate-500 hover:bg-white/[0.05] hover:text-slate-200 transition-all duration-150 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="border-t border-white/[0.06] pt-4">
                    <p className="text-[13px] font-medium text-slate-200 mb-1">Integrations</p>
                    <p className="text-[11.5px] text-slate-500 mb-4">
                        Apne accounts connect karo taaki AI agent unke saath directly kaam kar sake.
                    </p>

                    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-3">
                        <div>
                            <p className="text-[13px] font-medium text-slate-200">Google Calendar</p>
                            <p className="text-[11px] text-slate-500">Meetings schedule, update, delete</p>
                        </div>
                        <CalendarConnectButton userId={userData?._id || userData?.userId} />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SettingsPanel;