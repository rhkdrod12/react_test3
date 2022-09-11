import { useMemo } from "react";
import { useEffect, useReducer, useState } from "react";

/** */
class ListDataState {
  constructor(param) {
    /** @type {Object[]}*/
    this.rowAllData = param?.rowAllData || new Array();
    /** @type {Object} */
    this.rowData = param?.rowData || {};
    /** @type {Number} */
    this.rowIndex = param?.rowIndex || -1;
    /** @type {Object[]} */
    this.prevRowAllData = param?.prevRowAllData || new Array();
    /** @type {Object[]} */
    this.originRowAllData = param?.originRowAllData || new Array();
    /** @type {Filter} */
    this.filter = param?.filter || new Filter();
  }
}
class Filter {
  constructor(param) {
    /** @type {Boolean} */
    this.active = param?.active || false;
    /** @type {FilterData[]} */
    this.filterList = param?.filterList || new Array();
  }
}
class FilterData {
  constructor(param) {
    /** @type {String} */
    this.type = param?.type || COMPARE_STRING.EQUALS;
    /** @type {Object} */
    this.value = param?.value || {};
  }
}
/**
 * List형태의 data를 처리하기 위한 클래스
 * @constructor
 */
export class ListDataAction {
  constructor(state, dispatch) {
    /** @type {ListDataState}*/
    this.rowState = state;
    /**
     * @type {function(Object):void}
     */
    this.dispatch = dispatch;
  }

