import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Inputs} from 'adminlte-2-react';
import {Button, Col, Row} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {reqDataStatus, runningHourAddAsync} from '../../../store/runningHourSlice';
import {profileData} from '../../../store/profileSlice';
import moment from 'moment';

let validator;

function RunningHourForm({id}) {
  const {Date, Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);
  const profile = useSelector(profileData);

  const [formData, setFormData] = useState({
    vessel_machinery_id: id,
    updating_date: moment().format("DD-MMM-YYYY"),
    running_hours: 1,
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  useEffect(() => {
    validator = new ReeValidate({
      updating_date: 'required',
      running_hours: 'required|min_value:1',
    });
  }, []);

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
    dispatch(runningHourAddAsync(formData));
  };

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <Row>
        <Col xs={12}>
          <Text
            inputType="number"
            name="running_hours"
            id="runningHoursInput"
            label="Running Hours"
            labelPosition="above"
            onChange={handleInputChange}
            value={formData.running_hours}
            type={formErrors['running_hours'] ? 'error' : ''}
            help={formErrors['running_hours']}
          />
        </Col>
        <Col xs={12}>
          <Date
            name="updating_date"
            id="updatingDateInput"
            label="Updating Date"
            labelPosition="above"
            iconRight="fa-calendar"
            format="DD-MMM-YYYY"
            dateProps={{
              numberOfMonths: 1,
              isOutsideRange: () => false
            }}
            onChange={handleInputChange}
            value={moment(formData.updating_date)}
            type={formErrors['updating_date'] ? 'error' : ''}
            help={formErrors['updating_date']}
          />
        </Col>
        <Col xs={12}>
          {
            !!profile.permissions['running_hours_create']
              && <Button type="submit"
                         bsStyle="primary"
                         id="loginButton"
                         className="pull-right"
                         disabled={isLoading}>
              Save
            </Button>
          }
        </Col>
      </Row>
    </form>
  )
}

RunningHourForm.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};

export default RunningHourForm;
