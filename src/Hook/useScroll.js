import React, { useEffect, useRef, useState } from "react";

const useScroll = () => {
  const [scrollTop, setScrollTop] = useState();
  const ref = useRef();
  const onScroll = ({ target: { scrollTop } }) => {
    return setScrollTop(scrollTop);
  };

  useEffect(() => {
    const scrollContainer = ref.current;
    scrollContainer.addEventListener("scroll", onScroll);
    setScrollTop(scrollContainer.scrollTop);
    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, []);

  return [scrollTop, ref];
};

export default useScroll;
