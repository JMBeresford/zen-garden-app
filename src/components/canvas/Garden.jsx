import useStore from '@/store';
import { useMemo, useRef } from 'react';
import Tile from './Tile';
import { useEffect } from 'react';
import { Perf } from 'r3f-perf';
import { Instances, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import Log from './Log';

const Garden = ({ ...props }) => {
  const ref = useRef();

  useEffect(() => {
    useStore.getState().actions.initGarden();
  }, []);

  const { tiles, gridSize, debug } = useStore();

  const { sunColor, sunPos } = useControls('Lighting', {
    sunColor: 'white',
    sunPos: [0, 10, -2],
  });

  // position each tile in the grid
  const garden = useMemo(() => {
    let mid = Math.floor(gridSize / 2);

    return tiles.map((tile, index) => {
      let x = -mid + (index % gridSize);
      let z = -mid + Math.floor(index / gridSize);

      return { position: [x, 0, z], ...tile };
    });
  }, [gridSize, tiles]);

  const logs = useMemo(() => {
    let mid = Math.floor(gridSize / 2);
    let logs = [];
    let y = 0.05;

    for (let i = 0; i < gridSize; i++) {
      logs.push(
        // top
        <Log
          position={[-mid + i, y, -mid - 0.5]}
          rotation={[0, Math.PI / 2, 0]}
        />,
        // bottom
        <Log
          position={[-mid + i, y, mid + 0.5]}
          rotation={[0, Math.PI / 2, 0]}
        />,
        // left
        <Log position={[-mid - 0.5, y, -mid + i]} />,
        // right
        <Log position={[mid + 0.5, y, -mid + i]} />
      );
    }

    return logs;
  }, [gridSize]);

  return (
    <>
      <group ref={ref} {...props}>
        <Instances ma></Instances>
        {garden.map((tile, index) => (
          <Tile
            key={index}
            index={index}
            type={tile.type}
            position={tile.position}
            level={tile.level}
            tendable={tile.tendable}
          />
        ))}
      </group>
      {logs}

      <pointLight intensity={0.15} position={sunPos} color={sunColor}>
        <mesh>
          <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color='red' />
        </mesh>
      </pointLight>
      <ambientLight intensity={0.25} />
      <OrbitControls />
      {debug && <Perf position='bottom-left' />}
    </>
  );
};

export default Garden;
