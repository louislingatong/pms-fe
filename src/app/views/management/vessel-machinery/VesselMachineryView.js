import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Row} from 'react-bootstrap';
import {Button, Inputs} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import Divider from '../../../components/Divider';
import VesselMachineryForm from '../form/VesselMachineryForm';
import {
  reqDataStatus,
  vesselMachineryEditSubCategoriesAsync,
  vesselMachineryExportAsync
} from '../../../store/vesselMachinerySlice';
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
  const [updatedSubCategories, setUpdatedSubCategories] = useState([]);
  const [removedSubCategories, setRemovedSubCategories] = useState([]);

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
    if (totalValidForm && updatedSubCategories.concat(removedSubCategories).length
      && (totalValidForm === updatedSubCategories.concat(removedSubCategories).length)) {
      submit();
      setTotalValidForm(0);
      setValidFormCount(0);
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
      restoreSubCategory(selectedRow.id);
    } else if (selectedRow.action === 'unchecked') {
      disableEditRow(selectedRow.id);
      removeSubCategory(selectedRow.id);
      delete newFormDatas[selectedRow.id];
    } else if (selectedRow.action === 'checked_all') {
      selectedRow.ids.forEach((id) => {
        newFormDatas[id] = formData(id);
        restoreSubCategory(selectedRow.id);
      });
    } else if (selectedRow.action === 'unchecked_all') {
      selectedRow.ids.forEach((id) => {
        disableEditRow(id);
        removeSubCategory(id);
        delete newFormDatas[id];
      });
    }
    setFormDatas(newFormDatas);
  };

  const formData = (id) => {
    const subCategory = localVesselMachinery.sub_categories.find(subCategory => subCategory.id === id);
    return {
      machinery_sub_category_id: id,
      code: subCategory ? subCategory.code : machineryCode + '-',
      description: subCategory ? subCategory.description.name : '',
      interval: subCategory ? subCategory.interval.name : ''
    }
  };

  const enableEditRow = (id) => {
    const newUpdatedSubCategories = updatedSubCategories.slice();
    newUpdatedSubCategories.push(id);
    setUpdatedSubCategories(newUpdatedSubCategories);
  };

  const disableEditRow = (id) => {
    const newUpdatedSubCategories = updatedSubCategories.slice();
    const i = newUpdatedSubCategories.indexOf(id);
    newUpdatedSubCategories.splice(i, 1);
    setUpdatedSubCategories(newUpdatedSubCategories);
  };

  const removeSubCategory = (id) => {
    const newRemovedSubCategories = removedSubCategories.slice();
    const i = newRemovedSubCategories.indexOf(id);
    if (i === -1) {
      const subCategory = localVesselMachinery.sub_categories.find(subCategory => subCategory.id === id);
      if (subCategory) {
        newRemovedSubCategories.push(id);
        setRemovedSubCategories(newRemovedSubCategories);
      }
    }
  };

  const restoreSubCategory = (id) => {
    const newRemovedSubCategories = removedSubCategories.slice();
    const i = newRemovedSubCategories.indexOf(id);
    if (i !== -1) {
      newRemovedSubCategories.splice(i, 1);
      setRemovedSubCategories(newRemovedSubCategories);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    updatedSubCategories.forEach((row, i) => {
      const formDataRow = formDatas[row];
      validator.validateAll(formDataRow)
        .then((success) => {
          if (success) {
            setValidFormCount(validFormCount + 1);
          } else {
            setFormError({[row]: Transform.toFormError((validator.errors))});
          }
        });
    });

    if (removedSubCategories.length) {
      setValidFormCount(validFormCount + removedSubCategories.length);
    }
  };

  const submit = () => {
    let formData = {vessel_machinery_id: localVesselMachinery.id}
    if (updatedSubCategories.length) {
      const subCategories = {};
      updatedSubCategories.forEach((row, i) => {
        const formDataRow = formDatas[row];
        for (const [key, value] of Object.entries(formDataRow)) {
          subCategories[`vessel_machinery_sub_categories[${i}][${key}]`] = value;
        }
      });
      formData = {...formData, ...subCategories}
    }

    if (removedSubCategories.length) {
      const subCategories = {};
      removedSubCategories.forEach((row, i) => {
        subCategories[`vessel_machinery_sub_categories[${i + updatedSubCategories.length}][code]`] = '';
        subCategories[`vessel_machinery_sub_categories[${i + updatedSubCategories.length}][description]`] = '';
        subCategories[`vessel_machinery_sub_categories[${i + updatedSubCategories.length}][interval]`] = '';
        subCategories[`vessel_machinery_sub_categories[${i + updatedSubCategories.length}][machinery_sub_category_id]`] = row;
      });
      formData = {...formData, ...subCategories}
    }
    dispatch(vesselMachineryEditSubCategoriesAsync(formData));
  };

  const handleExportVesselMachinery = () => {
    dispatch(vesselMachineryExportAsync(localVesselMachinery.id));
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
          disabled={!formDatas[row.id] || !updatedSubCategories.includes(row.id)}
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
          disabled={!formDatas[row.id] || !updatedSubCategories.includes(row.id)}
          onChange={(e) => handleInputChange(e, row.id)}
        />
      )
    },
    {
      title: 'Interval',
      data: 'interval',
      width: '20',
      render: (interval, row) => {
        if (!updatedSubCategories.includes(row.id)) {
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
       if (!updatedSubCategories.includes(row.id)) {
         return <Button type="primary"
                        icon="fas-edit"
                        disabled={!formDatas[row.id]}
                        onClick={() => enableEditRow(row.id)}/>
       }
       return <Button type="default"
                      icon="fas-times"
                      disabled={!formDatas[row.id]}
                      onClick={() => disableEditRow(row.id)}/>
      }
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <Button
            type="primary"
            text="Export"
            onClick={handleExportVesselMachinery}
            pullRight
          />
        </Col>
        <Col xs={12}><Divider type="line"/></Col>
      </Row>
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
