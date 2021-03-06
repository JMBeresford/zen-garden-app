import useStore from '@/store';
import { useEffect, useRef } from 'react';

const Dom = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    useStore.setState({ dom: ref });
  }, []);

  return (
    <div ref={ref} id='dom'>
      {children}
    </div>
  );
};

export default Dom;
