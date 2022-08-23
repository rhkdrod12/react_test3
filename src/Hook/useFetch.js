import axios from "axios";
import { useEffect, useState } from "react";
import queryString from "query-string";

const defaultUrl = "http://localhost:8080";

export function useGetFetch(url, { stateType = [], param, callbackFunc }) {
  const [responseData, setResponseData] = useState(stateType);
  url = defaultUrl + url;
  useEffect(() => {
    if (param && param instanceof Object) {
      url += "?" + queryString.stringify(param);
    }

    axios
      .get(url)
      .then((res) => {
        let {
          data: { message },
        } = res;

        if (typeof callbackFunc === "function") {
          callbackFunc(message);
        }

        setResponseData(message);
      })
      .catch(({ message, code }) => {
        console.log(`Messgae: ${message}\nCode: ${code}`);
      });
  }, [url]);

  return [responseData, setResponseData];
}

export function usePostFetch(url, data, stateType = []) {
  const [responseData, setResponseData] = useState(stateType);
  url = defaultUrl + url;
  useEffect(() => {
    axios
      .post(url, data)
      .then((res) => {
        let {
          data: { message },
        } = res;
        setResponseData(message);
      })
      .catch(({ message, code }) => {
        console.log(`Messgae: ${message}\nCode: ${code}`);
      });
  }, [url]);

  return [responseData, setResponseData];
}

export function getFetch(url, param, callback) {
  url = defaultUrl + url;

  if (param && param instanceof Object) {
    url += "?" + queryString.stringify(param);
  }

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        let {
          data: { message },
        } = res;
        resolve(message, res);
      })
      .catch((e) => {
        const { message, code } = e;
        console.log(e);
        console.log(`Messgae: ${message}\nCode: ${code}`);
        reject();
      });
  });
}

export function postFetch(url, data, callback) {
  url = defaultUrl + url;
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((res) => {
        let {
          data: { message },
        } = res;
        resolve(message);
      })
      .catch((e) => {
        const { message, code } = e;
        console.log(e);
        console.log(`Messgae: ${message}\nCode: ${code}`);
        reject();
      });
  });
}

export function fileDownload(url, param) {
  url = defaultUrl + url;

  return new Promise((resolve, reject) => {
    const option = {
      url: url, // 파일 다운로드 요청 URL
      method: "POST", // 혹은 'POST'
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: param,
    };

    axios(option)
      .then((response) => {
        debugger;
        resolve(true);
      })
      .catch((e) => {
        const { message, code } = e;
        console.log(e);
        console.log(`Messgae: ${message}\nCode: ${code}`);
        reject();
      });
  });
}

export function fileUpload(url, param) {
  url = defaultUrl + url;

  if (param && param instanceof Object) {
    url += "?" + queryString.stringify(param);
  }

  return new Promise((resolve, reject) => {
    const option = {
      url: url, // 파일 다운로드 요청 URL
      method: "GET", // 혹은 'POST'
      responseType: "blob", // 응답 데이터 타입 정의
    };
    // 서버에서 받은 데이터는 바이너리 형태의 데이터가 됨
    // 따라서 이 것을 blod로 변환한다음 다운로드를 실시함?
    axios(option)
      .then((response) => {
        const blob = new Blob([response.data]); // blob을 사용해 객체 URL을 생성합니다.

        const fileObjectUrl = window.URL.createObjectURL(blob); // blob 객체 URL을 설정할 링크를 만듭니다.

        const link = document.createElement("a");
        link.href = fileObjectUrl;
        link.style.display = "none"; // 다운로드 파일 이름을 지정 할 수 있습니다. // 일반적으로 서버에서 전달해준 파일 이름은 응답 Header의 Content-Disposition에 설정됩니다.

        link.download = extractDownloadFilename(response); // 다운로드 파일 이름을 추출하는 함수

        const extractDownloadFilename = (response) => {
          const disposition = response.headers["content-disposition"];
          const fileName = decodeURI(disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]/g, ""));
          return fileName;
        }; // 다운로드 파일의 이름은 직접 지정 할 수 있습니다. // link.download = "sample-file.xlsx"; // 링크를 body에 추가하고 강제로 click 이벤트를 발생시켜 파일 다운로드를 실행시킵니다.

        document.body.appendChild(link);
        link.click();
        link.remove(); // 다운로드가 끝난 리소스(객체 URL)를 해제합니다.

        window.URL.revokeObjectURL(fileObjectUrl);

        resolve(true);
      })
      .catch((e) => {
        const { message, code } = e;
        console.log(e);
        console.log(`Messgae: ${message}\nCode: ${code}`);
        reject();
      });
  });
}
