import React, { useState } from "react";
import { useGetFetch } from "../../Hook/useFetch";
import { MyGrid } from "../MyGrid2";
import GridComp from "./GridComp";

const MenuGrid = () => {
  // 헤더 설정
  const HeaderInfo = [
    { field: "menuId", headerName: "ID", width: 200 },
    { field: "type", headerName: "TYPE", width: 200 },
    { field: "category", headerName: "카테고리", width: 200 },
    { field: "name", headerName: "이름", width: 300 },
    { field: "upperMenu", headerName: "상위메뉴", width: 300 },
    { field: "menuDepth", headerName: "메뉴 깊이", width: 300 },
    { field: "menuOrder", headerName: "메뉴순서", width: 300 },
  ];

  // const ColumnInfo = [{ field: "menuId" }, { field: "type" }, { field: "category" }, { field: "name" }, { field: "upperMenu" }, { field: "menuDepth" }, { field: "menuOrder" }];
  // 컬럼 설정
  const ColumnInfo = HeaderInfo.map(({ field }) => ({ field }));

  const [menus] = useGetFetch("/menu/get", { param: { menuType: "HEADER" } });
  return <GridComp GridInfo={{ HeaderInfo, ColumnInfo }} RowData={menus}></GridComp>;
};

const MenuInput = ({ columnInfo, value: Value, rowData, setRowData, setComponent, orgComponent }) => {
  console.log(setComponent);
  const [value, setValue] = useState(Value);
  const onChange = (e) => setValue(e.target.value);
  const onBlur = (e) => {
    // 값 변경
    // setRowData((rowAllData) => rowAllData.map((item) => (item["@id"] === rowData["@id"] ? { ...item, [columnInfo.name]: value } : item)));
    setComponent(orgComponent);
  };
  return <input value={value} onChange={onChange} onBlur={onBlur}></input>;
  // return <div></div>;
};

export default MenuGrid;
