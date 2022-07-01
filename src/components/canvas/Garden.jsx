import useStore from '@/store';
import { useMemo, useRef } from 'react';
import { useEffect } from 'react';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import Log from './Logs';
import Tiles from './Tiles';
import Logs from './Logs';

const Garden = ({ ...props }) => {
  const ref = useRef();

  useEffect(() => {
    useStore.getState().actions.initGarden();
  }, []);

  const { gridSize, debug } = useStore();

  const { sunColor, sunPos } = useControls('Lighting', {
    sunColor: 'white',
    sunPos: [0, 10, -2],
  });

  return (
    <>
      <group ref={ref} {...props}>
        <Tiles />
        <Logs />
      </group>

      <pointLight intensity={0.15} position={sunPos} color={sunColor} />
      <ambientLight intensity={0.25} />

      <OrbitControls />
      {debug && <Perf position='bottom-left' />}
    </>
  );
};

export default Garden;
