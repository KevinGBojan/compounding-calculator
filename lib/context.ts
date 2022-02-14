import { createContext } from "react";
import { User } from "firebase/auth";

interface AppContextInterface {
  user: User | null | undefined;
}

const defaultState = {
  user: null,
};

export const UserContext = createContext<AppContextInterface>(defaultState);
