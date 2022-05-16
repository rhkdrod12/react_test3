import React from "react";
import "./DefaultCss.css";
import gridStyle from "./gridStyle.module.css";
import styled from "styled-components";
import useScroll from "../Hook/useScroll";

const MyGrid = ({ columns, rootStyle, style }) => {
  const columns2 = [
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
      field: "in",
      headerName: "입력",
      type: "input",
      // width: "auto",
      // editable: true,
      // disabled: true,
      // readOnly: true,
    },
  ];

  columns = columns2;

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
    { id: 10, lastName: "Roxie", firstName: "Harvey", age: 65 },
    { id: 11, lastName: "Roxie", firstName: "Harvey", age: 65 },
    { id: 12, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  for (var i = 13; i <= 5000; i++) {
    rows.push({ id: i, lastName: "길동" + i, firstName: `홍${i}`, age: i });
  }

  console.log(columns2);

  // 컨테이너 범위지정
  const width = columns
    .map(({ width }) => {
      if (width == null) {
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

  return (
    <div style={style} className={gridStyle["grid-root"]}>
      <GridHeaderContainer columns={columns2} gridInlineStyle={gridInlineStyle}></GridHeaderContainer>
      <GridDataContainer columns={columns2} rowData={rows} gridInlineStyle={gridInlineStyle}></GridDataContainer>
    </div>
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

  return (
    <GridScrollBox itemCount={rowData.length} options={options}>
      {rowData ? rowData.map((coulmnData, idx) => <GridDataColumn key={idx} columns={columns} data={coulmnData} gridInlineStyle={gridInlineStyle}></GridDataColumn>) : null}
    </GridScrollBox>
  );
};

/**
 * 가상 스크롤 컴포넌트
 * @param {children} 자식 컴포넌트 배열
 * @param {options}
 * options - 스크롤 옵션
 * 기본 열 높이 : itemHeight(defualt 50px)
 * 화면에 랜더링 개수 : visibleCount(defualt 5)
 * 미리 생성시킬 개수 : offsetCnt(defualt 1)
 * @returns
 */
const GridScrollBox = ({ children, options: { itemHeight = 50, visibleCount = 5, offsetCnt = 1 } = {} }) => {
  const [scrollTop, ref] = useScroll();

  const itemCount = children.length;
  // 최대 높이(스크롤의 길이)
  const totalHeight = itemHeight * itemCount;
  // 시작 idx
  const startIdx = Math.max(Math.floor(scrollTop / itemHeight), 0);

  // 화면 표현 높이
  const containerHeight = itemHeight * visibleCount;

  // 마지막 idx
  const endIdx = startIdx + visibleCount + offsetCnt;
  // 현재 표기해야할 스크롤 위치
  const offsetY = startIdx * itemHeight;

  return (
    <StyleDataContainer height={containerHeight} ref={ref}>
      <StyleOverflowDiv className={gridStyle["grid-data-container"]} height={totalHeight}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>{children.filter((item, idx) => idx >= startIdx && idx < endIdx)}</div>
      </StyleOverflowDiv>
    </StyleDataContainer>
  );
};

const GridDataColumn = ({ columns, data, gridInlineStyle }) => {
  return (
    <StyleGridContainer className={gridStyle["grid-data-row"]} {...gridInlineStyle}>
      {columns ? columns.map((coulmnSettings, idx) => <ColumnBox key={idx} setting={coulmnSettings} value={data[coulmnSettings.field]}></ColumnBox>) : null}
    </StyleGridContainer>
  );
};

const ColumnBox = ({ setting, value }) => {
  const { field, type, editable, disabled = false, onChange, readOnly } = setting;
  let comp;
  switch (type) {
    case "input":
      comp = <StyleInput value={value} onChange={onChange} disabled={disabled} readOnly={readOnly}></StyleInput>;
      break;
    default:
      comp = value;
      break;
  }
  return <div className={gridStyle["grid-data-column"]}>{comp}</div>;
};

export default MyGrid;
