"use client";

import React, { use } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/db";
import { createContext, useState } from "react";
import { userDcontext } from "../context/UserDcontex"; // Adjust the import path as needed

export type UserDetail = {
  name: string;
  email: string;
  credits: number;
};
export function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoaded } = useUser();

  const [userDetail, setUserDetail] = useState<any>();

  useEffect(() => {
    if (isLoaded && user) {
      CreatenewUser();
    }
  }, [isLoaded, user]);

  const CreatenewUser = async () => {
    try {
      const result = await axios.post("/api/user");
      console.log("User created:", result.data);
      setUserDetail(result.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <userDcontext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </userDcontext.Provider>
    </div>
  );
}

export default Provider;
