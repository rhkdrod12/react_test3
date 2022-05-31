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
    var data = cssObj[key];
    var calmelKey = !notSnake ? calmelToSnake(key) : key;

    if (data instanceof Object) {
      result += `${calmelKey} {${(makeCssObject(data), notSnake)}}; `;
    } else {
      result += `${calmelKey} : ${defaultCssValue(data)}; `;
    }
  }
  return result;
};

/**
 * 입력받은 camel형태의 문자를 snake형태로 바꿈
 * @param {*} val
 * @returns
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
  let resultX = positionX.toUpperCase() === "RIGHT" ? width - offsetX : 0 - offsetX;
  let resultY = positionY.toUpperCase() === "BOTTOM" ? height - offsetY : 0 - offsetY;

  return { top: resultY, left: resultX, width: width, height: height };
};

export const getHeight = () => {};

/**
 * 이벤트들을 받아 params을 추가시킴
 * @param {*} events
 * @param {*} params
 * @returns
 */
export const makeEvent = (events, params) => {
  if (events) {
    const result = {};
    const keys = Object.keys(events);

    for (const key in events) {
      const func = events[key];
      result[key] = (e) => func(e, params);
    }
    return result;
  }
  return null;
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
export const makeDisplayAlign = (val, type = "flex") => {
  if (type == "flex") {
    switch (val) {
      case "center":
      case "middle":
        return "center";
      case "right":
      case "bottom":
        return "flex-end";
      case "top":
      default:
        return "flex-start";
    }
  }
};
