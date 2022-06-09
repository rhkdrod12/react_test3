import styled from "@emotion/styled";
import React, { useState, memo, useEffect, useContext } from "react";
import { log } from "react-modal/lib/helpers/ariaAppHider";
import useScroll, { ScrollBox, useScrollData, useScrollPosition } from "../../Hook/useScroll";
import { defaultCssValue, findFieldAndSetObjectValue, makeFlexAlign } from "../../utils/commonUtils";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider";
import { StyleDiv } from "../StyleComp/StyleComp";
import "./GridComp.css";

const GridContextStore = createMutilContext(["RowData", "setRowInfo", "GridInfo", "setGridInfo"]);
const GridComp = ({ RowData: rowData, GridInfo: gridInfo = {} }) => {
  console.log("render GridComp");
  const { HeaderInfo: headerInfo = [], RowInfo: rowInfo = {}, ColumnInfo: columnInfo = [] } = gridInfo;

  // 그리드 생성에 필요한 파라미터 생성
  makeGridParam(gridInfo);

  const [RowData, setRowData] = useState(rowData);
  const [GridInfo, setGridInfo] = useState(gridInfo);

  // rowData의 경우 데이터를 조회하는 과정에서 먼저 빈배열이 넘어오기 때문에 없을 수 있음
  useEffect(() => setRowData(rowData), [rowData]);

  // 스크롤 처리
  const [scrollData, ref] = useScrollData(RowData, {});

  return (
    <div className="grid-root">
      <ContextProvider ContextStore={GridContextStore} Data={{ RowData, setRowData, HeaderInfo, setHeaderInfo, RowInfo, setRowInfo, ColumnInfo, setColumnInfo }}>
        <ScrollBox scrollData={scrollData} ref={ref}>
          <GridHeader HeaderInfo={HeaderInfo}></GridHeader>
          <div className="test" style={{ transform: `translateY(${scrollData.dataTransform}px)` }}>
            {scrollData.scrollRowData && scrollData.scrollRowData.length > 0 ? <GridBody ColumnInfo={ColumnInfo} RowInfo={RowInfo} RowData={scrollData.scrollRowData}></GridBody> : "데이터 없음"}
          </div>
        </ScrollBox>
      </ContextProvider>
    </div>
  );
};

/**
 * 그리드 헤더의 첫부분
 */
const GridHeader = memo(({ HeaderInfo: headerInfo }) => {
  const [HeaderInfo, setHeaderInfo] = useState(headerInfo);
  return (
    <StyleDiv inStyle={{ height: 50, zIndex: "15", position: "relative", background: "white" }} className="grid-header">
      {HeaderInfo.map((header, idx) => {
        return <GridHeaderColumn key={idx} header={header} />;
      })}
    </StyleDiv>
  );
});

/**
 * 그리드 헤어 내 컬럼 구현 부분
 */
const GridHeaderColumn = memo(({ header }) => {
  return (
    <StyleDiv style={{ width: header.width }} className="grid-header-column">
      <div className="grid-header-column-name">{header.headerName}</div>
      <div className="grid-header-column-svg">|</div>
    </StyleDiv>
  );
});

/**
 * 그리드 Body부분(데이터 표현 부분)
 */
const GridBody = memo(({ ColumnInfo: columnInfo, RowInfo: rowInfo, RowData: rowData, transform }) => {
  return (
    <StyleDiv style={{ transform: `translateY(${transform}px)` }} className="grid-body">
      {rowData.map((row, idx) => (
        <GridBodyRow key={idx} Data={row} Idx={idx}></GridBodyRow>
      ))}
    </StyleDiv>
  );
});

/**
 * Row 구현 부분
 */
const GridBodyRow = memo(({ Data: data, Idx: idx }) => {
  const ColumnInfo = useContext(GridContextStore.ColumnInfo);

  return (
    <StyleDiv key={idx} inStyle={{ display: "flex", height: 50, borderBottom: "1px solid" }}>
      {ColumnInfo ? ColumnInfo.map((column, idx) => <GridBodyColumn key={idx} columnInfo={column} value={data[column.field]} rowData={data}></GridBodyColumn>) : null}
    </StyleDiv>
  );
});

const GridBodyColumn = memo(({ value: data, rowData, columnInfo }) => {
  const { textAlign = "left", verticalAlign = "center" } = columnInfo;
  return (
    <StyleDiv inStyle={{ width: columnInfo.width, padding: 10, display: "flex", alignItems: makeFlexAlign(verticalAlign), justifyContent: makeFlexAlign(textAlign) }}>
      <div>{data}</div>
    </StyleDiv>
  );
});

/**
 * 여기서 주입을 하는게 맞는지는 확인이 필요하긋네..
 * @param {} gridInfo
 */
const makeGridParam = (gridInfo) => {
  const { HeaderInfo, RowInfo, ColumnInfo, FooterInfo } = gridInfo;
  HeaderInfo.map((header) => findFieldAndSetObjectValue({ field: header.field }, { width: header.width }, ColumnInfo));
};

export default GridComp;
