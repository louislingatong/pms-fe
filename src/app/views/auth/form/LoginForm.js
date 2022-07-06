import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Row, Button} from 'react-bootstrap';
import {Inputs} from 'adminlte-2-react';
import ReeValidate from 'ree-validate';
import {loginAsync, reqLoginStatus} from '../../../store/authSlice';
import Transform from '../../../utils/Transformer';

const validator = new ReeValidate({
  username: 'required|email',
  password: 'required',
});

function LoginForm(props) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqLoginStatus);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    dispatch(loginAsync(formData));
  };

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <Row>
        <Col xs={12}>
          <Text inputType="email"
                name="username"
                id="emailInput"
                labelPosition="none"
                placeholder="Email"
                onChange={handleInputChange}
                type={formErrors['username'] ? 'error' : ''}
                help={formErrors['username']}
          />
        </Col>
        <Col xs={12}>
          <Text inputType="password"
                name="password"
                id="passwordInput"
                labelPosition="none"
                placeholder="Password"
                onChange={handleInputChange}
                type={formErrors['password'] ? 'error' : ''}
                help={formErrors['password']}
          />
        </Col>
        <Col xs={12}>
          <Button type="submit"
                  bsStyle="primary"
                  id="loginButton"
                  className="pull-right"
                  disabled={isLoading}>
            Submit
          </Button>
        </Col>
      </Row>
    </form>
  )
}

export default LoginForm;
