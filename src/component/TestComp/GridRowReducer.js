import { useMemo } from "react";
import { useEffect, useReducer, useState } from "react";

/**
 * ROW_DATA의 초기 구조
 */
export const ROW_INIT_STATE = {
  rowAllData: [],
  rowData: {},
  rowIndex: -1,
  prevRowAllData: [],
  originRowAllData: [],
};

/**
 * ROW_DATA에 대한 액션 정의
 */
export const ROW_ACTION = {
  SET_INIT: "setInit",

  //
  SET_ORIGIN_ROW_ALL_DATA: "setOriginRowAllData",
  // 입력한 값으로 데이터를 필터링 처리
  SET_ROW_FILTER: "setRowFilter",

  CLEAR_ROW_FILTER: "clearRowFilter",
  // 모든 ROW에 대해 주어진 데이터로 변경처리
  SET_ROW_ALL_DATA: "setRowAllData",
  // 모든 ROW에 대한 데이터 반환
  GET_ROW_ALL_DATA: "getRowAllData",
  // 입력받은 INDEX의 ROW 데이터를 변경
  SET_ROW_DATA: "setRowData",
  // 입력받은 INDEX의 ROW 데이터를 반환
  GET_ROW_DATA: "getRowData",
  // 입력받은 INDEX의 COLUMN의 데이터를 변경
  SET_COLUMN_DATA: "setColumnData",
  // 입력받은 INDEX의 COLUMN의 데이터를 반환
  GET_COLUMN_DATA: "getColumnData",

  // 선택중인 INDEX의 ROW 데이터를 변경
  SET_SELECTED_ROW_DATA: "setSelectedRowData",
  // 선택중인 INDEX의 ROW 데이터를 반환
  GET_SELECTED_ROW_DATA: "getSelectedRowData",
  // 현재 INDEX를 입력한 INDEX로 변경
  SET_SELECTED_ROW_INDEX: "setSelectedRowIdex",
  // 선택중인 INDEX를 반환
  GET_SELECTED_ROW_INDEX: "getSelectedRowIndex",
};

class GridAction {
  constructor(state, dispatch) {
    this.rowState = state;
    this.dispatch = dispatch;
  }
  /**
   * 입력한 옵션에 따라 filter값에 해당하는 rowData로 변경
   * @param {Object} filter
   * @param {Object} filterOption {compare: "equals", "startsWith", "endsWith", "includes"}
   */
  setRowFilter = (filter, filterOption) => {
    this.dispatch({ type: ROW_ACTION.SET_ROW_FILTER, filter, filterOption });
  };
  /**
   * 필터를 초기화한다.
   */
  clearRowFilter = () => {
    this.dispatch({ type: ROW_ACTION.CLEAR_ROW_FILTER });
  };

  /**
   * 현재 rowState를 변경(그리드 제어 객체)
   * @param {*} state
   * @returns 현재 클래스 객체
   */
  setRowState = (state) => {
    this.rowState = state;
    return this;
  };

  /**
   * 현재 rowState를 반환
   * @returns rowState
   */
  getRowState = () => {
    return this.rowState;
  };
  /**
   * 현재 그리드의 모든 rowData를 입력한 값으로 변경
   * @param {Array<Object>} rowAllData
   */
  setRowAllData = (rowAllData) => {
    this.dispatch({ type: ROW_ACTION.SET_ROW_ALL_DATA, rowAllData });
  };
  /**
   * 현재 그리드의 모든 rowData를 반환
   * @returns {Array<Object>} rowAllData
   */
  getRowAllData = () => {
    return this.rowState.rowAllData;
  };
  /**
   * 입력한 index의 rowdata를 변경
   * @param {*} rowIndex
   * @param {Object} rowData
   */
  setRowData = (rowIndex, rowData) => {
    this.dispatch({ type: ROW_ACTION.SET_ROW_DATA, rowIndex, rowData });
  };
  /**
   * 입력한 index의 rowdata를 반환
   * @param {Number} rowIndex
   * @returns {Object} rowAllData
   */
  getRowData = (rowIndex) => {
    return this.rowState.rowAllData[rowIndex];
  };
  /**
   * 입력한 index의 rowdata의 column값들을 변경
   * @param {Number} rowIndex
   * @param {Object} columnData 변경할 column들을 가지고 있는 객체
   */
  setColumnData = (rowIndex, columnData) => {
    this.dispatch({ type: ROW_ACTION.SET_COLUMN_DATA, rowData: columnData, rowIndex });
  };
  /**
   * 입력한 index의 rowdata의 column을 반환
   * @param {Number} rowIndex
   * @param {String} id
   * @returns
   */
  getColumnData = (rowIndex, id) => {
    return this.getRowData(rowIndex)?.[id];
  };

