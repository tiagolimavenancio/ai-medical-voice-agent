/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type UsersDetail = {
  name: string;
  email: string;
  credits: number;
};

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isLoaded, user } = useUser();
  const [userDetail, setUserDetail] = useState<UsersDetail | undefined>(undefined);

  const createNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      setUserDetail(result.data);
    } catch (e: any) {
      console.error({ e });
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      createNewUser();
    }
  }, [isLoaded, user]);

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;
