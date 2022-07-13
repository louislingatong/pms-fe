import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Inputs} from 'adminlte-2-react';
import {Button, Col, Row} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {machineryAddSubCategoryAsync, reqDataStatus} from '../../../store/machinerySlice';

const validator = new ReeValidate({
  code: 'required',
  name: 'required',
});

function SubCategoryForm({machineryId}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);

  const [formData, setFormData] = useState({
    code: '',
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
      code: formData.code,
      name: formData.name,
    }));
  };

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <Row>
        <Col xs={12} lg={3}>
          <Text
            name="code"
            id="subCategoryCodeInput"
            label="Code"
            labelPosition="above"
            onChange={handleInputChange}
            value={formData.code}
            type={formError['code'] ? 'error' : ''}
            help={formError['code']}
          />
        </Col>
        <Col xs={12} lg={9}>
          <Text
            name="name"
            id="subCategoryNameInput"
            label="Name"
            labelPosition="above"
            onChange={handleInputChange}
            value={formData.name}
            type={formError['name'] ? 'error' : ''}
            help={formError['name']}
          />
        </Col>
        <Col xs={12}>
          <Button type="submit" bsStyle="primary" disabled={isLoading} className="pull-right">Add</Button>
        </Col>
      </Row>
    </form>
  );
}

SubCategoryForm.propTypes = {
  machineryId: PropTypes.number
}

export default SubCategoryForm;
