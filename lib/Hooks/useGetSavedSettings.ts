import { collection } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useGetSavedSettings = () => {
  const { user } = useContext(UserContext);

  const [settings] = useCollectionData(
    collection(db, "users", `${user?.email}`, "settings")
  );

  return settings;
};

export default useGetSavedSettings;