  /**
   * 입력한 index들의 rowdata의 column들을 변경
   * @param {Array<Number>} rowIndex
   * @param {Object} columnData
   * @returns
   */
  setIndexColumnData = (rowIndex = [], columnData) => {
    const result = this.rowState.rowAllData.map((val, idx) => (rowIndex.includes(idx) ? { ...val, ...columnData } : val));
    this.setRowAllData(result);
  };

  /**
   * 입력한 index들의 rowdata의 column을 반환
   * @param {Array<Number>} rowIndex
   * @param {String} id
   * @returns
   */
  getIndexColumnData = (rowIndex = [], id) => {
    return this.rowState.rowAllData.filter((val, idx) => rowIndex.includes(idx)).map((val, idx) => val[id]);
  };

  /**
   * 모든 rowdata의 column들을 입력한 값으로 변경
   * @param {Object} columnData
   * @returns
   */
  setAllColumnData = (columnData) => {
    const result = this.rowState.rowAllData.map((val, idx) => ({ ...val, ...columnData }));
    this.setRowAllData(result);
  };
  /**
   * 모든 rowdata의 해당 column의 값을 배열로 반환
   * @param {String} id
   * @returns
   */
  getAllColumnData = (id) => {
    return this.rowState.rowAllData.map((val, idx) => val[id]);
  };
  /**
   * 현재 그리드 포지션의 rowdata를 입력한 데이터로 변경
   * @param {Object} rowData
   */
  setSelectedRowData = (rowData) => {
    this.dispatch({ type: ROW_ACTION.SET_SELECTED_ROW_DATA, rowData });
  };
  /**
   * 현재 그리드 포지션의 rowdata를 반환
   * @returns
   */
  getSelectedRowData = () => {
    return this.rowState.rowData;
  };
  /**
   * 현재 그리드 포지션을 입력받은 값으로 변경
   * @param {Number} rowIndex
   */
  setSelectedRowIdex = (rowIndex) => {
    this.dispatch({ type: ROW_ACTION.SET_SELECTED_ROW_INDEX, rowIndex });
  };
  /**
   * 현재 그리드 포지션을 반환
   * @returns
   */
  getSelectedRowIndex = () => {
    return this.rowState.rowIndex;
  };
}

export const useGridReducer = (rowAllData) => {
  const [state, dispatch] = useReducer(GridDataReducer, ROW_INIT_STATE);

  // rowAllData 변경시 rowAllData를 해당 데이터로 변경처리
  useEffect(() => {
    dispatch({ type: ROW_ACTION.SET_INIT, rowAllData });
  }, [rowAllData]);

  //return useGridAction(state, dispatch);
  return useMemo(() => new GridAction(state, dispatch), [state]);
};

