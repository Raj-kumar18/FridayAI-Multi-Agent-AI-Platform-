import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";
import { useEffect, useRef } from "react";

function MessageList() {
    const { messages = [], isLoading } = useSelector(
        (state) => state.message
    );

    const { selectedConversation } = useSelector(
        (state) => state.conversation
    );

    const bottomRef = useRef(null)

    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef?.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        })
    }, [messages?.length, isLoading])


    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {messages.length === 0 || !selectedConversation ? (

                <div className="flex h-full items-center justify-center text-center px-4">

                    <div className="flex flex-col items-center gap-1.5">

                        <h2 className="text-3xl sm:text-4xl font-medium mb-2">
                            Friday
                            <span className="text-orange-500">
                                .AI
                            </span>
                        </h2>

                        <p className="text-[14px] sm:text-[15px] font-semibold text-slate-400 tracking-tight">
                            How can I help you?
                        </p>

                        <p className="text-[13px] sm:text-[15px] max-w-[350px] text-slate-500 leading-relaxed">
                            Ask me anything — code, ideas, explanations,
                            or just a quick question.
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-2">

                            {[
                                "Write a Netflix Clone",
                                "Explain Redis",
                                "Build a dashboard",
                            ].map((s) => (
                                <button
                                    key={s}
                                    className="
                                        text-[11px] sm:text-[12px]
                                        text-slate-400
                                        bg-white/[0.04]
                                        border border-white/[0.07]
                                        px-2.5 sm:px-3
                                        py-1.5
                                        rounded-lg
                                        hover:bg-white/[0.08]
                                        hover:text-slate-200
                                        transition-colors
                                        duration-150
                                        cursor-pointer
                                    "
                                >
                                    {s}
                                </button>
                            ))}

                        </div>

                    </div>

                </div>

            ) : (

                <>
                    {messages.map((msg, i) => (
                        <MessageBubble
                            key={msg._id || i}
                            role={msg?.role}
                            content={msg?.content}
                            images={msg?.images || []}
                        />
                    ))}

                    {isLoading && <LoadingAnimation />}
                </>

            )}
            <div ref={bottomRef} />

        </div>
    );
}

export default MessageList;