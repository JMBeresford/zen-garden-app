import { useMemo, useCallback } from 'react';
import useStore from '@/store';
import {
  Instance,
  Instances,
  shaderMaterial,
  useTexture,
} from '@react-three/drei';
import { Color, Texture } from 'three';
import { vertexShader, fragmentShader } from './shaders';
import Tile from './Tile';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import noiseImage from '@/img/waves.png';
import { useRef, useEffect } from 'react';

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
    mat.defines.USE_INSTANCING = '';
    // mat.transparent = true;
  }
);

extend({ SandMaterial });

const Tiles = () => {
  const ref = useRef();
  const { tiles, gridSize } = useStore();

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

  useFrame(({ clock }) => {
    ref.current.material.uTime = clock.elapsedTime;
  });

  return (
    <Instances ref={ref}>
      <planeGeometry args={[1, 1]} />
      <sandMaterial
        uColor={sandColor}
        uNoiseMap={noiseTexture}
        uAmbientFactor={ambientFactor}
        uDiffuseFactor={diffuseFactor}
        uSunColor={sunColor}
        uSunPos={sunPos}
      />

      {tiles.map((tile, index) => {
        let mid = Math.floor(gridSize / 2);
        let x = -mid + (index % gridSize);
        let z = -mid + Math.floor(index / gridSize);

        tile.position = [x, 0, z];

        return <Tile key={index} {...tile} index={index} />;
      })}
    </Instances>
  );
};

export default Tiles;
