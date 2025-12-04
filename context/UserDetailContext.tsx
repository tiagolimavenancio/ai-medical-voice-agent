import { UsersDetail } from "@/app/provider";
import { createContext } from "react";

export const UserDetailContext = createContext<UsersDetail | undefined>(undefined);
