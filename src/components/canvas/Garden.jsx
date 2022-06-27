import useStore from '@/store';
import { useMemo, useRef } from 'react';
import Tile from './Tile';
import { useEffect } from 'react';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';

const Garden = ({ ...props }) => {
  const ref = useRef();

  useEffect(() => {
    useStore.getState().actions.initGarden();
  }, []);

  const { tiles, gridSize, debug } = useStore();

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

      <OrbitControls />
      {debug && <Perf position='bottom-left' />}
    </>
  );
};

export default Garden;
