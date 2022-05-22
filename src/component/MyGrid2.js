import React, { createContext, useContext, useState } from "react";
import "./DefaultCss.css";
import gridStyle from "../CssModule/gridStyle.module.css";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import ScrollBox from "./BasicComponent/ScrollBox";
import { defaultCssValue, makeCssObject } from "../utils/commonUtils";
import { ContextProvider, createMutilContext } from "./BasicComponent/ContextProvider";

const Btn = ({ rowData, columnInfo }) => {
  var { name, ...attr } = columnInfo;
  var value = rowData.url;
  console.log("render btn");
  var onClick = () => {
    console.log(`${value} 로 이동`);
  };
  return (
    <button style={{ width: "20%" }} onClick={onClick}>
      {name}
    </button>
  );
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

  const GridInfo = { columnInfo: columnInfo };

  return <MyGrid GridInfo={GridInfo} RowData={rows}></MyGrid>;
};

/**
 * ROW SELECT EVENT -> 로우에 rowEvent라는 항목을 만들어서 있는 rowContainer에 걸어주면 되겠지
 * COLUMN SELECT EVENT -> 이건 컴포넌트를 보내는 걸로 해결이 가능
 */
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
// 현재 컴포넌트 하위로 사용할 전역 컨텍스트 선언
const ContextStore = createMutilContext(["GridInfo", "RowData"]);
const MyGrid = ({ GridInfo = {}, RowData = [], Style }) => {
  const contextData = { GridInfo, RowData };
  return (
    <ContextProvider ContextStore={ContextStore} Data={contextData}>
      <DefaultContainer></DefaultContainer>
    </ContextProvider>
  );
};

const setDefaultOption = (GridInfo) => {
  // 데이터 컬럼, 헤더 컬럼 길이 지정
  GridInfo.rowWidth = GridInfo.columnInfo.map(({ width }) => defaultCssValue(width, "1fr")).join(" ");
};

const DefaultContainer = () => {
  const GridInfo = useContext(ContextStore.GridInfo);
  const RowData = useContext(ContextStore.RowData);

  setDefaultOption(GridInfo);

  return (
    <div className={gridStyle["grid-root"]}>
      <div className={gridStyle["grid-root-container"]}>
        <GridHeaderContainer GridInfo={GridInfo}></GridHeaderContainer>
        <GridDataContainer columnInfo={GridInfo.columnInfo} rowData={RowData}></GridDataContainer>
      </div>
    </div>
  );
};

const GridHeaderContainer = ({ GridInfo }) => {
  const columnInfo = GridInfo.columnInfo;
  console.log(columnInfo);
  return (
    <StyleContainer className={gridStyle["grid-header-container"]}>
      {GridInfo.columnInfo.map((column, idx) => (
        <ColumnHeaderCoulmn key={idx} {...column}></ColumnHeaderCoulmn>
      ))}
    </StyleContainer>
  );
};

const StyleContainer = styled.div`
  ${({ inStyle }) => makeCssObject(inStyle)}
`;

const ColumnHeaderCoulmn = ({ headerName, width, ...options }) => {
  const styleObj = { width: width };
  return (
    <StyleContainer inStyle={styleObj} className={gridStyle["grid-header-column"]}>
      <div className={gridStyle["grid-header-columnName"]}>
        <span>{headerName}</span>
      </div>
      <div className={gridStyle["grid-header-columnSvg"]}>
        {/* <svg></svg> */}
        <span>|</span>
      </div>
    </StyleContainer>
  );
};

const GridDataContainer = ({ columnInfo, rowData }) => {
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
      {rowData ? rowData.map((coulmnData, idx) => <GridDataRow key={idx} index={idx} columns={columnInfo} data={coulmnData} onSelected={onSelected} selected={selected}></GridDataRow>) : null}
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
      {columns
        ? columns.map((columnInfo, idx) => (
            <GridDataColumnContainer key={idx} width={columnInfo.width}>
              <GridDataColumn columnInfo={columnInfo} value={data[columnInfo.field]} rowData={data}></GridDataColumn>
            </GridDataColumnContainer>
          ))
        : null}
    </StyleGridContainer>
  );
};

const GridDataColumnContainer = ({ children, width }) => {
  const styleObj = { width: width };
  return (
    <StyleContainer inStyle={styleObj} className={`${gridStyle["grid-data-column-container"]}`}>
      {children}
    </StyleContainer>
  );
};

// /**
//  * 음 기본적으로 필요한 놈들을 생각해봅니다.
//  * 컴포넌트의 경우 rowData와 event가 필요하겠지..
//  * @param {*} param0
//  * @returns
//  */
const GridDataColumn = ({ columnInfo, value, rowData }) => {
  const { field, type, editable, disabled = false, onChange, readOnly, Component } = columnInfo;
  let comp;
  const styleObj = { height: columnInfo.height };

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

  console.log(columnInfo);
  return (
    <StyleContainer inStyle={styleObj} className={gridStyle["grid-data-column"]}>
      {comp}
    </StyleContainer>
  );
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

// /**
//  * Grid Context
//  */

// const GridContext = createContext();

// const ContextStore = {};
// export const GridContextProvider = ({ children, ...data }) => {
//   return <GridContext.Provider value={data}>{children}</GridContext.Provider>;
// };

// const GridContextStore = () => useContext(GridContext).data;

// export default MyGrid;
