import React, { memo, useCallback, useState } from "react";
import RadioComp from "../Component/BasicComponent/RadioComp";
import { StyleDiv } from "../Component/StyleComp/StyleComp";
import { useGridComponent } from "../Component/TestComp/GridComp3";
import { useGetFetch } from "../Hook/useFetch";
import { formatSizeUnits } from "../utils/commonUtils";
import { FileDownload } from "./FileDownload";
import { FileUpload } from "./Fileupload";
import { ReactComponent as Delete } from "../svg/delete.svg";

const FileMgm = () => {
  const [select, setSelect] = useState("0");
  const onChange = useCallback((orgVal, newVal) => {
    setSelect(newVal);
  });

  const data = [
    { id: "fileMgm", value: 0, name: "파일관리", checked: true },
    { id: "fileDownload", value: 1, name: "파일다운로드" },
    { id: "fileUpload", value: 2, name: "파일업로드" },
  ];

  let Comp;
  switch (select) {
    case "1":
      Comp = <FileDownload />;
      break;
    case "2":
      Comp = <FileUpload />;
      break;
    default:
      Comp = <FileMgmComp />;
      break;
  }

  return (
    <StyleDiv inStyle={{ color: "white" }}>
      <h2>테스트 페이지 입니다.</h2>
      <hr style={{ margin: "10px 0px" }}></hr>
      <RadioComp name="file" data={data} onChange={onChange} />
      {Comp}
    </StyleDiv>
  );
};

const FileMgmComp = () => {
  const GridInfo = {
    Row: {
      height: 40,
    },
    Column: [
      { id: "rowIndex", name: "번호", width: "5%", textAlign: "center" },
      { id: "fileFullName", name: "파일이름", width: "60%" },
      { id: "fileByte", name: "파일크기", width: "10%" },
      { id: "fileOther", name: "삭제", width: "20%", textAlign: "center" },
      { id: "check", width: "5%", textAlign: "center", defaultValue: "0" },
    ],
    HeaderInfo: {
      Row: { css: { backgroundColor: "#f0f0f0", borderBottom: "1px solid black", color: "#000", letterSpacing: "2px", fontSize: "14px", fontWeight: "700" } },
      Column: [
        { id: "rowIndex" },
        { id: "fileFullName", textAlign: "center" },
        { id: "fileByte", textAlign: "center" },
        { id: "check", component: CheckAllBox, css: { "& .grid-header-column-name": { width: "100%", height: "100%" } } },
      ], //Delete
    },
    DataInfo: {
      css: {
        backgroundColor: "#f0f0f0",
        color: "#000",
      },
      Row: {
        select: "#3060d9",
        css: { "&:hover": { backgroundColor: "#6060d9" } },
      },
      Column: [
        { id: "rowIndex", textAlign: "center", formmater: (val) => val + 1 },
        {
          id: "fileFullName",
          css: { cursor: "pointer" },
        },
        { id: "fileByte", textAlign: "right", formmater: formatSizeUnits },
        { id: "fileOther", component: DeleteWarpper },
        { id: "fileTransYn" },
        { id: "check", component: CheckBox, event: { onClick: fileCheckBoxClick } },
      ],
      Scroll: { visibleCount: 10 },
    },
  };

  const [files, setFiles] = useGetFetch("/api/getFileList", { param: { page: 1, pageCount: 999 } });
  const { rowAction, gridComponent } = useGridComponent(files, GridInfo);

  return (
    <div>
      <h2>파일 관리자</h2>
      <div>{gridComponent}</div>
    </div>
  );
};

const DeleteWarpper = ({ id, data, rowData, rowAction, rowIdx, colIdx, event }) => {
  return <Delete width="20px" height="20px" fill="white" cursor="pointer" />;
};

const fileCheckBoxClick = (event, { id, data, rowIdx, rowAction }) => {
  event.stopPropagation();
  rowAction.setColumnData(rowIdx, { check: data == null || data == "0" ? "1" : "0" });
};
// 전체선택시
const CheckAllBox = memo(({ id, data, rowAction }) => {
  // 리액트 기본적
  const [select, setSelect] = useState(false);
  const onClick = (e) => {
    setSelect((value) => !value);
  };
  const onChange = (e) => {
    const result = rowAction.getRowAllData().map((item) => ({ ...item, check: e.target.checked ? "1" : "0" }));
    rowAction.setRowAllData(result);
  };
  return <input style={{ width: "100%", height: "100%" }} type="checkbox" name={id} onClick={onClick} onChange={onChange} checked={select} />;
});

const CheckBox = memo(({ id, data, rowData, rowAction, rowIdx, colIdx, event }) => {
  // 리액트 기본적
  // console.log("render checkbox %s %s %s %o", data, id, rowIdx, rowData);
  const onChange = (e) => {
    rowAction.setColumnData(rowIdx, { check: e.target.checked ? "1" : "0" });
  };
  return <input {...event} style={{ width: "100%", height: "100%" }} type="checkbox" name={id} onChange={onChange} checked={data == "1" ? true : false} />;
});
export default FileMgm;
