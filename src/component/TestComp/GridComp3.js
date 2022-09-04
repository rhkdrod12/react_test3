import React, { memo, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { ScrollYBox, useScrollYData } from "../../Hook/useScroll";
import { copyObjectBykey, makeDisplayFlexAlign, makeEvent } from "../../utils/commonUtils";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider/ContextProvider";
import { StyleDiv } from "../StyleComp/StyleComp";
import "./GridComp.css";
import { useGridReducer } from "./GridRowReducer";

export const useGridComponent = (rowAllData, gridInfo) => {
  // 공통설정을 각각의 header, data, footer에 적용
  useEffect(() => {
    makeGridParam(gridInfo);
  }, [gridInfo]);
  // 기본값 생성
  useEffect(() => {
    makeDefaultValue(gridInfo.DataInfo, rowAllData);
  }, [rowAllData]);

  const rowAction = useGridReducer(rowAllData);
  const rowState = rowAction.getRowState();

  const gridComponent = <GridComp rowState={rowState} rowAction={rowAction} gridInfo={gridInfo} />;

  return { rowState, rowAction, gridComponent };
};

const GridContextStore = createMutilContext(["rowState", "rowAction", "GridInfo"]);
const GridComp = ({ rowState, rowAction, gridInfo }) => {
  const [GridInfo, setGridInfo] = useState(gridInfo);
  // 컨텍스트 데이터 저장
  const contextData = { rowState, rowAction, GridInfo };
  // console.log("render GridComp %o", rowState);

  return (
    <div className="grid-root">
      <ContextProvider ContextStore={GridContextStore} Data={contextData}>
        <GridWrapper rowState={rowState} rowAction={rowAction} GridInfo={GridInfo} />
      </ContextProvider>
    </div>
  );
};
// const GridComp = ({ Data: rowAllData, GridInfo: gridInfo }) => {
//   // 공통설정을 각각의 header, data, footer에 적용
//   useEffect(() => {
//     makeGridParam(gridInfo);
//   }, [gridInfo]);
//   // 기본값 생성
//   useEffect(() => {
//     makeDefaultValue(gridInfo.DataInfo, rowAllData);
//   }, [rowAllData]);

//   const [GridInfo, setGridInfo] = useState(gridInfo);
//   const rowAction = useGridReducer(rowAllData);
//   const rowState = rowAction.getRowState();

//   // 컨텍스트 데이터 저장
//   const contextData = { rowState, rowAction, GridInfo };
//   // console.log("render GridComp %o", rowState);

//   return (
//     <div className="grid-root">
//       <ContextProvider ContextStore={GridContextStore} Data={contextData}>
//         <GridWrapper rowState={rowState} rowAction={rowAction} GridInfo={GridInfo} />
//       </ContextProvider>
//     </div>
//   );
// };

const GridWrapper = memo(({ rowState, rowAction, GridInfo }) => {
  const { HeaderInfo, DataInfo, FooterInfo } = GridInfo;
  // 스크롤 처리
  const [scrollData, ref] = useScrollYData(rowState.rowAllData, DataInfo.Scroll);
  // 스크롤 데이터
  const { scrollRowData, dataTranslateY, scrollDisplay } = scrollData;
  // console.log("render GridWrapper");
  const { css } = DataInfo;

  return (
    <React.Fragment>
      <GridHeader HeaderInfo={HeaderInfo} scroll={scrollDisplay}></GridHeader>
      <ScrollYBox scrollData={scrollData} ref={ref}>
        <div className="grid-data-scrollCotainer" style={{ transform: `translateY(${dataTranslateY}px)` }}>
          {scrollRowData && scrollRowData.length > 0 ? (
            <GridBody rowAllData={scrollRowData} startIdx={scrollData.startIdx}></GridBody>
          ) : (
            <StyleDiv className="grid-not-data" inStyle={{ width: 150, margin: "10px auto", textAlign: "center", ...css }}>
              데이터 없음
            </StyleDiv>
          )}
        </div>
      </ScrollYBox>
    </React.Fragment>
  );
});

/**
 *
 */
const GridHeader = memo(({ HeaderInfo: headerInfo, scroll }) => {
  const headerRow = headerInfo.Row;
  const headerColumn = headerInfo.Column;

  // default값이 필요한건 이렇게 처리하고 나머지는 어차피 저렇게 처리하면 덮어 씌어질테니
  const { height, background, css: rowCss } = headerRow;
  return (
    <StyleDiv inStyle={{ height, background, ...rowCss, paddingRight: `${scroll ? "17px" : ""}` }} className="grid-header">
      {headerColumn.map((column, idx) => (
        <GridHeaderColumn key={idx} column={column} />
      ))}
    </StyleDiv>
  );
});

/**
 * 그리드 헤어 내 컬럼 구현 부분
 */
const GridHeaderColumn = memo(({ column }) => {
  const { id, name, width, verticalAlign, textAlign, css: columnCss, component: Component, event } = column;

  const rowAction = useContext(GridContextStore.rowAction);

  // 컴포넌트 또는 이벤트에 넘길 파라미터
  const param = { id, name, rowAction };
  // 이벤트에 필요한 파라미터 추가
  const columnEvent = makeEvent(event, param);

  let comp;
  if (Component) {
    param.columnEvent = columnEvent;
    comp = <Component {...param}>{name}</Component>;
  } else {
    comp = <div {...columnEvent}>{name}</div>;
  }

  return (
    <StyleDiv inStyle={{ flexBasis: width, ...makeDisplayFlexAlign({ verticalAlign, textAlign }), ...columnCss }} className="grid-column grid-header-column">
      <div className="grid-header-column-name">{comp}</div>
      {/* <div className="grid-header-column-svg">|</div> */}
    </StyleDiv>
  );
});

/**
 * 그리드 Body부분(데이터 표현 부분)
 */
const GridBody = memo(({ rowAllData, transform, startIdx }) => {
  // console.log("render dataBody");
  const { css } = useContext(GridContextStore.GridInfo).DataInfo;
  const [selectIdx, setSelectIdx] = useState(-1);

  return (
    <StyleDiv inStyle={{ ...css }} style={{ transform: `translateY(${transform}px)` }} className="grid-body">
      {rowAllData ? rowAllData.map((row, idx) => <GridBodyRow key={idx} rowData={row} rowIdx={startIdx + idx} selectIdx={selectIdx} setSelectIdx={setSelectIdx}></GridBodyRow>) : null}
    </StyleDiv>
  );
});

/**
 * Row 구현부분
 */
const GridBodyRow = memo(({ rowData, rowIdx, selectIdx, setSelectIdx }) => {
  // 이놈 때문에 발동했구만..
  const DataInfo = useContext(GridContextStore.GridInfo).DataInfo;
  const rowAction = useContext(GridContextStore.rowAction);

  const rowAllData = rowAction.getRowAllData();
  const Row = DataInfo.Row;
  const RowColumn = DataInfo.Column;

  // console.log("render row %s", rowIdx);

  const styleParam = { display: "flex", borderBottom: "1px solid", height: Row.height, background: Row.background, ...Row.css };

  const onClick = () => {
    let idx = selectIdx != rowIdx ? rowIdx : -1;
    setSelectIdx(idx);
    rowAction.setSelectedRowIdex(idx);
  };

  if (selectIdx == rowIdx) {
    styleParam.backgroundColor = Row.select;
  }

  return (
    <StyleDiv className="grid-row" inStyle={styleParam} onClick={onClick}>
      {RowColumn
        ? RowColumn.map((column, idx) => (
            <GridBodyColumn key={idx} columnData={rowData[column.id]} rowIdx={rowIdx} colIdx={idx} Column={column} RowColumn={RowColumn} rowData={rowData} rowAllData={rowAllData}></GridBodyColumn>
          ))
        : null}
    </StyleDiv>
  );
});

const GridBodyColumn = memo(({ columnData, Column, rowIdx, colIdx }) => {
  const { id, width, textAlign, verticalAlign, css: columnCss, fommater, event, component: Component } = Column;

  const rowAction = useContext(GridContextStore.rowAction);
  const DataInfo = useContext(GridContextStore.GridInfo).DataInfo;

  const Row = DataInfo.Row;
  const RowColumn = DataInfo.Column;

  const param = { id, data: columnData, rowData: rowAction.getRowData(rowIdx), rowIdx, colIdx, rowAction, Column, RowColumn, Row };
  const columnEvent = makeEvent(event, param);
  const rowEvent = makeEvent(Row.event, param);

  let comp;
  if (Component) {
    param.event = columnEvent;
    param.rowEvent = rowEvent;
    comp = <Component {...param}>{fommater?.(columnData) || columnData}</Component>;
  } else {
    comp = <div>{fommater?.(columnData) || columnData}</div>;
  }

  return (
    <StyleDiv inStyle={{ flexBasis: width, ...makeDisplayFlexAlign({ textAlign, verticalAlign }), ...columnCss }} className="grid-column grid-data-column" {...rowEvent} {...columnEvent}>
      {comp}
    </StyleDiv>
  );
});

const makeDefaultValue = (DataInfo, rowAllData) => {
  if (rowAllData && rowAllData.length > 0) {
    const defaultColumn = DataInfo?.Column?.filter((item) => item.defaultValue)?.reduce((acc, item) => {
      acc[item.id] = item.defaultValue;
      return acc;
    }, {});

    if (defaultColumn) {
      for (const row of rowAllData) {
        for (const key in defaultColumn) {
          if (!row[key]) {
            row[key] = defaultColumn[key];
          }
        }
      }
    }
  }
};

/**
 * 여기서 주입을 하는게 맞는지는 확인이 필요하긋네..
 * @param {} gridInfo
 */
const makeGridParam = (GridInfo) => {
  const { HeaderInfo = { Row: {}, Column: [] }, DataInfo = { Row: {}, Column: [] }, FooterInfo = { Row: {}, Column: [] } } = GridInfo;

  if (GridInfo) {
    if (GridInfo.Column) {
      HeaderInfo.Column = copyObjectBykey("id", GridInfo.Column, HeaderInfo.Column);
      DataInfo.Column = copyObjectBykey("id", GridInfo.Column, DataInfo.Column);
      FooterInfo.Column = copyObjectBykey("id", GridInfo.Column, FooterInfo.Column);
    }

    if (GridInfo.Row) {
      HeaderInfo.Row = { ...DefaultHeaderInfo.Row, ...GridInfo.Row, ...HeaderInfo.Row };
      DataInfo.Row = { ...DefaultDataInfo.Row, ...GridInfo.Row, ...DataInfo.Row };
      FooterInfo.Row = { ...DefaultFooterInfo.Row, ...GridInfo.Row, ...FooterInfo.Row };
    }

    DataInfo.Scroll = { ...DefaultDataInfo.Scroll, itemHeight: DataInfo.Row.height, headerHeight: HeaderInfo.Row.height, ...DataInfo.Scroll };

    GridInfo.HeaderInfo = HeaderInfo;
    GridInfo.DataInfo = DataInfo;
    GridInfo.FooterInfo = FooterInfo;
  }

  return GridInfo;
};

// 기본 설정
const DefaultHeaderInfo = {
  Row: { height: 50 },
  Column: [],
};
const DefaultDataInfo = {
  Row: { height: 50 },
  Column: [],
  Scroll: {
    visibleCount: 5,
    offsetCnt: 1,
    headerHeight: 50,
    itemHeight: 50,
  },
};
const DefaultFooterInfo = {
  Row: { height: 50 },
  Column: [],
};

export default GridComp;
