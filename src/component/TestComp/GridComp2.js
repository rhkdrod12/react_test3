import styled from "@emotion/styled";
import React, { useState, memo, useEffect, useContext } from "react";
import { ScrollVirtualYBox, useScrollYData } from "../../Hook/useScroll";
import { copyObjectBykey, defaultCssValue, findFieldAndSetObjectValue, makeDisplayFlexAlign, makeFlexAlign } from "../../utils/commonUtils";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider/ContextProvider";
import { StyleDiv } from "../StyleComp/StyleComp";
import "./GridComp.css";

const GridContextStore = createMutilContext(["RowData", "setRowInfo", "GridInfo", "setGridInfo"]);
const GridComp = ({ Data: data, GridInfo: gridInfo }) => {
  console.log("render GridComp");
  // data = null;
  // 그리드 생성에 필요한 파라미터 생성
  makeGridParam(gridInfo);

  const { HeaderInfo, DataInfo, FooterInfo } = gridInfo;

  const [RowData, setRowData] = useState(data);
  const [GridInfo, setGridInfo] = useState(gridInfo);

  // rowData의 경우 데이터를 조회하는 과정에서 먼저 빈배열이 넘어오기 때문에 없을 수 있음
  useEffect(() => setRowData(data), [data]);
  useEffect(() => setGridInfo(gridInfo), [gridInfo]);

  // 스크롤 처리
  const [scrollData, ref] = useScrollYData(RowData, {});

  let { scrollRowData, dataTranslateY } = scrollData;

  return (
    <div className="grid-root">
      <ContextProvider ContextStore={GridContextStore} Data={{ RowData, setRowData, GridInfo, setGridInfo }}>
        <ScrollVirtualYBox scrollData={scrollData} ref={ref}>
          <GridHeader HeaderInfo={HeaderInfo}></GridHeader>
          <div className="grid-data-scrollCotainer" style={{ transform: `translateY(${dataTranslateY}px)` }}>
            {scrollRowData && scrollRowData.length > 0 ? (
              <GridBody ColumnInfo={DataInfo.Column} RowInfo={DataInfo.Row} Data={scrollRowData}></GridBody>
            ) : (
              <StyleDiv inStyle={{ width: 150, margin: "10px auto", textAlign: "center" }}>데이터 없음</StyleDiv>
            )}
          </div>
        </ScrollVirtualYBox>
      </ContextProvider>
    </div>
  );
};

/**
 * 그리드 헤더의 첫부분
 */
const GridHeader = memo(({ HeaderInfo: headerInfo }) => {
  console.log("헤더");
  const headerRow = headerInfo.Row;
  const headerColumn = headerInfo.Column;

  console.log(headerRow);
  console.log(headerColumn);
  // default값이 필요한건 이렇게 처리하고 나머지는 어차피 저렇게 처리하면 덮어 씌어질테니
  const { height, background, css: rowCss } = headerRow;
  return (
    <StyleDiv inStyle={{ height, background, ...rowCss }} className="grid-header">
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
  const { name, width, verticalAlign, textAlign, css: columnCss } = column;
  return (
    <StyleDiv style={{ flexBasis: width, ...makeDisplayFlexAlign({ verticalAlign, textAlign }), ...columnCss }} className="grid-column grid-header-column">
      <div className="grid-header-column-name">{name}</div>
      <div className="grid-header-column-svg">|</div>
    </StyleDiv>
  );
});

/**
 * 그리드 Body부분(데이터 표현 부분)
 */
const GridBody = memo(({ ColumnInfo: columnInfo, RowInfo: rowInfo, Data: rowData, transform }) => {
  return (
    <StyleDiv style={{ transform: `translateY(${transform}px)` }} className="grid-body">
      {rowData ? rowData.map((row, idx) => <GridBodyRow key={idx} Data={row} Idx={idx}></GridBodyRow>) : null}
    </StyleDiv>
  );
});

/**
 * Row 구현 부분
 */
const GridBodyRow = memo(({ Data: rowData, Idx: idx }) => {
  const ColumnInfo = useContext(GridContextStore.GridInfo).DataInfo.Column;

  return (
    <StyleDiv key={idx} inStyle={{ display: "flex", height: 50, borderBottom: "1px solid" }}>
      {ColumnInfo ? ColumnInfo.map((column, idx) => <GridBodyColumn key={idx} Column={column} Data={rowData[column.field]} RowData={rowData}></GridBodyColumn>) : null}
    </StyleDiv>
  );
});

const GridBodyColumn = memo(({ Data: data, RowData, Column }) => {
  const { width, textAlign, verticalAlign, css: columnCss } = Column;

  return (
    <StyleDiv inStyle={{ flexBasis: width, ...makeDisplayFlexAlign({ textAlign, verticalAlign }), ...columnCss }} className="grid-column grid-data-column">
      <div>{data}</div>
    </StyleDiv>
  );
});

/**
 * 여기서 주입을 하는게 맞는지는 확인이 필요하긋네..
 * @param {} gridInfo
 */
const makeGridParam = (GridInfo) => {
  console.log("param 생성");

  const { HeaderInfo = { Row: {}, Column: [] }, DataInfo = { Row: {}, Column: [] }, FooterInfo = { Row: {}, Column: [] } } = GridInfo;

  if (GridInfo) {
    if (GridInfo.Column) {
      HeaderInfo.Column = copyObjectBykey("field", GridInfo.Column, HeaderInfo.Column);
      DataInfo.Column = copyObjectBykey("field", GridInfo.Column, DataInfo.Column);
      FooterInfo.Column = copyObjectBykey("field", GridInfo.Column, FooterInfo.Column);
    }

    if (GridInfo.Row) {
      HeaderInfo.Row = { ...GridInfo.Row, ...HeaderInfo.Row };
      DataInfo.Row = { ...GridInfo.Row, ...DataInfo.Row };
      FooterInfo.Row = { ...GridInfo.Row, ...FooterInfo.Row };
    }
  }

  console.log(GridInfo);

  // HeaderInfo.map((header) => findFieldAndSetObjectValue({ field: header.field }, { width: header.width }, ColumnInfo));
};

// 헤더 설정
const HeaderInfo = {
  Row: {},
  Column: [],
};

const DataInfo = {
  Row: {},
  Column: [],
};

const FooterInfo = {
  Row: {},
  Column: [],
};

const GridInfo = {
  Column: [
    { field: "menuId", name: "ID", width: 200 },
    { field: "type", name: "TYPE", width: 200 },
    { field: "category", name: "카테고리", width: 200 },
    { field: "name", name: "이름", width: 300 },
    { field: "upperMenu", name: "상위메뉴", width: 300 },
    { field: "menuDepth", name: "메뉴 깊이", width: 300 },
    { field: "menuOrder", name: "메뉴순서", width: 300 },
  ],
  HeaderInfo,
  DataInfo,
  FooterInfo,
};
export default GridComp;
