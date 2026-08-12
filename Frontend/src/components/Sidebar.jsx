import React from "react";
import { useState } from "react";
import {
    Plus,
    Settings,
    HelpCircle,
    PanelLeft,
    PenBoxIcon,
    PenSquareIcon,
    PenSquare,
    MessageSquare,
    User,
    Coins,
    LogOut,
    PanelRight
} from "lucide-react";
import { useEffect } from "react";
import { getConversations } from "../features/getConversations";
import { useDispatch } from "react-redux";
import { addConversation, setConversations, setSelectedConversation } from "../redux/slices/conversationSlice";
import { createConversation } from "../features/createConversation";
import { useSelector } from "react-redux";
import logOut from "../features/logOut";
import { setUserData } from "../redux/slices/userSlice";

function Sidebar() {

    const dispatch = useDispatch()
    const { conversations, selectedConversation } = useSelector(
        state => state.conversation
    );

    const { userData } = useSelector(
        state => state.user
    );
    console.log(userData)
    const [collapsed, setCollapsed] = useState(false)
    const [imageError, setImageError] = useState(false)

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
    }, [dispatch, userData?._id])
    const handleCreateConversation = async () => {
        try {
            const data = await createConversation();

            const newConversation = data.data;

            dispatch(addConversation(newConversation));
            dispatch(setSelectedConversation(newConversation));

        } catch (error) {
            console.error("Failed to create conversation:", error);
        }
    };


    if (collapsed) {
        return (
            <div className="hidden lg:flex flex-col items-center w-[56px] bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0">

                <button className="flex items-center justify-center h-7 w-7 rounded-lg border-none bg-transparent text-slate-500 transition-all duration-150 hover:bg-white/[0.05] hover:text-slate-200 cursor-pointer mb-8" onClick={() => setCollapsed(!collapsed)}>
                    <PanelRight size={16} />
                </button>



                <button className="flex items-center justify-center h-7 w-7 rounded-lg border-none bg-transparent text-slate-500 transition-all duration-150 hover:bg-orange-500/10 hover:text-orange-500 cursor-pointer mb-8" onClick={() => dispatch(setSelectedConversation(null))}>
                    <Plus size={16} />
                </button>

                <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {conversations.map((conv) => {
                        const isActive = selectedConversation?._id === conv?._id;

                        return (
                            <div
                                key={conv._id}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`flex cursor-pointer items-center gap-2.5 mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${isActive
                                    ? "bg-orange-500/10 border-orange-500/10"
                                    : "bg-transparent border-transparent"
                                    }`}
                            >
                                <div className={`flex items-center justify-center shrink-0 w-[22px] h-[22px] rounded-lg transition-colors duration-150 ${isActive ? "bg-orange-500/15 text-orange-400" : "bg-white/[0.05] text-slate-500"}`}>

                                    <MessageSquare
                                        className="text-orange-500"
                                        size={18}
                                    />
                                </div>


                            </div>
                        );
                    })}
                </div>

                <div className="relative shrink-0">
                    {
                        userData?.avatar && !imageError ? (
                            <img
                                src={userData.avatar}
                                alt="User avatar"
                                className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/23"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-[10px] border-2 border-indigo-500/23 flex items-center justify-center">
                                <User className="text-orange-500" />
                            </div>
                        )
                    }
                </div>

            </div>
        )
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

                    <button className="flex items-center justify-center h-7 w-7 rounded-lg border-none bg-transparent text-slate-500 transition-all duration-150 hover:bg-white/[0.05] hover:text-slate-200 cursor-pointer" onClick={() => dispatch(setSelectedConversation(null))}>
                        <PenSquare size={16} />
                    </button>

                </div>


                {/* recent conversations */}


                <div className="px-4 pt-4 pb-1 ">
                    <button className="w-full flex items-center justify-center  gap-2.5 text-sm font-medium text-white bg-linear-to-br from-orange-500 to-orange-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150" onClick={() => dispatch(setSelectedConversation(null))}>
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
                    </div>
                )}
                <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {conversations.map((conv) => {
                        const isActive = selectedConversation?._id === conv?._id;

                        return (
                            <div
                                key={conv._id}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`flex cursor-pointer items-center gap-2.5 mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${isActive
                                    ? "bg-orange-500/10 border-orange-500/10"
                                    : "bg-transparent border-transparent"
                                    }`}
                            >
                                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${isActive ? "bg-orange-500/15 text-orange-400" : "bg-white/[0.05] text-slate-500"}`}>

                                    <MessageSquare
                                        className="text-orange-500"
                                        size={18}
                                    />
                                </div>

                                <span
                                    className="truncate text-sm font-medium text-slate-300"
                                >
                                    {conv.title || "New Chat"}
                                </span>

                                <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400">
                                    {new Date(conv.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        );
                    })}
                </div>


                <div className="mx-2.5 ">
                    <div className="px-3.5 py-3.5 border-t border-white/[0.06]">
                        {userData ? (
                            <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">

                                <div className="relative shrink-0">
                                    {
                                        (userData?.avatar || !imageError)
                                            ? <img src={userData?.avatar} alt="" className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/23" onError={() => setImageError(true)} />
                                            :
                                            <div className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/23 flex items-center justify-center ">
                                                <User className="text-orange-500" />
                                            </div>

                                    }
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[13.5px] font-semibold text-slate-100 truncate">{userData.name || "user"}</p>
                                    <p className="text-[11px] text-slate-600 mt-px">{"Free Plan"}</p>
                                </div>

                                <div className="flex gap-1">
                                    <button className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150">
                                        <Coins size={16} />
                                    </button>
                                    <button className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150" onClick={() => {
                                        logOut()
                                        dispatch(setUserData(null))
                                    }}>
                                        <LogOut size={16} />
                                    </button>
                                </div>


                            </div>) : <button></button>}


                    </div>
                </div>

            </div>

        </div>
    )


}

export default Sidebar
