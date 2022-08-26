import React, { useCallback, useRef } from "react";
import btnClass from "./Btn.module.css";
import { StyleDiv, StyleLi, StyleUl } from "../Component/StyleComp/StyleComp";
import { useState } from "react";
import { makeFileInfo } from "../utils/commonUtils";
import { fileRxjsUpload, postFetch, rxJsPost } from "../Hook/useFetch";
import { catchError, from, map, mergeMap, Observable, of, retry, toArray } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { memo } from "react";
import axios from "axios";
import { ReactComponent as Cancel } from "../svg/cancel.svg";
import { ReactComponent as Delete } from "../svg/delete.svg";

const Main = () => {
  return (
    <StyleDiv inStyle={{ color: "white" }}>
      <h2>테스트 페이지 입니다.</h2>
      <hr style={{ margin: "10px 0px" }}></hr>
      <FIleSendComp></FIleSendComp>
    </StyleDiv>
  );
};

const FIleSendComp = () => {
  const [fileData, setFileData] = useState([]);

  const fileRef = useRef();
  const onFileAddClick = () => {
    fileRef.current.click();
  };

  // 파일 추가
  const addFile = useCallback((files) => {
    setFileData((saveFiles) => {
      let tempIndex = saveFiles.length;
      const tempSave = [];
      for (const file of files) {
        if (file.type != "" && !saveFiles.find((item) => item.fileFullName == file.name)) {
          const fileInfo = makeFileInfo(file);
          fileInfo.fileIndex = tempIndex++;
          tempSave.push(fileInfo);
        }
      }
      // 새롭게 변경된 경우에만 새롭게 배열을 배열을 만들어 화면 갱신을 유도함
      if (tempSave.length > 0) {
        return [...saveFiles, ...tempSave];
      } else {
        return saveFiles;
      }
    });
  });

  const onFileChange = useCallback(({ target: { files } }) => {
    addFile(files);
  }, []);
  /**
   * fileTransYn : 0 -> 전송대기
   * fileTransYn : 1 -> 전송중
   * fileTransYn : 2 -> 전송완료
   * fileTransYn : 3 -> 전송실패
   * fileTransYn : 4 -> 전송취소
   */
  const onFileUpload = useCallback(() => {
    setFileData((saveFiles) => {
      if (saveFiles.length > 0) {
        console.log("파일 업로드 실행");
        from(saveFiles)
          .pipe(
            mergeMap((file) => {
              return of(file).pipe(
                // 파일 등록 여부 확인
                mergeMap((file) => rxJsPost("/api/exist", { fileName: file.fileName, fileExt: file.fileExt }).pipe(map((res, index) => res.data))),
                // 등록된 파일이 아니면 전송 실행
                mergeMap((res) => {
                  // 전송할 수 없는 파일
                  if (!res.result) {
                    console.log(res.resultMessage);
                    return of(res);
                  }
                  // 전송 시작
                  else {
                    return fileRxjsUpload("/api/upload", file, (process) => {
                      const percent = ((process.loaded * 100) / process.total).toFixed(2);
                      setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...file, fileTransYn: 1, fileTransPer: percent } : item)));
                    }).pipe(
                      catchError((error, caught) => {
                        if (error.code && error.code == "ERR_CANCELED") {
                          return of({ result: false, resultCode: "EF1002", resultMessage: "취소요청" });
                        }
                        const {
                          response: { status },
                          response: { data },
                        } = error;
                        if (status != 400) {
                          throw error.response.data;
                        }
                        return of(data);
                      }),
                      retry(1)
                    );
                  }
                }),
                tap((res) => {
                  if (!res.result) {
                    if (res.resultCode == "EF1002") {
                      setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...file, fileTransYn: 4 } : item)));
                    } else {
                      setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...file, fileTransYn: 3 } : item)));
                    }
                  } else {
                    setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...file, fileTransYn: 2 } : item)));
                  }
                }),
                catchError((error, caught) => {
                  console.log("여기");
                  setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...file, fileTransYn: 5 } : item)));
                  return of(false);
                })
              );
            }),

            toArray()
          )
          .subscribe({
            next: (next) => console.log("다음~~ %o", next),
            error: (error) => console.log("에러@@ %o", error),
            complete: () => {
              console.log("완료~!! %o");
            },
          });
      }
      return saveFiles;
    });
  });

  // 드래그를 통한 파일 삽입용
  const onDrop = (event) => {
    event.preventDefault();
    const {
      dataTransfer: { files = [] },
    } = event;
    addFile(files);
  };
  // 기본 이벤트 막야아함 -> 아니면 복사실행함
  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onFileAllDelete = () => {
    setFileData((files) => []);
  };

  console.log(fileData);

  return (
    <div>
      <input onChange={onFileChange} type="file" ref={fileRef} name="uploadFile" id="uploadFile" multiple style={{ display: "none" }}></input>
      <Button name="파일추가" onClick={onFileAddClick}></Button>
      <Button name="파일업로드" onClick={onFileUpload}></Button>
      <Button name="전체삭제" onClick={onFileAllDelete}></Button>
      <StyleDiv inStyle={{ padding: 10 }}>
        <h3>파일 목록</h3>

        <StyleDiv inStyle={{ width: "100%", height: "500px", border: "1px solid white", padding: 10, background: "#000000" }} onDragOver={onDragOver} onDrop={onDrop}>
          <StyleDiv inStyle={{ width: "100%", height: 30, padding: "5px 0px", display: "grid", gridAutoFlow: "column", gridColumnGap: "3%", gridTemplateColumns: "5% 50% 10% 10% 10%" }}>
            <StyleDiv inStyle={{ justifySelf: "center" }}>순번</StyleDiv>
            <StyleDiv inStyle={{ justifySelf: "center" }}>파일명</StyleDiv>
            <StyleDiv inStyle={{ justifySelf: "center" }}>용량</StyleDiv>
            <StyleDiv inStyle={{ justifySelf: "center" }}>진행</StyleDiv>
            <StyleDiv inStyle={{ justifySelf: "center" }}>취소/삭제</StyleDiv>
          </StyleDiv>
          <hr></hr>
          <StyleUl inStyle={{ width: "100%", height: "calc(100% - 30px)", overflow: "hidden" }}>
            {fileData.map((item, idx) => {
              return <FileLi key={idx} index={idx} fileData={item} setFileData={setFileData} />;
            })}
          </StyleUl>
        </StyleDiv>
      </StyleDiv>
    </div>
  );
};
// 독립적으로 이벤트들을 걸어서 하나로 모은다음에 처리하는게 맞으려나..
// 음 파일이 추가되면 cancleToken 까지 넣는게 맞을거 같은데..
const FileLi = memo(({ index, fileData, setFileData }) => {
  console.log(fileData);

  const onCancleClick = (event) => {
    fileData.axiosSource.cancel();
    setFileData((files) => files.map((item) => (item.fileIndex == fileData.fileIndex ? { ...item, fileTransYn: 4 } : item)));
    console.log("취소 요청");
  };

  const onDeleteClick = (event) => {
    setFileData((files) => files.filter((item) => item.fileIndex !== fileData.fileIndex));
    console.log("삭제 요청");
  };

  let comp;
  switch (fileData.fileTransYn) {
    case 0:
      comp = <StyleDiv>전송대기</StyleDiv>;
      break;
    case 1:
      comp = <ProgressBar percent={fileData.fileTransPer} />;
      break;
    case 2:
      comp = <StyleDiv>전송완료</StyleDiv>;
      break;
    case 3:
      comp = <StyleDiv>전송실패</StyleDiv>;
      break;
    case 4:
      comp = <StyleDiv>전송취소</StyleDiv>;
      break;
    default:
      comp = <StyleDiv>전송오류</StyleDiv>;
      break;
  }

  return (
    <StyleLi inStyle={{ display: "grid", gridAutoFlow: "column", gridColumnGap: "3%", gridTemplateColumns: "5% 50% 10% 10% 10%", padding: "5px 0px", alignItems: "center" }}>
      <StyleDiv inStyle={{ justifySelf: "center" }}>{index + 1}</StyleDiv>
      <StyleDiv inStyle={{ justifySelf: "left" }}>{fileData.fileFullName}</StyleDiv>
      <StyleDiv inStyle={{ justifySelf: "right" }}>{formatSizeUnits(fileData.fileByte)}</StyleDiv>
      <StyleDiv inStyle={{ justifySelf: "center", textAlign: "center", width: "100%", height: "100%", padding: "5px 0px" }}>{comp}</StyleDiv>
      <StyleDiv inStyle={{ justifySelf: "center" }}>
        {fileData.fileTransYn == 1 ? (
          <Cancel width="20px" height="20px" fill="white" cursor="pointer" onClick={onCancleClick} />
        ) : (
          <Delete width="20px" height="20px" fill="white" cursor="pointer" onClick={onDeleteClick} />
        )}
      </StyleDiv>
    </StyleLi>
  );
});

function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(2) + " GB";
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes > 1) {
    bytes = bytes + " bytes";
  } else if (bytes == 1) {
    bytes = bytes + " byte";
  } else {
    bytes = "0 bytes";
  }
  return bytes;
}

const ProgressBar = ({ percent = 0 }) => {
  return (
    <StyleDiv inStyle={{ position: "relative", width: "100%", height: "100%", background: "white" }}>
      <StyleDiv
        inStyle={{ position: "absolute", background: "#6d93ff", textAlign: "center", width: percent + "%", height: "100%", left: 0, top: 0, zIndex: "1", transition: "all 0.1s ease-in" }}
      ></StyleDiv>
      <StyleDiv inStyle={{ position: "relative", color: "black", textAlign: "center", zIndex: "2" }}>{percent == 0 ? "전송대기" : percent + "%"}</StyleDiv>
    </StyleDiv>
  );
};

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
