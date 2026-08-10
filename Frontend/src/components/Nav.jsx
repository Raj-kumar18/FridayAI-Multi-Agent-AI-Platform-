import { MessageSquare } from "lucide-react"
import { useSelector } from "react-redux"
function Nav() {

    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages } = useSelector(state => state.message)




    return (
        <>

            {selectedConversation && <div className="flex h-14 items-center gap-2.5 px-5 border-b border-white/[0.06] bg-[#0d0f14]">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/10 shrink-0">
                    <MessageSquare size={13} className="text-orange-500 " />
                </div>
                <div className="text-[14px] font-semibold text-slate-100 tracking-tight">
                    {selectedConversation?.title || "New Chat"}
                </div>
                <div className="text-[10px] font-medium text-slate-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                    {messages?.length} Messages
                </div>
            </div>}
        </>
    )
}
export default Nav