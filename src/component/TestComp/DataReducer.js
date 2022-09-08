import { useEffect, useMemo, useReducer, useState } from "react";

const DATA_INIT_STATE = {
  data: {},
  originData: null,
};

class DataAction {
  constructor(state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
  }
  setState = (state) => {
    this.state = state;
  };
  setInit = (data) => {
    this.dispatch({ type: "setInit", data });
  };
  setData = (data) => {
    this.dispatch({ type: "setData", data });
  };
  getData = (id) => {
    return this.state.data?.[id];
  };
  getAllData = () => {
    return this.state.data;
  };
}

const DataReducer = (state, action) => {
  const type = action?.type;
  const { data: stateData = {} } = state;
  const { data: actionData = {} } = action;

  let data;
  let resultState = state;
  switch (type) {
    case "setInit":
      resultState = { originData: actionData, data: actionData };
      break;
    case "setData":
      data = { ...stateData, ...actionData };
      resultState = { ...state, data };
      break;
    default:
      throw new Error("Unsupported action type:", type);
  }
  return resultState;
};

const useDataReducer = (data) => {
  const [state, dispatch] = useReducer(DataReducer, DATA_INIT_STATE);
  // const [dataAciton, setDataAction] = useState(new DataAction(state, dispatch));

  useEffect(() => {
    dispatch({ type: "setInit", data: data ?? {} });
  }, [data]);

  return useMemo(() => new DataAction(state, dispatch), [state]);
};

export default useDataReducer;
