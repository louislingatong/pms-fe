import React from 'react';
import PropTypes from 'prop-types';
import {BarLoader, ClipLoader, BeatLoader, PulseLoader, HashLoader} from 'react-spinners';
import {css} from '@emotion/react'

const override = css`
  display: block;
  width: 100%;
  z-index: 1041;
`;

const colors = {
  light: '#fff',
  dark: '#000'
};

function Loader(props) {
  const {color = 'dark', type = 'beat'} = props;
  switch (type) {
    case 'beat':
      return <div><BeatLoader color={colors[color]} loading={true} size={10}/></div>
    case 'clip':
      return <div className="loader-wrapper-overlay"><HashLoader color={colors[color]} loading={true} size={30}/></div>
    case 'bar':
    default:
      return <div className="loader-wrapper"><BarLoader color={colors[color]} loading={true} css={override}/></div>
  }
}

Loader.propTypes = {
  type: PropTypes.oneOf(['bar', 'clip', 'beat']),
  color: PropTypes.oneOf(['light', 'dark']),
};

export default Loader;
