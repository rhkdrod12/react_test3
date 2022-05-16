import React from "react";
import "./DefaultCss.css";
import gridStyle from "./gridStyle.module.css";
import styeld from "styled-components";
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
    },
    {
      field: "age",
      headerName: "나이",
      type: "number",
      width: "auto",
      // editable: true,
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

  console.log(columns2);

  // 컨테이너 범위지정
  const width = columns.map(({ width }) => (!isNaN(width) ? width + "px" : width)).join(" ");

  const gridInStyle = {
    width: width,
  };

  return (
    <div style={style} className={gridStyle["grid-root"]}>
      <GridHeaderContainer columns={columns2} gridInStyle={gridInStyle}></GridHeaderContainer>
      <GridDataContainer columns={columns2} data={rows} gridInStyle={gridInStyle}></GridDataContainer>
    </div>
  );
};

const StyleGridWidth = styeld.div`
  grid-template-columns: ${(props) => props.width || "auto"}
`;

const GridHeaderContainer = ({ columns, gridInStyle }) => {
  console.log("테스트");

  return (
    <StyleGridWidth {...gridInStyle} className={gridStyle["grid-header-container"]}>
      {/* <StyledGridHeaderContainer width={width}> */}
      {columns.map((column, idx) => (
        <ColumnHeaderCoulmn key={idx} {...column}></ColumnHeaderCoulmn>
      ))}
    </StyleGridWidth>
  );
};

const ColumnHeaderCoulmn = (props) => {
  const { field, headerName, headerType, columnType, width, editable, disabled } = props;
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

const GridDataContainer = ({ columns, data, gridInStyle }) => {
  const [scrollTop, ref] = useScroll();
  const itemCount = data.length;
  const itemHegiht = 50;
  const totalHeight = 50 * itemCount;
  const containerHeight = 500;

  const startIdx = Math.max(Math.floor(scrollTop / itemHegiht), 0);
  const visibleCount = Math.floor(containerHeight / itemHegiht);
  const offsetY = startIdx * itemHegiht;

  return (
    <div className={gridStyle["grid-data-container"]} ref={ref} style={{ height: { totalHeight } }}>
      {data ? data.map((coulmnData, idx) => <GridDataColumn key={idx} columns={columns} data={coulmnData} gridInStyle={gridInStyle}></GridDataColumn>) : null}
    </div>
  );
};
const GridDataColumn = ({ columns, data, gridInStyle }) => {
  return (
    <StyleGridWidth className={gridStyle["grid-data-row"]} {...gridInStyle}>
      {columns ? columns.map((coulmnSettings, idx) => <ColumnBox key={idx} setting={coulmnSettings} value={data[coulmnSettings.field]}></ColumnBox>) : null}
    </StyleGridWidth>
  );
};
const ColumnBox = ({ setting, value }) => {
  const { type } = setting;

  return <div>{value}</div>;
};

export default MyGrid;
