import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Inputs} from 'adminlte-2-react';
import Transform from '../../utils/Transformer';
import {employeeDepartments as options, employeeDepartmentsAsync} from '../../store/optionSlice';
import {usePrevious} from '../../utils/Hooks';

function EmployeeDepartmentSelect(props) {
  const {name, id, label, labelPosition = 'none', placeholder = '', allowClear = false} = props;
  const {form = false, value, disabled, type, help} = props;
  const {onChange} = props;

  const {Select2} = Inputs;

  const dispatch = useDispatch();
  const defaultOptions = useSelector(options);

  const localValue = useRef(value);
  const localDefaultOptions = useRef(Transform.toSelectOptions(defaultOptions));
  const openDropdownMenu = useRef(false);

  const preLocalValue = usePrevious(localValue);

  useEffect(() => {
    const currentLocalDefaultOptions = localDefaultOptions.current;
    const currentOpenDropdownMenu = openDropdownMenu.current;
    if (!currentLocalDefaultOptions.length && currentOpenDropdownMenu) {
      localDefaultOptions.current = Transform.toSelectOptions(defaultOptions);
      openDropdownMenu.current = false;
    }
  }, [defaultOptions]);

  const openOptions = (e) => {
    localValue.current = Array.isArray(e.params.data) ? e.params.data[0] : e.params.data;
    openDropdownMenu.current = true;
  };

  const fetchOptions = (data, success) => {
    const currentLocalValue = localValue.current;
    const currentLocalDefaultOptions = localDefaultOptions.current;
    const params = {};
    if (!data.searchValue && !currentLocalValue && !preLocalValue && currentLocalDefaultOptions.length) {
      success(currentLocalDefaultOptions);
      return;
    }
    if (!data.searchValue && currentLocalValue) {
      params['keyword'] = currentLocalValue
    }
    if ((data.searchValue && !currentLocalValue) || (data.searchValue && currentLocalValue)) {
      params['keyword'] = data.searchValue;
    }
    dispatch(employeeDepartmentsAsync(params))
      .unwrap()
      .then((response) => {
        const transformedOptions = Transform.toSelectOptions(response);
        success(transformedOptions);
      });
  };

  const formProps = form ? {value, disabled, type, help, options: [value]} : {};

  return (
    <Select2
      name={name}
      id={id}
      label={label}
      labelPosition={labelPosition}
      placeholder={placeholder}
      allowClear={allowClear}
      onChange={onChange}
      onOpen={openOptions}
      onFetchData={fetchOptions}
      fetchDataDelay={1000}
      {...formProps}
    />
  )
}

EmployeeDepartmentSelect.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf(['above', 'left', 'none']),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  help: PropTypes.string,
  form: PropTypes.bool,
  onChange: PropTypes.func,
};

export default EmployeeDepartmentSelect;
