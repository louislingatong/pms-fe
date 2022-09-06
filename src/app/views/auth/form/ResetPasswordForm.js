import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Row, Button} from 'react-bootstrap';
import {Inputs} from 'adminlte-2-react';
import ReeValidate from 'ree-validate';
import {resetPasswordAsync, reqResetPasswordStatus} from '../../../store/authSlice';
import Transform from '../../../utils/Transformer';

const validator = new ReeValidate({
  password: 'required',
  password_confirmation: 'required',
});

function ResetPasswordForm({token}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqResetPasswordStatus);

  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
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
    dispatch(resetPasswordAsync({...formData, token}));
  };

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <Row>
        <Col xs={12}>
          <Text inputType="password"
                name="password"
                id="passwordInput"
                labelPosition="none"
                placeholder="New Password"
                onChange={handleInputChange}
                type={formErrors['password'] ? 'error' : ''}
                help={formErrors['password']}
          />
        </Col>
        <Col xs={12}>
          <Text inputType="password"
                name="password_confirmation"
                id="confirmPasswordInput"
                labelPosition="none"
                placeholder="Confirm New Password"
                onChange={handleInputChange}
                type={formErrors['password_confirmation'] ? 'error' : ''}
                help={formErrors['password_confirmation']}
          />
        </Col>
        <Col xs={12}>
          <Button type="submit"
                  bsStyle="primary"
                  id="resetPasswordButton"
                  className="pull-right"
                  disabled={isLoading}>
            Reset
          </Button>
        </Col>
      </Row>
    </form>
  )
}

export default ResetPasswordForm;
