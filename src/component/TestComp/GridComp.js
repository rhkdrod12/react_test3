import React, { useState } from "react";
import { findFieldAndSetObjectValue } from "../../utils/commonUtils";
import { ContextProvider, createMutilContext } from "../BasicComponent/ContextProvider";
import { StyleDiv } from "../StyleComp/StyleComp";
import "./GridComp.css";

const GridContextStore = createMutilContext(["RowData", "setRowInfo", "HeaderInfo", "setHeaderInfo", "RowInfo", "setRowInfo", "ColumnInfo", "setColumnInfo"]);
const GridComp = ({ RowData: rowData = [], GridInfo: gridInfo = {} }) => {
  console.log("render GridComp");

  const { HeaderInfo: headerInfo = {}, RowInfo: rowInfo = {}, ColumnInfo: columnInfo = {} } = gridInfo;

  makeGridParam(gridInfo);

  const [RowData, setRowData] = useState(rowData);
  const [HeaderInfo, setHeaderInfo] = useState(headerInfo);
  const [RowInfo, setRowInfo] = useState(rowInfo);
  const [ColumnInfo, setColumnInfo] = useState(columnInfo);

  return (
    <div className="grid-root">
      <ContextProvider ContextStore={GridContextStore} Data={{ RowData, setRowData, HeaderInfo, setHeaderInfo, RowInfo, setRowInfo, ColumnInfo, setColumnInfo }}>
        <GridHeader HeaderInfo={gridInfo.HeaderInfo}></GridHeader>
      </ContextProvider>
    </div>
  );
};

const GridHeader = ({ HeaderInfo: headerInfo }) => {
  const [HeaderInfo, setHeaderInfo] = useState(headerInfo);

  return (
    <div className="grid-header-container">
      {HeaderInfo.map((header, idx) => {
        return <GridHeaderColumn key={idx} header={header} />;
      })}
    </div>
  );
};

const GridHeaderColumn = ({ header }) => {
  return (
    <StyleDiv inStyle={{ width: header.width }} className="grid-header-column">
      <div>{header.headerName}</div>
      <div className="grid-header-column-svg">|</div>
    </StyleDiv>
  );
};

const makeGridParam = (gridInfo) => {
  const { HeaderInfo, RowInfo, ColumnInfo, FooterInfo } = gridInfo;

  HeaderInfo.map((header) => findFieldAndSetObjectValue({ field: header.field }, { width: header.width }, ColumnInfo));
};

export default GridComp;
