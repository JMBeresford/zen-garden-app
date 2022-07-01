import { Instance, Instances } from '@react-three/drei';
import { useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import model from '@/models/log.glb';
import bakedImage from '@/img/logBaked.png';
import aoImage from '@/img/logAO.png';
import useStore from '@/store';

const Logs = (props) => {
  const { gridSize } = useStore();
  const { nodes } = useGLTF(model);

  const [bakedTexture, aoTexture] = useTexture(
    [bakedImage.src, aoImage.src],
    ([baked, ao]) => {
      baked.flipY = false;
      ao.flipY = false;
      baked.encoding = 'sRGB';
    }
  );

  const logs = useMemo(() => {
    let mid = Math.floor(gridSize / 2);
    let logs = [];
    let y = 0.05;

    for (let i = 0; i < gridSize; i++) {
      logs.push(
        // top
        <Instance
          key={`top-log-${i}`}
          position={[-mid + i, y, -mid - 0.6]}
          rotation={[
            Math.random() > 0.5 ? Math.PI : 0,
            Math.PI / 2,
            Math.random() > 0.5 ? Math.PI : 0,
          ]}
        />,
        // bottom
        <Instance
          key={`bottom-log-${i}`}
          position={[-mid + i, y, mid + 0.6]}
          rotation={[
            Math.random() > 0.5 ? Math.PI : 0,
            Math.PI / 2,
            Math.random() > 0.5 ? Math.PI : 0,
          ]}
        />,
        // left
        <Instance
          key={`left-log-${i}`}
          position={[-mid - 0.6, y, -mid + i]}
          rotation={[
            0,
            Math.random() > 0.5 ? Math.PI : 0,
            Math.random() > 0.5 ? Math.PI : 0,
          ]}
        />,
        // right
        <Instance
          key={`right-log-${i}`}
          position={[mid + 0.6, y, -mid + i]}
          rotation={[
            0,
            Math.random() > 0.5 ? Math.PI : 0,
            Math.random() > 0.5 ? Math.PI : 0,
          ]}
        />
      );
    }

    return logs;
  }, [gridSize]);

  return (
    <Instances {...props} geometry={nodes.log.geometry}>
      <meshPhongMaterial map={bakedTexture} aoMap={aoTexture} />

      {logs}
    </Instances>
  );
};

export default Logs;
