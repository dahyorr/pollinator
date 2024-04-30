import SessionContext from "@/context/SessionContext";
import { useContext } from "react";

export const useSession = () => useContext(SessionContext)