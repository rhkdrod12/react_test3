import React, { useCallback, useEffect, useRef } from "react";
import btnClass from "./Btn.module.css";
import { StyleDiv, StyleLi, StyleUl } from "../Component/StyleComp/StyleComp";
import { useState } from "react";
import { formatSizeUnits, makeFileInfo } from "../utils/commonUtils";
import { fileDownload, fileDownload2, fileRxjsUpload, postFetch, rxJsPost, useGetFetch } from "../Hook/useFetch";
import { catchError, from, map, mergeMap, Observable, of, retry, throwError, toArray } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { memo } from "react";
import axios from "axios";
import { ReactComponent as Cancel } from "../svg/cancel.svg";
import { ReactComponent as Delete } from "../svg/delete.svg";
import { COM_MESSAGE } from "../utils/commonMessage";
import { FileUpload } from "./FileDownload";
import RadioComp from "../Component/BasicComponent/RadioComp";
import { MyGrid } from "../Component/MyGrid2";
import GridComp from "../Component/TestComp/GridComp2";

const Main = () => {
  const [select, setSelect] = useState("0");
  const onChange = useCallback((orgVal, newVal) => {
    setSelect(newVal);
  });

  const data = [
    { id: "fileDownload", value: 0, name: "파일다운로드", checked: true },
    { id: "fileUpload", value: 1, name: "파일업로드" },
  ];

  return (
    <StyleDiv inStyle={{ color: "white" }}>
      <h2>테스트 페이지 입니다.</h2>
      <hr style={{ margin: "10px 0px" }}></hr>
      <RadioComp name="file" data={data} onChange={onChange} />
      {select == "0" ? <FileDownload /> : <FileUpload />}
    </StyleDiv>
  );
};

const FileDownload = () => {
  const GridInfo = {
    Row: {
      height: 40,
    },
    Column: [
      { id: "fileIndex", name: "순서", width: "5%", textAlign: "center" },
      { id: "fileFullName", name: "파일이름", width: "50%" },
      { id: "fileByte", name: "파일크기", width: "10%" },
      { id: "fileTransPer", name: "진행", width: "10%", textAlign: "center" },
      { id: "fileOther", name: "비고", width: "20%", textAlign: "center" },
      { id: "check", width: "5%", textAlign: "center", component: CheckBox },
    ],
    HeaderInfo: {
      Row: { css: { backgroundColor: "black", borderBottom: "1px solid white" } },
      Column: [{ id: "fileIndex" }, { id: "fileFullName", textAlign: "center" }, { id: "fileByte", textAlign: "center" }, { id: "fileTransPer", textAlign: "center" }],
    },
    DataInfo: {
      Row: {
        event: {
          onClick: (event, { data, RowData, setRowAllData, rowIdx }) => {
            if (!data.fileTransYn) {
              const progress = (process) => {
                const percent = ((process.loaded * 100) / data.fileByte).toFixed(2);
                setRowAllData((itemList) => itemList.map((item) => (item.fileId == data.fileId ? { ...item, fileTransYn: 1, fileTransPer: percent } : item)));
              };
              fileDownload2("/api/download", { fileId: data.fileId }, progress)
                .then((result) => {
                  const test = RowData;
                  setRowAllData((itemList) => itemList.map((item) => (item.fileId == data.fileId ? { ...item, fileTransYn: 2 } : item)));
                })
                .catch((error) => {
                  setRowAllData((itemList) => itemList.map((item) => (item.fileId == data.fileId ? { ...item, fileTransYn: 3 } : item)));
                });
            }
          },
        },
        css: { "&:hover": { backgroundColor: "#6c6cd9" } },
      },
      Column: [
        { id: "fileFullName", css: { cursor: "pointer" } },
        { id: "fileByte", textAlign: "right", fommater: formatSizeUnits },
        { id: "fileTransYn" },
        { id: "fileTransPer", component: ProgressBarMgm },
      ],
      Scroll: { visibleCount: 10 },
    },
  };

  const [files, setFiles] = useGetFetch("/api/getFileList", { param: { page: 1, limit: 30 } });

  useEffect(() => {
    files.forEach((item, idx) => (item.fileIndex = idx + 1));
  }, [, files]);

  console.log(files);

  return (
    <div>
      <StyleDiv inStyle={{ padding: 10, minWidth: "820px" }}>
        <h3>파일 목록</h3>
        <StyleDiv inStyle={{ width: "100%", height: "460px", border: "1px solid white", padding: 10, background: "#000000", marginTop: 10 }}>
          <GridComp GridInfo={GridInfo} Data={files}></GridComp>
        </StyleDiv>
      </StyleDiv>
    </div>
  );
};

const CheckBox = ({ id, data, rowData, setRowData, Column, rowIdx, colIdx, columnEvent }) => {
  const onChange = (e) => {
    setRowData(rowIdx, { ...rowData, check: e.target.checked ? "1" : "0" });
  };

  return <input type="checkbox" name={id} value="1" onClick={(e) => e.stopPropagation()} onChange={onChange} checked={data == 1 ? true : false} />;
};

const ProgressBarMgm = memo(({ id, data, rowData, Column, rowIdx, colIdx, columnEvent }) => {
  let comp;
  switch (rowData?.fileTransYn ?? 0) {
    case 0:
      comp = <StyleDiv>대기</StyleDiv>;
      break;
    case 1:
      comp = <ProgressBar percent={data} />;
      break;
    case 2:
      comp = <ProgressBar percent={data} message="완료" />;
      break;
    case 3:
      comp = <ProgressBar percent={data} message="실패" state="red" />;
      break;
    case 4:
      comp = <StyleDiv>취소</StyleDiv>;
      break;
    case 5:
      comp = <StyleDiv>오류</StyleDiv>;
      break;
    default:
      comp = <StyleDiv>대기</StyleDiv>;
      break;
  }

  return comp;
});

const ProgressBar = memo(({ percent = 0, message, state = "transparent" }) => {
  return (
    <StyleDiv inStyle={{ position: "relative", width: "100%", height: "fit-content", background: "white", display: "grid", alignItems: "center" }}>
      <StyleDiv
        inStyle={{ position: "absolute", background: "#6d93ff", textAlign: "center", width: percent + "%", height: "100%", left: 0, top: 0, zIndex: "1", transition: "all 0.1s ease-in" }}
      ></StyleDiv>
      <StyleDiv inStyle={{ position: "relative", backgroundColor: state, color: "black", textAlign: "center", zIndex: "2", transition: "all 0.2s ease-in" }}>
        {message ? message : percent + "%"}
      </StyleDiv>
    </StyleDiv>
  );
});

const HrefComp = ({ children }) => {
  return (
    <React.Fragment>
      <a>{children}</a>
    </React.Fragment>
  );
};

export default Main;
