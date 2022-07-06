import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Content, Inputs} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {vesselData, vesselDataAsync,} from '../../../store/vesselSlice';
import {profileData} from '../../../store/profileSlice';
import {Divider, Modal} from '../../../components';
import VesselForm from '../form/VesselForm';

function VesselView({match, name}) {
  const {Text} = Inputs;
  const history = useHistory();
  const dispatch = useDispatch();

  const vessel = useSelector(vesselData);
  const profile = useSelector(profileData);

  const {params} = match;
  const paramId = parseInt(params.id);

  const [localVessel, setLocalVessel] = useState(vessel);
  const [vesselModalShow, setVesselModalShow] = useState(false);

  useEffect(() => {
    if (vessel.id) {
      setLocalVessel(vessel);
      handleModalClose();
    }
    if (!vessel.id) {
      initData();
    }
  }, [vessel]);

  const initData = () => {
    dispatch(vesselDataAsync(paramId));
  };

  const handleModalOpen = () => {
    setVesselModalShow(true);
  };

  const handleModalClose = () => {
    setVesselModalShow(false);
  };

  return (
    <Content title={name} browserTitle={`ASTRO | Management - ${name}`}>
      <Row>
        <Col xs={12}>
          <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
              <li className="active">
                <a href="#generalInfo" data-toggle="tab" aria-expanded="false">General Information</a>
              </li>
              <li className="">
                <a href="#otherInfo" data-toggle="tab" aria-expanded="false">Other Information</a>
              </li>
              <li className="">
                <a href="#otherInfo2" data-toggle="tab" aria-expanded="false">Other Information 2</a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane active" id="generalInfo">
                <Row>
                  <Col xs={6}>
                    <Row>
                      <Col xs={4}><label>Owner</label></Col>
                      <Col xs={8}>
                        <Text name="owner"
                              id="ownerInput"
                              labelPosition="none"
                              value={localVessel.owner.name}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Code</label></Col>
                      <Col xs={8}>
                        <Text name="code_name"
                              id="codeNameInput"
                              labelPosition="none"
                              value={localVessel.code_name}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Name</label></Col>
                      <Col xs={8}>
                        <Text name="name"
                              id="nameInput"
                              labelPosition="none"
                              value={localVessel.name}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Former Name</label></Col>
                      <Col xs={8}>
                        <Text name="former_name"
                              id="formerNameInput"
                              labelPosition="none"
                              value={localVessel.former_name}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Flag</label></Col>
                      <Col xs={8}>
                        <Text name="flag"
                              id="flagInput"
                              labelPosition="none"
                              value={localVessel.flag}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Call Sign</label></Col>
                      <Col xs={8}>
                        <Text name="call_sign"
                              id="callSignInput"
                              labelPosition="none"
                              value={localVessel.call_sign}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Official No.</label></Col>
                      <Col xs={8}>
                        <Text name="official_no"
                              id="officialNoInput"
                              labelPosition="none"
                              value={localVessel.official_no}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>IMO No.</label></Col>
                      <Col xs={8}>
                        <Text name="imo_no"
                              id="imoNoInput"
                              labelPosition="none"
                              value={localVessel.imo_no}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>LOA/LBP</label></Col>
                      <Col xs={8}>
                        <Row>
                          <Col xs={6}>
                            <Text name="loa"
                                  id="loaInput"
                                  labelPosition="none"
                                  value={localVessel.loa}
                                  disabled
                            />
                          </Col>
                          <Col xs={6}>
                            <Text name="lbp"
                                  id="lbpInput"
                                  labelPosition="none"
                                  value={localVessel.lbp}
                                  disabled
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
                              id="lightConditionInput"
                              labelPosition="none"
                              value={localVessel.light_condition}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Classification</label></Col>
                      <Col xs={8}>
                        <Text name="classification"
                              id="classificationInput"
                              labelPosition="none"
                              value={localVessel.classification}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Character</label></Col>
                      <Col xs={8}>
                        <Text name="character"
                              id="characterInput"
                              labelPosition="none"
                              value={localVessel.character}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Descriptive Note</label></Col>
                      <Col xs={8}>
                        <Text name="descriptive_note"
                              id="descriptiveNoteInput"
                              labelPosition="none"
                              value={localVessel.descriptive_note}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Built Year</label></Col>
                      <Col xs={8}>
                        <Text name="built_year"
                              id="builtYearInput"
                              labelPosition="none"
                              value={localVessel.built_year}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Built Yard</label></Col>
                      <Col xs={8}>
                        <Text name="build_yard"
                              id="buildYardInput"
                              labelPosition="none"
                              value={localVessel.build_yard}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>TPC</label></Col>
                      <Col xs={8}>
                        <Text name="tpc"
                              id="tpcInput"
                              labelPosition="none"
                              value={localVessel.tpc}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Breadth (MLD)</label></Col>
                      <Col xs={8}>
                        <Text name="breadth"
                              id="breadthInput"
                              labelPosition="none"
                              value={localVessel.breadth}
                              disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><label>Depth (MLD)</label></Col>
                      <Col xs={8}>
                        <Text name="depth"
                              id="depthInput"
                              labelPosition="none"
                              value={localVessel.depth}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="tab-pane" id="otherInfo">
                <Row>
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
                              id="summerDraftInput"
                              labelPosition="none"
                              value={localVessel.summer_draft}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="summer_freeboard"
                              id="summerFreeboardInput"
                              labelPosition="none"
                              value={localVessel.summer_freeboard}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="summer_deadweight"
                              id="summerDeadweightInput"
                              labelPosition="none"
                              value={localVessel.summer_deadweight}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={3}><label>Winter</label></Col>
                      <Col xs={3}>
                        <Text name="winter_draft"
                              id="winterDraftInput"
                              labelPosition="none"
                              value={localVessel.winter_draft}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="winter_freeboard"
                              id="winterFreeboardInput"
                              labelPosition="none"
                              value={localVessel.winter_freeboard}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="winter_deadweight"
                              id="winterDeadweightInput"
                              labelPosition="none"
                              value={localVessel.winter_deadweight}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={3}><label>Tropical</label></Col>
                      <Col xs={3}>
                        <Text name="tropical_draft"
                              id="tropicalDraftInput"
                              labelPosition="none"
                              value={localVessel.tropical_draft}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="tropical_freeboard"
                              id="tropicalFreeboardInput"
                              labelPosition="none"
                              value={localVessel.tropical_freeboard}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="tropical_deadweight"
                              id="tropicalDeadweightInput"
                              labelPosition="none"
                              value={localVessel.tropical_deadweight}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={3}><label>Tropical F.W.</label></Col>
                      <Col xs={3}>
                        <Text name="tropical_fw_draft"
                              id="tropicalFwDraftInput"
                              labelPosition="none"
                              value={localVessel.tropical_fw_draft}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="tropical_fw_freeboard"
                              id="tropicalFwFreeboardInput"
                              labelPosition="none"
                              value={localVessel.tropical_fw_freeboard}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="tropical_fw_deadweight"
                              id="tropicalFwDeadweightInput"
                              labelPosition="none"
                              value={localVessel.tropical_fw_deadweight}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={3}><label>F.W</label></Col>
                      <Col xs={3}>
                        <Text name="fw_draft"
                              id="fwDraftInput"
                              labelPosition="none"
                              value={localVessel.fw_draft}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="fw_freeboard"
                              id="fwFreeboardInput"
                              labelPosition="none"
                              value={localVessel.fw_freeboard}
                              disabled
                        />
                      </Col>
                      <Col xs={3}>
                        <Text name="fw_deadweight"
                              id="fwDeadweightInput"
                              labelPosition="none"
                              value={localVessel.fw_deadweight}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={3}><label>F.W. Allowance</label></Col>
                      <Col xs={3}>
                        <Text name="fw_allowance"
                              id="fwAllowanceInput"
                              labelPosition="none"
                              value={localVessel.fw_allowance}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="tab-pane" id="otherInfo2">
                <Row>
                  <Col xs={12}>
                    <Col xs={4}/>
                    <Col xs={4}><label>F</label></Col>
                    <Col xs={4}><label>A</label></Col>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={4}><label>Light Shift Drafts (M)</label></Col>
                      <Col xs={4}>
                        <Text name="light_shift_drafts_f"
                              id="lightShiftDraftsFInput"
                              labelPosition="none"
                              value={localVessel.light_shift_drafts_f}
                              disabled
                        />
                      </Col>
                      <Col xs={4}>
                        <Text name="light_shift_drafts_a"
                              id="lightShiftDraftsAInput"
                              labelPosition="none"
                              value={localVessel.light_shift_drafts_a}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={4}><label>Heavy Ballast Drafts (M)</label></Col>
                      <Col xs={4}>
                        <Text name="heavy_ballast_drafts_f"
                              id="heavyBallastDraftsFInput"
                              labelPosition="none"
                              value={localVessel.heavy_ballast_drafts_f}
                              disabled
                        />
                      </Col>
                      <Col xs={4}>
                        <Text name="heavy_ballast_drafts_a"
                              id="heavyBallastDraftsAInput"
                              labelPosition="none"
                              value={localVessel.heavy_ballast_drafts_a}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col xs={4}><label>Normal Ballast Drafts (M)</label></Col>
                      <Col xs={4}>
                        <Text name="normal_ballast_drafts_f"
                              id="normalBallastDraftsFInput"
                              labelPosition="none"
                              value={localVessel.normal_ballast_drafts_f}
                              disabled
                        />
                      </Col>
                      <Col xs={4}>
                        <Text name="normal_ballast_drafts_a"
                              id="normalBallastDraftsAInput"
                              labelPosition="none"
                              value={localVessel.normal_ballast_drafts_a}
                              disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    (Basis on full bunker condition)
                    <Divider type="line"/>
                  </Col>
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
                                      id="internationalGtInput"
                                      labelPosition="none"
                                      value={localVessel.international_gt}
                                      disabled
                                />
                              </Col>
                              <Col xs={4}>
                                <Text name="international_nt"
                                      id="internationalNtInput"
                                      labelPosition="none"
                                      value={localVessel.international_nt}
                                      disabled
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
                                      id="panamaGtInput"
                                      labelPosition="none"
                                      value={localVessel.panama_gt}
                                      disabled
                                />
                              </Col>
                              <Col xs={4}>
                                <Text name="panama_nt"
                                      id="panamaNtInput"
                                      labelPosition="none"
                                      value={localVessel.panama_nt}
                                      disabled
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
                                      id="suezGtInput"
                                      labelPosition="none"
                                      value={localVessel.suez_gt}
                                      disabled
                                />
                              </Col>
                              <Col xs={4}>
                                <Text name="suez_nt"
                                      id="suezNtInput"
                                      labelPosition="none"
                                      value={localVessel.suez_nt}
                                      disabled
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <Button type="default" text="Back" onClick={() => history.goBack()}/>
          <Button type="primary" text="Edit" onClick={handleModalOpen} pullRight/>
        </Col>
      </Row>
      <Modal
        show={vesselModalShow}
        title="Edit Vessel"
        modalSize="lg"
        closeButton
        onHide={handleModalClose}
      >
        <VesselForm data={localVessel}/>
      </Modal>
    </Content>
  )
}

export default VesselView;
