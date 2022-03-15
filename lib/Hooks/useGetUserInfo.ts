import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const useGetUserInfo = (email: string | null | undefined) => {
  const [userInfo] = useDocumentData(doc(db, "users", `${email}`));
  return userInfo;
};

export default useGetUserInfo;
