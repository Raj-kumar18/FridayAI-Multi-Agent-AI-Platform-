import Markdown from "react-markdown";
import { useState } from "react";
import remarkGfm from "remark-gfm"
import { Clipboard, ExternalLink } from "lucide-react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ role, content, images }) {
    const isUser = role === "user";
    const [lightBox, setLightBox] = useState(false)
    const [selectedImage, setSelectedImage] = useState("")
    const openLightBox = (img) => {
        setSelectedImage(img)
        setLightBox(true)
    }
    const [copyCode, setCodyCode] = useState("")
    const copyCodes = async (code) => {
        console.log(code, copyCode)
        if (copyCode == code) {
            return
        }
        await navigator.clipboard.writeText(code)
        setCodyCode(code)
        setTimeout(() => setCodyCode(""), 2000)
    }

    return (
        <div
            className={`flex w-full ${isUser ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`
                    w-fit
                    max-w-[92vw]
                    md:max-w-[72%]
                    min-w-0
                    break-words
                    overflow-hidden
                    px-4 py-2.5
                    rounded-2xl
                    text-[13.5px]
                    leading-relaxed
                    ${isUser
                        ? "bg-linear-to-br from-orange-500 to-orange-700 text-white rounded-tr-sm"
                        : " text-slate-200 rounded-tl-sm"
                    }
                `}
            >
                {images?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">

                        {images.map((img, i) => {
                            return (
                                <img
                                    src={img}
                                    alt=""
                                    loading="lazy"
                                    onError={(e) => e.target.style.display = "none"}
                                    key={i}
                                    className="w-40 h-28 rounded-2xl object-cover border-white/10 cursor-zoom-in hover:opacity-90 transition-opacity duration-200"
                                    onClick={() => openLightBox(img)}
                                />
                            )
                        })}
                    </div>
                )}
                <Markdown components={{
                    h1: ({ children }) => {
                        return <h1 className="text-3xl font-bold mt-5 mb-3">{children}</h1>
                    },
                    h2: ({ children }) => {
                        return <h2 className="text-2xl font-bold mt-4 mb-2">{children}</h2>
                    },
                    h3: ({ children }) => {
                        return <h3 className="text-xl font-bold mt-3 mb-2">{children}</h3>
                    },
                    h4: ({ children }) => {
                        return <h4 className="text-lg font-bold mt-2 mb-1">{children}</h4>
                    },
                    h5: ({ children }) => {
                        return <h5 className="text-md font-bold mt-1 mb-1">{children}</h5>
                    },
                    h6: ({ children }) => {
                        return <h6 className="text-sm font-bold">{children}</h6>
                    },
                    p: ({ children }) => {
                        return <p className="text-sm mb-2">{children}</p>
                    },
                    a: ({ href, children }) => {
                        return <a target="_blank" rel="noreferrer" className="text-sm text-indigo-400 underline flex items-center gap-1" href={href} onClick={(e) => e.stopPropagation()}>{children} <ExternalLink size={14} /></a>
                    },
                    ul: ({ children }) => {
                        return <ul className="list-disc pl-5">{children}</ul>
                    },
                    li: ({ children }) => {
                        return <li className="text-sm mb-2">{children}</li>
                    },
                    ol: ({ children }) => {
                        return <ol className="list-decimal pl-5">{children}</ol>
                    },
                    blockquote: ({ children }) => {
                        return <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-500">{children}</blockquote>
                    },
                    code: ({ className, children }) => {
                        const value = String(children).trim()
                        const language = className?.replace("language-", "") || ""
                        if (!className) {
                            return (
                                <code className="px-1.5 py-0.5 rounded-md bg-gray-800 text-indigo-400">{value}</code>
                            )
                        }
                        return (
                            <div className="my-4 overflow-hidden rounded-xl border border-white/20 shadow-sm bg-slate-900">
                                <div className="flex items-center justify-between px-4 py-2 bg-slate-800/60 border-b border-white/10">
                                    <span className="text-xs text-slate-400 uppercase font-medium tracking-wider">
                                        {language || "code"}
                                    </span>
                                    <button
                                        value={copyCode}
                                        onClick={() => copyCodes(value)}
                                        className="
                                            px-2.5 py-1.5
                                            rounded-lg
                                            text-xs text-slate-200
                                            bg-orange-600 hover:bg-orange-500
                                            transition-colors
                                            flex items-center gap-1.5
                                            cursor-pointer
                                        "
                                    >
                                        <Clipboard size={13} />
                                        Copy
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <div>
                                        <SyntaxHighlighter language={language} style={atomOneDark}
                                            wrapLongLines
                                            showLineNumbers
                                            customStyle={{
                                                margin: 0,
                                                padding: "16px",
                                                background: "#0d1117",
                                                fontSize: "13px"
                                            }}
                                        >

                                            {value}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    pre: ({ children }) => {
                        return <pre className="bg-gray-900 p-1 rounded">{children}</pre>
                    }
                    , table: ({ children }) => {
                        return (
                            <div className="overflow-x-auto my-5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
                                <table className="min-w-[00px] w-full border-collapse text-sm">
                                    {children}
                                </table>
                            </div>
                        );
                    },

                    thead: ({ children }) => {
                        return (
                            <thead className="bg-slate-300 dark:bg-slate-800">
                                {children}
                            </thead>
                        );
                    },

                    tbody: ({ children }) => {
                        return (
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {children}
                            </tbody>
                        );
                    },

                    tr: ({ children }) => {
                        return (
                            <tr className="
            transition-colors
            hover:bg-slate-50
            dark:hover:bg-slate-800/60
        ">
                                {children}
                            </tr>
                        );
                    },

                    th: ({ children }) => {
                        return (
                            <th
                                className="
                border-b
                border-slate-300
                dark:border-slate-700
                px-4
                py-3
                text-left
                font-semibold
                text-slate-700
                dark:text-slate-200
                whitespace-nowrap
            "
                            >
                                {children}
                            </th>
                        );
                    },

                    td: ({ children }) => {
                        return (
                            <td
                                className="
                border-b
                border-slate-200
                dark:border-slate-700
                px-4
                py-3
                text-slate-600
                dark:text-slate-300
                align-top
            "
                            >
                                {children}
                            </td>
                        );
                    },

                    hr: () => {
                        return (
                            <hr
                                className="
                my-6
                border-0
                border-t
                border-slate-200
                dark:border-slate-700
            "
                            />
                        );
                    },

                    strong: ({ children }) => {
                        return (
                            <strong className="font-semibold text-slate-200 dark:text-white">
                                {children}
                            </strong>
                        );
                    },

                    em: ({ children }) => {
                        return (
                            <em className="italic text-slate-700 dark:text-slate-300">
                                {children}
                            </em>
                        );
                    },

                    del: ({ children }) => {
                        return (
                            <del className="line-through text-slate-400 dark:text-slate-500">
                                {children}
                            </del>
                        );
                    },
                }} remarkPlugins={[remarkGfm]}>
                    {content}
                </Markdown>
            </div>

            {lightBox && <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000]">

                <div className="cursor-zoom-out relative w-[90vw] h-[90vh] max-w-7xl max-h-[90vh] flex items-center justify-center">
                    <button
                        onClick={() => setLightBox(false)}
                        className="cursor-pointer absolute top-6 right-6 text-white text-3xl hover:scale-110 transition-transform duration-200"
                    >
                        ×
                    </button>
                    <img
                        src={selectedImage}
                        alt=""
                        className="w-full max-w-full h-auto max-h-[85vh] object-contain"
                    />

                </div>

            </div>}
        </div>
    );
}

export default MessageBubble;