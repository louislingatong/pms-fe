import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Inputs, Button} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {reqDataStatus, employeeEditAsync, employeeAddAsync} from '../../../store/employeeSlice';
import EmployeeDepartmentSelect from '../../../components/select/EmployeeDepartmentSelect';
import Employee from '../../../core/models/Employee';

const validator = new ReeValidate({
  email: 'required|email',
  password: 'required',
  first_name: 'required',
  middle_name: '',
  last_name: 'required',
  department: 'required',
  id_number: '',
  position: '',
});

const placeholderPassword = 'E5DywsaXsMmlzqstXBScQ9YnLJOI4X55OlQbWM2d';

function EmployeeForm({data: employee}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);

  const [formData, setFormData] = useState({
    email: employee.email,
    password: employee.id ? placeholderPassword : '',
    first_name: employee.first_name,
    middle_name: employee.middle_name,
    last_name: employee.last_name,
    department: employee.department.name,
    id_number: employee.id_number,
    position: employee.position
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

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
    if (formData.password === placeholderPassword) {
      delete formData.password;
    }
    if (employee.id) {
      const newFormData = {
        ...formData,
        employee_id: employee.id
      }
      dispatch(employeeEditAsync(newFormData));
    } else {
      dispatch(employeeAddAsync(formData));
    }
  };

  return (
    <Row>
      <Col xs={12}>
        <Text inputType="email"
              name="email"
              id="emailFormInput"
              label="Email"
              labelPosition="above"
              value={formData.email}
              onChange={handleInputChange}
              type={formErrors['email'] ? 'error' : ''}
              help={formErrors['email']}
        />
      </Col>
      <Col xs={12}>
        <Text inputType="password"
              name="password"
              id="passwordFormInput"
              label="Password"
              labelPosition="above"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setFormData({...formData, password: ''})}
              type={formErrors['password'] ? 'error' : ''}
              help={formErrors['password']}
        />
      </Col>
      <Col xs={12}>
        <Text
          name="first_name"
          id="firstNameFormInput"
          label="First Name"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.first_name}
          type={formErrors['first_name'] ? 'error' : ''}
          help={formErrors['first_name']}
        />
      </Col>
      <Col xs={12}>
        <Text
          name="middle_name"
          id="middleNameFormInput"
          label="Middle Name"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.middle_name}
        />
      </Col>
      <Col xs={12}>
        <Text
          name="last_name"
          id="lastNameFormInput"
          label="Last Name"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.last_name}
          type={formErrors['last_name'] ? 'error' : ''}
          help={formErrors['last_name']}
        />
      </Col>
      <Col xs={12}>
        <EmployeeDepartmentSelect
          form
          name="department"
          id="employeeDepartmentSelect"
          label="Department"
          labelPosition="above"
          allowClear={true}
          onChange={handleInputChange}
          value={formData.department}
          type={formErrors['department'] ? 'error' : ''}
          help={formErrors['department']}
        />
      </Col>
      <Col xs={12}>
        <Text
          name="id_number"
          id="idNumberFormInput"
          label="Employee ID"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.id_number}
        />
      </Col>
      <Col xs={12}>
        <Text
          name="position"
          id="positionFormInput"
          label="Position"
          labelPosition="above"
          onChange={handleInputChange}
          value={formData.position}
        />
      </Col>
      <Col xs={12}>
        <Button type="primary"
                text="Save"
                onClick={handleSubmitForm}
                disabled={isLoading}
                pullRight/>
      </Col>
    </Row>
  )
}

EmployeeForm.propTypes = {
  data: PropTypes.instanceOf(Employee).isRequired
};

export default EmployeeForm;
