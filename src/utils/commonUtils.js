import axios from "axios";
import { useEffect, useState } from "react";
import queryString from "query-string";

function makeQueryString(url, param) {
  return url;
}

export function useGetFetch(url, { stateType = [], param }) {
  const [responseData, setResponseData] = useState(stateType);
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
        setResponseData(message);
      })
      .catch(({ message, code }) => {
        console.log(`Messgae: ${message}\nCode: ${code}`);
      });
  }, [url]);

  return responseData;
}

export function usePostFetch(url, data, stateType = []) {
  const [responseData, setResponseData] = useState(stateType);

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

  return responseData;
}
