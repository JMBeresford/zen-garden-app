import useStore from '@/store';
import { Box } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { damp } from 'three/src/math/MathUtils';

const Tile = ({ type = 'sand', index, level = 0, tendable, ...props }) => {
  const ref = useRef();

  const clickedTile = useStore((state) => state.clickedTile);

  const tileColor = useMemo(() => {
    switch (type) {
      case 'sand':
        return 'tan';
      case 'stone':
        return 'grey';
      case 'tree':
        return 'green';
      case 'pond':
        return 'blue';
    }
  }, [type]);

  const handleClick = useCallback(
    (e, tile) => {
      if (clickedTile === null) {
        let x = e.x / window.innerWidth;
        let y = e.y / window.innerHeight;

        useStore.setState({
          clickedPosition: { x, y },
          clickedTile: tile,
          hideContextMenu: false,
        });
      }
    },
    [clickedTile]
  );

  useFrame(({ clock }, delta) => {
    if (tendable) {
      ref.current.position.y = damp(
        ref.current.position.y,
        Math.sin(clock.elapsedTime + 50 * index) * 0.1,
        0.8,
        delta
      );
    } else {
      ref.current.position.y = damp(ref.current.position.y, 0, 1.5, delta);
    }
  });

  return (
    <mesh
      ref={ref}
      {...props}
      rotation-x={-Math.PI / 2}
      onClick={(e) => handleClick(e, ref.current)}
      userData={{
        type: type,
        index: index,
        level: level,
        tendable: tendable,
      }}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={tileColor} />

      {/* TEMPORARY FOR DEBUGGING LEVELS */}
      <group rotation-x={Math.PI / 2}>
        {level > 0 && (
          <Box scale={[0.1, 0.1, 0.1]} position={[-0.2, 0.05, 0]} />
        )}
        {level > 1 && <Box scale={[0.1, 0.1, 0.1]} position={[0.2, 0.05, 0]} />}
        {level > 2 && <Box scale={[0.1, 0.1, 0.1]} position={[0, 0.05, 0.2]} />}
      </group>
    </mesh>
  );
};

export default Tile;
