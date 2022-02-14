import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const useGetUser = () => {
  const [user] = useAuthState(auth);
  return { user };
};

export default useGetUser;
