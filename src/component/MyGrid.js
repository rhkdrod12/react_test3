import React, { createContext, useContext } from "react";
import "./DefaultCss.css";
import gridStyle from "./gridStyle.module.css";
import styled from "styled-components";

import TextField from "@mui/material/TextField";
import ScrollBox from "./BasicComponent/ScrollBox";

const Btn = ({ columnInfo, rowData, value }) => {
  const onClick = () => {
    console.log("클릭!");
    console.log("이동디오: ", value);
    console.log(rowData);
  };

  const { name } = columnInfo;

  return <button onClick={onClick}>{name}</button>;
};

const MyGrid = ({ columns, style }) => {
  columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "성",
      width: 200,
      // editable: true,
    },
    {
      field: "lastName",
      headerName: "이름",
      width: 200,
      // editable: true,
      // disabled: true,
    },
    {
      field: "age",
      headerName: "나이",
      type: "number",
      // width: "auto",
      // editable: true,
    },
    {
      field: "url",
      headerName: "상세내용",
      type: "component",
      Component: Btn,
      name: "이동하겠다",
      width: 300,
    },
  ];

  const rows = [
    // { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    // { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    // { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    // { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    // { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    // { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    // { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    // { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    // { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
    // { id: 10, lastName: "Roxie", firstName: "Harvey", age: 65 },
    // { id: 11, lastName: "Roxie", firstName: "Harvey", age: 65 },
    // { id: 12, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  for (var i = 0; i <= 5000; i++) {
    rows.push({ id: i, lastName: "길동" + i, firstName: `홍${i}`, age: i, url: "/nan/" + i });
  }

  // 컨테이너 범위지정
  const width = columns
    .map(({ width }, idx) => {
      if (idx == columns.length - 1) {
        return "auto";
      } else if (width == null) {
        return "1fr";
      } else if (isNaN(width)) {
        return width;
      } else {
        return width + "px";
      }
    })
    .join(" ");

  const gridInlineStyle = {
    width: width,
  };

  /**
   * [Option 정의]
   * GridOption: 그리드의 전체적인 부분에 관한 옵션
   * HeaderOtpion : Header 관련 옵션
   * DataOption : Content 부분에 관한 옵션
   * FooterOption : footer 부분 옵션
   */
  const gridOption = { columnInfo: columns };
  const dataOption = {};
  const headerOption = {};
  const footerOption = {};

  return (
    <GridContextProvider data={{ GridOption: gridOption, DataOption: dataOption, HeaderOption: headerOption, FooterOption: footerOption, RowData: rows }}>
      <div style={style} className={gridStyle["grid-root"]}>
        <GridHeaderContainer columns={gridOption.columnInfo} gridInlineStyle={gridInlineStyle}></GridHeaderContainer>
        <GridDataContainer columns={gridOption.columnInfo} rowData={rows} gridInlineStyle={gridInlineStyle}></GridDataContainer>
      </div>
    </GridContextProvider>
  );
};

const GridHeaderContainer = ({ columns, gridInlineStyle }) => {
  return (
    <StyleGridContainer {...gridInlineStyle} className={gridStyle["grid-header-container"]}>
      {columns.map((column, idx) => (
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

const GridDataContainer = ({ columns, rowData, gridInlineStyle }) => {
  const options = {
    visibleCount: 5,
  };

  const value = useContext(GridContext);

  console.log("발류~:");
  console.log(value);
  return (
    <ScrollBox itemCount={rowData.length} options={options}>
      {rowData ? rowData.map((coulmnData, idx) => <GridDataRow key={idx} columns={columns} data={coulmnData} gridInlineStyle={gridInlineStyle}></GridDataRow>) : null}
    </ScrollBox>
  );
};

const GridDataRow = ({ key, columns, data, gridInlineStyle }) => {
  const [select, onSelect] = React.useState(false);
  const onClick = (event) => {
    console.log(event);
    onSelect((flag) => !flag);
  };
  // 여기에 부여하는 방식은 안된다는거네? 해당 열을 선택했다는 정보를 어디에 저장하고 있어야한다는건데
  // 어차피 모든 곳에 다 부여하는건 아니니. 상관은 없을거 같긴한데..
  return (
    <StyleGridContainer onClick={onClick} className={`${gridStyle["grid-data-row"]} ${select ? gridStyle["grid-data-row-selected"] : ""}`} {...gridInlineStyle}>
      {columns ? columns.map((coulmnSettings, idx) => <GridDataColumn key={idx} columnInfo={coulmnSettings} rowData={data} value={data[coulmnSettings.field]}></GridDataColumn>) : null}
    </StyleGridContainer>
  );
};

/**
 * 음 기본적으로 필요한 놈들을 생각해봅니다.
 * @param {*} param0
 * @returns
 */
const GridDataColumn = React.memo(({ columnInfo, rowData, value }) => {
  const { field, type, editable, disabled = false, onChange, readOnly, Component } = columnInfo;
  let comp;
  switch (type) {
    case "input":
      comp = <StyleInput></StyleInput>;
      break;
    case "component":
      comp = <Component columnInfo={columnInfo} rowData={rowData} value={value}></Component>;
      break;
    default:
      comp = value;
      break;
  }
  return <div className={gridStyle["grid-data-column"]}>{comp}</div>;
});

/*
 * =================================================================================
 * style-components
 * =================================================================================
 */
const StyleGridContainer = styled.div.attrs({ "data-ho": "테스트" })`
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

const GridContextProvider = ({ children, data }) => {
  return <GridContext.Provider value={data}>{children}</GridContext.Provider>;
};

export default MyGrid;
