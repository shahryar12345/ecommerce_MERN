import React from 'react';
import loader from '../../assets/loader.gif';

export default (props) => {
  const styles = {
    margin: 'auto',
    display: 'block',
    width: props.width
  }
  return (
    <div>
      <img
        src={loader}
        style={styles}
        alt="Loading..."
      />
    </div>
  )
}
