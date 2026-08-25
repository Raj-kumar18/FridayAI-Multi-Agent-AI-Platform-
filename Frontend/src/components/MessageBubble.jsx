import Markdown from "react-markdown";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import {
    Clipboard,
    ExternalLink,
    Play,
    X,
} from "lucide-react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

function MessageBubble({ role, content, images = [] }) {

    const isUser = role === "user";

    const [lightBox, setLightBox] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const [copyCode, setCopyCode] = useState("");

    // =========================================================
    // OPEN IMAGE
    // =========================================================

    const openLightBox = (img) => {
        setSelectedImage(img);
        setLightBox(true);
    };

    // =========================================================
    // COPY CODE
    // =========================================================

    const copyCodes = async (code) => {

        if (copyCode === code) {
            return;
        }

        await navigator.clipboard.writeText(code);

        setCopyCode(code);

        setTimeout(() => {
            setCopyCode("");
        }, 2000);
    };

    // =========================================================
    // URL HELPERS
    // =========================================================

    const isDirectVideo = (url = "") => {

        const cleanUrl = url.split("?")[0].toLowerCase();

        return (
            cleanUrl.endsWith(".mp4") ||
            cleanUrl.endsWith(".webm") ||
            cleanUrl.endsWith(".mov") ||
            cleanUrl.endsWith(".m4v")
        );
    };


    const isDirectImage = (url = "") => {

        const cleanUrl = url.split("?")[0].toLowerCase();

        return (
            cleanUrl.endsWith(".jpg") ||
            cleanUrl.endsWith(".jpeg") ||
            cleanUrl.endsWith(".png") ||
            cleanUrl.endsWith(".gif") ||
            cleanUrl.endsWith(".webp") ||
            cleanUrl.endsWith(".avif")
        );
    };


    const isInstagramPost = (url = "") => {

        return (
            url.includes("instagram.com/p/") ||
            url.includes("instagram.com/reel/") ||
            url.includes("instagram.com/tv/")
        );
    };


    const isInstagramCrawler = (url = "") => {

        return url.includes(
            "lookaside.instagram.com/seo/google_widget/crawler"
        );
    };


    const isYouTube = (url = "") => {

        return (
            url.includes("youtube.com/watch") ||
            url.includes("youtu.be/") ||
            url.includes("youtube.com/shorts/")
        );
    };


    // =========================================================
    // YOUTUBE EMBED
    // =========================================================

    const getYouTubeEmbedUrl = (url) => {

        try {

            const parsed = new URL(url);

            // youtu.be/VIDEO_ID
            if (parsed.hostname.includes("youtu.be")) {

                const id = parsed.pathname.slice(1);

                return `https://www.youtube.com/embed/${id}`;
            }

            // youtube.com/watch?v=VIDEO_ID
            if (parsed.searchParams.get("v")) {

                return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
            }

            // youtube.com/shorts/VIDEO_ID
            if (parsed.pathname.includes("/shorts/")) {

                const id = parsed.pathname.split("/shorts/")[1];

                return `https://www.youtube.com/embed/${id}`;
            }

            return null;

        } catch {

            return null;
        }
    };


    // =========================================================
    // INSTAGRAM EMBED
    // =========================================================

    const getInstagramEmbedUrl = (url) => {

        try {

            const parsed = new URL(url);

            const pathname = parsed.pathname;

            // Normal Instagram post
            if (pathname.includes("/p/")) {

                const shortcode =
                    pathname.split("/p/")[1]?.split("/")[0];

                if (shortcode) {
                    return `https://www.instagram.com/p/${shortcode}/embed`;
                }
            }


            // Instagram reel
            if (pathname.includes("/reel/")) {

                const shortcode =
                    pathname.split("/reel/")[1]?.split("/")[0];

                if (shortcode) {
                    return `https://www.instagram.com/reel/${shortcode}/embed`;
                }
            }


            // Instagram TV
            if (pathname.includes("/tv/")) {

                const shortcode =
                    pathname.split("/tv/")[1]?.split("/")[0];

                if (shortcode) {
                    return `https://www.instagram.com/tv/${shortcode}/embed`;
                }
            }


            return null;

        } catch {

            return null;
        }
    };


    // =========================================================
    // MEDIA COMPONENT
    // =========================================================

    const renderMedia = (url, alt = "") => {

        if (!url) {
            return null;
        }


        // =====================================================
        // DIRECT VIDEO
        // =====================================================

        if (isDirectVideo(url)) {

            return (
                <div className="my-4 w-full max-w-[650px]">

                    <video
                        src={url}
                        controls
                        playsInline
                        preload="metadata"
                        className="
                            w-full
                            max-h-[600px]
                            rounded-2xl
                            border
                            border-white/10
                            bg-black
                            object-contain
                        "
                    />

                </div>
            );
        }


        // =====================================================
        // INSTAGRAM NORMAL POST / REEL
        // =====================================================

        if (isInstagramPost(url)) {

            const embedUrl = getInstagramEmbedUrl(url);

            if (embedUrl) {

                return (
                    <div
                        className="
                            my-4
                            w-full
                            max-w-[540px]
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-black
                        "
                    >

                        <iframe
                            src={embedUrl}
                            className="
                                w-full
                                min-h-[620px]
                                border-0
                            "
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            title="Instagram post"
                        />

                    </div>
                );
            }
        }


        // =====================================================
        // INSTAGRAM CRAWLER URL
        // =====================================================

        if (isInstagramCrawler(url)) {

            return (
                <div
                    className="
                        my-4
                        w-full
                        max-w-[520px]
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        p-4
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-gradient-to-br
                                from-purple-500
                                via-pink-500
                                to-orange-400
                            "
                        >
                            <Play
                                size={18}
                                className="text-white"
                            />
                        </div>


                        <div className="min-w-0 flex-1">

                            <p className="text-sm font-medium text-white">
                                Instagram Media
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                                This is an Instagram crawler URL, not a direct video URL.
                            </p>

                        </div>


                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-1.5
                                rounded-lg
                                bg-orange-500
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-white
                                transition
                                hover:bg-orange-600
                            "
                        >

                            Open

                            <ExternalLink size={13} />

                        </a>

                    </div>

                </div>
            );
        }


        // =====================================================
        // YOUTUBE
        // =====================================================

        if (isYouTube(url)) {

            const embedUrl = getYouTubeEmbedUrl(url);

            if (embedUrl) {

                return (
                    <div
                        className="
                            my-4
                            w-full
                            max-w-[700px]
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-black
                            aspect-video
                        "
                    >

                        <iframe
                            src={embedUrl}
                            className="h-full w-full border-0"
                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                                web-share
                            "
                            allowFullScreen
                            loading="lazy"
                            title="YouTube video"
                        />

                    </div>
                );
            }
        }


        // =====================================================
        // DIRECT IMAGE
        // =====================================================

        if (isDirectImage(url)) {

            return (
                <img
                    src={url}
                    alt={alt || "Image"}
                    loading="lazy"
                    className="
                        my-3
                        max-w-full
                        w-auto
                        max-h-[500px]
                        rounded-2xl
                        border
                        border-white/10
                        object-contain
                        cursor-zoom-in
                        hover:opacity-90
                        transition
                    "
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                    onClick={() => openLightBox(url)}
                />
            );
        }


        // =====================================================
        // NORMAL LINK
        // =====================================================

        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-3
                    py-2
                    text-sm
                    text-blue-400
                    hover:bg-white/[0.08]
                    hover:text-blue-300
                "
            >

                <ExternalLink size={14} />

                Open Media

            </a>
        );
    };


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div
            className={`
                flex
                w-full
                ${isUser
                    ? "justify-end"
                    : "justify-start"
                }
            `}
        >

            <div
                className={`
                    w-fit
                    max-w-[92vw]
                    md:max-w-[72%]
                    min-w-0
                    break-words
                    overflow-hidden
                    px-4
                    py-2.5
                    rounded-2xl
                    text-[13.5px]
                    leading-relaxed

                    ${isUser
                        ? "bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-tr-sm"
                        : "text-slate-200 rounded-tl-sm"
                    }
                `}
            >

                {/* =====================================================
                    IMAGES FROM BACKEND
                ===================================================== */}

                {images?.length > 0 && (

                    <div className="flex flex-wrap gap-3 mb-3">

                        {images.map((img, i) => (

                            <img
                                src={img}
                                alt=""
                                loading="lazy"
                                key={i}
                                className="
                                    w-40
                                    h-28
                                    rounded-2xl
                                    object-cover
                                    border
                                    border-white/10
                                    cursor-zoom-in
                                    hover:opacity-90
                                    transition
                                "
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                                onClick={() =>
                                    openLightBox(img)
                                }
                            />

                        ))}

                    </div>

                )}


                {/* =====================================================
                    MARKDOWN
                ===================================================== */}

                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{

                        // =================================================
                        // HEADINGS
                        // =================================================

                        h1: ({ children }) => (
                            <h1 className="text-3xl font-bold mt-5 mb-3">
                                {children}
                            </h1>
                        ),

                        h2: ({ children }) => (
                            <h2 className="text-2xl font-bold mt-4 mb-2">
                                {children}
                            </h2>
                        ),

                        h3: ({ children }) => (
                            <h3 className="text-xl font-bold mt-3 mb-2">
                                {children}
                            </h3>
                        ),

                        h4: ({ children }) => (
                            <h4 className="text-lg font-bold mt-2 mb-1">
                                {children}
                            </h4>
                        ),

                        h5: ({ children }) => (
                            <h5 className="text-md font-bold mt-1 mb-1">
                                {children}
                            </h5>
                        ),

                        h6: ({ children }) => (
                            <h6 className="text-sm font-bold">
                                {children}
                            </h6>
                        ),


                        // =================================================
                        // PARAGRAPH
                        // =================================================

                        p: ({ children }) => (
                            <p className="text-sm mb-2">
                                {children}
                            </p>
                        ),


                        // =================================================
                        // LINKS
                        // =================================================

                        a: ({ children, href, ...props }) => {

                            if (!href) {
                                return <>{children}</>;
                            }


                            // Instagram crawler URL
                            if (isInstagramCrawler(href)) {

                                return renderMedia(
                                    href,
                                    "Instagram media"
                                );
                            }


                            // Normal Instagram post/reel
                            if (isInstagramPost(href)) {

                                return renderMedia(
                                    href,
                                    "Instagram"
                                );
                            }


                            // YouTube
                            if (isYouTube(href)) {

                                return renderMedia(
                                    href,
                                    "YouTube"
                                );
                            }


                            // Direct video
                            if (isDirectVideo(href)) {

                                return renderMedia(
                                    href,
                                    "Video"
                                );
                            }


                            return (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1
                                        text-sm
                                        text-blue-400
                                        hover:text-blue-300
                                        underline
                                        underline-offset-2
                                    "
                                    {...props}
                                >

                                    {children}

                                    <ExternalLink
                                        size={12}
                                        className="inline"
                                    />

                                </a>
                            );
                        },


                        // =================================================
                        // IMAGE
                        // =================================================

                        img: ({ src, alt }) => {

                            if (!src) {
                                return null;
                            }

                            return renderMedia(
                                src,
                                alt || "Generated image"
                            );
                        },


                        // =================================================
                        // LIST
                        // =================================================

                        ul: ({ children }) => (
                            <ul className="list-disc pl-5">
                                {children}
                            </ul>
                        ),

                        li: ({ children }) => (
                            <li className="text-sm mb-2">
                                {children}
                            </li>
                        ),

                        ol: ({ children }) => (
                            <ol className="list-decimal pl-5">
                                {children}
                            </ol>
                        ),


                        // =================================================
                        // BLOCKQUOTE
                        // =================================================

                        blockquote: ({ children }) => (
                            <blockquote
                                className="
                                    border-l-4
                                    border-gray-500
                                    pl-4
                                    italic
                                    text-gray-500
                                "
                            >
                                {children}
                            </blockquote>
                        ),


                        // =================================================
                        // CODE
                        // =================================================

                        code: ({ className, children }) => {

                            const value =
                                String(children).trim();

                            const language =
                                className
                                    ?.replace("language-", "") || "";


                            if (!className) {

                                return (
                                    <code
                                        className="
                                            px-1.5
                                            py-0.5
                                            rounded-md
                                            bg-gray-800
                                            text-indigo-400
                                        "
                                    >
                                        {value}
                                    </code>
                                );
                            }


                            return (
                                <div
                                    className="
                                        my-4
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-white/20
                                        bg-slate-900
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            px-4
                                            py-2
                                            bg-slate-800/60
                                            border-b
                                            border-white/10
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                text-slate-400
                                                uppercase
                                                font-medium
                                                tracking-wider
                                            "
                                        >
                                            {language || "code"}
                                        </span>


                                        <button
                                            onClick={() =>
                                                copyCodes(value)
                                            }
                                            className="
                                                px-2.5
                                                py-1.5
                                                rounded-lg
                                                text-xs
                                                text-slate-200
                                                bg-orange-600
                                                hover:bg-orange-500
                                                transition
                                                flex
                                                items-center
                                                gap-1.5
                                                cursor-pointer
                                            "
                                        >

                                            <Clipboard size={13} />

                                            {copyCode === value
                                                ? "Copied"
                                                : "Copy"
                                            }

                                        </button>

                                    </div>


                                    <div className="overflow-x-auto">

                                        <SyntaxHighlighter
                                            language={language}
                                            style={atomOneDark}
                                            wrapLongLines
                                            showLineNumbers
                                            customStyle={{
                                                margin: 0,
                                                padding: "16px",
                                                background: "#0d1117",
                                                fontSize: "13px",
                                            }}
                                        >
                                            {value}
                                        </SyntaxHighlighter>

                                    </div>

                                </div>
                            );
                        },


                        pre: ({ children }) => (
                            <pre className="bg-gray-900 p-1 rounded">
                                {children}
                            </pre>
                        ),


                        // =================================================
                        // TABLE
                        // =================================================

                        table: ({ children }) => (
                            <div
                                className="
                                    overflow-x-auto
                                    my-5
                                    rounded-xl
                                    border
                                    border-slate-700
                                "
                            >
                                <table className="min-w-full border-collapse text-sm">
                                    {children}
                                </table>
                            </div>
                        ),

                        thead: ({ children }) => (
                            <thead className="bg-slate-800">
                                {children}
                            </thead>
                        ),

                        tbody: ({ children }) => (
                            <tbody className="divide-y divide-slate-700">
                                {children}
                            </tbody>
                        ),

                        tr: ({ children }) => (
                            <tr className="hover:bg-slate-800/60">
                                {children}
                            </tr>
                        ),

                        th: ({ children }) => (
                            <th
                                className="
                                    border-b
                                    border-slate-700
                                    px-4
                                    py-3
                                    text-left
                                    font-semibold
                                    text-slate-200
                                    whitespace-nowrap
                                "
                            >
                                {children}
                            </th>
                        ),

                        td: ({ children }) => (
                            <td
                                className="
                                    border-b
                                    border-slate-700
                                    px-4
                                    py-3
                                    text-slate-300
                                    align-top
                                "
                            >
                                {children}
                            </td>
                        ),


                        // =================================================
                        // OTHER MARKDOWN
                        // =================================================

                        hr: () => (
                            <hr className="my-6 border-0 border-t border-slate-700" />
                        ),

                        strong: ({ children }) => (
                            <strong className="font-semibold text-white">
                                {children}
                            </strong>
                        ),

                        em: ({ children }) => (
                            <em className="italic text-slate-300">
                                {children}
                            </em>
                        ),

                        del: ({ children }) => (
                            <del className="line-through text-slate-500">
                                {children}
                            </del>
                        ),

                    }}
                >
                    {content}
                </Markdown>

            </div>


            {/* =========================================================
                LIGHTBOX
            ========================================================= */}

            {lightBox && (

                <div
                    className="
                        fixed
                        inset-0
                        bg-black/90
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        z-[1000]
                        p-4
                    "
                    onClick={() => setLightBox(false)}
                >

                    <div
                        className="
                            relative
                            w-[95vw]
                            h-[90vh]
                            flex
                            items-center
                            justify-center
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            onClick={() =>
                                setLightBox(false)
                            }
                            className="
                                absolute
                                top-2
                                right-2
                                z-10
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-white/10
                                text-white
                                hover:bg-white/20
                                cursor-pointer
                            "
                        >

                            <X size={20} />

                        </button>


                        <img
                            src={selectedImage}
                            alt=""
                            className="
                                max-w-full
                                max-h-[85vh]
                                object-contain
                                rounded-xl
                            "
                        />

                    </div>

                </div>

            )}

        </div>
    );
}

export default MessageBubble;