import useStore from '@/store';
import { useMemo, useRef } from 'react';
import Tile from './Tile';
import { useEffect } from 'react';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

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

  return (
    <>
      <group ref={ref} {...props}>
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
