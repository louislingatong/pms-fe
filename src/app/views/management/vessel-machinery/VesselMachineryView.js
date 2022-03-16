import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Row} from 'react-bootstrap';
import {Button, Inputs} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import Divider from '../../../components/Divider';
import VesselMachineryForm from '../form/VesselMachineryForm';
import {reqDataStatus, vesselMachineryEditSubCategoriesAsync} from '../../../store/vesselMachinerySlice';
import IntervalSelect from '../../../components/select/IntervalSelect';
import MachinerySubCategoryDescriptionAutoSuggest
  from '../../../components/auto-suggest/MachinerySubCategoryDescriptionAutoSuggest';
import Transform from '../../../utils/Transformer';
import ReeValidate from 'ree-validate';

const validator = new ReeValidate({
  code: 'required',
  description: '',
  interval: '',
});

function VesselMachineryView({data: localVesselMachinery}) {
  const {Text} = Inputs;

  const dispatch = useDispatch();

  const status = useSelector(reqDataStatus);

  const [formErrors, setFormErrors] = useState({});
  const [formDatas, setFormDatas] = useState({});
  const [formError, setFormError] = useState();
  const [validFormCount, setValidFormCount] = useState(0);
  const [totalValidForm, setTotalValidForm] = useState(0);
  const [updatedRows, setUpdatedRows] = useState([]);

  const hasId = !!localVesselMachinery.id;
  const machineryCode = localVesselMachinery.machinery.code_name;
  const isLoading = status === 'loading';

  useEffect(() => {
    const subCategories = localVesselMachinery.sub_categories;
    if (subCategories.length) {
      loadFormData(subCategories);
    }
  }, [localVesselMachinery]);

  useEffect(() => {
    const formDatasLength = Object.keys(formDatas).length;
    if (totalValidForm && formDatasLength && (totalValidForm === formDatasLength)) {
      submit();
    }
  }, [totalValidForm]);

  useEffect(() => {
    if (validFormCount) {
      setTotalValidForm(validFormCount);
    }
  }, [validFormCount]);

  useEffect(() => {
    if (formError) {
      setFormErrors({...formErrors, ...formError});
    }
  }, [formError]);

  const loadFormData = (subCategories) => {
    setFormDatas((prevState) => {
      const state = {...prevState};
      subCategories.forEach((subCategory) => {
        state[subCategory.id] = {
          vessel_machinery_id: localVesselMachinery.id,
          machinery_sub_category_id: subCategory.id,
          code: subCategory.code,
          description: subCategory.description.name,
          interval: subCategory.interval.name
        }
      });
      return state;
    })
  };

  const handleInputChange = (e, id) => {
    const name = e.target.name.split('_')[0];
    const value = e.target.value;
    const {errors} = validator;

    setFormDatas((prevState) => {
      const state = {...prevState};
      state[id] = {...state[id], [name]: value};
      return state;
    });

    errors.remove(id);
    validator.validate(name, value)
      .then(() => {
        setFormErrors({...formErrors, [id]: Transform.toFormError(errors)});
      })
  };

  const handleRowSelect = (selectedRow) => {
    const newFormDatas = {...formDatas};
    if (selectedRow.action === 'checked') {
      newFormDatas[selectedRow.id] = formData(selectedRow.id);
    } else if (selectedRow.action === 'unchecked') {
      delete newFormDatas[selectedRow.id];
    } else if (selectedRow.action === 'checked_all') {
      selectedRow.ids.forEach((id) => {
        newFormDatas[id] = formData(id);
      });
    } else if (selectedRow.action === 'unchecked_all') {
      selectedRow.ids.forEach((id) => {
        delete newFormDatas[id];
      });
    }
    setFormDatas(newFormDatas);
  };

  const formData = (id) => {
    const subCategory = localVesselMachinery.sub_categories.find(subCategory => subCategory.id === id);
    return {
      vessel_machinery_id: localVesselMachinery.id,
      machinery_sub_category_id: id,
      code: subCategory ? subCategory.code : machineryCode + '-',
      description: subCategory ? subCategory.description.name : '',
      interval: subCategory ? subCategory.interval.name : ''
    }
  };

  const enableEditRow = (e, id) => {
    e.preventDefault();
    const newUpdatedRows = updatedRows.slice();
    newUpdatedRows.push(id);
    setUpdatedRows(newUpdatedRows);
  };

  const disableEditRow = (e, id) => {
    e.preventDefault();
    const newUpdatedRows = updatedRows.slice();
    const i = newUpdatedRows.indexOf(id);
    newUpdatedRows.splice(i, 1);
    setUpdatedRows(newUpdatedRows);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    Object.entries(formDatas).forEach(([key, value], i) => {
      validator.validateAll(value)
        .then((success) => {
          if (success) {
            setValidFormCount(i + 1);
          } else {
            setFormError({[key]: Transform.toFormError((validator.errors))});
          }
        });
    });
  };

  const submit = () => {
    const subCategories = {};
    for (let i = 0; i < Object.keys(formDatas).length; i++) {
      const key = Object.keys(formDatas)[i];
      if (updatedRows.includes(parseInt(key))) {
        const formData = formDatas[key];
        for (const [key, value] of Object.entries(formData)) {
          subCategories[`vessel_machinery_sub_categories[${i}][${key}]`] = value;
        }
      }
    }
    dispatch(vesselMachineryEditSubCategoriesAsync({
      vessel_machinery_id: localVesselMachinery.id,
      ...subCategories
    }));
  };

  const header = [
    {
      title: 'Code',
      data: 'code',
      width: '15',
      render: (code, row) => (
        <Text
          name={`code_${row.id}`}
          id={`code${row.id}Input`}
          labelPosition="none"
          value={formDatas[row.id] ? formDatas[row.id].code : machineryCode + '-'}
          disabled={!formDatas[row.id] || !updatedRows.includes(row.id)}
          onChange={(e) => handleInputChange(e, row.id)}
          type={formErrors[row.id] && formErrors[row.id]['code'] ? 'error' : ''}
          help={formErrors[row.id] && formErrors[row.id]['code']}
        />
      )
    },
    {
      title: 'Sub Category',
      data: 'name',
      width: '20',
    },
    {
      title: 'Description',
      data: 'description',
      width: '35',
      render: (description, row) => (
        <MachinerySubCategoryDescriptionAutoSuggest
          name={`description_${row.id}`}
          id={`description${row.id}Input`}
          labelPosition="none"
          value={formDatas[row.id] ? formDatas[row.id].description : ''}
          defaultSuggestions={row.description}
          disabled={!formDatas[row.id] || !updatedRows.includes(row.id)}
          onChange={(e) => handleInputChange(e, row.id)}
        />
      )
    },
    {
      title: 'Interval',
      data: 'interval',
      width: '20',
      render: (interval, row) => {
        if (!updatedRows.includes(row.id)) {
          return (
            <Text
              name={`interval_${row.id}`}
              id={`interval${row.id}Input`}
              labelPosition="none"
              value={formDatas[row.id] ? formDatas[row.id].interval : ''}
              disabled={true}
            />
          )
        }
        return (
          <IntervalSelect
            form
            name={`interval_${row.id}`}
            id={`interval${row.id}Select`}
            labelPosition="none"
            allowClear={true}
            value={formDatas[row.id] ? formDatas[row.id].interval : ''}
            onChange={(e) => handleInputChange(e, row.id)}
          />
        )
      }
    },
    {
      title: '',
      data: 'action',
      render: (action, row) => {
       if (!updatedRows.includes(row.id)) {
         return <Button type="primary"
                        icon="fas-edit"
                        disabled={!formDatas[row.id]}
                        onClick={(e) => enableEditRow(e, row.id)}/>
       }
       return <Button type="default"
                      icon="fas-times"
                      disabled={!formDatas[row.id]}
                      onClick={(e) => disableEditRow(e, row.id)}/>
      }
    },
  ];

  return (
    <React.Fragment>
      <VesselMachineryForm data={localVesselMachinery}/>
      {
        hasId && (
          <React.Fragment>
            <Row>
              <Divider type="line"/>
              <Col xs={6} className="display-flex align-items-center">
                <h4>Sub Categories</h4>
              </Col>
              <Divider type="line"/>
              <Col xs={12}>
                <DataTable
                  data={localVesselMachinery.machinery.sub_categories}
                  columns={header}
                  selectedRowIds={Object.keys(formDatas).map(Number)}
                  options={{
                    page: true,
                    pageInfo: true,
                    pageLength: true,
                    search: true,
                  }}
                  striped
                  hover
                  responsive
                  fixed
                  multiple
                  onSelect={handleRowSelect}
                  isLoading={isLoading}
                />
              </Col>
            </Row>
            <Divider/>
            <Row>
              <Col xs={12}>
                {
                  !!Object.entries(formDatas).length
                  && <Button type="primary" text="Save" onClick={handleSubmitForm} disabled={isLoading} pullRight/>
                }
              </Col>
            </Row>
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
}

export default VesselMachineryView;
