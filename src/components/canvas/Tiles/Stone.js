import { RoundedBox } from '@react-three/drei';
import React from 'react';

const Stone = (props) => {
  return (
    <RoundedBox radius={0.05} smoothness={16} {...props}>
      <meshPhongMaterial color='#f5f5f5' />
    </RoundedBox>
  );
};

export default Stone;
