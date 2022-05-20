/**
 * Grid Context
 */
import { createContext } from "react";

const GridContext = createContext();

const GridContextProvider = ({ children, ...data }) => {
  console.log(data);

  return <GridContext.Provider value={data}>{children}</GridContext.Provider>;
};

export const ContextStore = {};
