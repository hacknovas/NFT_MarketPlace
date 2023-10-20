import { createContext, useState } from "react";

export const conApp = createContext();

export default function Provider({ children }) {
  const [userAdd, setUserAdd] = useState("");

  return (
    <conApp.Provider value={{ userAdd, setUserAdd }}>
      {children}
    </conApp.Provider>
  );
}
