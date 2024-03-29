import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Inputs} from 'adminlte-2-react';
import {Col, Row, Button} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {
  intervalAddAsync,
  intervalEditAsync,
  reqDataStatus
} from '../../../store/intervalSlice';
import {profileData} from '../../../store/profileSlice';
import Interval from '../../../core/models/Interval';
import IntervalUnitSelect from '../../../components/select/IntervalUnitSelect';

let validator;

function IntervalForm({data: localInterval}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);
  const profile = useSelector(profileData);

  const [isViewing, setIsViewing] = useState(false);

  const [formData, setFormData] = useState({
    value: localInterval.value,
    unit: localInterval.unit.name,
    name: localInterval.name
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  useEffect(() => {
    validator = new ReeValidate({
      value: 'numeric|min_value:1',
      unit: '',
      name: ''
    });
  }, []);

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

  const enableEdit = (e) => {
    e.preventDefault();
    setIsViewing(false);
  }

  return (
    <form onSubmit={handleSubmitForm} noValidate>
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
          <Text
            name="name"
            id="intervalNameInput"
            label="Name"
            labelPosition="above"
            onChange={handleInputChange}
            value={formData.name}
            disabled={isViewing}
          />
        </Col>
        <Col xs={12}>
          {
            isViewing
              ? !!profile.permissions['interval_edit']
                && <Button bsStyle="primary" onClick={e => enableEdit(e)} className="pull-right">Edit</Button>
              : <Button type="submit"
                        bsStyle="primary"
                        id="loginButton"
                        className="pull-right"
                        disabled={isLoading}>
                { localInterval.id ? 'Save' : 'Add' }
              </Button>
          }
        </Col>
      </Row>
    </form>
  )
}

IntervalForm.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Interval)
  ]),
};

export default IntervalForm;
