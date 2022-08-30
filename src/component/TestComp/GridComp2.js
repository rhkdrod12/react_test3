import styled from "@emotion/styled";
import React, { useState, memo, useEffect, useContext, useMemo } from "react";
import { ScrollVirtualYBox, ScrollYBox, useScrollYData } from "../../Hook/useScroll";
import { copyObjectBykey, defaultCssValue, findFieldAndSetObjectValue, makeCssObject, makeDisplayFlexAlign, makeEvent, makeFlexAlign } from "../../utils/commonUtils";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider/ContextProvider";
import { StyleDiv } from "../StyleComp/StyleComp";
import "./GridComp.css";

const GridContextStore = createMutilContext(["rowAllData", "setRowAllData", "GridInfo", "setGridInfo"]);
const GridComp = ({ Data, GridInfo: gridInfo }) => {
  // data = null;
  // 그리드 생성에 필요한 파라미터 생성
  gridInfo = useMemo(() => makeGridParam(gridInfo), [gridInfo]);

  const { HeaderInfo, DataInfo, FooterInfo } = gridInfo;
  const [rowAllData, setRowAllData] = useState(Data);
  const [GridInfo, setGridInfo] = useState(gridInfo);

  // rowData의 경우 데이터를 조회하는 과정에서 먼저 빈배열이 넘어오기 때문에 없을 수 있음
  useEffect(() => setRowAllData(Data), [Data]);
  useEffect(() => setGridInfo(gridInfo), [gridInfo]);

  // 스크롤 여부
  const scrollFlag = rowAllData.length > DataInfo.Scroll.visibleCount;
  // 스크롤 처리
  const [scrollData, ref] = useScrollYData(rowAllData, DataInfo.Scroll);

  let { scrollRowData, dataTranslateY } = scrollData;

  console.log("render GridComp %o", scrollData);

  return (
    <div className="grid-root">
      <ContextProvider ContextStore={GridContextStore} Data={{ rowAllData, setRowAllData, GridInfo, setGridInfo }}>
        <GridHeader HeaderInfo={HeaderInfo} scroll={scrollFlag}></GridHeader>
        <ScrollYBox scrollData={scrollData} ref={ref}>
          <div className="grid-data-scrollCotainer" style={{ transform: `translateY(${dataTranslateY}px)` }}>
            {scrollRowData && scrollRowData.length > 0 ? (
              <GridBody rowAllData={scrollRowData}></GridBody>
            ) : (
              <StyleDiv inStyle={{ width: 150, margin: "10px auto", textAlign: "center" }}>데이터 없음</StyleDiv>
            )}
          </div>
        </ScrollYBox>
      </ContextProvider>
    </div>
  );
};

/**
 * 그리드 헤더의 첫부분
 */
const GridHeader = memo(({ HeaderInfo: headerInfo, scroll }) => {
  const headerRow = headerInfo.Row;
  const headerColumn = headerInfo.Column;

  // default값이 필요한건 이렇게 처리하고 나머지는 어차피 저렇게 처리하면 덮어 씌어질테니
  const { height, background, css: rowCss } = headerRow;
  return (
    <StyleDiv inStyle={{ height, background, ...rowCss, paddingRight: `${scroll ? "18px" : ""}` }} className="grid-header">
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

  const rowAllData = useContext(GridContextStore.rowAllData);
  const setRowAllData = useContext(GridContextStore.setRowAllData);

  // 컴포넌트 또는 이벤트에 넘길 파라미터
  const param = { id, name, rowAllData, setRowAllData };
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
    <StyleDiv style={{ flexBasis: width, ...makeDisplayFlexAlign({ verticalAlign, textAlign }), ...columnCss }} className="grid-column grid-header-column">
      <div className="grid-header-column-name">{comp}</div>
      <div className="grid-header-column-svg">|</div>
    </StyleDiv>
  );
});

/**
 * 그리드 Body부분(데이터 표현 부분)
 */
const GridBody = memo(({ rowAllData, transform }) => {
  return (
    <StyleDiv style={{ transform: `translateY(${transform}px)` }} className="grid-body">
      {rowAllData ? rowAllData.map((row, idx) => <GridBodyRow key={idx} rowData={row} rowIdx={idx}></GridBodyRow>) : null}
    </StyleDiv>
  );
});

/**
 * Row 구현 부분
 */
const GridBodyRow = memo(({ rowData, rowIdx }) => {
  const setRowAllData = useContext(GridContextStore.setRowAllData);
  const DataInfo = useContext(GridContextStore.GridInfo).DataInfo;
  const Row = DataInfo.Row;
  const RowColumn = DataInfo.Column;

  const param = { data: rowData, rowIdx, Row, RowColumn, setRowAllData };
  const rowEvent = makeEvent(DataInfo.Row.event, param);

  return (
    <StyleDiv className="grid-row" inStyle={{ display: "flex", borderBottom: "1px solid", height: Row.height, background: Row.background, ...Row.css }} {...rowEvent}>
      {RowColumn
        ? RowColumn.map((column, idx) => (
            <GridBodyColumn key={idx} columnData={rowData[column.id]} rowIdx={rowIdx} colIdx={idx} Column={column} RowColumn={RowColumn} rowData={rowData}></GridBodyColumn>
          ))
        : null}
    </StyleDiv>
  );
});

const GridBodyColumn = memo(({ columnData, Column, rowIdx, colIdx, rowData }) => {
  const { id, width, textAlign, verticalAlign, css: columnCss, fommater, event, component: Component } = Column;
  const DataInfo = useContext(GridContextStore.GridInfo).DataInfo;
  const Row = DataInfo.Row;
  const RowColumn = DataInfo.Column;
  const rowAllData = useContext(GridContextStore.rowAllData);
  const setAllRowData = useContext(GridContextStore.setRowAllData);

  const setRowData = (rowIdx, rowData) => {
    setAllRowData((items) => {
      debugger;
      return items.map((item, idx) => (idx === rowIdx ? { ...item, ...rowData } : item));
    });
  };

  const param = { id, data: columnData, rowData, setRowData, rowIdx, colIdx, Column, Row, RowColumn, rowAllData, setAllRowData };
  const columnEvent = makeEvent(event, param);

  let comp;
  if (Component) {
    comp = <Component {...param}>{fommater?.(columnData) || columnData}</Component>;
  } else {
    comp = <div {...columnEvent}>{fommater?.(columnData) || columnData}</div>;
  }

  return (
    <StyleDiv inStyle={{ flexBasis: width, ...makeDisplayFlexAlign({ textAlign, verticalAlign }), ...columnCss }} className="grid-column grid-data-column">
      {comp}
    </StyleDiv>
  );
});

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
