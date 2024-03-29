import axios from "axios";
import { event } from "jquery";

/**
 * 입력받은 css값에 숫자형태이면 px를 붙이는 용도
 * @param {*} val
 * @param {*} defaultValue
 * @returns
 */
export const defaultCssValue = (val, defaultValue) => {
  if (val == null) {
    return defaultValue;
  } else if (typeof val === "number") {
    return val + "px";
  } else {
    return val;
  }
};

/**
 * 입력받은 객체 형태로 선언된 css값을 css 문법으로 치환
 * @param {*} cssObj
 * @param {*} notSnake : 카멜케이스 형태의 키값을 스네이크 형태로 치환하지 않도록 하는 옵션
 * @returns
 */
export const makeCssObject = (cssObj, notSnake) => {
  let result = "";
  for (const key in cssObj) {
    const data = cssObj[key];
    const calmelKey = !notSnake ? calmelToSnake(key) : key;

    if (data != null && data !== "") {
      if (data instanceof Object) {
        result += `${calmelKey} {${makeCssObject(data, notSnake)}}; `;
      } else {
        result += `${calmelKey} : ${defaultCssValue(data)}; `;
      }
    }
  }
  return result;
};

/**
 * 입력받은 camel형태의 문자를 snake형태로 바꿈
 * @param {*} val 카멜형태의 문자
 * @returns 스네이크 형태의 문자
 */
export const calmelToSnake = (val) => {
  let result = "";
  for (const idx in val) {
    const s = val.charCodeAt(idx);
    if (s >= 65 && s <= 95) {
      result += "-" + val[idx];
    } else {
      result += val[idx];
    }
  }

  return result;
};

/**
 * 부모 객체로부터 입력받은 포지션에 따라 이동시켜야하는 거리를 반환하는 함수
 * @param {*} parentRef
 * @param {*} positionX
 * @param {*} positionY
 * @param {*} param3
 * @returns
 */
export const getRect = (parentRef, positionX, positionY, { offsetX = 0, offsetY = 0 } = {}) => {
  const dom = parentRef.current;

  const { width, height } = dom.getBoundingClientRect();
  let resultX = positionX.toUpperCase() === "RIGHT" ? "100%" : 0 - offsetX;
  let resultY = positionY.toUpperCase() === "BOTTOM" ? height - offsetY : 0 - offsetY;

  return { top: resultY, left: resultX, width: width, height: height };
};
/**
 * @declare
 * @param {*} compRef
 * @param {*} parentRef
 * @param {*} param2
 * @returns
 */
export const getCommRefRect = (compRef, parentRef, { positionX = "RIGHT", positionY = "BOTTOM", offsetX = 0, offsetY = 0 } = {}) => {
  const compRect = compRef.current.getBoundingClientRect();
  const parentRect = parentRef.current.getBoundingClientRect();

  let top;
  let left;

  // right인 경우에는 해당 바운더리 밖으로 넘기지는 않을 것임
  if (positionX.toUpperCase() === "RIGHT") {
    left = compRect.right - parentRect.left + offsetX;
  } else {
    left = compRect.left - parentRect.left + offsetX;
  }

  if (positionY.toUpperCase() === "BOTTOM") {
    top = compRect.bottom - parentRect.top + offsetY;
  } else {
    top = compRect.top - parentRect.top + offsetY;
  }

  return { top: parseFloat(top), left: parseFloat(left) };
};

/**
 * 해당 객체의 위치값을 연산하여 위치값을 반환
 * @param {*} compRef
 * @param {*} param1
 * @returns
 */
export const getCompRect = (compRef, { positionX = "RIGHT", positionY = "BOTTOM", offsetX = 0, offsetY = 0 } = {}) => {
  const compRect = compRef.current.getBoundingClientRect();

  let top;
  let left;
  // debugger;
  // right인 경우에는 해당 바운더리 밖으로 넘기지는 않을 것임
  if (positionX.toUpperCase() === "RIGHT") {
    left = compRect.right + offsetX;
  } else {
    left = compRect.left + offsetX;
  }

  if (positionY.toUpperCase() === "BOTTOM") {
    top = compRect.bottom + offsetY;
  } else {
    top = compRect.top + offsetY;
  }

  return { top: parseFloat(top), left: parseFloat(left) };
};
/**
 * 부모 객체 안의 자식객체의 위치를 입력한 인수에 맞추어 계산하여 위치값을 반환
 * @param {*} compRef 부모 컴포넌트
 * @param {*} itemRef 위치를 지정할 자식 컴포넌트
 * @param {*} param2 포지션 객체(ex: { positionX = "RIGHT", positionY = "BOTTOM" })
 * @param {*} param3 위치 보정용 객체(ex: { offsetX = 0, offsetY = 0 })
 * @returns {object} {top: 111, left: 111} 형태로 반환
 */
export const getItemRect = (compRef, itemRef, { positionX = "RIGHT", positionY = "BOTTOM" } = {}, { offsetX = 0, offsetY = 0 } = {}) => {
  const itemRect = itemRef.hasOwnProperty("current") ? itemRef.current.getBoundingClientRect() : itemRef.getBoundingClientRect();
  const compRect = compRef.current.getBoundingClientRect();
  const winRect = { width: window.innerWidth, height: window.innerHeight };

  let top;
  let left;

  // right인 경우에는 해당 바운더리 밖으로 넘기지는 않을 것임
  if (positionX.toUpperCase() === "RIGHT") {
    left = compRect.right < itemRect.right + offsetX ? compRect.right : itemRect.right + offsetX;
  } else {
    left = compRect.left > itemRect.left + offsetX ? compRect.left : itemRect.left + offsetX;
  }

  if (positionY.toUpperCase() === "BOTTOM") {
    top = compRect.bottom < itemRect.bottom + offsetY ? compRect.bottom : itemRect.bottom + offsetY;
  } else {
    top = compRect.top > itemRect.top + offsetY ? compRect.top : itemRect.top + offsetY;
  }

  return { top, left };
};

