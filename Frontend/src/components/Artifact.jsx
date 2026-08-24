import {
    Code2,
    Copy,
    LucideEye,
    PanelRightClose,
    PanelRightOpen,
    Check,
    X,
    FileCode2,
} from "lucide-react";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import Editor from "@monaco-editor/react";

function Artifact() {
    const { artifacts } = useSelector((state) => state.message);

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [tab, setTab] = useState("code");
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    // ============================================
    // ARTIFACT DATA
    // ============================================

    const artifact = artifacts?.[0];

    const files = artifact?.files || [];

    const activeFile = files?.[activeFileIndex];

    const fileContent = activeFile?.content || "";

    // ============================================
    // FIND FILES FOR PREVIEW
    // ============================================

    const htmlFile =
        files.find((file) =>
            file.name?.toLowerCase().endsWith(".html")
        )?.content || "";

    const cssFile =
        files.find((file) =>
            file.name?.toLowerCase().endsWith(".css")
        )?.content || "";

    const jsFile =
        files.find((file) =>
            file.name?.toLowerCase().endsWith(".js")
        )?.content || "";

    const canPreview = Boolean(htmlFile);

    // ============================================
    // LANGUAGE DETECTION
    // ============================================

    const detectLanguage = (filename = "") => {
        const name = filename.toLowerCase();

        if (name.endsWith(".html")) return "html";
        if (name.endsWith(".css")) return "css";
        if (name.endsWith(".js")) return "javascript";
        if (name.endsWith(".jsx")) return "javascript";
        if (name.endsWith(".ts")) return "typescript";
        if (name.endsWith(".tsx")) return "typescript";
        if (name.endsWith(".json")) return "json";
        if (name.endsWith(".py")) return "python";
        if (name.endsWith(".java")) return "java";
        if (name.endsWith(".cpp")) return "cpp";
        if (name.endsWith(".c")) return "c";
        if (name.endsWith(".sql")) return "sql";
        if (name.endsWith(".md")) return "markdown";

        return "plaintext";
    };

    // ============================================
    // PREVIEW DOCUMENT
    // ============================================

    const previewDoc = `
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <style>
        ${cssFile}
    </style>

</head>

<body>

${htmlFile}

<script>
${jsFile}
</script>

</body>

</html>
`;

    // ============================================
    // COPY ACTIVE FILE
    // ============================================

    const handleCopy = async () => {
        if (!fileContent) return;

        try {
            await navigator.clipboard.writeText(fileContent);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    // ============================================
    // NO ARTIFACT
    // ============================================

    if (!artifacts?.length || !artifact) {
        return null;
    }

    // ============================================
    // MOBILE CONTENT BUTTON
    // ============================================

    const MobileContentButton = () => {
        return (
            <button
                onClick={() => setMobileOpen(true)}
                className="
                    lg:hidden
                    fixed
                    cursor-pointer
                    right-7
                    bottom-7
                    

                    flex
                    items-center
                    gap-2

                    px-4
                    py-3

                    rounded-xl

                    bg-orange-500
                    hover:bg-orange-400

                    text-white
                    text-sm
                    font-medium

                    shadow-lg
                    shadow-orange-500/20

                    border
                    border-orange-400/30

                    transition-all
                    duration-200

                    active:scale-95
                "
            >
                <FileCode2 size={17} />

                <span>Content</span>
            </button>
        );
    };

    // ============================================
    // SHARED ARTIFACT CONTENT
    // ============================================

    const ArtifactContent = ({ mobile = false }) => {
        return (
            <div
                className="
                    flex
                    flex-col
                    w-full
                    h-full
                    min-h-0
                    overflow-hidden
                    bg-[#0d0f14]
                "
            >

                {/* ============================================
                    HEADER
                ============================================ */}

                <div
                    className="
                        min-h-14
                        px-3
                        sm:px-4

                        border-b
                        border-white/[0.06]

                        flex
                        items-center
                        gap-2
                        sm:gap-3

                        shrink-0
                    "
                >

                    {/* Close */}

                    <button
                        onClick={() => {
                            if (mobile) {
                                setMobileOpen(false);
                            } else {
                                setCollapsed(true);
                            }
                        }}
                        title={mobile ? "Close content" : "Collapse"}
                        className="
                            flex
                            items-center
                            justify-center

                            w-8
                            h-8

                            rounded-lg

                            text-slate-500

                            hover:text-slate-200
                            hover:bg-white/[0.05]

                            transition-colors
                            duration-150

                            bg-transparent
                            border-none
                            cursor-pointer

                            shrink-0
                        "
                    >
                        {mobile ? (
                            <X size={17} />
                        ) : (
                            <PanelRightClose size={16} />
                        )}
                    </button>

                    {/* Title */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2

                            flex-1
                            min-w-0
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-center

                                w-7
                                h-7

                                rounded-md

                                bg-orange-500/10
                                border
                                border-orange-500/20

                                shrink-0
                            "
                        >
                            <Code2
                                className="text-orange-400"
                                size={14}
                            />
                        </div>

                        <div
                            className="
                                text-[13px]
                                font-medium
                                text-slate-200
                                truncate
                            "
                        >
                            {artifact?.title || "Artifact"}
                        </div>

                    </div>

                    {/* Copy */}

                    <button
                        onClick={handleCopy}
                        disabled={!fileContent}
                        title="Copy current file"
                        className="
                            flex
                            items-center
                            justify-center

                            w-8
                            h-8

                            rounded-lg

                            text-slate-400

                            hover:text-white
                            hover:bg-white/[0.05]

                            disabled:opacity-30
                            disabled:cursor-not-allowed

                            transition-colors

                            bg-transparent
                            border-none
                            cursor-pointer

                            shrink-0
                        "
                    >
                        {copied ? (
                            <Check
                                size={15}
                                className="text-green-400"
                            />
                        ) : (
                            <Copy size={15} />
                        )}
                    </button>

                    {/* CODE / PREVIEW */}

                    {canPreview && (
                        <div
                            className="
                                flex
                                items-center
                                gap-1

                                bg-white/[0.04]

                                border
                                border-white/[0.06]

                                p-1
                                rounded-lg

                                shrink-0
                            "
                        >

                            <button
                                onClick={() => setTab("code")}
                                className={`
                                    flex
                                    items-center
                                    gap-1.5

                                    px-2
                                    sm:px-2.5
                                    py-1.5

                                    text-[10px]
                                    sm:text-[11px]

                                    font-medium

                                    rounded-md

                                    transition-all
                                    duration-150

                                    border-none
                                    cursor-pointer

                                    ${tab === "code"
                                        ? "text-white bg-orange-500 shadow-sm"
                                        : "text-slate-400 bg-transparent hover:text-slate-200 hover:bg-white/[0.05]"
                                    }
                                `}
                            >
                                <Code2 size={11} />

                                <span>Code</span>
                            </button>

                            <button
                                onClick={() => setTab("preview")}
                                className={`
                                    flex
                                    items-center
                                    gap-1.5

                                    px-2
                                    sm:px-2.5
                                    py-1.5

                                    text-[10px]
                                    sm:text-[11px]

                                    font-medium

                                    rounded-md

                                    transition-all
                                    duration-150

                                    border-none
                                    cursor-pointer

                                    ${tab === "preview"
                                        ? "text-white bg-orange-500 shadow-sm"
                                        : "text-slate-400 bg-transparent hover:text-slate-200 hover:bg-white/[0.05]"
                                    }
                                `}
                            >
                                <LucideEye size={11} />

                                <span>Preview</span>
                            </button>

                        </div>
                    )}

                </div>

                {/* ============================================
                    CONTENT
                ============================================ */}

                <div
                    className="
                        flex-1
                        min-h-0
                        overflow-hidden
                    "
                >

                    {tab === "code" ? (

                        <div
                            className="
                                flex
                                flex-col
                                h-full
                                min-h-0
                            "
                        >

                            {/* ====================================
                                FILE TABS
                            ==================================== */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1

                                    px-2
                                    py-1

                                    border-b
                                    border-white/[0.06]

                                    overflow-x-auto

                                    [scrollbar-width:none]
                                    [&::-webkit-scrollbar]:hidden

                                    shrink-0
                                "
                            >

                                {files.map((file, index) => (

                                    <button
                                        key={file.name || index}
                                        onClick={() =>
                                            setActiveFileIndex(index)
                                        }
                                        className={`
                                            flex
                                            items-center
                                            gap-1.5

                                            px-2.5
                                            sm:px-3

                                            py-1.5

                                            text-[10px]
                                            sm:text-[11px]

                                            font-medium

                                            rounded-md

                                            whitespace-nowrap

                                            border

                                            transition-all
                                            duration-150

                                            cursor-pointer

                                            shrink-0

                                            ${activeFileIndex === index
                                                ? "text-white bg-orange-500/15 border-orange-500/30"
                                                : "text-slate-400 bg-transparent border-transparent hover:text-slate-200 hover:bg-white/[0.05]"
                                            }
                                        `}
                                    >

                                        <Code2 size={10} />

                                        {file.name}

                                    </button>

                                ))}

                            </div>

                            {/* ====================================
                                MONACO
                            ==================================== */}

                            <motion.div
                                key={activeFile?.name}
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="
                                    flex-1
                                    min-h-0
                                    overflow-hidden
                                "
                            >

                                <Editor
                                    theme="vs-dark"

                                    language={detectLanguage(
                                        activeFile?.name
                                    )}

                                    value={fileContent}

                                    options={{
                                        readOnly: true,

                                        minimap: {
                                            enabled: false,
                                        },

                                        fontSize:
                                            mobile
                                                ? 12
                                                : 13,

                                        automaticLayout: true,

                                        scrollBeyondLastLine: false,

                                        padding: {
                                            top: 12,
                                            bottom: 12,
                                        },

                                        wordWrap: "on",

                                        lineNumbers:
                                            mobile
                                                ? "off"
                                                : "on",

                                        renderWhitespace:
                                            "selection",

                                        smoothScrolling: true,

                                        cursorBlinking:
                                            "smooth",

                                        folding: true,

                                        bracketPairColorization: {
                                            enabled: true,
                                        },
                                    }}
                                />

                            </motion.div>

                        </div>

                    ) : (

                        /* ============================================
                           PREVIEW
                        ============================================ */

                        <motion.div
                            key="preview"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="
                                w-full
                                h-full
                                overflow-hidden
                                bg-white
                            "
                        >

                            <iframe
                                className="
                                    w-full
                                    h-full
                                    border-none
                                "
                                srcDoc={previewDoc}
                                sandbox="allow-scripts"
                                title={
                                    artifact?.title ||
                                    "Artifact Preview"
                                }
                            />

                        </motion.div>

                    )}

                </div>

            </div>
        );
    };

    return (
        <>
            {/* ============================================
                MOBILE CONTENT BUTTON
            ============================================ */}

            <MobileContentButton />


            {/* ============================================
                DESKTOP COLLAPSED PANEL
            ============================================ */}

            {collapsed && (
                <motion.div
                    initial={{
                        width: 0,
                        opacity: 0,
                    }}
                    animate={{
                        width: "48px",
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="
                        hidden
                        lg:flex

                        h-full

                        border
                        border-white/[0.06]

                        flex-col
                        items-center

                        py-4
                        gap-3

                        shrink-0

                        bg-[#0d0f14]
                    "
                >

                    <button
                        onClick={() => setCollapsed(false)}
                        className="
                            flex
                            items-center
                            justify-center

                            w-7
                            h-7

                            rounded-lg

                            text-slate-500

                            hover:text-slate-200
                            hover:bg-white/[0.05]

                            transition-colors

                            bg-transparent
                            border-none
                            cursor-pointer
                        "
                    >
                        <PanelRightOpen size={16} />
                    </button>

                    <div
                        className="
                            text-[13px]
                            font-medium
                            text-slate-600

                            tracking-widest
                            uppercase

                            whitespace-nowrap
                        "
                        style={{
                            writingMode: "vertical-lr",
                            transform: "rotate(180deg)",
                        }}
                    >
                        {artifact?.title || "Artifact"}
                    </div>

                </motion.div>
            )}


            {/* ============================================
                DESKTOP PANEL
            ============================================ */}

            {!collapsed && (
                <motion.div
                    initial={{
                        width: 0,
                        opacity: 0,
                    }}
                    animate={{
                        width: "500px",
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="
                        hidden
                        lg:flex

                        h-full

                        border
                        border-white/[0.06]

                        flex-col

                        overflow-hidden

                        shrink-0

                        bg-[#0d0f14]
                    "
                >

                    <ArtifactContent />

                </motion.div>
            )}


            {/* ============================================
                MOBILE PANEL
            ============================================ */}

            <AnimatePresence>

                {mobileOpen && (

                    <motion.div
                        className="
                            lg:hidden

                            fixed
                            inset-0

                            z-[100]

                            bg-black/60
                            backdrop-blur-sm
                        "
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                    >

                        <motion.div
                            initial={{
                                x: "100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "100%",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            className="
                                absolute
                                right-0
                                top-0
                                bottom-0

                                w-full
                                sm:w-[90%]
                                md:w-[600px]

                                max-w-full

                                bg-[#0d0f14]

                                shadow-2xl

                                border-l
                                border-white/[0.08]

                                overflow-hidden
                            "
                        >

                            <ArtifactContent mobile />

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>
        </>
    );
}

export default Artifact;