import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Button, Inputs} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {reqDoneListStatus, workAddAsync} from '../../../store/workSlice';
import moment from 'moment';

const validator = new ReeValidate({
  last_done: 'required',
  running_hours: '',
  instructions: '',
  remarks: '',
  file: 'max:10000'
});

function WorkForm({ids}) {
  const {Date, Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDoneListStatus);

  const [formData, setFormData] = useState({
    last_done: moment().format("DD-MMM-YYYY"),
    running_hours: '',
    instructions: '',
    remarks: '',
    file: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  const handleInputChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = type === 'file' ? Array.from(e.target.files) : e.target.value;
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
    const vesselMachinerySubCategoryIds = {};
    ids.forEach((id, i) => {
      vesselMachinerySubCategoryIds[`vessel_machinery_sub_category_ids[${i}]`] = id;
    });
    dispatch(workAddAsync({...vesselMachinerySubCategoryIds, ...formData}));
  };

  return (
    <Row>
      <Col xs={12}>
        <Date
          name="last_done"
          id="lastDoneInput"
          label="Last Done"
          labelPosition="above"
          iconRight="fa-calendar"
          format="DD-MMM-YYYY"
          dateProps={{
            numberOfMonths: 1,
            isOutsideRange: () => false
          }}
          onChange={handleInputChange}
          value={moment(formData.last_done)}
          type={formErrors['last_done'] ? 'error' : ''}
          help={formErrors['last_done']}
        />
      </Col>
      <Col xs={12}>
        <Text
          name="running_hours"
          id="runningHoursInput"
          label="Running Hours"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.running_hours}
        />
      </Col>
      <Col xs={12}>
        <Text
          inputType="textarea"
          name="instructions"
          id="instructionsInput"
          label="Instructions"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.instructions}
        />
      </Col>
      <Col xs={12}>
        <Text
          inputType="textarea"
          name="remarks"
          id="remarksInput"
          label="Remarks"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.remarks}
        />
      </Col>
      <Col xs={12}>
        <Text
          inputType="file"
          name="file"
          id="fileInput"
          label="File Upload"
          labelPosition="above"
          onChange={handleInputChange}
          type={formErrors['file'] ? 'error' : ''}
          help={formErrors['file']}
        />
      </Col>
      <Col xs={12}>
        <Button type="primary" text="Save" onClick={handleSubmitForm} disabled={isLoading} pullRight/>
      </Col>
    </Row>
  )
}

WorkForm.propTypes = {
  ids: PropTypes.array.isRequired,
};

export default WorkForm;
