import { Crown, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useSelector } from "react-redux"
import { createOrder } from "../features/createOrder";


function BillingPlan({ showBilling, setShowBilling }) {
    const { userData } = useSelector(
        state => state.user
    );


    console.log(userData)


    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder(plan)
            const options = {

                key: import.meta.VITE_RAZORPAY_KEY,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "AI Agent Platform",
                description: `${data.plan.name} Plan`,
                order_id: data.order.id,
                prefill: {
                    name: userData?.name,
                    email: userData?.email
                },
                handler: function (response) {
                    console.log(response)
                }

            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.log("ERROR: ", error)
        }
    }


    return (
        <AnimatePresence>
            {showBilling && <>
                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: .5
                    }}
                    exit={{
                        opacity: 0
                    }}
                    className="fixed inset-0 bg-black z-40"
                    onClick={() => setShowBilling(false)}
                />

                <motion.div
                    initial={{
                        x: "100%"
                    }}
                    animate={{
                        x: 0
                    }}
                    exit={{
                        x: "100%"
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut"
                    }}
                    className="fixed top-0 right-0 h-screen w-[380px] bg-[#0f1117] border-white/10 shadow-2xl flex flex-col z-40"
                >
                    <div className="flex items-center justify-between p-5 border-b border-white/10  ">

                        <div>


                            <div className="text-white font-semibold text-xl">
                                <h1 >Billing Plans</h1>
                            </div>
                            <div className="text-slate-400 text-sm">
                                Plan & Credits

                            </div>
                        </div>
                        <button
                            className="text-white/50 hover:text-white cursor-pointer"
                            onClick={() => setShowBilling(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>


                    <div className="p-5">

                        <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Current Plan</p>
                                    <h3 className="text-white text-xl font-bold capitalize">
                                        {userData?.plan || "free"}
                                    </h3>
                                </div>
                                <Crown className="text-yellow-400" />
                            </div>


                            <div className="flex justify-between text-sm text-slate-400 mb-2 mt-4">
                                <span >Credits</span>
                                <span >{userData?.credits || 0}/{userData?.totalCredits || 100}</span>

                            </div>

                            <div className="h-2 rounded-full bg-white/10 overflow-hidden " >
                                <div className="h-full bg-orange-500 transition-all duration-500" style={{
                                    width: `${(
                                        (userData?.credits || 0) /
                                        (userData?.totalCredits || 1)
                                    ) * 100
                                        }%`
                                }}>

                                </div>
                            </div>

                        </div>

                    </div>


                    <div className="px-5 flex-1 overflow-auto space-y-4">
                        <div className="rounded-xl border border-white/10 p-4">
                            <h3 className="text-white font-semibold">Starter Plan</h3>
                            <p className="text-orange-400 text-2xl mt-2 font-bold">₹199</p>
                            <p className="text-slate-400 text-sm mt-1">500 Credits</p>
                            <button onClick={handleUpgrade("starter")} className="mt-4 w-full rounded-lg bg-orange-600 hover:bg-orange-700 py-2 text-white cursor-pointer">Upgrade</button>
                        </div>
                    </div>

                    <div className="px-5 flex-1 overflow-auto space-y-4">
                        <div className="rounded-xl border border-white/10 p-4">
                            <h3 className="text-white font-semibold">Pro Plan</h3>
                            <p className="text-orange-400 text-2xl mt-2 font-bold">₹499</p>
                            <p className="text-slate-400 text-sm mt-1">1000 Credits</p>
                            <button onClick={handleUpgrade("pro")} className="mt-4 w-full rounded-lg bg-orange-600 hover:bg-orange-700 py-2 text-white cursor-pointer">Upgrade</button>
                        </div>
                    </div>


                </motion.div>
            </>
            }
        </AnimatePresence>
    )
}

export default BillingPlan