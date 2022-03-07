import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Col, Row} from 'react-bootstrap';
import {Inputs, Button} from 'adminlte-2-react';
import {machineryAddAsync, machineryEditAsync} from '../../../store/machinerySlice';
import Transform from '../../../utils/Transformer';
import Machinery from '../../../core/models/Machinery';
import {reqDataStatus} from '../../../store/machinerySlice';
import VesselDepartmentSelect from '../../../components/select/VesselDepartmentSelect';
import MachineryModelAutoSuggest from '../../../components/auto-suggest/MachineryModelAutoSuggest';
import MachineryMakerAutoSuggest from '../../../components/auto-suggest/MachineryMakerAutoSuggest';

const validator = new ReeValidate({
  department: 'required',
  name: 'required',
  code: 'required',
  model: '',
  maker: '',
});

function MachineryForm({data: localMachinery}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);

  const [isViewing, setIsViewing] = useState(false);
  const [formData, setFormData] = useState({
    department: localMachinery.department.name,
    code_name: localMachinery.code_name,
    name: localMachinery.name,
    model: localMachinery.model.name,
    maker: localMachinery.maker.name
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  useEffect(() => {
    if (localMachinery.id) {
      setIsViewing(true);
    }
  }, [localMachinery]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const {errors} = validator;

    setFormData({...formData, [name]: value});

    errors.remove(name);

    validator.validate(name, value)
      .then(() => {
        setFormErrors(Transform.toFormError(errors));
      })
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    validator.validateAll(formData)
      .then((success) => {
        if (success) {
          submit();
        } else {
          setFormErrors(Transform.toFormError((validator.errors)));
        }
      })
  };

  const submit = () => {
    if (localMachinery.id) {
      const newFormData = {
        ...formData,
        machinery_id: localMachinery.id
      }
      dispatch(machineryEditAsync(newFormData));
    } else {
      dispatch(machineryAddAsync(formData));
    }
  };

  return (
    <Row>
      <Col xs={12}>
        <Row>
          <Col xs={12} md={4}>
            <VesselDepartmentSelect
              form
              name="department"
              id="departmentSelect"
              label="Department"
              labelPosition="above"
              allowClear={true}
              onChange={handleInputChange}
              value={formData.department}
              disabled={isViewing}
              type={formErrors['department'] ? 'error' : ''}
              help={formErrors['department']}
            />
          </Col>
          <Col xs={12} md={4}>
            <Text
              name="name"
              id="nameInput"
              label="Name"
              labelPosition="above"
              onChange={handleInputChange}
              value={formData.name}
              disabled={isViewing}
              type={formErrors['name'] ? 'error' : ''}
              help={formErrors['name']}
            />
          </Col>
          <Col xs={12} md={4}>
            <Text
              name="code_name"
              id="codeNameInput"
              label="Code"
              labelPosition="above"
              onChange={handleInputChange}
              value={formData.code_name}
              disabled={isViewing}
              type={formErrors['code_name'] ? 'error' : ''}
              help={formErrors['code_name']}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <Row>
          <Col xs={12} md={4}>
            <MachineryModelAutoSuggest
              name="model"
              id="modelInput"
              label="Model"
              labelPosition="above"
              value={formData.model}
              onChange={handleInputChange}
              disabled={isViewing}
            />
          </Col>
          <Col xs={12} md={4}>
            <MachineryMakerAutoSuggest
              name="maker"
              id="makerInput"
              label="Maker"
              labelPosition="above"
              value={formData.maker}
              onChange={handleInputChange}
              disabled={isViewing}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        {
          isViewing
            ? <Button type="primary" text="Edit" onClick={() =>  setIsViewing(false)} pullRight/>
            : <Button type="primary"
                      text={localMachinery.id ? 'Save' : 'Add'}
                      onClick={handleSubmitForm}
                      disabled={isLoading}
                      pullRight/>
        }
      </Col>
    </Row>
  );
}

MachineryForm.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Machinery)
  ]),
};

export default MachineryForm;
