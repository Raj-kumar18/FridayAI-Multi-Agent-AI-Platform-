import React from "react";
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
    const user = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();

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

            const token = await result.user.getIdToken();

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
        <div className="flex h-screen min-h-0 w-full overflow-hidden bg-[#0d0f14] text-white">

            {/* Sidebar */}
            <div className="shrink-0 min-h-0">
                <Sidebar />
            </div>

            {/* Main Chat */}
            <main className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
                <ChatArea />
            </main>

            {/* Artifact */}
            <div className="shrink-0 min-h-0">
                <Artifact />
            </div>

            {/* Login Modal */}
            {!user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">

                    <div className="flex w-[340px] flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#13151c] p-7">

                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-semibold">
                                Welcome to Friday.Ai
                            </h2>

                            <p className="text-white/70">
                                Please sign in to continue
                            </p>
                        </div>

                        <button
                            onClick={googleLogin}
                            className="flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition duration-300 hover:text-gray-700 hover:shadow-lg"
                        >
                            <FcGoogle className="h-5 w-5" />
                            <span>Continue with Google</span>
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Home;