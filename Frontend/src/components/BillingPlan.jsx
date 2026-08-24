import { Crown, X, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSelector } from "react-redux";

import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";

function BillingPlan({ showBilling, setShowBilling }) {
    const { userData } = useSelector((state) => state.user);

    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder(plan);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,

                amount: data?.order?.amount,
                currency: data?.order?.currency,

                name: "AI Agent Platform",
                description: `${data?.plan?.name} Plan`,

                order_id: data?.order?.id,

                prefill: {
                    name: userData?.name || "",
                    email: userData?.email || "",
                },

                handler: async function (response) {
                    try {
                        const paymentData = {
                            razorpay_order_id:
                                response.razorpay_order_id,

                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_signature:
                                response.razorpay_signature,
                        };

                        await verifyPayment(paymentData);

                        setShowBilling(false);

                        // Refresh user data
                        window.location.reload();
                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error
                        );
                    }
                },

                modal: {
                    ondismiss: function () {
                        console.log("Payment popup closed");
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                console.error(
                    "Payment failed:",
                    response.error
                );
            });

            razorpay.open();
        } catch (error) {
            console.error("ERROR:", error);
        }
    };

    const currentPlan = userData?.plan || "free";

    const credits = userData?.credits || 0;

    const totalCredits = userData?.totalCredits || 100;

    const creditPercentage = Math.min(
        Math.max((credits / totalCredits) * 100, 0),
        100
    );

    return (
        <AnimatePresence>
            {showBilling && (
                <>
                    {/* =========================================
                        BACKDROP
                    ========================================= */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="
                            fixed
                            inset-0
                            bg-black
                            z-[60]
                        "
                        onClick={() =>
                            setShowBilling(false)
                        }
                    />

                    {/* =========================================
                        BILLING DRAWER
                    ========================================= */}

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className="
                            fixed
                            top-0
                            right-0
                            z-[70]

                            h-dvh
                            w-full
                            sm:w-[380px]
                            md:w-[400px]

                            bg-[#0f1117]

                            border-l
                            border-white/[0.08]

                            shadow-2xl

                            flex
                            flex-col

                            overflow-hidden
                        "
                    >
                        {/* =====================================
                            HEADER
                        ===================================== */}

                        <div
                            className="
                                shrink-0

                                px-4
                                sm:px-5

                                py-4
                                sm:py-5

                                border-b
                                border-white/[0.08]

                                flex
                                items-center
                                justify-between

                                gap-3
                            "
                        >
                            {/* Title */}

                            <div className="min-w-0">
                                <h1
                                    className="
                                        text-white
                                        font-semibold
                                        text-lg
                                        sm:text-xl
                                        truncate
                                    "
                                >
                                    Billing Plans
                                </h1>

                                <p
                                    className="
                                        text-slate-400
                                        text-xs
                                        sm:text-sm
                                        mt-0.5
                                    "
                                >
                                    Plan & Credits
                                </p>
                            </div>

                            {/* Close */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowBilling(false)
                                }
                                className="
                                    shrink-0

                                    w-9
                                    h-9

                                    flex
                                    items-center
                                    justify-center

                                    rounded-lg

                                    text-slate-400

                                    hover:text-white
                                    hover:bg-white/[0.06]

                                    transition-colors

                                    cursor-pointer
                                "
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* =====================================
                            SCROLLABLE CONTENT
                        ===================================== */}

                        <div
                            className="
                                flex-1
                                min-h-0

                                overflow-y-auto

                                px-4
                                sm:px-5

                                py-4
                                sm:py-5

                                space-y-5

                                overscroll-contain

                                [scrollbar-width:thin]
                            "
                        >
                            {/* =================================
                                CURRENT PLAN
                            ================================= */}

                            <div
                                className="
                                    rounded-xl

                                    bg-white/[0.04]

                                    border
                                    border-white/[0.08]

                                    p-4
                                    sm:p-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-slate-400
                                                text-xs
                                                sm:text-sm
                                            "
                                        >
                                            Current Plan
                                        </p>

                                        <h3
                                            className="
                                                text-white
                                                text-lg
                                                sm:text-xl
                                                font-bold
                                                capitalize
                                                mt-0.5
                                                truncate
                                            "
                                        >
                                            {currentPlan}
                                        </h3>
                                    </div>

                                    <div
                                        className="
                                            shrink-0

                                            w-9
                                            h-9

                                            rounded-lg

                                            flex
                                            items-center
                                            justify-center

                                            bg-yellow-400/10
                                            border
                                            border-yellow-400/20
                                        "
                                    >
                                        <Crown
                                            size={18}
                                            className="text-yellow-400"
                                        />
                                    </div>
                                </div>

                                {/* Credits */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between

                                        text-xs
                                        sm:text-sm

                                        text-slate-400

                                        mt-5
                                        mb-2
                                    "
                                >
                                    <span>Credits</span>

                                    <span>
                                        {credits} /{" "}
                                        {totalCredits}
                                    </span>
                                </div>

                                {/* Progress */}

                                <div
                                    className="
                                        h-2

                                        rounded-full

                                        bg-white/[0.08]

                                        overflow-hidden
                                    "
                                >
                                    <motion.div
                                        initial={{
                                            width: 0,
                                        }}
                                        animate={{
                                            width: `${creditPercentage}%`,
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeOut",
                                        }}
                                        className="
                                            h-full

                                            bg-orange-500

                                            rounded-full
                                        "
                                    />
                                </div>
                            </div>

                            {/* =================================
                                AVAILABLE PLANS
                            ================================= */}

                            <div className="space-y-3">
                                <h2
                                    className="
                                        text-white
                                        text-sm
                                        sm:text-base
                                        font-semibold
                                    "
                                >
                                    Available Plans
                                </h2>

                                {/* =============================
                                    STARTER
                                ============================= */}

                                <div
                                    className={`
                                        rounded-xl

                                        border

                                        p-4
                                        sm:p-5

                                        transition-colors

                                        ${currentPlan ===
                                            "starter"
                                            ? "border-orange-500/30 bg-orange-500/[0.04]"
                                            : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                                        }
                                    `}
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        "
                                    >
                                        <div>
                                            <h3
                                                className="
                                                    text-white
                                                    font-semibold
                                                    text-sm
                                                    sm:text-base
                                                "
                                            >
                                                Starter Plan
                                            </h3>

                                            <p
                                                className="
                                                    text-orange-400
                                                    text-2xl
                                                    sm:text-3xl
                                                    font-bold
                                                    mt-2
                                                "
                                            >
                                                ₹199
                                            </p>
                                        </div>

                                        {currentPlan ===
                                            "starter" && (
                                                <span
                                                    className="
                                                    text-[10px]
                                                    sm:text-xs

                                                    px-2
                                                    py-1

                                                    rounded-full

                                                    bg-orange-500/10

                                                    text-orange-400

                                                    border
                                                    border-orange-500/20
                                                "
                                                >
                                                    Current
                                                </span>
                                            )}
                                    </div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2

                                            text-slate-400

                                            text-xs
                                            sm:text-sm

                                            mt-2
                                        "
                                    >
                                        <Check
                                            size={14}
                                            className="text-orange-400"
                                        />

                                        <span>
                                            500 Credits
                                        </span>
                                    </div>

                                    <button
                                        disabled={
                                            currentPlan ===
                                            "starter"
                                        }
                                        onClick={() =>
                                            handleUpgrade(
                                                "starter"
                                            )
                                        }
                                        className={`
                                            mt-4

                                            w-full

                                            rounded-lg

                                            py-2.5

                                            text-sm
                                            font-medium

                                            transition-all

                                            ${currentPlan ===
                                                "starter"
                                                ? "bg-orange-500/20 text-orange-300 cursor-not-allowed"
                                                : "bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white cursor-pointer"
                                            }
                                        `}
                                    >
                                        {currentPlan ===
                                            "starter"
                                            ? "Current Plan"
                                            : "Upgrade"}
                                    </button>
                                </div>

                                {/* =============================
                                    PRO
                                ============================= */}

                                <div
                                    className={`
                                        rounded-xl

                                        border

                                        p-4
                                        sm:p-5

                                        transition-colors

                                        ${currentPlan ===
                                            "pro"
                                            ? "border-orange-500/30 bg-orange-500/[0.04]"
                                            : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                                        }
                                    `}
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        "
                                    >
                                        <div>
                                            <h3
                                                className="
                                                    text-white
                                                    font-semibold
                                                    text-sm
                                                    sm:text-base
                                                "
                                            >
                                                Pro Plan
                                            </h3>

                                            <p
                                                className="
                                                    text-orange-400
                                                    text-2xl
                                                    sm:text-3xl
                                                    font-bold
                                                    mt-2
                                                "
                                            >
                                                ₹499
                                            </p>
                                        </div>

                                        {currentPlan ===
                                            "pro" && (
                                                <span
                                                    className="
                                                    text-[10px]
                                                    sm:text-xs

                                                    px-2
                                                    py-1

                                                    rounded-full

                                                    bg-orange-500/10

                                                    text-orange-400

                                                    border
                                                    border-orange-500/20
                                                "
                                                >
                                                    Current
                                                </span>
                                            )}
                                    </div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2

                                            text-slate-400

                                            text-xs
                                            sm:text-sm

                                            mt-2
                                        "
                                    >
                                        <Check
                                            size={14}
                                            className="text-orange-400"
                                        />

                                        <span>
                                            1000 Credits
                                        </span>
                                    </div>

                                    <button
                                        disabled={
                                            currentPlan ===
                                            "pro"
                                        }
                                        onClick={() =>
                                            handleUpgrade(
                                                "pro"
                                            )
                                        }
                                        className={`
                                            mt-4

                                            w-full

                                            rounded-lg

                                            py-2.5

                                            text-sm
                                            font-medium

                                            transition-all

                                            ${currentPlan ===
                                                "pro"
                                                ? "bg-orange-500/20 text-orange-300 cursor-not-allowed"
                                                : "bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white cursor-pointer"
                                            }
                                        `}
                                    >
                                        {currentPlan ===
                                            "pro"
                                            ? "Current Plan"
                                            : "Upgrade"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* =====================================
                            FOOTER
                        ===================================== */}

                        <div
                            className="
                                shrink-0

                                px-4
                                sm:px-5

                                py-3

                                border-t
                                border-white/[0.06]

                                text-center
                            "
                        >
                            <p
                                className="
                                    text-[10px]
                                    sm:text-xs
                                    text-slate-500
                                "
                            >
                                Secure payments powered by
                                Razorpay
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default BillingPlan;