export const getHeight = () => {};

/**
 * func에 param을 인수로 추가
 * @param {function} func
 * @param {Object} newParams
 */
export const makeFunc = (func, newParams) => {
  return func ? (e, params) => func(e, { ...params, ...newParams }) : null;
};

/**
 * 이벤트들을 받아 params을 추가시킴
 * @param {*} events
 * @param {*} newParams
 * @returns
 */
export const makeEvent = (events, newParams) => {
  if (events) {
    const result = {};
    for (const key in events) {
      result[key] = makeFunc(events[key], newParams);
    }
    return result;
  }
  return {};
};

/**
 * makeEvent를 통해 만들어진 이벤트를 서로 결합
 * @param {*} events1
 * @param {*} events2
 */
export const combineEvents = (events1, events2) => {
  if (events1 && events2) {
    // 일단 서로 모두다 넣고, 항상 events1부터 먼저 실행되도록 함
    const result = { ...events2, ...events1 };
    // event2의 이벤트가 events1에도 있으면 결합시킴
    for (const key in events1) {
      if (events2[key]) {
        result[key] = (e, params) => {
          events1[key](e, params);
          events2[key](e, params);
        };
      }
    }
    return result;
  }
  return {};
};

/**
 * fieldId가 서로 같은 객체를 찾아 target에 copy 객체 값을 복사
 * @param {*} fieldId
 * @param {*} targetArr
 * @param {*} copyArr
 * @returns
 */
export const copyObjectBykey = (fieldId, targetArr, copyArr) => {
  if (fieldId && Array.isArray(targetArr) && Array.isArray(copyArr) && copyArr.length > 0) {
    const result = [];
    for (let i = 0; i < targetArr.length; i++) {
      let flag = false;
      let copyObject;
      const targetObject = targetArr[i];

      for (let j = 0; j < copyArr.length; j++) {
        if (targetObject[fieldId] == copyArr[j][fieldId]) {
          flag = true;
          copyObject = copyArr[j];
        }
      }

      if (flag) {
        result.push({ ...targetObject, ...copyObject });
      } else {
        result.push({ ...targetObject });
      }
    }
    return result;
  }
  return targetArr;
};

/**
 * 해당 객체 배열에서 findValueObj에 해당되는 객체를 찾아 setValueObj의 값을 추가시키는 함수
 * @param {*} findValueObj 키 : 찾을 대상 value: 비교할 값
 * @param {*} setValueObj  키 : 값을 넣을 대상, value: 넣을 값
 * @param {*} objArr       객체를 가지고 있는 배열
 */
export const findFieldAndSetObjectValue = (findValueObj, setValueObj, objArr) => {
  if (Array.isArray(objArr)) {
    const setKeys = Object.keys(setValueObj);
    const findKeys = Object.keys(findValueObj);

    for (let i = 0; i < objArr.length; i++) {
      const data = objArr[i];
      // 해당값 일치 여부
      let flag = true;
      for (let idx in findKeys) {
        const fieldName = findKeys[idx];
        if (data[fieldName] != findValueObj[fieldName]) {
          flag = false;
        }
      }
      // 일치하면 값 삽입
      if (flag) {
        for (let idx in setKeys) {
          const setName = setKeys[idx];
          data[setName] = setValueObj[setName];
        }
      }
    }
  }
};

/**
 * 입력받은 값을 flex 정렬에 맞는 값으로 변환
 */
export const makeFlexAlign = (val, type = "flex") => {
  if (val) {
    if (type == "flex") {
      switch (val) {
        case "center":
        case "middle":
          return "center";
        case "right":
        case "bottom":
          return "flex-end";
        case "top":
        case "left":
          return "flex-start";
      }
    }
  }
};

/**
 * 입력받은 값을 flex 정렬에 맞는 값으로 변환
 */
export const makeDisplayFlexAlign = ({ verticalAlign, textAlign }, type = "flex") => {
  const result = {};
  if (type == "flex") {
    if (verticalAlign) {
      result.alignItems = makeFlexAlign(verticalAlign, type);
    }

    if (textAlign) {
      result.justifyContent = makeFlexAlign(textAlign, type);
    }
  }
  return result;
};

/**
 * fileTransYn : 0 -> 전송대기
 * fileTransYn : 1 -> 전송중
 * fileTransYn : 2 -> 전송완료
 * fileTransYn : 3 -> 전송실패
 */
/**
 * 입력받은 파일을 서버의 FILE용 DTO에 맞는 형태로 변환
 *
 *
 * @param {*} file inputbox의 file type
 * @returns 서버 DTO 구조의 Object
 */
export const makeFileInfo = function (file, excludeFile) {
  let name = file.name + "";
  let fileName = name.substring(0, name.lastIndexOf("."));
  let fileExt = name.substring(name.lastIndexOf(".") + 1);

  const fileInfo = {
    fileFullName: name,
    fileName: fileName,
    fileExt: fileExt,
    fileType: file.type,
    fileByte: file.size,
    fileTransYn: 0,
    fileTransPer: 0,
  };

  if (!excludeFile) {
    fileInfo.file = file;
    fileInfo.axiosSource = axios.CancelToken.source();
  }

  return fileInfo;
};
/**
 * byte값을 최대 용량에 맞게 변환(GB까지)
 * @param {*} bytes
 * @returns
 */
export function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(2) + " GB";
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes > 1) {
    bytes = bytes + " Byte";
  } else if (bytes == 1) {
    bytes = bytes + " Byte";
  } else {
    bytes = "0 Byte";
  }
  return bytes;
}
