import React, { createContext, useContext, useState } from "react";
import "./DefaultCss.css";
import gridStyle from "./gridStyle.module.css";
import styled from "styled-components";

import TextField from "@mui/material/TextField";
import ScrollBox from "./BasicComponent/ScrollBox";
import { defaultCssValue } from "../utils/commonUtils";

const Btn = ({ rowData, columnInfo }) => {
  var { name, ...attr } = columnInfo;
  var value = rowData.url;
  console.log("render btn");
  var onClick = () => {
    console.log(`${value} 로 이동`);
  };
  return <button onClick={onClick}>{name}</button>;
};

export const TstGrid = () => {
  const style = { margin: "20px" };
  const columnInfo = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "성",
      width: 200,
    },
    {
      field: "lastName",
      headerName: "이름",
      width: 200,
    },
    {
      field: "age",
      headerName: "나이",
      type: "number",
      width: 100,
    },
    {
      field: "btn",
      headerName: "상세내용",
      type: "component",
      Component: Btn,
      name: "이동",
      width: 300,
    },
  ];

  const rows = [];
  for (var i = 0; i <= 5000; i++) {
    rows.push({ id: i, lastName: "길동" + i, firstName: `홍${i}`, age: i, url: "/home/stay" + i });
  }

  const GridOption = { columnInfo: columnInfo };

  return <MyGrid GridOption={GridOption} RowData={rows}></MyGrid>;
};

/**
 * [Option 정의]
 * GridOption: 그리드의 전체적인 부분에 관한 옵션
 * HeaderOtpion : Header 관련 옵션
 * DataOption : Content 부분에 관한 옵션
 * FooterOption : footer 부분 옵션
 */

/**
 * [GridOption]
 * columnInfo : 표기할 컬럼에 대한 정의
 * 1. field      : 컬럼 id(해당 컬럼 고유 아이디)
 * 2. headerName : header에 표기할 내용
 * 3.
 */
const MyGrid = ({ GridOption = {}, DataOption = {}, HeaderOption = {}, FooterOption = {}, RowData = [], Style }) => {
  const columnInfo = GridOption.columnInfo;

  // 컨테이너 범위지정
  const width = columnInfo.map(({ width }, idx) => defaultCssValue(width, "1fr")).join(" ");

  const gridInlineStyle = {
    width: width,
  };

  return (
    <GridContextProvider data={{ GridOption, DataOption, HeaderOption, FooterOption, RowData }} user="123" tess="111">
      <Temp></Temp>
    </GridContextProvider>
  );
};

const Temp = () => {
  const { GridOption, DataOption, HeaderOption } = GridContextStore();
  setDefaultOption();

  return (
    <div className={gridStyle["grid-root"]}>
      <div className={gridStyle["grid-root-container"]}>
        <GridHeaderContainer columnInfo={GridOption.columnInfo}></GridHeaderContainer>
        {/* <GridDataContainer columnInfo={GridOption.columnInfo} rowData={RowData} gridInlineStyle={gridInlineStyle}></GridDataContainer> */}
      </div>
    </div>
  );
};

const setDefaultOption = () => {
  const { GridOption, DataOption, HeaderOption } = GridContextStore();
  const rowWidth = GridOption.columnInfo.map(({ width }, idx) => defaultCssValue(width, "1fr")).join(" ");

  // 데이터 컬럼, 헤더 컬럼 길이 지정
  DataOption.rowWidth = rowWidth;
  HeaderOption.rowWidth = rowWidth;
};

const GridHeaderContainer = () => {
  console.log(GridContextStore().HeaderOption);

  const { GridOption, HeaderOption } = GridContextStore();
  const { columnInfo } = GridOption;

  const gridInlineStyle = { width: HeaderOption.rowWidth };

  return (
    <StyleGridContainer {...gridInlineStyle} className={gridStyle["grid-header-container"]}>
      {columnInfo.map((column, idx) => (
        <ColumnHeaderCoulmn key={idx} {...column}></ColumnHeaderCoulmn>
      ))}
    </StyleGridContainer>
  );
};

const ColumnHeaderCoulmn = ({ field, headerName, headerType, editable, disabled }) => {
  return (
    <div className={gridStyle["grid-header-column"]}>
      <div className={gridStyle["grid-header-columnName"]}>
        <span>{headerName}</span>
      </div>
      <div className={gridStyle["grid-header-columnSvg"]}>
        {/* <svg></svg> */}
        <span>|</span>
      </div>
    </div>
  );
};

const GridDataContainer = ({ columnInfo, rowData, gridInlineStyle }) => {
  const options = {
    visibleCount: 5,
  };

  const [selected, setSelected] = useState(-1);
  const onSelected = (index) => {
    setSelected(index != null ? index : -1);
  };

  console.log("render GridDataContainer");
  return (
    <ScrollBox itemCount={rowData.length} options={options}>
      {rowData
        ? rowData.map((coulmnData, idx) => (
            <GridDataRow key={idx} index={idx} columns={columnInfo} data={coulmnData} gridInlineStyle={gridInlineStyle} onSelected={onSelected} selected={selected}></GridDataRow>
          ))
        : null}
    </ScrollBox>
  );
};

const GridDataRow = ({ index, columns, data, gridInlineStyle, onSelected, selected, onEvent }) => {
  console.log(`render GridDataRow${index} selected ${selected}`);

  const onClick = () => {
    if (selected != index) onSelected(index);
  };

  return (
    <StyleGridContainer onClick={onClick} aria-rowindex={index} className={`${gridStyle["grid-data-row"]} ${selected == index ? gridStyle["grid-data-row-selected"] : ""}`} {...gridInlineStyle}>
      {columns ? columns.map((columnInfo, idx) => <GridDataColumn key={idx} columnInfo={columnInfo} value={data[columnInfo.field]} rowData={data}></GridDataColumn>) : null}
    </StyleGridContainer>
  );
};

/**
 * 음 기본적으로 필요한 놈들을 생각해봅니다.
 * 컴포넌트의 경우 rowData와 event가 필요하겠지..
 * @param {*} param0
 * @returns
 */
const GridDataColumn = ({ columnInfo, value, rowData }) => {
  const { field, type, editable, disabled = false, onChange, readOnly, Component } = columnInfo;
  let comp;

  switch (type) {
    case "input":
      comp = <StyleInput></StyleInput>;
      break;
    case "component":
      comp = <Component rowData={rowData} value={value} columnInfo={columnInfo}></Component>;
      break;
    default:
      comp = value;
      break;
  }
  return <div className={gridStyle["grid-data-column"]}>{comp}</div>;
};

/*
 * =================================================================================
 * style-components
 * =================================================================================
 */
const StyleGridContainer = styled.div`
  grid-template-columns: ${({ width }) => {
    return width || "auto";
  }};
`;
const StyleDataContainer = styled.div`
  overflow: auto;
  height: ${({ height }) => (!isNaN(height) ? `${height}px` : height)};
`;
const StyleOverflowDiv = styled.div`
  height: ${({ height }) => `${height}px`};
`;
const StyleInput = styled.input`
  width: 100%;
  border: 1px solid rgba(224, 224, 224, 1);
  border-radius: 4px;
  height: 30px;
`;
//==================================================================================

/**
 * Grid Context
 */

const GridContext = createContext();

const ContextStore = {};
export const GridContextProvider = ({ children, ...data }) => {
  return <GridContext.Provider value={data}>{children}</GridContext.Provider>;
};

const GridContextStore = () => useContext(GridContext).data;

export default MyGrid;
