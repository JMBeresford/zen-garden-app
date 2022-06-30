import useStore from '@/store';
import { Box, shaderMaterial, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useCallback, useMemo, useRef } from 'react';
import { Color, Texture } from 'three';
import { vertexShader, fragmentShader } from './shaders';
import normalImage from '@/img/sandNormal.png';
import displacementImage from '@/img/sandDisplacement.png';
import roughnessImage from '@/img/sandRoughness.png';
import Stone from './Stone';
import Pond from './Pond';
import Tree from './Tree';

const SandMaterial = shaderMaterial(
  {
    uColor: new Color(),
    uSunColor: new Color(),
    uSunPos: [0, 0, 0],
    uNormalMap: new Texture(),
    uDisplacementMap: new Texture(),
    uRoughnessMap: new Texture(),
    uAmbientFactor: 0.5,
    uDiffuseFactor: 0.5,
    uDisplacement: 0.1,
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

  const [normalTexture, displacementTexture, roughnessTexture] = useTexture([
    normalImage.src,
    displacementImage.src,
    roughnessImage.src,
  ]);

  const { sandColor, displacement } = useControls('Sand', {
    sandColor: '#ffe3af',
    displacement: { value: 0.1, min: 0, max: 1, step: 0.05 },
  });

  const { sunColor, sunPos, ambientFactor, diffuseFactor } = useControls(
    'Lighting',
    {
      sunColor: 'white',
      sunPos: [0, 10, -2],
      ambientFactor: { value: 0.5, min: 0, max: 1, step: 0.05 },
      diffuseFactor: { value: 0.5, min: 0, max: 1, step: 0.05 },
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
        uNormalMap={normalTexture}
        uDisplacementMap={displacementTexture}
        uRoughnessMap={roughnessTexture}
        uAmbientFactor={ambientFactor}
        uDiffuseFactor={diffuseFactor}
        uSunColor={sunColor}
        uDisplacement={displacement}
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
