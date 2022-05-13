import React from "react";
import "./DefaultCss.css";
import gridStyle from "./gridStyle.module.css";

const MyGrid = ({ columns, rootStyle }) => {
  const columns2 = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "성",
      width: 150,
      // editable: true,
    },
    {
      field: "lastName",
      headerName: "이름",
      width: 150,
      // editable: true,
    },
    {
      field: "age",
      headerName: "나이",
      type: "number",
      width: 110,
      // editable: true,
    },
  ];

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
  ];

  console.log(columns2);
  return (
    <div style={rootStyle} className={gridStyle["grid-root"]}>
      <GridHeaderContainer columns={columns2}></GridHeaderContainer>
      <GridDataContainer columns={columns2} data={rows}></GridDataContainer>
    </div>
  );
};

const GridHeaderContainer = ({ columns }) => {
  return (
    <div className={gridStyle["grid-header-container"]}>
      {columns.map((column, idx) => (
        <ColumnHeaderCoulmn key={idx} {...column}></ColumnHeaderCoulmn>
      ))}
    </div>
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

const GridDataContainer = ({ columns, data }) => {
  return <div className={gridStyle["grid-data-container"]}>{data ? data.map((coulmnData, idx) => <GridDataColumn key={idx} columns={columns} data={coulmnData}></GridDataColumn>) : null}</div>;
};
const GridDataColumn = ({ columns, data }) => {
  return (
    <div className={gridStyle["grid-data-row"]}>
      {columns ? columns.map((coulmnSettings, idx) => <ColumnBox key={idx} setting={coulmnSettings} value={data[coulmnSettings.field]}></ColumnBox>) : null}
    </div>
  );
};
const ColumnBox = ({ setting, value }) => {
  const { type } = setting;

  return <div>{value}</div>;
};

export default MyGrid;
