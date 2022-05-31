import React, { useCallback, useEffect, useRef, useState } from "react";

const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();
  const onScroll = useCallback(({ target: { scrollTop } }) => {
    setScrollTop(scrollTop);
  });

  useEffect(() => {
    const scrollContainer = ref.current;
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    setScrollTop(scrollContainer.scrollTop);
    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, []);

  return [scrollTop, ref];
};

export default useScroll;
