import { Code2, FileText, Image, MessageSquare, Mic, Paperclip, Presentation, Search, Send, Zap } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sendMessage from "../features/sendMessage";
import { addMessage, setMessage } from "../redux/slices/messageSlice";
import { createConversation } from "../features/createConversation.js";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/slices/conversationSlice.js";
import { updateConversation } from "../features/updateConversation.js";

function ChatInput() {
    const [selectedAgent, setSelectedAgent] = useState("Auto")
    const { selectedConversation } = useSelector(
        (state) => state.conversation
    );
    const { messages } = useSelector((state) => state.message)
    console.log("from chat input", messages)
    const dispatch = useDispatch()

    const [value, setValue] = useState("");

    const handleSendMessage = async () => {
        const prompt = value.trim();

        if (!prompt) return;
        let conversation = selectedConversation

        if (!conversation) {
            const data = await createConversation();
            console.log("CREATE CONVERSATION DATA:", data);
            dispatch(setSelectedConversation(data.data))
            dispatch(addConversation(data.data))
            conversation = data.data

        }


        if (conversation.title == "New Chat") {
            await updateConversation({
                id: conversation._id,
                title: value.trim().slice(0, 100)
            })
            dispatch(setConvTitle({
                title: value.trim().slice(0, 100) + "...",
                conversationId: conversation._id
            }))
        }


        const payload = {
            prompt,
            conversationId: conversation._id,
            agent: selectedAgent.toLocaleLowerCase()
        };

        console.log("SEND PAYLOAD:", payload);

        try {
            dispatch(addMessage({
                role: "user",
                content: value.trim()
            }))
            const data = await sendMessage(payload);
            dispatch(addMessage({
                role: "assistant",
                content: data.data.answer,
                images: data.data.images
            }))
            console.log("DATA:", data.data.answer, data.data.images);

            // Clear input after successful request
            setValue("");

        } catch (error) {
            console.error(
                "Send message error:",
                error.response?.data || error
            );
        }
    };

    const agents = [
        {
            id: "auto",
            icon: Zap,
            label: "Auto"
        },
        {
            id: "chat",
            icon: MessageSquare,
            label: "Chat"
        },
        {
            id: "coding",
            icon: Code2,
            label: "Coding"
        },
        {
            id: "pdf",
            icon: FileText,
            label: "PDF"
        },
        {
            id: "ppt",
            icon: Presentation,
            label: "PPT"
        },
        {
            id: "image",
            icon: Image,
            label: "Image"
        },
        {
            id: "search",
            icon: Search,
            label: "Search"
        }
    ]


    return (
        <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">

            <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">

                <div className="flex w-[80%} gap-2 pr-2 flex-wrap">
                    {agents.map((agent) => {
                        const isActive = selectedAgent === agent.label
                        const Icon = agent.icon
                        console.log(isActive)

                        return (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent.label)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-colors duration-200 cursor-pointer text-sm border
                            ${isActive
                                        ? "bg-orange-600 text-white border-orange-600"
                                        : "text-slate-400 bg-orange-500/[0.03] hover:text-slate-200 hover:bg-orange-500/[0.06] border-white/[0.07]"
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium">{agent.label}</span>
                            </button>
                        )
                    })}

                </div>

                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ask Anything..."
                    className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
                    rows={3}
                />

                <div className="flex items-center justify-between">



                    <div className="flex items-center gap-1">

                        <button className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors duration-150 cursor-pointer">
                            <Paperclip size={17} />
                        </button>

                        <button className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors duration-150 cursor-pointer">
                            <Mic size={17} />
                        </button>

                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={
                            !value.trim()
                        }
                        className={`flex items-center justify-center w-8 h-8 border-none cursor-pointer transition-all rounded-xl px-2 py-1.5 duration-150 hover:opacity-90 text-white ${!value.trim() ||
                            !selectedConversation?._id
                            ? "bg-white/3 cursor-not-allowed"
                            : "bg-linear-to-br from-orange-500 to-orange-700"
                            }`}
                    >
                        <Send size={16} />
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ChatInput;