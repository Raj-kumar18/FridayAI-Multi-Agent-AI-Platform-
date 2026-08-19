import { Code2, PanelRightClose, PanelRightOpen } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react"

function Artifact() {
    const { artifacts } = useSelector(state => state.message)
    const [collapsed, setCollapsed] = useState(false)

    if (artifacts.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ width: "270px" }}
            animate={{ width: collapsed ? "48px" : "270px" }}
            exit={{ width: "48px" }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex h-full border-1 border-white/[0.06]  flex-col overflow-hidden shrink-0 w-[270px]">

            {!collapsed ?
                <div className="flex flex-col h-full bg-[#0d0f14]">

                    <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
                        <button className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0">
                            <PanelRightClose size={16} onClick={() => setCollapsed(true)} />
                        </button>

                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                                <Code2 className="text-orange-400" size={14} />
                            </div>

                            <div className="text-[13px] font-medium text-slate-200 truncate">{artifacts[0]?.title}</div>



                        </div>
                    </div>

                </div> : <div className="hidden lg:flex h-full border-1 border-white/[0.06] flex-col items-center py-4 gap-3 shrink-0 bg-[#0d0f14]">
                    <button className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0">
                        <PanelRightOpen size={16} onClick={() => setCollapsed(false)} />
                    </button>

                    <div className="flex items-center gap-2 flex-1 min-w-0">

                        <div className="text-[13px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap" style={{
                            writingMode: "vertical-lr",
                            transform: "rotate(180deg)"

                        }}>{artifacts[0]?.title}</div>
                    </div>
                </div>
            }


        </motion.div>
    )
}

export default Artifact
