import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';

function Divider(props) {
  const {type = 'space'} = props;

  return (
    <Row>
      <Col xs={12}>
        {type === 'line' && <hr className="margin-10" />}
        {type === 'space' && <div className="margin-10"/>}
      </Col>
    </Row>
  )
}

Divider.propTypes = {
  type: PropTypes.oneOf(['space', 'line']),
};

export default Divider;
