import React, { memo, useCallback, useEffect, useState } from "react";
import RadioComp from "../Component/BasicComponent/RadioComp";
import { StyleDiv } from "../Component/StyleComp/StyleComp";
import GridComp, { useGridComponent } from "../Component/TestComp/GridComp3";
import { fileDownload2, useGetFetch } from "../Hook/useFetch";
import { formatSizeUnits } from "../utils/commonUtils";
import { FileUpload } from "./FileDownload";
import btnClass from "./Btn.module.css";
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
      { id: "fileIndex", name: "번호", width: "5%", textAlign: "center" },
      { id: "fileFullName", name: "파일이름", width: "50%" },
      { id: "fileByte", name: "파일크기", width: "10%" },
      { id: "fileTransPer", name: "진행", width: "10%", textAlign: "center", defaultValue: "0" },
      { id: "fileOther", name: "비고", width: "20%", textAlign: "center" },
      { id: "check", width: "5%", textAlign: "center", defaultValue: "0" },
    ],
    HeaderInfo: {
      Row: { css: { backgroundColor: "#f0f0f0", borderBottom: "1px solid black", color: "#000", letterSpacing: "2px" } },
      Column: [
        { id: "fileIndex" },
        { id: "fileFullName", textAlign: "center" },
        { id: "fileByte", textAlign: "center" },
        { id: "fileTransPer", textAlign: "center" },
        { id: "check", component: CheckAllBox, css: { "& .grid-header-column-name": { width: "100%", height: "100%" } } },
      ],
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
        {
          id: "fileFullName",
          css: { cursor: "pointer" },
          event: {
            onClick: fileDownloadEvent,
          },
        },
        { id: "fileByte", textAlign: "right", fommater: formatSizeUnits },
        { id: "fileTransYn" },
        { id: "fileTransPer", component: ProgressBarMgm },
        { id: "check", component: CheckBox, event: { onClick: fileCheckBoxClick } },
      ],
      Scroll: { visibleCount: 10 },
    },
  };

  const [files, setFiles] = useGetFetch("/api/getFileList", { param: { page: 1, pageCount: 100 } });

  useEffect(() => {
    files.forEach((item, idx) => (item.fileIndex = idx + 1));
  }, [, files]);

  console.log(files);

  const { rowAction, gridComponent } = useGridComponent(files, GridInfo);

  const fileAllDownload = (event) => {
    const resultData = rowAction
      .getRowAllData()
      .filter((val) => val.check == "1")
      .reduce(
        (acc, val) => {
          acc.rowIdx.push(val.fileIndex - 1);
          acc.fileId.push(val.fileId);
          acc.fileByte += val.fileByte;
          return acc;
        },
        { rowIdx: [], fileId: [], fileByte: 0 }
      );

    const progress = (process) => {
      const percent = ((process.loaded * 100) / resultData.fileByte).toFixed(2);
      rowAction.setIndexColumnData(resultData.rowIdx, { fileTransYn: 1, fileTransPer: percent });
    };

    fileDownload2("/api/multiDownload", { fileId: resultData.fileId }, progress)
      .then((result) => {
        rowAction.setIndexColumnData(resultData.rowIdx, { fileTransYn: 2, fileTransPer: 100 });
      })
      .catch((error) => {
        rowAction.setIndexColumnData(resultData.rowIdx, { fileTransYn: 3 });
      });
  };

  return (
    <div>
      <StyleDiv inStyle={{ padding: 10, minWidth: "820px", fontSize: "14px" }}>
        <h3>파일 목록({`총 파일수: ${files.length}`})</h3>
        <Button name="파일 다운로드" onClick={fileAllDownload} />
        <StyleDiv inStyle={{ width: "100%", height: "460px", border: "1px solid white", padding: 10, background: "#f0f0f0", marginTop: 10 }}>{gridComponent}</StyleDiv>
      </StyleDiv>
    </div>
  );
};

const fileDownloadEvent = (event, { id, rowIdx, rowAction }) => {
  const rowData = rowAction.getRowData(rowIdx);
  if (id != "check" && !rowData.fileTransYn) {
    const progress = (process) => {
      const percent = ((process.loaded * 100) / rowData.fileByte).toFixed(2);
      rowAction.setColumnData(rowIdx, { fileTransYn: 1, fileTransPer: percent });
    };
    fileDownload2("/api/download", { fileId: rowData.fileId }, progress)
      .then((result) => {
        rowAction.setColumnData(rowIdx, { fileTransYn: 2 });
      })
      .catch((error) => {
        rowAction.setColumnData(rowIdx, { fileTransYn: 3 });
      });
  }
};

const fileCheckBoxClick = (event, { id, data, rowIdx, rowAction }) => {
  const rowData = rowAction.getRowData(rowIdx);
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

const ProgressBarMgm = memo(({ id, data, rowData, Column, rowIdx, colIdx, event }) => {
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
const Button = ({ name, ...attr }) => {
  return (
    <div id="upload-btn" className={`${btnClass["btn-wrapper"]}`} {...attr}>
      <a className="button-wrap">
        <div>{name}</div>
      </a>
    </div>
  );
};

export default Main;
