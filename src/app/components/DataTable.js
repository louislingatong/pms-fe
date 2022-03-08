import React, {useEffect, useState} from 'react';
import {Button, Col, Inputs, Row} from 'adminlte-2-react';
import PropTypes from 'prop-types';
import Meta from '../core/models/Meta';
import Pagination from './Pagination';
import {useDebounce, usePrevious} from '../utils/Hooks';
import classnames from 'classnames';
import {PulseLoader} from 'react-spinners';

function DataTable(props) {
  const {Text, Select} = Inputs;

  const {
    data = [],
    columns,
    selectedRowIds = [],
    condensed,
    striped,
    hover,
    border,
    responsive,
    fixed,
    noMargin
  } = props;
  const {api, options = {}, meta, multiple = false, rowSelect = false, isLoading = false} = props;
  const {onPageLengthChange, onSearchChange, onPageChange, onSelect} = props;
  const {page, pageInfo, search, pageLength} = options;

  const hasHeaders = columns.filter((p) => p.title).length > 0;

  const apiControlled = !!api;

  const [localData, setLocalData] = useState([]);
  const [localMeta, setLocalMeta] = useState({
    totalElements: 0,
    activePage: 1,
    pageSize: 20,
    lastPage: 1,
  });
  const [searchString, setSearchString] = useState();
  const [localSelectedRowIds, setLocalSelectedRowIds] = useState([]);
  const [localUnselectedRowIds, setLocalUnselectedRowIds] = useState([]);
  const [checkedRowId, setCheckedRowId] = useState(0);
  const [checkedAction, setCheckedAction] = useState('');

  const debouncedSearchString = useDebounce(searchString, 1000);
  const prevLocalMeta = usePrevious(localMeta);
  const prevSelectedRows = usePrevious(localSelectedRowIds);

  const {totalElements, activePage, pageSize} = localMeta;

  useEffect(() => {
    if (localSelectedRowIds && !localSelectedRowIds.length) {
      setLocalSelectedRowIds(selectedRowIds);
    }
    if (!selectedRowIds.length && localSelectedRowIds.length) {
      setCheckedAction('unchecked_all');
      setLocalSelectedRowIds([]);
    }
  }, [selectedRowIds]);

  useEffect(() => {
    if (!meta) {
      initLocalData();
    } else {
      setLocalData(data);
    }
  }, [data]);

  useEffect(() => {
    if (meta) {
      if (meta.total !== localMeta.totalElements
        || meta.current_page !== localMeta.activePage
        || meta.per_page !== localMeta.pageSize) {
        initLocalMeta({
          totalElements: meta.total,
          activePage: meta.current_page,
          pageSize: meta.per_page,
          lastPage: meta.last_page,
        });
      }
    }
  }, [meta]);

  useEffect(() => {
    if (!meta) {
      if (!prevLocalMeta
        || (localMeta.totalElements !== prevLocalMeta.totalElements
          || localMeta.activePage !== prevLocalMeta.activePage
          || localMeta.pageSize !== prevLocalMeta.pageSize)) {
        initLocalData();
      }
    }
  }, [localMeta]);

  useEffect(() => {
    if (prevSelectedRows && prevSelectedRows.length !== localSelectedRowIds.length) {
      if (checkedAction === 'checked' || checkedAction === 'unchecked') {
        onSelect({
          action: checkedAction,
          id: checkedRowId
        });
      } else if (checkedAction === 'checked_all') {
        onSelect({
          action: checkedAction,
          ids: localSelectedRowIds
        })
      } else if (checkedAction === 'unchecked_all') {
        onSelect({
          action: checkedAction,
          ids: localUnselectedRowIds
        })
      }
    }
  }, [localSelectedRowIds]);

  useEffect(() => {
    if (debouncedSearchString !== undefined) {
      handleSearch();
    }
  }, [debouncedSearchString]);

  const initLocalData = () => {
    let newTotalElements = 0;
    const {pageSize, activePage, totalElements} = localMeta;

    if (searchString) {
      const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchString.toLowerCase()));
      newTotalElements += filteredData.length;
      setLocalData(filteredData);
    } else {
      newTotalElements += data.length;
      const from = (pageSize * (activePage - 1));
      const to = Math.min(pageSize * (activePage - 1) + pageSize, totalElements);
      setLocalData(data.slice(from, to));
    }
    const newLastPage = Math.ceil(totalElements / pageSize);

    initLocalMeta({
      ...localMeta,
      totalElements: newTotalElements,
      lastPage: newLastPage
    })
  };

  const initLocalMeta = (metaData) => {
    setLocalMeta(metaData);
  };

  const renderInfo = () => {
    let info = 'Showing _START_ to _END_ of _TOTAL_ entries'
    return info.replace('_START_', (1 + pageSize * (activePage - 1)).toString())
      .replace('_END_', Math.min(pageSize * (activePage - 1) + pageSize, totalElements).toString())
      .replace('_TOTAL_', totalElements);
  };

  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  const handlePageLengthChange = (e) => {
    const value = e.target.value;
    apiControlled && onPageLengthChange(value);
    setLocalMeta({
      ...localMeta,
      activePage: 1,
      pageSize: parseInt(value),
      lastPage: Math.ceil(localMeta.totalElements / value)
    });
  };

  const handlePageChane = (page) => {
    apiControlled && onPageChange(page);
    setLocalMeta({
      ...localMeta,
      activePage: page
    });
  };

  const handleSearch = () => {
    apiControlled ? onSearchChange(searchString) : initLocalData(localMeta);
  };

  const handleAllRowsCheck = (e) => {
    const isChecked = e.target.checked;
    let action = 'unchecked_all';
    let ids = [];
    if (isChecked) {
      action = 'checked_all'
      ids = localData.map((item) => item.id)
    } else {
      setLocalUnselectedRowIds(localSelectedRowIds);
    }
    setCheckedAction(action);
    setLocalSelectedRowIds(ids);
  };

  const handleRowCheck = (row) => {
    let action;
    const newLocalSelectedIds = localSelectedRowIds.slice();
    const index = newLocalSelectedIds.indexOf(row.id);
    if (index === -1) {
      action = 'checked';
      newLocalSelectedIds.push(row.id);
    } else {
      action = 'unchecked'
      newLocalSelectedIds.splice(index, 1);
    }
    setCheckedRowId(row.id);
    setCheckedAction(action);
    setLocalSelectedRowIds(newLocalSelectedIds);
  };

  const allRowsChecked = () => {
    const localDataSize = localData.length
    return localDataSize > 0 && localDataSize === localSelectedRowIds.length;
  };

  const rowChecked = (data) => {
    return localSelectedRowIds.indexOf(data.id) !== -1;
  };

  const checkColumn = [{
    title: <div className="text-center"><input type="checkbox" checked={allRowsChecked()}
                                               onChange={handleAllRowsCheck}/></div>,
    data: 'check',
    width: 10
  }];

  const headers = multiple ? checkColumn.concat(columns) : columns;

  const classNames = classnames('table', {
    'no-margin': noMargin,
    'table-condensed': condensed,
    'table-striped': striped,
    'table-bordered': border,
    'table-hover': hover,
    'table-fixed': fixed,
  });

  const mapCell = (data, column, rowData, rowIdx) => {
    if (column.data === 'check') {
      return (
        <td key={`${column.data}-${rowIdx}`} style={{width: `${column.width}%`}}>
          <div className="text-center">
            <input type="checkbox" checked={rowChecked(rowData)} onChange={() => handleRowCheck(rowData)}/>
          </div>
        </td>
      );
    }
    if (column.data === 'action') {
      return (
        <td key={`${column.data}-${rowIdx}`} style={{width: `${column.width}%`}}>
          {column.render(data, rowData, rowIdx)}
        </td>
      )
    }
    if (column.render) {
      return (
        rowSelect
          ? (
            <td key={`${column.data}-${rowIdx}`}
                onClick={() => onSelect(rowData)}
                style={{cursor: 'pointer', width: `${column.width}%`}}
            >
              {column.render(data, rowData, rowIdx)}
            </td>
          )
          : (
            <td key={`${column.data}-${rowIdx}`} style={{width: `${column.width}%`}}>
              {column.render(data, rowData, rowIdx)}
            </td>
          )
      );
    }
    return (
      rowSelect
        ? (
          <td key={`${column.data}-${rowIdx}`}
              onClick={() => data !== 'check' && onSelect(rowData)}
              style={{cursor: 'pointer', width: `${column.width}%`}}
          >
            {data}
          </td>
        )
        : (
          <td key={`${column.data}-${rowIdx}`} style={{width: `${column.width}%`}}>
            {data}
          </td>
        )
    );
  }

  return (
    <React.Fragment>
      <Row>
        {
          pageLength && (
            <Col sm={6}>
              <div className="comp-custom-datatable-page-length">
                <span style={{margin: '6px 5px 0 0'}}>Show</span>
                <Select
                  name="page_length"
                  id="pageLengthSelect"
                  labelPosition="none"
                  options={[
                    {text: '20', value: 20},
                    {text: '50', value: 50},
                    {text: '100', value: 100},
                  ]}
                  value={pageSize || 20}
                  onChange={handlePageLengthChange}
                  width={70}
                />
                <span style={{margin: '6px 0 0 5px'}}>Entries</span>
              </div>
            </Col>
          )
        }
        {
          search && (
            <Col sm={6}>
              <div className="pull-right">
                <Text
                  name="search"
                  id="searchInput"
                  labelPosition="none"
                  buttonRight={<Button flat icon="fa-search" onClick={handleSearch}/>}
                  onChange={handleSearchChange}
                  width={250}
                />
              </div>
            </Col>
          )
        }
      </Row>
      <Row>
        <Col sm={12}>
          <div className="table-container">
            <div className={classnames({'table-responsive': responsive})}>
              <table className={classNames}>
                {
                  hasHeaders && (
                    <thead>
                    <tr>
                      {headers.map((p) => <th key={`${p.title}`} style={{width: `${p.width}%`}}>{p.title}</th>)}
                    </tr>
                    </thead>
                  )
                }
                <tbody>
                {
                  localData.length
                    ? localData.slice(0, localMeta.pageSize).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {headers.map((col) => mapCell(row[col.data], col, row, rowIdx))}
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={headers.length}
                            style={{height: '40px', textAlign: 'center', verticalAlign: 'middle'}}>
                          {isLoading ? '' : 'No available records found'}
                        </td>
                      </tr>
                    )
                }
                </tbody>
              </table>
            </div>
            {
              isLoading && (
                <div className="table-loader">
                  <strong>LOADING </strong><PulseLoader size={3}/>
                </div>
              )
            }
          </div>
        </Col>
      </Row>
      <Row>
        {
          pageInfo && (
            <Col sm={5}>
              <div>
                {renderInfo()}
              </div>
            </Col>
          )
        }
        {
          page && (
            <Col sm={7}>
              <div className="pull-right">
                <Pagination
                  meta={localMeta}
                  onPageChange={handlePageChane}
                />
              </div>
            </Col>
          )
        }
      </Row>
    </React.Fragment>
  )
}

DataTable.propTypes = {
  api: PropTypes.bool,
  data: PropTypes.array,
  columns: PropTypes.array,
  selectedRowIds: PropTypes.array,
  options: PropTypes.object,
  hover: PropTypes.bool,
  striped: PropTypes.bool,
  border: PropTypes.bool,
  condensed: PropTypes.bool,
  fixed: PropTypes.bool,
  noMargin: PropTypes.bool,
  responsive: PropTypes.bool,
  meta: PropTypes.instanceOf(Meta),
  multiple: PropTypes.bool,
  rowSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  onSearchChange: PropTypes.func,
  onPageLengthChange: PropTypes.func,
  onPageChange: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default DataTable;
