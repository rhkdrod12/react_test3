import styled from "@emotion/styled";
import React, { useState, memo, useEffect, useContext, useMemo, useCallback } from "react";
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
  const [rowStateAllData, setRowAllData] = useState(Data);
  const [GridInfo, setGridInfo] = useState(gridInfo);
  const [rowAllData, setTempRowAllData] = useState([]); // rowAllData는 어차피 더이상 변경감지를 할 필요가 없는 데이터들

  // rowData의 경우 데이터를 조회하는 과정에서 먼저 빈배열이 넘어오기 때문에 없을 수 있음
  useEffect(() => setRowAllData(Data), [Data]);
  useEffect(() => setGridInfo(gridInfo), [gridInfo]);
  useEffect(
    () =>
      setTempRowAllData((data) => {
        data.length = 0;
        data.push(...rowStateAllData);
        return data;
      }),
    [rowStateAllData]
  );

  // 스크롤 여부
  const scrollFlag = rowStateAllData.length > DataInfo.Scroll.visibleCount;
  // 스크롤 처리
  const [scrollData, ref] = useScrollYData(rowStateAllData, DataInfo.Scroll);

  let { scrollRowData, dataTranslateY } = scrollData;

  console.log("render GridComp");

  return useMemo(
    () => (
      <div className="grid-root">
        <ContextProvider ContextStore={GridContextStore} Data={{ rowAllData: rowAllData, setRowAllData, GridInfo, setGridInfo }}>
          <GridHeader HeaderInfo={HeaderInfo} scroll={scrollFlag}></GridHeader>
          <ScrollYBox scrollData={scrollData} ref={ref}>
            <div className="grid-data-scrollCotainer" style={{ transform: `translateY(${dataTranslateY}px)` }}>
              {scrollRowData && scrollRowData.length > 0 ? (
                <GridBody rowAllData={scrollRowData} startIdx={scrollData.startIdx}></GridBody>
              ) : (
                <StyleDiv inStyle={{ width: 150, margin: "10px auto", textAlign: "center" }}>데이터 없음</StyleDiv>
              )}
            </div>
          </ScrollYBox>
        </ContextProvider>
      </div>
    ),
    [scrollRowData]
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

  // 현재 문제가 rowAllData가 변경되면 주소값이 변경되어서 여기가 재갱신되고
  // 그 하위애들도 전부 다 갱신시켜버리는데..
  // 근데 결국에는 다시 그려지려면 rowAllData가 갱신되어야하는데..
  // 그래야 스크롤시 변경된 값이 반영이 되는데..

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
const GridBody = memo(({ rowAllData, transform, startIdx }) => {
  console.log("render dataBody");
  return (
    <StyleDiv style={{ transform: `translateY(${transform}px)` }} className="grid-body">
      {rowAllData ? rowAllData.map((row, idx) => <GridBodyRowWrapper key={idx} rowData={row} rowIdx={startIdx + idx}></GridBodyRowWrapper>) : null}
    </StyleDiv>
  );
});

/**
 * Row 데이터 전달용 wrapper
 * @param {*} param0
 * @returns
 */
const GridBodyRowWrapper = ({ rowData, rowIdx }) => {
  const rowAllData = useContext(GridContextStore.rowAllData);
  const DataInfo = useContext(GridContextStore.GridInfo).DataInfo;
  const Row = DataInfo.Row;
  const RowColumn = DataInfo.Column;
  return <GridBodyRow rowData={rowData} rowIdx={rowIdx} rowAllData={rowAllData} Row={Row} RowColumn={RowColumn} />;
};

/**
 * Row 구현부분
 */
const GridBodyRow = memo(({ rowData, rowIdx, rowAllData, Row, RowColumn }) => {
  // 이놈 때문에 발동했구만..
  console.log("render row %s", rowIdx);
  // rowData 보관용 - 근데 이정도면 그냥 재 랜더링 시키는게 낫지 않나..?
  const [rowTempData, rowTempSetData] = useState(rowData);
  useEffect(() => {
    rowTempSetData((data) => {
      Object.assign(data, rowData);
      return data;
    });
  }, [rowData]);

  return (
    <StyleDiv className="grid-row" inStyle={{ display: "flex", borderBottom: "1px solid", height: Row.height, background: Row.background, ...Row.css }}>
      {RowColumn
        ? RowColumn.map((column, idx) => (
            <GridBodyColumn key={idx} columnData={rowData[column.id]} rowIdx={rowIdx} colIdx={idx} Column={column} RowColumn={RowColumn} rowData={rowTempData} rowAllData={rowAllData}></GridBodyColumn>
          ))
        : null}
    </StyleDiv>
  );
});

const GridBodyColumn = memo(({ columnData, Column, rowIdx, colIdx, rowData, rowAllData }) => {
  const { id, width, textAlign, verticalAlign, css: columnCss, fommater, event, component: Component } = Column;

  const setAllRowData = useContext(GridContextStore.setRowAllData);
  const DataInfo = useContext(GridContextStore.GridInfo).DataInfo;
  const Row = DataInfo.Row;
  const RowColumn = DataInfo.Column;

  console.log("render column %s", id);
  /**
   * 로우 인덱스에 해당하는 열을 해당 값으로 바꿈
   * @param {*} rowIdx
   * @param {*} rowData
   */
  const setRowData = (rowIdx, rowData) => {
    setAllRowData((items) => items.map((item, idx) => (idx === rowIdx ? { ...item, ...rowData } : item)));
  };

  const param = { id, data: columnData, rowData, setRowData, rowIdx, colIdx, Column, RowColumn, Row, rowAllData, setAllRowData };
  const columnEvent = makeEvent(event, param);
  const rowEvent = makeEvent(Row.event, param);

  let comp;
  if (Component) {
    param.event = columnEvent;
    param.rowEvent = rowEvent;
    comp = <Component {...param}>{fommater?.(columnData) || columnData}</Component>;
  } else {
    comp = <div {...columnEvent}>{fommater?.(columnData) || columnData}</div>;
  }

  return (
    <StyleDiv inStyle={{ flexBasis: width, ...makeDisplayFlexAlign({ textAlign, verticalAlign }), ...columnCss }} className="grid-column grid-data-column" {...rowEvent} {...columnEvent}>
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
