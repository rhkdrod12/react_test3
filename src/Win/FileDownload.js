import React, { useCallback, useRef } from "react";
import btnClass from "./Btn.module.css";
import { StyleDiv, StyleLi, StyleUl } from "../Component/StyleComp/StyleComp";
import { useState } from "react";
import { makeFileInfo } from "../utils/commonUtils";
import { fileRxjsUpload, rxJsPost } from "../Hook/useFetch";
import { catchError, from, mergeMap, of, retry } from "rxjs";
import { tap } from "rxjs/operators";
import { memo } from "react";
import { ReactComponent as Cancel } from "../svg/cancel.svg";
import { ReactComponent as Delete } from "../svg/delete.svg";
import { COM_MESSAGE } from "../utils/commonMessage";

export const FileUpload = () => {
  const [fileData, setFileData] = useState([]);

  const fileRef = useRef();
  const onFileAddClick = () => {
    fileRef.current.click();
  };

  // 파일 추가
  const addFile = (files) => {
    setFileData((saveFiles) => {
      let tempIndex = saveFiles.length;
      const tempSave = [];
      for (const file of files) {
        if (!saveFiles.find((item) => item.fileFullName == file.name)) {
          const fileInfo = makeFileInfo(file);
          fileInfo.fileIndex = tempIndex++;
          tempSave.push(fileInfo);
        }
      }

      // 초기화
      fileRef.current.value = "";

      // 새롭게 변경된 경우에만 새롭게 배열을 배열을 만들어 화면 갱신을 유도함
      if (tempSave.length > 0) {
        return [...saveFiles, ...tempSave];
      } else {
        return saveFiles;
      }
    });
  };

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
                mergeMap((file) =>
                  rxJsPost("/api/exist", { fileName: file.fileName, fileExt: file.fileExt }).pipe(
                    catchError((error, caught) => {
                      if (error.resultCode.startsWith("EC")) {
                        // EC에러는 어차피 다시 할 수 없으니 다음단계로 넘김
                        return of(error);
                      } else {
                        throw error;
                      }
                    }),
                    retry(2)
                  )
                ),
                // 등록된 파일이 아니면 전송 실행
                mergeMap((res) => {
                  const onProcess = (process) => {
                    const percent = ((process.loaded * 100) / process.total).toFixed(2);
                    setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...item, fileTransYn: 1, fileTransPer: percent } : item)));
                  };
                  return !res.result
                    ? of(res)
                    : fileRxjsUpload("/api/upload", file, onProcess).pipe(
                        catchError((error, caught) => {
                          if (error.resultCode.startsWith("EC")) {
                            return of(error);
                          } else {
                            throw error;
                          }
                        })
                      );
                }),
                tap((res) => {
                  if (!res.result) {
                    setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...item, fileTransYn: 3, resultMessage: res.resultMessage } : item)));
                  } else {
                    setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...item, fileTransYn: 2, resultMessage: res.resultMessage } : item)));
                  }
                }),
                catchError((error, caught) => {
                  if (error.resultCode === COM_MESSAGE.CANCEL_REQUEST.resultCode) {
                    setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...item, fileTransYn: 4, resultMessage: error.resultMessage } : item)));
                  } else {
                    setFileData((files) => files.map((item) => (item.fileIndex == file.fileIndex ? { ...item, fileTransYn: 5, resultMessage: error.resultMessage } : item)));
                  }
                  return of(error);
                })
              );
            })
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

  return (
    <div>
      <input onChange={onFileChange} type="file" ref={fileRef} name="uploadFile" id="uploadFile" multiple style={{ display: "none" }}></input>

      <StyleDiv inStyle={{ padding: 10, minWidth: "820px" }}>
        <StyleDiv inStyle={{ display: "grid", gridAutoFlow: "column", justifyContent: "space-between" }}>
          <h3>파일 목록(등록한 파일 수: {fileData.length})</h3>
          <StyleDiv>
            <Button name="파일추가" onClick={onFileAddClick}></Button>
            <Button name="파일업로드" onClick={onFileUpload}></Button>
            <Button name="전체삭제" onClick={onFileAllDelete}></Button>
          </StyleDiv>
        </StyleDiv>

        <StyleDiv inStyle={{ width: "100%", height: "500px", border: "1px solid white", padding: 10, background: "#000000", marginTop: 10 }} onDragOver={onDragOver} onDrop={onDrop}>
          <StyleDiv inStyle={{ height: 30, padding: "5px 0px", display: "grid", gridAutoFlow: "column", gridColumnGap: 10, gridTemplateColumns: "1fr 8fr 2fr 2fr 2fr 3fr" }}>
            <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>순번</StyleDiv>
            <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>파일명</StyleDiv>
            <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>용량</StyleDiv>
            <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>진행</StyleDiv>
            <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>취소/삭제</StyleDiv>
            <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>비고</StyleDiv>
          </StyleDiv>
          <hr></hr>
          <StyleUl inStyle={{ transition: "all 2s ease-in", width: "100%", height: "calc(100% - 30px)" }} scroll={true}>
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
      comp = <ProgressBar percent={fileData.fileTransPer} message="전송완료" />;
      break;
    case 3:
      comp = <ProgressBar percent={fileData.fileTransPer} message="전송실패" state="red" />;
      break;
    case 4:
      comp = <StyleDiv>전송취소</StyleDiv>;
      break;
    default:
      comp = <StyleDiv>전송오류</StyleDiv>;
      break;
  }

  return (
    <StyleLi
      inStyle={{ transition: "all 2s ease-in", display: "grid", gridAutoFlow: "column", gridColumnGap: 10, gridTemplateColumns: "1fr 8fr 2fr 2fr 2fr 3fr", padding: "5px 0px", alignItems: "center" }}
    >
      <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>{index + 1}</StyleDiv>
      <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "left", overflowWrap: "anywhere" }}>{fileData.fileFullName}</StyleDiv>
      <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "right" }}>{formatSizeUnits(fileData.fileByte)}</StyleDiv>
      <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center", textAlign: "center", width: "100%", height: "100%", padding: "5px 0px", display: "grid", alignItems: "center" }}>{comp}</StyleDiv>
      <StyleDiv inStyle={{ padding: "0px 5px", justifySelf: "center" }}>
        {fileData.fileTransYn == 1 ? (
          <Cancel width="20px" height="20px" fill="white" cursor="pointer" onClick={onCancleClick} />
        ) : (
          <Delete width="20px" height="20px" fill="white" cursor="pointer" onClick={onDeleteClick} />
        )}
      </StyleDiv>
      <StyleDiv inStyle={{ justifySelf: "left" }}>{fileData.resultMessage}</StyleDiv>
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

const ProgressBar = memo(({ percent = 0, message, state = "transparent" }) => {
  return (
    <StyleDiv inStyle={{ position: "relative", width: "100%", height: "fit-content", background: "white", display: "grid", alignItems: "center" }}>
      <StyleDiv
        inStyle={{ position: "absolute", background: "#6d93ff", textAlign: "center", width: percent + "%", height: "100%", left: 0, top: 0, zIndex: "1", transition: "all 0.2s ease-in" }}
      ></StyleDiv>
      <StyleDiv inStyle={{ position: "relative", backgroundColor: state, color: "black", textAlign: "center", zIndex: "2", transition: "all 0.5s ease-in" }}>
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
