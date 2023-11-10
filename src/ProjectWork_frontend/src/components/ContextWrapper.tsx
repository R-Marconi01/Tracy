import { Actor, HttpAgent } from "@dfinity/agent";
import React, { FC, createContext, useContext, useState } from "react";
import {
  canisterId,
  idlFactory,
} from "../../../declarations/project_backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId as identityCanId } from "../../../declarations/internet_identity";

const authClient = await AuthClient.create();

export const host = "http://localhost:8080";
// export const canisterId = "br5f7-7uaaa-aaaaa-qaaca-cai"

// export const host = "https://icp0.io";
// export const canisterId = "zhnok-mqaaa-aaaak-aevwq-cai"

// Types
interface LayoutProps {
  children: React.ReactNode;
}

type User = {
  isSupplier: boolean;
  isFashion: boolean;
}

type Context = {
  principleId: string;
  identity: any;
  backendActor: any;
  isAuthenticated: boolean;
  storageInitiated: boolean;
  isAdmin: boolean;
  user: User;
  setIsAdmin: (_value: any) => void;
  setUser: (_value: any) => void;
  setStorageInitiated: (_value: any) => void;
  setContextPrincipleID: (_value: string) => void;
  setUserIdentity: (_value: any) => void;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
};

const initialContext: Context = {
  principleId: "",
  identity: null,
  backendActor: null,
  isAuthenticated: false,
  storageInitiated: false,
  isAdmin: false,
  user: null,
  setIsAdmin:(any): void => {
    throw new Error("setContext function must be overridden");
  }, 
  setUser: (any): void => {
    throw new Error("setContext function must be overridden");
  },
  setStorageInitiated: (any): void => {
    throw new Error("setContext function must be overridden");
  },
  setContextPrincipleID: (string): void => {
    throw new Error("setContext function must be overridden");
  },
  setUserIdentity: (any): void => {
    throw new Error("setContext function must be overridden");
  },
  login: (): void => {
    throw new Error("login function must be overridden");
  },
  logout: (): void => {
    throw new Error("logout function must be overridden");
  },
  checkAuth: (): void => {
    throw new Error("checkAuth function must be overridden");
  },
};

const WalletContext = createContext<Context>(initialContext);

export const useAuth = () => {
  return useContext(WalletContext);
};

const ContextWrapper: FC<LayoutProps> = ({ children }) => {
  const [principleId, setPrincipleId] = useState("");
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isAdmin, setIsAdmin] = useState(false)
  const [storageInitiated, setStorageInitiated] = useState(false)

  const setContextPrincipleID = (value: string) => {
    setPrincipleId(value);
  };

  const setUserIdentity = (value: any) => {
    setIdentity(value);
  };

  const login = async () => {
    await authClient.login({
      // identityProvider: "https://identity.ic0.app/#authorize",
      identityProvider:
        `http://localhost:4943?canisterId=${identityCanId}`,
      onSuccess: () => {
        setIsAuthenticated(true);
        checkAuth();
      },
    });
  };

  const checkAuth = async () => {
    try {
      if (await authClient.isAuthenticated()) {
        setIsAuthenticated(true);
        const identity = authClient.getIdentity();
        setIdentity(identity);
        setContextPrincipleID(identity?.getPrincipal().toText());
      }
    } catch (error) {
      console.log("Error in checkAuth", error)
    }
  };

  const handleLogout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setContextPrincipleID("");
  };

  const logout = async () => {
    await handleLogout();
    setContextPrincipleID("");
    setIdentity(null);
  };

  let agent = new HttpAgent({
    host: host,
    identity: identity,
  });
  agent.fetchRootKey();

  const backendActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId,
  });
  return (
    <WalletContext.Provider
      value={{
        principleId,
        setContextPrincipleID,
        setUserIdentity,
        setStorageInitiated,
        storageInitiated,
        identity,
        user,
        isAdmin,
        setIsAdmin,
        setUser,
        backendActor,
        isAuthenticated,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default ContextWrapper;
