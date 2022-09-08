import { useEffect, useRef, useState } from "react";
import { StyleDiv } from "../StyleComp/StyleComp";

/**
 * Fade 컴포넌트 자식 컴포넌트를 출력할 떄 fade in, out을 실시함
 * @param {Ojbect} param0 fadeIn: 실행할 애니메이션명, fadeOut : 실행할 애니메이션명
 * @returns
 */
export const Fade = ({ children, state, style = {}, fadeIn, fadeOut }) => {
  const [fade, setFade] = useState(true);
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setShow((val) => {
      if (state) {
        setFade(true);
        return true;
      } else {
        setFade(false);
        return val;
      }
    });
  }, [state]);

  // fadeOut시 동작
  const onAnimationEnd = (event) => {
    if (show && ref.current == event.target && event.animationName == fadeOut) {
      setShow(false);
    }
  };

  // 스타일 기본 설정
  return show ? (
    <StyleDiv ref={ref} inStyle={{ transformOrigin: "top", animation: `${fade ? "0.16s " + fadeIn ?? "fadeIn" : "0.1s " + fadeOut ?? "fadeOut"} forwards`, ...style }} onAnimationEnd={onAnimationEnd}>
      {children}
    </StyleDiv>
  ) : null;
};
