import { doc } from "firebase/firestore";
import { useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";
import useGetUser from "./useGetUser";

const useGetSavedSettings = (settingUid: string) => {
  const { user } = useContext(UserContext);

  //TODO: Firestore database rules
  // Users can only read/write if uid matches
  const [settings] = useDocumentData(
    doc(db, "users", `${user?.uid}`, "settings", `${settingUid}`)
  );
};

export default useGetSavedSettings;
