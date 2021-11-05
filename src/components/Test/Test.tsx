import React, { FC, ReactElement } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import './Test.scss';

import { increment, selectCount } from '../../features/testSlice';

import Button from '@material-ui/core/Button';

type TestProps = {
  label?: string
};

const Test: FC<TestProps> = ({label = 'Test'}): ReactElement => {

  const dispatch = useAppDispatch();

  const value = useAppSelector(selectCount);

  const clicked = () => {
    dispatch(increment());
  };
  
  return (
    <div className="Test">
      <Button variant="contained" color="primary" onClick={clicked}>{`${label}: ${value}`}</Button>
    </div>
  );
};

export default Test;
