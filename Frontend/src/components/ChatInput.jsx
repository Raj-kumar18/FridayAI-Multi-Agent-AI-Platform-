import { Code2, FileText, Globe, Image, MessageSquare, Mic, Paperclip, Presentation, Search, Send, X, Zap } from "lucide-react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import sendMessage from "../features/sendMessage";
import { addMessage, setArtifacts, setIsLoading, setMessage } from "../redux/slices/messageSlice";
import { createConversation } from "../features/createConversation.js";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/slices/conversationSlice.js";
import { updateConversation } from "../features/updateConversation.js";

function ChatInput() {
    const [selectedAgent, setSelectedAgent] = useState("Auto")
    const { selectedConversation } = useSelector(
        (state) => state.conversation
    );
    const { messages } = useSelector((state) => state.message)
    const [selectedFile, setSelectedFile] = useState(null)
    const fileRef = useRef(null)
    console.log("from chat input", messages)
    const dispatch = useDispatch()

    const [value, setValue] = useState("");

    const handleSendMessage = async () => {
        dispatch(setIsLoading(true))
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



        const formData = new FormData()
        formData.append("prompt", prompt)
        formData.append("conversationId", conversation._id)
        formData.append("agent", selectedAgent.toLocaleLowerCase())
        if (selectedFile) {
            formData.append("file", selectedFile)
        }

        try {
            dispatch(addMessage({
                role: "user",
                content: value.trim()
            }))
            const data = await sendMessage(formData);
            dispatch(setIsLoading(false))
            dispatch(setArtifacts(data.data.artifacts || []))
            dispatch(addMessage({
                role: "assistant",
                content: data.data.answer,
                images: data.data.images
            }))


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
            id: "vision",
            icon: Image,
            label: "Vision"
        },
        {
            id: "search",
            icon: Globe,
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


                {
                    selectedFile && (
                        <div className="flex items-center gap-2">
                            {selectedFile?.type === "application/pdf" ? (
                                <FileText size={25} />
                            ) : selectedFile?.type?.startsWith("image/") ? (
                                <img src={URL.createObjectURL(selectedFile)} className="h-10 w-10 rounded-lg object-cover mt-3" alt="Preview" />
                            ) : (
                                <File size={25} />
                            )}
                            <span className="text-slate-400 bg-orange-500/[0.03] border border-white/[0.07] rounded-2xl px-4">
                                {selectedFile.name}
                            </span>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors duration-150 cursor-pointer"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    )
                }

                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ask Anything..."
                    className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
                    rows={3}
                />

                <div className="flex items-center justify-between">



                    <div className="flex items-center gap-1">

                        <input
                            type="file"
                            id="file"
                            name="file"
                            ref={fileRef}
                            onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                    setSelectedFile(file)
                                }
                            }}
                            hidden
                            accept=".pdf,image/*"
                        />

                        <button className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors duration-150 cursor-pointer">
                            <Paperclip onClick={() => fileRef.current.click()} size={17} />
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