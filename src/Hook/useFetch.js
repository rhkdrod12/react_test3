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
