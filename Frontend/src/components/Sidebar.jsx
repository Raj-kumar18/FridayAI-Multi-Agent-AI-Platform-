import React from "react";
import { useState } from "react";
import {
    Plus,
    Settings,
    HelpCircle,
    PanelLeft,
    PenBoxIcon,
    PenSquareIcon,
    PenSquare
} from "lucide-react";
import { useEffect } from "react";
import { getConversations } from "../features/getConversations";
import { useDispatch } from "react-redux";
import { addConversation, setConversations } from "../redux/slices/conversationSlice";
import { createConversation } from "../features/createConversation";
import { useSelector } from "react-redux";

function Sidebar() {

    const dispatch = useDispatch()
    const { conversations } = useSelector(state => state.conversation)
    const [collapsed, setCollapsed] = useState(false)


    useEffect(() => {
        const getConv = async () => {
            try {
                const data = await getConversations()

                dispatch(setConversations(data.data))
            } catch (error) {
                console.error("Failed to fetch conversations:", error)
            }
        }

        getConv()
    }, [dispatch])
    const handleCreateConversation = async () => {
        try {
            const data = await createConversation()

            dispatch(addConversation(data.data))
        } catch (error) {
            console.error("Failed to create conversation:", error)
        }
    }

    return (
        <div className="fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06]">

            <div className="flex h-full flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-4">

                    <div className="flex items-center gap-2.5" onClick={() => setCollapsed(!collapsed)}>

                        <PanelLeft className="hidden h-6 w-6 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-slate-500 transition-all duration-150 hover:bg-white/[0.05] hover:text-slate-200 lg:flex" />

                        <span className="text-[16px] font-semibold tracking-tight text-slate-100">
                            Friday.Ai
                        </span>
                    </div>

                    <span className="ml-auto rounded-full border border-orange-500/10 bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium tracking-wider text-orange-400">
                        free
                    </span>

                    <button className="flex items-center justify-center h-7 w-7 rounded-lg border-none bg-transparent text-slate-500 transition-all duration-150 hover:bg-white/[0.05] hover:text-slate-200 cursor-pointer" onClick={handleCreateConversation}>
                        <PenSquare size={16} />
                    </button>

                </div>


                {/* recent conversations */}


                <div className="px-4 pt-4 pb-1 ">
                    <button className="w-full flex items-center justify-center  gap-2.5 text-sm font-medium text-white bg-linear-to-br from-orange-500 to-orange-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150" onClick={handleCreateConversation}>
                        <Plus size={18} />
                        <span>New Chat</span>
                    </button>
                </div>

                {conversations.length == 0 ? (
                    <div className="flex-1 overflow-y-auto px-4">
                        <div className="text-center text-slate-400 py-4">
                            No conversation history
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
                            Recent
                        </div>
                        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {conversations.map((conversation) => (
                                <div key={conversation._id} className="px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.05] rounded-lg cursor-pointer">
                                    {conversation.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>




        </div>
    )
}

export default Sidebar
