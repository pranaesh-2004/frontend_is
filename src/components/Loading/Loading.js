import React from 'react';
import { useLoading } from '../../hooks/useLoading';
import classes from './loading.module.css';

export default function Loading() {
  const { isLoading } = useLoading();
  if (!isLoading) return;

  return (
    <div className={classes.container}>
      <div className={classes.items}>
<<<<<<< HEAD
        <img src="/loading.svg" alt="Loading!" />
=======
        <img src="/loadin.svg" alt="Loading!" />
>>>>>>> 4228c54e0c651cc8601ee0dcbc07ab673a979434
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
