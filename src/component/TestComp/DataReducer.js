import { useEffect, useMemo, useReducer, useState } from "react";

const DATA_INIT_STATE = {
  data: {},
  originData: null,
};

class DataState {
  constructor(param) {
    /** @type {Object}*/
    this.data = param?.data || {};
    /** @type {Object}*/
    this.originData = param?.originData || null;
  }
}

class DataAction {
  constructor(state, dispatch) {
    /** @type {DataState}*/
    this.state = state;
    /** @type {function(Object):void}*/
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

/**
 *
 * @param {DataState} state
 * @param {Object} action
 * @returns {DataAction}
 */
const DataReducer = (state, action) => {
  const type = action?.type;
  const { data: stateData = {} } = state;
  const { data: actionData = {} } = action;

  let resultState = state;
  switch (type) {
    case "setInit":
      resultState = { originData: actionData, data: actionData };
      break;
    case "setData":
      state.data = { ...state.data, ...actionData };
      resultState = state;
      break;
    default:
      throw new Error("Unsupported action type:", type);
  }
  return new DataState(resultState);
};

const useDataReducer = (data) => {
  const [state, dispatch] = useReducer(DataReducer, new DataState());
  const [dataAciton, setDataAction] = useState(() => new DataAction(state, dispatch));

  useEffect(() => {
    dispatch({ type: "setInit", data: data ?? {} });
  }, [data]);

  useEffect(() => {
    dataAciton.setState(state);
  }, [state]);

  console.log("render dataReducer %o", state);

  return dataAciton;
};

export default useDataReducer;
