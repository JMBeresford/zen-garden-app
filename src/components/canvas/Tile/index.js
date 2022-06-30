import useStore from '@/store';
import { Box, shaderMaterial, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useCallback, useMemo, useRef } from 'react';
import { Color, Texture } from 'three';
import { vertexShader, fragmentShader } from './shaders';
import noiseImage from '@/img/waves.png';
import Stone from './Stone';
import Pond from './Pond';
import Tree from './Tree';

const SandMaterial = shaderMaterial(
  {
    uColor: new Color(),
    uSunColor: new Color(),
    uSunPos: [0, 0, 0],
    uNoiseMap: new Texture(),
    uTime: 0,
    uAmbientFactor: 0.5,
    uDiffuseFactor: 0.5,
  },
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
  const tendTile = useStore((state) => state.actions.tendTile);

  const noiseTexture = useTexture(noiseImage.src);

  const { sandColor } = useControls('Sand', {
    sandColor: '#ffeac2',
  });

  const { sunColor, sunPos, ambientFactor, diffuseFactor } = useControls(
    'Lighting',
    {
      sunColor: 'white',
      sunPos: [0, 10, -2],
      ambientFactor: { value: 0.9, min: 0, max: 1, step: 0.05 },
      diffuseFactor: { value: 0.2, min: 0, max: 1, step: 0.05 },
    }
  );

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
    if (tendable && type === 'sand') {
      // DO SOME ANIMATION
      tendTile(ref.current);
    }

    ref.current.material.uTime = clock.elapsedTime;
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
      <planeGeometry args={[1, 1, 8, 8]} />
      <sandMaterial
        uColor={sandColor}
        uNoiseMap={noiseTexture}
        uAmbientFactor={ambientFactor}
        uDiffuseFactor={diffuseFactor}
        uSunColor={sunColor}
        uSunPos={sunPos}
      />

      {type === 'stone' && (
        <Stone scale={[0.9, 0.9, 0.1]} position={[0, 0, 0.05]} />
      )}
      {type === 'pond' && (
        <Pond scale={[0.9, 0.9, 0.1]} position={[0, 0, 0.05]} />
      )}
      {type === 'tree' && (
        <Tree scale={[0.9, 0.9, 0.1]} position={[0, 0, 0.05]} />
      )}

      {/* TEMPORARY FOR DEBUGGING LEVELS */}
      <group rotation-x={Math.PI / 2}>
        {level > 0 && <Box scale={[0.1, 0.1, 0.1]} position={[-0.2, 0.2, 0]} />}
        {level > 1 && <Box scale={[0.1, 0.1, 0.1]} position={[0.2, 0.2, 0]} />}
        {level > 2 && <Box scale={[0.1, 0.1, 0.1]} position={[0, 0.2, 0.2]} />}
      </group>
    </mesh>
  );
};

export default Tile;
