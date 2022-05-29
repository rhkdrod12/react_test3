export const defaultCssValue = (val, defaultValue) => {
  if (val == null) {
    return defaultValue;
  } else if (typeof val === "number") {
    return val + "px";
  } else {
    return val;
  }
};

export const makeCssObject = (val, notSnake) => {
  let result = "";
  for (const key in val) {
    var data = val[key];
    var calmelKey = !notSnake ? calmelToSnake(key) : key;

    if (data instanceof Object) {
      result += `${calmelKey} {${makeCssObject(data)}}; `;
    } else {
      result += `${calmelKey} : ${defaultCssValue(data)}; `;
    }
  }
  return result;
};

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

export const getRect = (parentRef, positionX, positionY, { offsetX = 0, offsetY = 0 } = {}) => {
  const dom = parentRef.current;

  // const winWidth = window.screen.width;
  // const winHeight = window.screen.height;

  // const clientTop = dom.clientTop;
  // const clientHeight = dom.clientHeight;
  // const offsetYCal = clientHeight - clientTop;

  // const clientLeft = dom.clientLeft;
  // const clientWidth = dom.clientWidth;
  // const offSetXCal = clientWidth - clientLeft;

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
 *
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
