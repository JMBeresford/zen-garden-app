import useStore from '@/store';
import { Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCallback, useRef, useMemo } from 'react';
import Stone from './Stone';
import Pond from './Pond';
import Tree from './Tree';

const Tile = ({
  type = 'sand',
  index,
  level,
  tendable,
  tendableAt,
  ...props
}) => {
  const ref = useRef();
  const pointerDownRef = useRef();

  const { showContextMenu } = useStore();
  const tendTile = useStore((state) => state.actions.tendTile);

  const handleClick = useCallback(
    (e, tile) => {
      if (
        pointerDownRef.current &&
        performance.now() - pointerDownRef.current > 333
      ) {
        // if dragging for more than 1/3 of a second, don't show context menu on mouse up
        return;
      }

      e.stopPropagation();
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
    [showContextMenu]
  );

  const upgrade = useMemo(() => {
    switch (type) {
      case 'stone':
        return <Stone scale={[0.9, 0.1, 0.9]} position={[0, 0.05, 0]} />;
      case 'pond':
        return <Pond scale={[0.9, 0.1, 0.9]} position={[0, 0.05, 0]} />;
      case 'tree':
        return <Tree scale={[0.9, 0.1, 0.9]} position={[0, 0.05, 0]} />;
      default:
        return null;
    }
  }, [type]);

  useFrame(() => {
    if (tendable && type === 'sand') {
      // DO SOME ANIMATION
      tendTile(ref.current);
    }
  });

  return (
    <group
      ref={ref}
      {...props}
      onClick={(e) => handleClick(e, ref.current)}
      onPointerDown={() => {
        pointerDownRef.current = performance.now();
      }}
      userData={{
        type,
        index,
        level,
        tendable,
      }}
    >
      {upgrade}
      <Instance rotation-x={-Math.PI / 2} />
    </group>
  );
};

export default Tile;
