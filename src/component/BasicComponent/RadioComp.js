import { memo, useCallback, useState } from "react";
import { StyleDiv } from "../StyleComp/StyleComp";

const RadioComp = memo(({ name, data, onChange }) => {
  const defualtValue = data?.find((item) => item.checked)?.value ?? "";
  const [radio, setRadio] = useState(defualtValue);

  const onRadioChange = useCallback(({ target: { value } }) => {
    {
      setRadio((val) => value);
      if (typeof onChange == "function") onChange(radio, value);
    }
  });
  return (
    <StyleDiv inStyle={{ display: "grid", gridAutoFlow: "column", justifyContent: "start" }}>
      {data.map((item, idx) => {
        return (
          <StyleDiv key={idx} inStyle={{ padding: "0px 5px 0px 0px" }}>
            <input type="radio" id={item.id} name={name} value={item.value} onChange={onRadioChange} checked={item.value == radio} />
            <label htmlFor={item.id}>{item.name}</label>
          </StyleDiv>
        );
      })}
    </StyleDiv>
  );
});

export default RadioComp;
