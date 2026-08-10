import { useEffect } from "react";
import Home from "./pages/Home";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser()
      if (data.success) {
        dispatch(setUserData(data.data))
      }
    }

    getUser()
  }, [])
  return (
    <>
      <Home />
    </>
  );
}

export default App;