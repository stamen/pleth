import { useEffect, useState } from 'react';

export const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length !== 1) {
        throw new Error('Expected exactly one resize observer entry.');
      }
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    const element = ref.current;
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [ref]);

  return dimensions;
};
