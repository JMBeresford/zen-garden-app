import useStore from '@/helpers/store';
import { useEffect, useRef } from 'react';

const Dom = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    useStore.setState({ dom: ref });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 10,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default Dom;
