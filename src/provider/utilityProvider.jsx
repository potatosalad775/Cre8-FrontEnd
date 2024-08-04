export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isEmpty = (input) => {
  if (
       typeof input === "undefined" ||
       input === null ||
       input === "" ||
       input === "null" ||
       input.length === 0 ||
       (typeof input === "object" && !Object.keys(input).length)
      )
  {
      return true;
  }
  else return false;
}