export const GridDataReducer = (state, action) => {
  const type = action?.type;
  const { rowAllData: stateRowAllData = [], rowData: stateRowData = {}, rowIndex: stateRowIndex = -1 } = state ?? ROW_INIT_STATE;
  const { rowAllData: actionRowAllData = [], rowData: actionRowData = {}, rowIndex: actionRowIndex = -1 } = action;

  let rowAllData, rowData, rowIndex;
  let resultState = state;
  switch (type) {
    case ROW_ACTION.SET_INIT:
      resultState = { originRowAllData: actionRowAllData, prevRowAllData: actionRowAllData, rowAllData: actionRowAllData, rowData: {}, rowIndex: -1 };
      break;

    case ROW_ACTION.SET_ORIGIN_ROW_ALL_DATA:
      resultState = { ...state, originRowAllData: actionRowAllData };
      break;
    // 모든 ROW에 대해 주어진 데이터로 변경처리
    case ROW_ACTION.SET_ROW_ALL_DATA:
      resultState = { ...state, rowAllData: actionRowAllData };
      break;
    // 입력받은 INDEX의 ROW 데이터를 변경
    case ROW_ACTION.SET_ROW_DATA:
      rowAllData = stateRowAllData.map((val, idx) => (idx == actionRowIndex ? actionRowData : val)) ?? [];
      resultState = { ...state, rowAllData };
      break;
    case ROW_ACTION.SET_COLUMN_DATA:
      rowAllData = stateRowAllData.map((val, idx) => (idx == actionRowIndex ? { ...val, ...actionRowData } : val)) ?? [];
      resultState = { ...state, rowAllData };
      break;
    // 현재 선택중인 INDEX의 ROW 데이터를 변경
    case ROW_ACTION.SET_SELECTED_ROW_DATA:
      rowAllData = stateRowAllData.map((val, idx) => (idx == stateRowIndex ? actionRowData : val));
      rowData = actionRowData;
      resultState = { ...state, rowAllData, rowData };
      break;
    // 입력받은 INDEX로 현재 포지션을 변경
    case ROW_ACTION.SET_SELECTED_ROW_INDEX:
      rowIndex = actionRowIndex;
      rowData = stateRowAllData[rowIndex];
      resultState = { ...state, rowData, rowIndex };
      break;
    case ROW_ACTION.SET_ROW_FILTER:
      const filter = action.filter;
      const filterOption = action.filterOption || {};

      // prevRowAllData에 현재 상태 업데이트
      stateRowAllData.forEach((item) => {
        state.prevRowAllData[item.rowIndex] = item;
      });

      rowAllData = stateRowAllData.filter((value) => compare(value, filter, compareFunc(filterOption.compare ?? "equals")));
      resultState = { ...state, rowAllData };
      break;
    case ROW_ACTION.CLEAR_ROW_FILTER:
      // prevRowAllData에 현재 상태 업데이트
      stateRowAllData.forEach((item) => {
        state.prevRowAllData[item.rowIndex] = item;
      });
      resultState = { ...state, rowAllData: [...state.prevRowAllData] };
      break;
    default:
      throw new Error("Unsupported action type:", type);
  }
  return resultState;
};

/**
 * compareObject의 각각의 키에 해당하는 데이터를 비교하여 compare에서 모두 true가 떨어지면
 * 같음
 * @param {Object} value  데이터
 * @param {Object} compareObject  비교할 key와 value를 가지고 있는 객체
 * @param {Function} compare
 * @returns
 */
const compare = (value, compareObject, compare) => {
  if (compareObject == null) {
    return true;
  } else {
    if (compareObject instanceof Object) {
      const keys = Object.keys(compareObject);
      for (const key of keys) {
        if (!compare(value[key], compareObject[key])) {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
  }
};

/**
 * 선택한 파라미터에 따라 startsWith, endsWith, includes, equals를 비교하는 함수 반환
 * @param {String} selector
 * @returns
 */
const compareFunc = (selector) => {
  if (selector == "startsWith") {
    return (val1, val2) => {
      return String(val1).startsWith(String(val2));
    };
  } else if (selector == "endsWith") {
    return (val1, val2) => {
      return String(val1).endsWith(String(val2));
    };
  } else if (selector == "includes") {
    return (val1, val2) => {
      return String(val1).includes(String(val2));
    };
  } else if (selector == "equals") {
    return (val1, val2) => {
      return String(val1) == String(val2);
    };
  }
};
