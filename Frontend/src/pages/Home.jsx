import React from "react"
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
    const user = useSelector((state) => state.user.userData)
    const dispatch = useDispatch()

    const handleLogin = async (token) => {
        try {
            const { data } = await api.post(
                "/api/auth/login",
                { token }
            );

            if (data.success) {
                dispatch(setUserData(data.user));
            }

        } catch (error) {
            console.error(
                "Backend login failed:",
                error.response?.data || error.message
            );
        }
    };

    const googleLogin = async () => {
        try {

            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            console.log(
                "Firebase user:",
                result.user
            );

            const token =
                await result.user.getIdToken();

            await handleLogin(token);

        } catch (error) {

            console.error(
                "Google login failed:",
                error.code,
                error.message
            );
        }
    };
    return (
        <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col md:flex-row overflow-hidden">
            <Sidebar />
            <ChatArea />
            <Artifact />

            {!user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
                    <div className="w-[340px] bg-[#13151c] border justify-center border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-semibold">Welcome to Friday.Ai</h2>
                            <p className="text-white/70">Please sign in to continue</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={googleLogin} className="flex cursor-pointer items-center justify-center gap-3 rounded-lg px-4 py-3 transition duration-300 hover:shadow-lg text-black text-sm font-medium bg-white hover:text-gray-700">
                                <div className="flex items-center gap-2">
                                    <FcGoogle className="w-5 h-5" />
                                    <span>Continue with Google</span>
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Home