export const defaultCssValue = (val, defaultValue) => {
  if (val == null) {
    return defaultValue;
  } else if (isNaN(val)) {
    return val;
  } else {
    return val + "px";
  }
};
