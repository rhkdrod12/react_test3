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
  console.log(result);
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

export const getRect = (parentRef, positionX, positionY) => {
  const dom = parentRef.current;

  // const winWidth = window.screen.width;
  // const winHeight = window.screen.height;

  // const clientTop = dom.clientTop;
  // const clientHeight = dom.clientHeight;
  // const offsetYCal = clientHeight - clientTop;

  // const clientLeft = dom.clientLeft;
  // const clientWidth = dom.clientWidth;
  // const offSetXCal = clientWidth - clientLeft;

  const { x, y, width, height } = dom.getBoundingClientRect();
  console.log(dom.getBoundingClientRect());
  let resultX = positionX.toUpperCase() == "RIGHT" ? width : 0;
  let resultY = positionY.toUpperCase() == "BOTTOM" ? height : 0;

  return { top: resultY, left: resultX };
};
