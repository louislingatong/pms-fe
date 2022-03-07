import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useDebounce} from '../../utils/Hooks';
import Autosuggest from 'react-autosuggest';
import {vesselOwners, vesselOwnersAsync} from '../../store/optionSlice';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function VesselOwnerAutoSuggest(props) {
  const {type = 'text', name, id, label, labelPosition = 'none', value = '', disabled, validation, help, onChange} = props;
  const {defaultSuggestions} = props;

  const dispatch = useDispatch();
  const suggestions = useSelector(vesselOwners);

  const [localValue, setLocalValue] = useState();
  const [localSuggestions, setLocalSuggestions] = useState(suggestions);

  const debouncedLocalValue = useDebounce(localValue, 1000);

  useEffect(() => {
    if (localSuggestions) {
      setLocalSuggestions(suggestions);
    }
  }, [suggestions]);

  useEffect(() => {
    if (debouncedLocalValue !== undefined) {
      loadSuggestions(localValue);
    }
  }, [debouncedLocalValue]);

  const handleInputChange = (e, { newValue }) => {
    onChange({target: {name, value: newValue}});
  };

  const onSuggestionsFetchRequested = ({value}) => {
    setLocalValue(value);
  };

  const onSuggestionsClearRequested = () => {
    setLocalSuggestions([]);
  };

  const loadSuggestions = (value) => {
    if (defaultSuggestions) {
      const filteredDefaultSuggestions = defaultSuggestions
        .filter((suggestion) => {
          return suggestion.name.toLowerCase().includes(value.trim().toLowerCase());
        });
      setLocalSuggestions(filteredDefaultSuggestions);
    } else {
      dispatch(vesselOwnersAsync({keyword: value}));
    }
  };

  const getSuggestionValue = suggestion => suggestion.name;

  const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

  const inputProps = {
    type,
    name,
    id,
    value,
    className: 'form-control',
    onChange: handleInputChange,
    disabled
  };

  const hasLabel = labelPosition !== 'none'

  return (
    <div className={classnames('form-group', {[`has-${validation}`]: validation})}>
      {hasLabel && <label htmlFor={name} className="control-label">{label}</label>}
      <div>
        <Autosuggest
          suggestions={localSuggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />
      </div>
      {help && <p className="help-block">{help}</p>}
    </div>
  )
}

VesselOwnerAutoSuggest.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf(['above', 'left', 'none']),
  validation: PropTypes.oneOf(['error', 'success', 'warning']),
  help: PropTypes.string,
  inputProps: PropTypes.object
};

export default VesselOwnerAutoSuggest;
