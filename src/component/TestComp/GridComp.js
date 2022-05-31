import styled from "@emotion/styled";
import React, { useState, memo, useEffect, useContext } from "react";
import useScroll from "../../Hook/useScroll";
import { defaultCssValue, findFieldAndSetObjectValue, makeDisplayAlign } from "../../utils/commonUtils";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider";
import ScrollBox from "../BasicComponent/ScrollBox3";
import { StyleDiv } from "../StyleComp/StyleComp";
import "./GridComp.css";

const GridContextStore = createMutilContext(["RowData", "setRowInfo", "HeaderInfo", "setHeaderInfo", "RowInfo", "setRowInfo", "ColumnInfo", "setColumnInfo"]);
const GridComp = ({ RowData: rowData = [], GridInfo: gridInfo = {} }) => {
  console.log("render GridComp");

  const { HeaderInfo: headerInfo = [], RowInfo: rowInfo = [], ColumnInfo: columnInfo = [] } = gridInfo;

  makeGridParam(gridInfo);

  const [RowData, setRowData] = useState(rowData);
  const [HeaderInfo, setHeaderInfo] = useState(headerInfo);
  const [RowInfo, setRowInfo] = useState(rowInfo);
  const [ColumnInfo, setColumnInfo] = useState(columnInfo);

  // rowData의 경우 데이터를 조회하는 과정에서 먼저 빈배열이 넘어오기 때문에 없을 수 있음
  useEffect(() => setRowData(rowData), [rowData]);

  const visibleCount = 5;
  const itemHeight = 50;
  const offsetCnt = 1;
  const headerHeight = 50;
  // 스크롤 이벤트 감지 훅 : 스크롤이 이동되면 현재의 스크롤 위치를 반환한다., ref는 스크롤를 감지할 영역

  // 원래 스크롤 위치에 해당되는 idx값은->
  //
  const [scrollTop, ref] = useScroll(0);
  // 표기해야할 아이템 총개수
  const itemTotalCount = RowData.length;
  // 최대 높이(스크롤의 길이)
  const totalHeight = itemHeight * itemTotalCount;
  // 화면 데이터 표현 높이
  const containerHeight = itemHeight * visibleCount;
  // 화면 헤더 포함 높이
  const containerTotalHeight = containerHeight + headerHeight;
  // 아이템 한개당 스크롤에 차지하는 높이
  const scrollItemHeight = (totalHeight - containerTotalHeight) / (itemTotalCount - visibleCount);
  // 현재 스크롤에서 시작 idx
  const startIdx = Math.max(Math.floor(scrollTop / scrollItemHeight), 0);
  // 현재 스크롤에서 마지막 idx
  const endIdx = startIdx + visibleCount + offsetCnt;
  // 현재 표기해야할 스크롤 위치
  const offsetY = scrollTop;
  // 표기 데이터
  const scrollData = RowData.filter((item, idx) => idx >= startIdx && idx < endIdx);
  // 데이터 폼을 자연스럽게 이동시키기 위한
  const dataTransform = -(scrollTop % scrollItemHeight);

  return (
    <div className="grid-root">
      <ContextProvider ContextStore={GridContextStore} Data={{ RowData, setRowData, HeaderInfo, setHeaderInfo, RowInfo, setRowInfo, ColumnInfo, setColumnInfo }}>
        <StyleDiv inStyle={{ position: "relative", overflow: "hidden", height: containerTotalHeight }}>
          <StyleDiv inStyle={{ paddingRight: 18 }} className="scroll-display-area">
            <GridHeader HeaderInfo={HeaderInfo}></GridHeader>
            <div style={{ transform: `translateY(${dataTransform}px)` }}>
              {scrollData && scrollData.length > 0 ? <GridBody ColumnInfo={ColumnInfo} RowInfo={RowInfo} RowData={scrollData}></GridBody> : "데이터 없음"}
            </div>
          </StyleDiv>
          <StyleOverflowDiv inStyle={{}} className="scroll-container" height={containerTotalHeight} ref={ref}>
            <StyleScrollDiv height={totalHeight}>
              <StyleDiv style={{ transform: `translateY(${offsetY}px)` }}></StyleDiv>
            </StyleScrollDiv>
          </StyleOverflowDiv>
        </StyleDiv>
      </ContextProvider>
    </div>
  );
};

/*
 * =================================================================================
 * style-components
 * =================================================================================
 */
const StyleOverflowDiv = styled(StyleDiv)`
  position: absolute;
  width: 100%;
  top: 0px;
  right: 0px;
  z-index: 15;
  overflow-y: auto;
  height: ${({ height }) => defaultCssValue(height)};
`;
const StyleScrollDiv = styled.div`
  display: grid;
  position: relative;
  grid-auto-flow: row;
  align-content: start;
  height: ${({ height }) => defaultCssValue(height, "250px")};
`;
//==================================================================================

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
    <StyleDiv inStyle={{ width: columnInfo.width, padding: 10, display: "flex", alignItems: makeDisplayAlign(verticalAlign), justifyContent: makeDisplayAlign(textAlign) }}>
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
