import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Inputs} from 'adminlte-2-react';
import {Button, Col, Row} from 'react-bootstrap';
import Vessel from '../../../core/models/Vessel';
import ReeValidate from 'ree-validate';
import {reqDataStatus, vesselAddAsync, vesselEditAsync} from '../../../store/vesselSlice';
import {useDispatch, useSelector} from 'react-redux';
import Transform from '../../../utils/Transformer';
import {Divider} from '../../../components';
import VesselOwnerAutoSuggest from '../../../components/auto-suggest/VesselOwnerAutoSuggest';

let validator;

function VesselForm({data: vessel}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);

  const [formData, setFormData] = useState({
    code_name: vessel.code_name,
    name: vessel.name,
    owner: vessel.owner.name,
    former_name: vessel.former_name,
    flag: vessel.flag,
    call_sign: vessel.call_sign,
    official_no: vessel.official_no,
    imo_no: vessel.imo_no,
    loa: vessel.loa,
    lbp: vessel.lbp,
    light_condition: vessel.light_condition,
    classification: vessel.classification,
    character: vessel.character,
    descriptive_note: vessel.descriptive_note,
    built_year: vessel.built_year,
    build_yard: vessel.build_yard,
    tpc: vessel.tpc,
    breadth: vessel.breadth,
    depth: vessel.depth,
    summer_draft: vessel.summer_draft,
    summer_freeboard: vessel.summer_freeboard,
    summer_deadweight: vessel.summer_deadweight,
    winter_draft: vessel.winter_draft,
    winter_freeboard: vessel.winter_freeboard,
    winter_deadweight: vessel.winter_deadweight,
    tropical_draft: vessel.tropical_draft,
    tropical_freeboard: vessel.tropical_freeboard,
    tropical_deadweight: vessel.tropical_deadweight,
    tropical_fw_draft: vessel.tropical_fw_draft,
    tropical_fw_freeboard: vessel.tropical_fw_freeboard,
    tropical_fw_deadweight: vessel.tropical_fw_deadweight,
    fw_draft: vessel.fw_draft,
    fw_freeboard: vessel.fw_freeboard,
    fw_deadweight: vessel.fw_deadweight,
    fw_allowance: vessel.fw_allowance,
    light_shift_drafts_f: vessel.light_shift_drafts_f,
    light_shift_drafts_a: vessel.light_shift_drafts_a,
    heavy_ballast_drafts_f: vessel.heavy_ballast_drafts_f,
    heavy_ballast_drafts_a: vessel.heavy_ballast_drafts_a,
    normal_ballast_drafts_f: vessel.normal_ballast_drafts_f,
    normal_ballast_drafts_a: vessel.normal_ballast_drafts_a,
    international_gt: vessel.international_gt,
    international_nt: vessel.international_nt,
    panama_gt: vessel.panama_gt,
    panama_nt: vessel.panama_nt,
    suez_gt: vessel.suez_gt,
    suez_nt: vessel.suez_nt,
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === 'loading';

  useEffect(() => {
    validator = new ReeValidate({
      code_name: 'required',
      name: 'required',
      owner: 'required',
      former_name: '',
      flag: '',
      call_sign: '',
      official_no: '',
      imo_no: '',
      loa: '',
      lbp: '',
      light_condition: '',
      classification: '',
      character: '',
      descriptive_note: '',
      built_year: '',
      build_yard: '',
      tpc: '',
      breadth: '',
      depth: '',
      summer_draft: '',
      summer_freeboard: '',
      summer_deadweight: '',
      winter_draft: '',
      winter_freeboard: '',
      winter_deadweight: '',
      tropical_draft: '',
      tropical_freeboard: '',
      tropical_deadweight: '',
      tropical_fw_draft: '',
      tropical_fw_freeboard: '',
      tropical_fw_deadweight: '',
      fw_draft: '',
      fw_freeboard: '',
      fw_deadweight: '',
      fw_allowance: '',
      light_shift_drafts_f: '',
      light_shift_drafts_a: '',
      heavy_ballast_drafts_f: '',
      heavy_ballast_drafts_a: '',
      normal_ballast_drafts_f: '',
      normal_ballast_drafts_a: '',
      international_gt: '',
      international_nt: '',
      panama_gt: '',
      panama_nt: '',
      suez_gt: '',
      suez_nt: '',
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
    if (vessel.id) {
      const newFormData = {
        ...formData,
        vessel_id: vessel.id
      }
      dispatch(vesselEditAsync(newFormData));
    } else {
      dispatch(vesselAddAsync(formData));
    }
  };

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <Row>
        <Col xs={6}>
          <Row>
            <Col xs={4}><label>Owner</label></Col>
            <Col xs={8}>
              <VesselOwnerAutoSuggest
                name="owner"
                id="ownerFormInput"
                labelPosition="none"
                value={formData.owner}
                onChange={handleInputChange}
                type={formErrors['owner'] ? 'error' : ''}
                help={formErrors['owner']}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Code</label></Col>
            <Col xs={8}>
              <Text name="code_name"
                    id="codeNameFormInput"
                    labelPosition="none"
                    value={formData.code_name}
                    onChange={handleInputChange}
                    type={formErrors['code_name'] ? 'error' : ''}
                    help={formErrors['code_name']}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Name</label></Col>
            <Col xs={8}>
              <Text name="name"
                    id="nameFormInput"
                    labelPosition="none"
                    value={formData.name}
                    onChange={handleInputChange}
                    type={formErrors['name'] ? 'error' : ''}
                    help={formErrors['name']}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Former Name</label></Col>
            <Col xs={8}>
              <Text name="former_name"
                    id="formerNameFormInput"
                    labelPosition="none"
                    value={formData.former_name}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Flag</label></Col>
            <Col xs={8}>
              <Text name="flag"
                    id="flagFormInput"
                    labelPosition="none"
                    value={formData.flag}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Call Sign</label></Col>
            <Col xs={8}>
              <Text name="call_sign"
                    id="callSignFormInput"
                    labelPosition="none"
                    value={formData.call_sign}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Official No.</label></Col>
            <Col xs={8}>
              <Text name="official_no"
                    id="officialNoFormInput"
                    labelPosition="none"
                    value={formData.official_no}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>IMO No.</label></Col>
            <Col xs={8}>
              <Text name="imo_no"
                    id="imoNoFormInput"
                    labelPosition="none"
                    value={formData.imo_no}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>LOA/LBP</label></Col>
            <Col xs={8}>
              <Row>
                <Col xs={6}>
                  <Text name="loa"
                        id="loaFormInput"
                        labelPosition="none"
                        value={formData.loa}
                        onChange={handleInputChange}
                  />
                </Col>
                <Col xs={6}>
                  <Text name="lbp"
                        id="lbpFormInput"
                        labelPosition="none"
                        value={formData.lbp}
                        onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={6}>
          <Row>
            <Col xs={4}><label>Light Condition</label></Col>
            <Col xs={8}>
              <Text name="light_condition"
                    id="lightConditionFormInput"
                    labelPosition="none"
                    value={formData.light_condition}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Classification</label></Col>
            <Col xs={8}>
              <Text name="classification"
                    id="classificationFormInput"
                    labelPosition="none"
                    value={formData.classification}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Character</label></Col>
            <Col xs={8}>
              <Text name="character"
                    id="characterFormInput"
                    labelPosition="none"
                    value={formData.character}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Descriptive Note</label></Col>
            <Col xs={8}>
              <Text name="descriptive_note"
                    id="descriptiveNoteFormInput"
                    labelPosition="none"
                    value={formData.descriptive_note}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Built Year</label></Col>
            <Col xs={8}>
              <Text name="built_year"
                    id="builtYearFormInput"
                    labelPosition="none"
                    value={formData.built_year}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Built Yard</label></Col>
            <Col xs={8}>
              <Text name="build_yard"
                    id="buildYardFormInput"
                    labelPosition="none"
                    value={formData.build_yard}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>TPC</label></Col>
            <Col xs={8}>
              <Text name="tpc"
                    id="tpcFormInput"
                    labelPosition="none"
                    value={formData.tpc}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Breadth (MLD)</label></Col>
            <Col xs={8}>
              <Text name="breadth"
                    id="breadthFormInput"
                    labelPosition="none"
                    value={formData.breadth}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}><label>Depth (MLD)</label></Col>
            <Col xs={8}>
              <Text name="depth"
                    id="depthFormInput"
                    labelPosition="none"
                    value={formData.depth}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}><Divider type="line"/></Col>
        <Col xs={12}>
          <Row>
            <Col xs={3}/>
            <Col xs={3}><label>Drafts</label></Col>
            <Col xs={3}><label>Freeboard</label></Col>
            <Col xs={3}><label>Deadweight</label></Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={3}><label>Summer</label></Col>
            <Col xs={3}>
              <Text name="summer_draft"
                    id="summerDraftFormInput"
                    labelPosition="none"
                    value={formData.summer_draft}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="summer_freeboard"
                    id="summerFreeboardFormInput"
                    labelPosition="none"
                    value={formData.summer_freeboard}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="summer_deadweight"
                    id="summerDeadweightFormInput"
                    labelPosition="none"
                    value={formData.summer_deadweight}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={3}><label>Winter</label></Col>
            <Col xs={3}>
              <Text name="winter_draft"
                    id="winterDraftFormInput"
                    labelPosition="none"
                    value={formData.winter_draft}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="winter_freeboard"
                    id="winterFreeboardFormInput"
                    labelPosition="none"
                    value={formData.winter_freeboard}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="winter_deadweight"
                    id="winterDeadweightFormInput"
                    labelPosition="none"
                    value={formData.winter_deadweight}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={3}><label>Tropical</label></Col>
            <Col xs={3}>
              <Text name="tropical_draft"
                    id="tropicalDraftFormInput"
                    labelPosition="none"
                    value={formData.tropical_draft}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="tropical_freeboard"
                    id="tropicalFreeboardFormInput"
                    labelPosition="none"
                    value={formData.tropical_freeboard}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="tropical_deadweight"
                    id="tropicalDeadweightFormInput"
                    labelPosition="none"
                    value={formData.tropical_deadweight}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={3}><label>Tropical F.W.</label></Col>
            <Col xs={3}>
              <Text name="tropical_fw_draft"
                    id="tropicalFwDraftFormInput"
                    labelPosition="none"
                    value={formData.tropical_fw_draft}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="tropical_fw_freeboard"
                    id="tropicalFwFreeboardFormInput"
                    labelPosition="none"
                    value={formData.tropical_fw_freeboard}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="tropical_fw_deadweight"
                    id="tropicalFwDeadweightFormInput"
                    labelPosition="none"
                    value={formData.tropical_fw_deadweight}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={3}><label>F.W</label></Col>
            <Col xs={3}>
              <Text name="fw_draft"
                    id="fwDraftFormInput"
                    labelPosition="none"
                    value={formData.fw_draft}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="fw_freeboard"
                    id="fwFreeboardFormInput"
                    labelPosition="none"
                    value={formData.fw_freeboard}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={3}>
              <Text name="fw_deadweight"
                    id="fwDeadweightFormInput"
                    labelPosition="none"
                    value={formData.fw_deadweight}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={3}><label>F.W. Allowance</label></Col>
            <Col xs={3}>
              <Text name="fw_allowance"
                    id="fwAllowanceFormInput"
                    labelPosition="none"
                    value={formData.fw_allowance}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}><Divider type="line"/></Col>
        <Col xs={12}>
          <Col xs={4}></Col>
          <Col xs={4}><label>F</label></Col>
          <Col xs={4}><label>A</label></Col>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={4}><label>Light Shift Drafts (M)</label></Col>
            <Col xs={4}>
              <Text name="light_shift_drafts_f"
                    id="lightShiftDraftsFFormInput"
                    labelPosition="none"
                    value={formData.light_shift_drafts_f}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={4}>
              <Text name="light_shift_drafts_a"
                    id="lightShiftDraftsAFormInput"
                    labelPosition="none"
                    value={formData.light_shift_drafts_a}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={4}><label>Heavy Ballast Drafts (M)</label></Col>
            <Col xs={4}>
              <Text name="heavy_ballast_drafts_f"
                    id="heavyBallastDraftsFFormInput"
                    labelPosition="none"
                    value={formData.heavy_ballast_drafts_f}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={4}>
              <Text name="heavy_ballast_drafts_a"
                    id="heavyBallastDraftsAFormInput"
                    labelPosition="none"
                    value={formData.heavy_ballast_drafts_a}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={4}><label>Normal Ballast Drafts (M)</label></Col>
            <Col xs={4}>
              <Text name="normal_ballast_drafts_f"
                    id="normalBallastDraftsFFormInput"
                    labelPosition="none"
                    value={formData.normal_ballast_drafts_f}
                    onChange={handleInputChange}
              />
            </Col>
            <Col xs={4}>
              <Text name="normal_ballast_drafts_a"
                    id="normalBallastDraftsAFormInput"
                    labelPosition="none"
                    value={formData.normal_ballast_drafts_a}
                    onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}><Divider type="line"/></Col>
        <Col xs={12}>
          <Row>
            <Col xs={2}><label>G.T/N.T</label></Col>
            <Col xs={10}>
              <Row>
                <Col xs={12}>
                  <Row>
                    <Col xs={4}>
                      <label>International</label>
                    </Col>
                    <Col xs={4}>
                      <Text name="international_gt"
                            id="internationalGtFormInput"
                            labelPosition="none"
                            value={formData.international_gt}
                            onChange={handleInputChange}
                      />
                    </Col>
                    <Col xs={4}>
                      <Text name="international_nt"
                            id="internationalNtFormInput"
                            labelPosition="none"
                            value={formData.international_nt}
                            onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={12}>
                  <Row>
                    <Col xs={4}>
                      <label>Panama</label>
                    </Col>
                    <Col xs={4}>
                      <Text name="panama_gt"
                            id="panamaGtFormInput"
                            labelPosition="none"
                            value={formData.panama_gt}
                            onChange={handleInputChange}
                      />
                    </Col>
                    <Col xs={4}>
                      <Text name="panama_nt"
                            id="panamaNtFormInput"
                            labelPosition="none"
                            value={formData.panama_nt}
                            onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={12}>
                  <Row>
                    <Col xs={4}>
                      <label>Suez</label>
                    </Col>
                    <Col xs={4}>
                      <Text name="suez_gt"
                            id="suezGtFormInput"
                            labelPosition="none"
                            value={formData.suez_gt}
                            onChange={handleInputChange}
                      />
                    </Col>
                    <Col xs={4}>
                      <Text name="suez_nt"
                            id="suezNtFormInput"
                            labelPosition="none"
                            value={formData.suez_nt}
                            onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Button type="submit"
                  bsStyle="primary"
                  disabled={isLoading}
                  className="pull-right">
            Save
          </Button>
        </Col>
      </Row>
    </form>
  )
}

VesselForm.propTypes = {
  data: PropTypes.instanceOf(Vessel).isRequired
};

export default VesselForm;
