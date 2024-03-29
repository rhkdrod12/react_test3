import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import { ScrollYBox, useScrollYData } from "../../Hook/useScroll";
import { copyObjectBykey, makeDisplayFlexAlign, makeEvent } from "../../utils/commonUtils";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider/ContextProvider";
import { StyleDiv } from "../StyleComp/StyleComp";
import "./GridComp.css";
const GridContextStore = createMutilContext(["rowAllData", "setRowAllData", "GridInfo", "setGridInfo", "selected", "setSelected"]);
const GridComp = ({ Data, GridInfo: gridInfo }) => {
  // 공통설정을 각각의 header, data, footer에 적용
  useMemo(() => makeGridParam(gridInfo), [gridInfo]);
  // 기본값 생성
  useMemo(() => makeDefaultValue(gridInfo.DataInfo, Data), [Data]);

  const { HeaderInfo, DataInfo, FooterInfo } = gridInfo;
  const [rowStateAllData, setRowAllData] = useState(Data);
  const [GridInfo, setGridInfo] = useState(gridInfo);
  const [rowTempAllData, setTempRowAllData] = useState([]); // rowAllData는 어차피 더이상 변경감지를 할 필요가 없는 데이터들
  const [selected, setSelected] = useState(-1);

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
  // 스크롤 데이터
  const { scrollRowData, dataTranslateY } = scrollData;
  // 컨텍스트 데이터 저장
  const contextData = { rowAllData: rowTempAllData, setRowAllData, GridInfo, setGridInfo, selected, setSelected };

  console.log("render GridComp");
  return useMemo(
    () => (
      <div className="grid-root">
        <ContextProvider ContextStore={GridContextStore} Data={contextData}>
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
  console.log("render dataBody");
  const { css } = useContext(GridContextStore.GridInfo).DataInfo;

  return (
    <StyleDiv inStyle={{ ...css }} style={{ transform: `translateY(${transform}px)` }} className="grid-body">
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
  // 재랜더링이 안되면서 기존값이 남아있는 상황인데..
  const select = useContext(GridContextStore.GridInfo).DataInfo.Row.select;
  const selected = useContext(GridContextStore.selected);
  const setSelected = useContext(GridContextStore.setSelected);

  const styleParam = { display: "flex", borderBottom: "1px solid", height: Row.height, background: Row.background, ...Row.css };

  const onClick = () => setSelected((val) => (val == rowIdx ? -1 : rowIdx));

  if (selected == rowIdx) {
    styleParam.backgroundColor = select;
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