  /**
   * 현재 state를 변경(그리드 제어 객체)
   * @param {ListDataState} state
   * @returns {ListDataAction} ListDataAction
   */
  setState = (state) => {
    this.rowState = state;
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
   * 입력한 파라미터로 초기화한다.
   * @param {array} rowAllData
   */
  setInit = (rowAllData) => {
    this.dispatch({ type: "setInit", rowAllData });
  };

  /**
   * 입력한 옵션에 따라 filter값에 해당하는 rowData로 변경
   * @param {FilterData} filter
   */
  setRowFilter = (filterData, type) => {
    const filter = new FilterData();
    filter.type = type || COMPARE_STRING.EQUALS;
    filter.value = filterData;

    this.dispatch({ type: "setRowFilter", filter });
  };
  /**
   * 필터를 초기화한다.
   */
  clearRowFilter = () => {
    this.dispatch({ type: "clearRowFilter" });
  };

  /**
   * 마지막에 rowData를 추가
   * @param {Object} rowData
   * @param {boolean} [selected=false] 입력한 곳으로 selected 여부
   */
  addRowData = (rowData, selected) => {
    this.dispatch({ type: "addRowData", rowData, selected });
  };
  /**
   * 마지막에 rowData들을 추가
   * @param {Array} rowAllData
   */
  addRowDatas = (rowAllData) => {
    this.dispatch({ type: "addRowDatas", rowAllData });
  };
  /**
   * rowIndex들의 데이터를 삭제
   * @param {Number} rowIndex
   */
  removeRowData = (rowIndex) => {
    this.dispatch({ type: "removeRowData", rowIndex });
  };
  /**
   *rowIndex들의 데이터을 삭제
   * @param {Array<Number>} rowIndexs
   */
  removeRowDatas = (rowIndexs) => {
    this.dispatch({ type: "removeRowDatas", rowIndexs });
  };

  /**
   * 현재 rowState를 반환
   * @returns {ListDataState} rowState
   */
  getRowState = () => {
    return this.rowState;
  };
  /**
   * 현재 그리드의 모든 rowData를 입력한 값으로 변경
   * @param {Array} rowAllData
   */
  setRowAllData = (rowAllData) => {
    this.dispatch({ type: "setRowAllData", rowAllData });
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
   * @param {Number} rowIndex
   * @param {Object} rowData
   */
  setRowData = (rowIndex, rowData) => {
    this.dispatch({ type: "getRowAllData", rowIndex, rowData });
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
    this.dispatch({ type: "setColumnData", rowData: columnData, rowIndex });
  };
  /**
   * 입력한 index의 rowdata의 column을 반환
   * @param {Number} rowIndex
   * @param {String} id
   * @returns {Object} rowData
   */
  getColumnData = (rowIndex, id) => {
    return this.getRowData(rowIndex)?.[id];
  };

  /**
   * 입력한 index들의 rowdata의 column들을 변경
   * @param {Array<Number>} [rowIndex]
   * @param {Object} columnData
   */
  setIndexColumnData = (rowIndex = new Array(), columnData) => {
    const result = this.rowState.rowAllData.map((val, idx) => (rowIndex.includes(idx) ? { ...val, ...columnData } : val));
    this.setRowAllData(result);
  };
  /**
   * 입력한 index들의 rowdata의 column을 반환
   * @param {Array<Number>} rowIndex
   * @param {String} id
   * @returns {Array} rowDatas
   */
  getIndexColumnData = (rowIndex = new Array(), id) => {
    return this.rowState.rowAllData.filter((val, idx) => rowIndex.includes(idx)).map((val, idx) => val[id]);
  };
  /**
   * 모든 rowdata의 column들을 입력한 값으로 변경
   * @param {Object} columnData
   */
  setAllColumnData = (columnData) => {
    const result = this.rowState.rowAllData.map((val, idx) => ({ ...val, ...columnData }));
    this.setRowAllData(result);
  };
  /**
   * 모든 rowdata의 해당 column의 값을 배열로 반환
   * @param {String} id
   * @returns {Array<Object>} columnAllData
   */
  getAllColumnData = (id) => {
    return this.rowState.rowAllData.map((val, idx) => val[id]);
  };
  /**
   * 현재 그리드 포지션의 rowdata를 입력한 데이터로 변경
   * @param {Object} rowData
   */
  setSelectedRowData = (rowData) => {
    this.dispatch({ type: "setSelectedRowData", rowData });
  };
  /**
   * 현재 그리드 포지션의 rowdata를 반환
   * @returns {Object} rowData
   */
  getSelectedRowData = () => {
    return this.rowState.rowData;
  };
  /**
   * 현재 그리드 포지션을 입력받은 값으로 변경
   * @param {Number} rowIndex
   */
  setSelectedRowIndex = (rowIndex) => {
    this.dispatch({ type: "setSelectedRowIndex", rowIndex });
  };
  /**
   * 현재 그리드 포지션을 반환
   * @returns {Number} rowIndex
   */
  getSelectedRowIndex = () => {
    return this.rowState.rowIndex;
  };

  /**
   * 필터링 되지 않은 데이터의 갯수를 반환
   * @returns {number}
   */
  getTotalDataCount = () => {
    return this.rowState.prevRowAllData.length;
  };

  /**
   * 필터링 된 데이터의 갯수를 반환
   * @returns {number}
   */
  getRowDataCount = () => {
    return this.rowState.rowAllData.length;
  };
}

const ROW_INIT_STATE = new ListDataState();
/**
 * List형태의 데이터를 처리하기 위한 action 컨트롤러를 반환
 * 해당 메소드을 사용하여 데이터를 생성, 수정, 삭제 처리
 * @param {*} rowAllData 초기 데이터
 * @returns
 */
const useListDataReducer = (rowAllData) => {
  const [state, dispatch] = useReducer(ListDataReducer, new ListDataState());
  const [dataAction, setDataAction] = useState(new ListDataAction(state, dispatch));

  // rowAllData 변경시 rowAllData를 해당 데이터로 변경처리
  useEffect(() => {
    dispatch({ type: "setInit", rowAllData: rowAllData ?? new Array() });
  }, [rowAllData]);

  // 데이터 변경은 dispatch에 의해 작동되기 때문에 데이터가 변경되면
  // state가 변경됨 => 따라서 state가 변경된 상태에는 dataAction의 state를 교환처리하여 데이터를 일괄 적으로 가져올 수 이 있게함
  useEffect(() => {
    dataAction.setState(state);
  }, [state]);

  console.log("render ListDataReducer");
  //return useGridAction(state, dispatch);
  //return useMemo(() => new ListDataAction(state, dispatch), [state]);
  return dataAction;
};

/**
 *
 * @param {ListDataState} state
 * @param {Object} action
 * @returns
 */
const ListDataReducer = (state, action) => {
  const type = action?.type;
  const { rowAllData: actionRowAllData = new Array(), rowData: actionRowData = {}, rowIndex: actionRowIndex = -1, rowIndexs: actionRowIndexs = new Array() } = action;
  let resultState = state;
  switch (type) {
    case "setInit":
      // rowIndex 부여
      Array.from(actionRowAllData).forEach((item, idx) => (item.rowIndex = idx));
      state.originRowAllData = actionRowAllData;
      state.prevRowAllData = actionRowAllData;
      state.rowAllData = actionRowAllData;
      state.rowData = {};
      state.rowIndex = -1;
      resultState = state;
      break;
    case "setOriginRowAllData":
      // rowIndex 부여
      Array.from(actionRowAllData).forEach((item, idx) => (item.rowIndex = idx));
      state.originRowAllData = actionRowAllData;
      resultState = state;
      break;
    // 모든 ROW에 대해 주어진 데이터로 변경처리
    case "setRowAllData":
      // rowIndex부여
      Array.from(actionRowAllData).forEach((item, idx) => (item.rowIndex = idx));
      // 데이터 변경처리
      state.rowAllData = actionRowAllData;
      resultState = state;
      break;
    // 입력받은 INDEX의 ROW 데이터를 변경
    case "setRowData":
      // rowIndex부여
      actionRowData.rowIndex = actionRowIndex;
      // 데이터 변경처리
      state.rowAllData = state.rowAllData.map((val, idx) => (idx == actionRowIndex ? actionRowData : val)) ?? new Array();
      resultState = state;
      break;

    case "setColumnData":
      state.rowAllData = state.rowAllData.map((val, idx) => (idx == actionRowIndex ? { ...val, ...actionRowData } : val)) ?? new Array();
      resultState = state;
      break;

    // 현재 선택중인 INDEX의 ROW 데이터를 변경
    case "setSelectedRowData":
      state.rowAllData = state.rowAllData.map((val, idx) => (idx == state.rowIndex ? actionRowData : val));
      state.rowData = actionRowData;
      resultState = state;
      break;

    // 입력받은 INDEX로 현재 포지션을 변경
    case "setSelectedRowIndex":
      state.rowIndex = actionRowIndex;
      state.rowData = state.rowAllData[actionRowIndex];
      resultState = state;
      break;

    // 마지막에 rowData를 추가 *
    case "addRowData":
      // prevRowAllData에 현재 상태 업데이트
      state.rowAllData.forEach((item) => (state.prevRowAllData[item.rowIndex] = item));
      // rowIndex 부여
      actionRowData.rowIndex = state.prevRowAllData.length;
      // prevRowAllData에 현재 추가 값 업데이트
      state.prevRowAllData = [...state.prevRowAllData, actionRowData];

      // 필터링이 활성화된 상태이면
      if (state.filter.active) {
        // 재필터링
        state.rowAllData = state.prevRowAllData.filter((value) => {
          for (const data of state.filter.filterData) {
            if (!compare(value, data.value, compareFunc(data.type ?? COMPARE_STRING.EQUALS))) {
              return false;
            }
          }
          return true;
        });
      } else {
        state.rowAllData = [...state.prevRowAllData];
      }

      // 위치 갱신이 필요하면
      if (action.selected) {
        state.rowData = actionRowData;
        state.rowIndex = actionRowData.rowIndex;
      }

      // state에 반영
      resultState = state;
      break;

    // 마지막에 rowData들을 추가 * 특정 rowIndex에 추가할 수 있도록 해야하려나..
    case "addRowDatas":
      // prevRowAllData에 현재 상태 업데이트
      state.rowAllData.forEach((item) => (state.prevRowAllData[item.rowIndex] = item));
      // rowIndex 부여
      const startIndex = state.prevRowAllData.length;
      Array.from(actionRowAllData).forEach((item, idx) => (item.rowIndex = startIndex + idx));
      // prevRowAllData에 현재 추가 값 업데이트
      state.prevRowAllData = [...state.prevRowAllData, ...actionRowAllData];

      // 필터링이 활성화된 상태이면
      if (state.filter.active) {
        // 재필터링
        state.rowAllData = state.prevRowAllData.filter((value) => {
          for (const data of state.filter.filterData) {
            if (!compare(value, data.value, compareFunc(data.type ?? COMPARE_STRING.EQUALS))) {
              return false;
            }
          }
          return true;
        });
      } else {
        state.rowAllData = [...state.prevRowAllData];
      }
      // state에 반영
      resultState = state;
      break;

    // 특정 rowIndex에 값을 제거 *
    case "removeRowData":
      // 만약 현재 state에 선택된 값이라면 선택된 값에서 제거
      if (actionRowIndex == state.rowIndex) {
        state.rowIndex = -1;
        state.rowData = {};
      }

      // 필터링이 활성화된 상태이면
      if (state.filter.active) {
        // prevRowAllData에 현재 상태 업데이트
        state.rowAllData.forEach((item) => (state.prevRowAllData[item.rowIndex] = item));
        // prevRowAllData rowIndex 제거처리 후 rowIndex 재할당
        state.prevRowAllData = state.prevRowAllData
          .filter((item) => actionRowIndex != item.rowIndex)
          .map((item, idx) => {
            item.rowIndex = idx;
            return item;
          });
        // 재필터링
        state.rowAllData = state.prevRowAllData.filter((value) => {
          for (const data of state.filter.filterData) {
            if (!compare(value, data.value, compareFunc(data.type ?? COMPARE_STRING.EQUALS))) {
              return false;
            }
          }
          return true;
        });
      }
      // 필터링된 상태가 아니라면
      else {
        // 선택된 rowIndex 제거처리 후 rowIndex 재할당
        state.rowAllData = state.rowAllData
          .filter((item) => actionRowIndex != item.rowIndex)
          .map((item, idx) => {
            item.rowIndex = idx;
            return item;
          });
        // prevRowAllData를 현재 상태로 업데이트
        state.prevRowAllData = [...state.rowAllData];
      }
      resultState = state;
      break;

    // 특정 rowIndex들의 값을 제거 -> 새롭게 rowIndex를 부여 -> 근데 필터링이 들어가면..?
    // 무언가 값이 바뀐거니 preRowAllData를 갱신하고 거기에 삽입하고 현재 state에 추가하면 되지 않을까유..? *
    case "removeRowDatas":
      // prevRowAllData, rowAllData, rowData, rowIndex를 갱신

      // 만약 현재 state에 선택된 값이라면 선택된 값에서 제거
      if (actionRowIndexs.includes(state.rowIndex)) {
        state.rowIndex = -1;
        state.rowData = {};
      }

      // 필터링이 활성화된 상태이면
      if (state.filter.active) {
        // prevRowAllData에 현재 상태 업데이트
        state.rowAllData.forEach((item) => (state.prevRowAllData[item.rowIndex] = item));
        // prevRowAllData rowIndex 제거처리 후 rowIndex 재할당
        state.prevRowAllData = state.prevRowAllData
          .filter((item) => !actionRowIndexs.includes(item.rowIndex))
          .map((item, idx) => {
            item.rowIndex = idx;
            return item;
          });
        // 재필터링
        state.rowAllData = state.prevRowAllData.filter((value) => {
          for (const data of state.filter.filterData) {
            if (!compare(value, data.value, compareFunc(data.type ?? COMPARE_STRING.EQUALS))) {
              return false;
            }
          }
          return true;
        });
      }
      // 필터링된 상태가 아니라면
      else {
        // 선택된 rowIndex 제거처리 후 rowIndex 재할당
        state.rowAllData = state.rowAllData
          .filter((item) => !actionRowIndexs.includes(item.rowIndex))
          .map((item, idx) => {
            item.rowIndex = idx;
            return item;
          });
        // prevRowAllData를 현재 상태로 업데이트
        state.prevRowAllData = [...state.rowAllData];
      }
      resultState = state;
      break;

    // *
    case "setRowFilter":
      // prevRowAllData에 현재 상태 업데이트
      state.rowAllData.forEach((item) => (state.prevRowAllData[item.rowIndex] = item));
      // 클리어 해서 쓰는건 알아서
      const filterData = action.filter;
      // 필터 항목 추가(이건 굳이 주소를 다시 할당할 이유는 없으니..)
      state.filter.filterList.push(filterData);
      // 재필터링
      state.rowAllData = state.prevRowAllData.filter((value) => {
        for (const data of state.filter.filterList) {
          if (!compare(value, data.value, compareFunc(data.type ?? COMPARE_STRING.EQUALS))) {
            return false;
          }
        }
        return true;
      });
      // 값 반영
      resultState = state;
      break;
    // 필터 초기화
    case "clearRowFilter":
      // prevRowAllData에 현재 상태 업데이트
      state.rowAllData.forEach((item) => (state.prevRowAllData[item.rowIndex] = item));
      // 필터 항목 갱신
      state.filter.filterList = new Array();
      // 필터 안된 값으로 변경
      state.rowAllData = [...state.prevRowAllData];
      // 값 반영
      resultState = state;
      break;

    default:
      throw new Error("Unsupported action type:", type);
  }
  return new ListDataState(resultState);
};

/**
 * compareObject의 각각의 키에 해당하는 데이터를 비교하여 compare에서 모두 true가 떨어지면
 * 같음
 * @param {Object} value  데이터
 * @param {Object} compareObject  비교할 key와 value를 가지고 있는 객체
 * @param {Function<compareFunc>} compare
 * @returns
 */
const compare = (value, compareObject, compareFunction) => {
  if (compareObject == null) {
    return true;
  } else {
    if (compareObject instanceof Object) {
      const keys = Object.keys(compareObject);
      for (const key of keys) {
        if (!compareFunction(value[key], compareObject[key])) {
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
  if (selector == COMPARE_STRING.STARTS_WITH) {
    return (val1, val2) => {
      return String(val1).startsWith(String(val2));
    };
  } else if (selector == COMPARE_STRING.ENDS_WITH) {
    return (val1, val2) => {
      return String(val1).endsWith(String(val2));
    };
  } else if (selector == COMPARE_STRING.INCLUDES) {
    return (val1, val2) => {
      return String(val1).includes(String(val2));
    };
  } else if (selector == COMPARE_STRING.EQUALS) {
    return (val1, val2) => {
      return String(val1) == String(val2);
    };
  }
};

export const COMPARE_STRING = {
  EQUALS: "equals",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
  INCLUDES: "includes",
};

export default useListDataReducer;
