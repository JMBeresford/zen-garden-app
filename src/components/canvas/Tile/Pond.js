import { RoundedBox } from '@react-three/drei';
import React from 'react';

const Pond = (props) => {
  return (
    <RoundedBox radius={0.05} smoothness={16} {...props}>
      <meshPhongMaterial color='#b0f6ff' />
    </RoundedBox>
  );
};

export default Pond;
