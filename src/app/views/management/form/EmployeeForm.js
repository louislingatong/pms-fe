import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Inputs} from 'adminlte-2-react';
import {Col, Row, Button} from 'react-bootstrap';
import Transform from '../../../utils/Transformer';
import {employeeAddAsync, employeeEditAsync, reqDataStatus} from '../../../store/employeeSlice';
import EmployeeDepartmentSelect from '../../../components/select/EmployeeDepartmentSelect';
import Employee from '../../../core/models/Employee';
import InchargeRankSelect from "../../../components/select/InchargeRankSelect";

const validator = new ReeValidate({
  email: 'required|email',
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
    position: employee.position,
    is_admin: employee.is_admin
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

  const handleIsAdminCheck = (e) => {
    const name = e.target.name;
    const isChecked = e.target.checked;
    setFormData({...formData, [name]: isChecked ? 1 : 0});
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
    <form onSubmit={handleSubmitForm} noValidate>
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
          {
            formData.department === 'Crewing'
              ? <InchargeRankSelect
                form
                name="position"
                id="positionSelect"
                label="Position"
                labelPosition="above"
                allowClear={true}
                onChange={handleInputChange}
                value={formData.position}/>
              : <Text
                name="position"
                id="positionFormInput"
                label="Position"
                labelPosition="above"
                onChange={handleInputChange}
                value={formData.position}
              />
          }
        </Col>
        <Col xs={12}>
          <div className="checkbox">
            <label>
              <input type="checkbox" name="is_admin"
                     checked={!!formData.is_admin}
                     onChange={handleIsAdminCheck}/>
              Admin
            </label>
          </div>
        </Col>
        <Col xs={12}>
          <Button type="submit"
                  bsStyle="primary"
                  id="loginButton"
                  className="pull-right"
                  disabled={isLoading}>
            Save
          </Button>
        </Col>
      </Row>
    </form>
  )
}

EmployeeForm.propTypes = {
  data: PropTypes.instanceOf(Employee).isRequired
};

export default EmployeeForm;
