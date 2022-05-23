import { createContext, useContext } from "react";

/**
 * 사용해야할 컨테스트 항목을 배열로 받음
 **/
export const createMutilContext = (keys) => {
  const MutilStore = {};

  for (const key in keys) {
    const name = keys[key];
    const context = createContext(name);
    MutilStore[name] = context;
  }

  return MutilStore;
};
/**
 * ContextStore : 사용해야할 컨텍스트(createMutilContext로 만npm install @mui/material @emotion/react @emotion/styled든 객체를 넣어주면 됨)
 * Data : 컨텍스트 이름을 키를 가지고 있는 데이터 객체,객체, 키를 사용해여 해당 컨텍스트에 집어넣음)
 * @param {} param0
 * @returns ReactComponet이기 때문에 내부에 자식을 감쌓으면 끝!
 */
export const ContextProvider = ({ children, ContextStore, Data }) => {
  let tempContext = children;
  for (const name in ContextStore) {
    const context = ContextStore[name];
    const data = Data[name];
    tempContext = <context.Provider value={data}>{tempContext}</context.Provider>;
  }
  return tempContext;
};
