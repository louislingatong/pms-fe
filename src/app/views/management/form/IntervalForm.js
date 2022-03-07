import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Inputs, Button} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {reqDataStatus, intervalEditAsync, intervalAddAsync} from '../../../store/intervalSlice';
import Interval from '../../../core/models/Interval';
import IntervalUnitSelect from "../../../components/select/IntervalUnitSelect";

const validator = new ReeValidate({
  value: 'required|numeric|min_value:1',
  unit: 'required',
});

function IntervalForm({data: localInterval}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);

  const [isViewing, setIsViewing] = useState(false);

  const [formData, setFormData] = useState({
    value: localInterval.value ? localInterval.value : 1,
    unit: localInterval.unit.name
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  useEffect(() => {
    if (localInterval.id) {
      setIsViewing(true);
    }
  }, [localInterval]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const {errors} = validator;

    setFormData({...formData, [name]: value});

    errors.remove(name);

    validator.validate(name, value)
      .then(() => {
        const transformedErrors = Transform.toFormError(errors);
        setFormErrors(transformedErrors);
      })
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    validator.validateAll(formData)
      .then((success) => {
        if (success) {
          submit();
        } else {
          const transformedErrors = Transform.toFormError((validator.errors));
          setFormErrors(transformedErrors);
        }
      })
  };

  const submit = () => {
    if (localInterval.id) {
      const newFormData = {
        ...formData,
        interval_id: localInterval.id
      }
      dispatch(intervalEditAsync(newFormData));
    } else {
      dispatch(intervalAddAsync(formData));
    }
  };

  return (
    <Row>
      <Col xs={12}>
        <Text
          inputType="number"
          name="value"
          id="intervalValueInput"
          label="Value"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.value}
          disabled={isViewing}
          type={formErrors['value'] ? 'error' : ''}
          help={formErrors['value']}
        />
      </Col>
      <Col xs={12}>
        <IntervalUnitSelect
          form
          name="unit"
          id="unitSelect"
          label="Unit"
          labelPosition="above"
          allowClear={true}
          onChange={handleInputChange}
          value={formData.unit}
          disabled={isViewing}
          type={formErrors['unit'] ? 'error' : ''}
          help={formErrors['unit']}
        />
      </Col>
      <Col xs={12}>
        {
          isViewing
            ? <Button type="primary" text="Edit" onClick={() =>  setIsViewing(false)} pullRight/>
            : <Button type="primary"
                      text={localInterval.id ? 'Save' : 'Add'}
                      onClick={handleSubmitForm}
                      disabled={isLoading}
                      pullRight/>

        }
      </Col>
    </Row>
  )
}

IntervalForm.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Interval)
  ]),
};

export default IntervalForm;
