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

const calmelToSnake = (val) => {
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
