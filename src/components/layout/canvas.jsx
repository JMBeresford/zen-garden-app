import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import useStore from '@/store';
import { useEffect, useRef } from 'react';
import { ACESFilmicToneMapping } from 'three';

const LControl = () => {
  const dom = useStore((state) => state.dom);
  const control = useRef(null);

  useEffect(() => {
    if (control.current) {
      const domElement = dom.current;
      const originalTouchAction = domElement.style['touch-action'];
      domElement.style['touch-action'] = 'none';

      return () => {
        domElement.style['touch-action'] = originalTouchAction;
      };
    }
  }, [dom, control]);
  // @ts-ignore
  return <OrbitControls ref={control} />;
};
const LCanvas = ({ children }) => {
  const dom = useStore((state) => state.dom);

  return (
    <Canvas
      mode='concurrent'
      style={{
        position: 'absolute',
        top: 0,
      }}
      gl={{ toneMapping: ACESFilmicToneMapping }}
      camera={{ position: [0, 3, 5] }}
      // onCreated={(state) => state.events.connect(dom.current)}
    >
      {/* <LControl /> */}
      {/* <Preload all /> */}
      {children}
    </Canvas>
  );
};

export default LCanvas;
