import React from 'react';
import { Slider } from 'antd';
const SliderANT = () => {
  const [value, setValue] = React.useState([0, 40]);
  return (
    <Slider
      range={{ editable: true, minCount: 1, maxCount: 5 }}
      value={value}
      onChange={setValue}
    />
  );
};
export default SliderANT;