import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ReeValidate from 'ree-validate';
import {Col, Row} from 'react-bootstrap';
import {Button, Inputs} from 'adminlte-2-react';
import {reqDataStatus, vesselMachineryAddAsync, vesselMachineryEditAsync} from '../../../store/vesselMachinerySlice';
import Transform from '../../../utils/Transformer';
import VesselMachinery from '../../../core/models/VesselMachinery';
import moment from 'moment';
import {activeVesselSubMenu} from '../../../store/navbarMenuSlice';
import MachinerySelect from '../../../components/select/MachinerySelect';
import InchargeRankSelect from '../../../components/select/InchargeRankSelect';
import MachineryModelAutoSuggest from '../../../components/auto-suggest/MachineryModelAutoSuggest';
import MachineryMakerAutoSuggest from '../../../components/auto-suggest/MachineryMakerAutoSuggest';

const validator = new ReeValidate({
  vessel: 'required',
  machinery: 'required',
  model: '',
  maker: '',
  incharge_rank: 'required',
  installed_date: 'required'
});

function VesselMachineryForm({data: localVesselMachinery}) {
  const {Date, Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);
  const activeVessel = useSelector(activeVesselSubMenu);

  const [isViewing, setIsViewing] = useState(false);
  const [formData, setFormData] = useState({
    vessel: activeVessel.name,
    machinery: localVesselMachinery.machinery.name,
    model: localVesselMachinery.model.name,
    maker: localVesselMachinery.maker.name,
    incharge_rank: localVesselMachinery.incharge_rank.name,
    installed_date: localVesselMachinery.installed_date
      ? moment(localVesselMachinery.installed_date).format("DD-MMM-YYYY")
      : moment().format("DD-MMM-YYYY")
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  useEffect(() => {
    if (localVesselMachinery.id) {
      setIsViewing(true);
    }
  }, [localVesselMachinery]);

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
    if (localVesselMachinery.id) {
      const newFormData = {
        ...formData,
        vessel_machinery_id: localVesselMachinery.id
      };
      dispatch(vesselMachineryEditAsync(newFormData));
    } else {
      dispatch(vesselMachineryAddAsync(formData));
    }
  };

  return (
    <Row>
      <Col xs={12}>
        <Row>
          <Col xs={12} md={4}>
            <Text
              name="vessel"
              id="vesselInput"
              label="Vessel"
              labelPosition="above"
              value={formData.vessel}
              disabled={true}/>
          </Col>
          <Col xs={12} md={8}>
            <MachinerySelect
              form
              name="machinery"
              id="machinerySelect"
              label="Machinery"
              labelPosition="above"
              allowClear={true}
              onChange={handleInputChange}
              value={formData.machinery}
              disabled={isViewing}
              type={formErrors['machinery'] ? 'error' : ''}
              help={formErrors['machinery']}
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
          <Col xs={12} md={4}>
            <InchargeRankSelect
              form
              name="incharge_rank"
              id="inchargeRankSelect"
              label="In-charge Rank"
              labelPosition="above"
              allowClear={true}
              onChange={handleInputChange}
              value={formData.incharge_rank}
              disabled={isViewing}
              type={formErrors['incharge_rank'] ? 'error' : ''}
              help={formErrors['incharge_rank']}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <Row>
          <Col xs={12} md={4}>
            <Date
              name="installed_date"
              id="installedDateInput"
              label="Commissioning Date"
              labelPosition="above"
              iconRight="fa-calendar"
              format="DD-MMM-YYYY"
              dateProps={{
                numberOfMonths: 1,
                isOutsideRange: () => false
              }}
              onChange={handleInputChange}
              value={moment(formData.installed_date)}
              disabled={isViewing}
              type={formErrors['installed_date'] ? 'error' : ''}
              help={formErrors['installed_date']}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        {
          isViewing
            ? <Button type="primary" text="Edit" onClick={() => setIsViewing(false)} pullRight/>
            : <Button type="primary"
                      text={localVesselMachinery.id ? 'Save' : 'Add'}
                      onClick={handleSubmitForm}
                      disabled={isLoading}
                      pullRight/>
        }
      </Col>
    </Row>
  );
}

VesselMachineryForm.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(VesselMachinery)
  ]),
};

export default VesselMachineryForm;
