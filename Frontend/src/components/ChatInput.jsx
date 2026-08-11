import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sendMessage from "../features/sendMessage";
import { addMessage, setMessage } from "../redux/slices/messageSlice";

function ChatInput() {
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

        if (!selectedConversation?._id) {
            console.log("No conversation selected");
            return;
        }

        const payload = {
            prompt,
            conversationId: selectedConversation._id,
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
                content: data.data
            }))
            console.log("DATA:", data);

            // Clear input after successful request
            setValue("");

        } catch (error) {
            console.error(
                "Send message error:",
                error.response?.data || error
            );
        }
    };

    return (
        <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">

            <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">

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
                            !value.trim() ||
                            !selectedConversation?._id
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