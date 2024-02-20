import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Row, Button} from 'react-bootstrap';
import {Inputs} from 'adminlte-2-react';
import ReeValidate from 'ree-validate';
import {forgotPasswordAsync, reqForgotPasswordStatus} from '../../../store/authSlice';
import Transform from '../../../utils/Transformer';

let validator;

function ForgotPasswordForm(props) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqForgotPasswordStatus);

  const [formData, setFormData] = useState({
    email: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  useEffect(() => {
    validator = new ReeValidate({
      email: 'required|email'
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
    dispatch(forgotPasswordAsync(formData));
  };

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <Row>
        <Col xs={12}>
          <Text inputType="email"
                name="email"
                id="emailInput"
                labelPosition="none"
                placeholder="Email"
                onChange={handleInputChange}
                type={formErrors['email'] ? 'error' : ''}
                help={formErrors['email']}
          />
        </Col>
        <Col xs={12}>
          <Button type="submit"
                  bsStyle="primary"
                  id="loginButton"
                  className="pull-right"
                  disabled={isLoading}>
            Forgot
          </Button>
        </Col>
      </Row>
    </form>
  )
}

export default ForgotPasswordForm;
