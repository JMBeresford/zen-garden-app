import useStore from '@/store';
import { Box, shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useCallback, useMemo, useRef } from 'react';
import { Color } from 'three';
import { damp } from 'three/src/math/MathUtils';
import { vertexShader, fragmentShader } from './shaders';

const SandMaterial = shaderMaterial(
  { uColor: new Color() },
  vertexShader,
  fragmentShader,
  (mat) => {
    mat.toneMapped = true;
    // mat.transparent = true;
  }
);

extend({ SandMaterial });

const Tile = ({ type = 'sand', index, level = 0, tendable, ...props }) => {
  const ref = useRef();

  const { clickedTile, showContextMenu } = useStore();

  const { sandColor, stoneColor, pondColor, treeColor } = useControls({
    sandColor: '#ffe3af',
    stoneColor: '#b1b1b1',
    pondColor: '#00bfff',
    treeColor: '#4fcb72',
  });

  const tileColor = useMemo(() => {
    switch (type) {
      case 'sand':
        return sandColor;
      case 'stone':
        return stoneColor;
      case 'tree':
        return treeColor;
      case 'pond':
        return pondColor;
    }
  }, [type, sandColor, stoneColor, pondColor, treeColor]);

  const handleClick = useCallback(
    (e, tile) => {
      if (!showContextMenu) {
        let x = e.x / window.innerWidth;
        let y = e.y / window.innerHeight;

        useStore.setState({
          clickedPosition: { x, y },
          clickedTile: tile,
          showContextMenu: true,
        });
      }
    },
    [clickedTile, showContextMenu]
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
      {/* <meshBasicMaterial color={tileColor} /> */}
      <sandMaterial uColor={tileColor} />

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
