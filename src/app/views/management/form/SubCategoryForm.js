import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Button, Inputs} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {machineryAddSubCategoryAsync, reqDataStatus} from '../../../store/machinerySlice';

const validator = new ReeValidate({
  name: 'required',
});

function SubCategoryForm({machineryId}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);

  const [formData, setFormData] = useState({
    name: ''
  });
  const [formError, setFormError] = useState({});

  const isLoading = status === 'loading';

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const {errors} = validator;

    setFormData({...formData, [name]: value});

    errors.remove(name);

    validator.validate(name, value)
      .then(() => {
        setFormError(Transform.toFormError(errors));
      })
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    validator.validateAll(formData)
      .then((success) => {
        if (success) {
          submit();
        } else {
          setFormError(Transform.toFormError((validator.errors)));
        }
      })
  };

  const submit = () => {
    dispatch(machineryAddSubCategoryAsync({
      machinery_id: machineryId,
      name: formData.name,
    }));
  };

  return (
    <Row>
      <Col xs={12}>
        <Text
          name="name"
          id="subCategoryNameInput"
          label="Name"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.name}
          type={formError['name'] ? 'error' : ''}
          help={formError['name']}
          buttonRight={<Button flat type="primary" text="Add" disabled={isLoading} onClick={handleSubmitForm}/>}
        />
      </Col>
    </Row>
  );
}

SubCategoryForm.propTypes = {
  machineryId: PropTypes.number
}

export default SubCategoryForm;
