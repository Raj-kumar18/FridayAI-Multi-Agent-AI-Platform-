
function MessageBubble({ role, content }) {
    const isUser = role === "user"
    return (
        <div className={`flex  ${isUser ? "justify-end" : "justify-start"}`}>

            <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed
                ${isUser ? "bg-linear-to-br from-orange-500 to-orange-700 text-white rounded-tr-sm"
                    : "bg-white/[0.04] border border-white/[0.05] text-slate-200 rounded-tl-sm"
                }
                `}>
                <p className="whitespace-pre-wrap">{content}</p>
            </div>

        </div>
    )
}

export default MessageBubble