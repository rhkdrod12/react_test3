import React, { useState } from "react";
import { useGetFetch } from "../../Hook/useFetch";
import { MyGrid } from "../MyGrid2";
import GridComp from "./GridComp2";

const MenuGrid = () => {
  const GridInfo = {
    Row: {
      height: 50,
    },

    Column: [
      { field: "menuId", name: "ID", width: "10%" },
      { field: "type", name: "TYPE", width: "10%" },
      { field: "category", name: "카테고리", width: "10%" },
      { field: "name", name: "이름", width: "10%" },
      { field: "upperMenu", name: "상위메뉴", width: "10%" },
      { field: "menuDepth", name: "메뉴 깊이", width: "10%" },
      { field: "menuOrder", name: "메뉴순서", event: {} },
    ],
    HeaderInfo: {
      Row: {},
      Column: [{ field: "menuId" }, { field: "menuOrder" }],
    },
    DataInfo: {
      Row: {},
      Column: [],
    },
    FooterInfo: {
      Row: {},
      Column: [],
    },
  };

  // 컬럼 설정
  const ColumnInfo = [{ field: "menuId" }, { field: "type" }, { field: "category" }, { field: "name" }, { field: "upperMenu" }, { field: "menuDepth" }, { field: "menuOrder" }];

  const [menus] = useGetFetch("/menu/get", { param: { menuType: "HEADER" } });
  return <GridComp GridInfo={GridInfo} Data={menus}></GridComp>;
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
