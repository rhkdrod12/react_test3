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
    this.originData = param?.originData || {}; // 여기는 아직 지원안되니.. 값을 전부 다 복사해놔야하는데.. 현재는 그게 안되니.
  }
}

class DataAction {
  constructor(state, dispatch) {
    /** @type {DataState}*/
    this.state = state;
    /** @type {function(Object):void}}*/
    this.dispatch = dispatch;
  }

  /**
   * 현재 state를 변경
   * @param {DataState} state
   * @returns
   */
  setState = (state) => {
    this.state = state;
    return this;
  };
  /**
   * reducer의 dispatch를 입력한 dispatch로 변경-> 이거 왠만해서는 안하는게..
   * @param {function} dispath
   */
  setDispatch = (dispath) => {
    this.dispatch = dispath;
  };

  /**
   * 입력한 data로 초기화
   * @param {Object} data
   */
  setInit = (data) => {
    this.dispatch({ type: "setInit", data });
  };

  /**
   * 입력한 id의 data로 data 변경
   * @param {Object} data
   */
  setData = (data) => {
    this.dispatch({ type: "setData", data });
  };

  /**
   * 특정 id의 data 반환
   * @param {String} id
   * @returns
   */
  getData = (id) => {
    return this.state.data?.[id];
  };

  /**
   * 모든 값 반환
   * @returns {Object}
   */
  getAllData = () => {
    return this.state.data;
  };
}

const DataReducer = (state, action) => {
  const type = action?.type;

  const { data: actionData = {} } = action;

  switch (type) {
    case "setInit":
      state.data = actionData;
      state.originData = actionData;
      break;
    case "setData":
      state.data = { ...state.data, ...actionData };
      break;
    default:
      throw new Error("Unsupported action type:", type);
  }

  return new DataState(state);
};

/**
 * 단 건의 데이터를 처리하기 위한 action 컨트롤러를 반환
 * 해당 메소드를 사용하여 데이터를 생성, 수정, 삭제 처리
 * @param {Object} data 초기 데이터
 * @returns
 */
const useDataReducer = (data) => {
  const [state, dispatch] = useReducer(DataReducer, DATA_INIT_STATE);
  // const [dataAciton, setDataAction] = useState(new DataAction(state, dispatch));
  const [dataAction, setDataAction] = useState(new DataAction(state, dispatch));

  useEffect(() => {
    dispatch({ type: "setInit", data: data ?? {} });
  }, [data]);

  useEffect(() => {
    dataAction.setState(state);
  }, [state]);

  // return useMemo(() => new DataAction(state, dispatch), [state]);
  return dataAction;
};

export default useDataReducer;
