import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Row} from 'react-bootstrap';
import {Button} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import Divider from '../../../components/Divider';
import MachineryForm from '../form/MachineryForm';
import SubCategoryForm from '../form/SubCategoryForm';
import {
  machineryRemoveSubCategoriesAsync,
  reqDataStatus
} from '../../../store/machinerySlice';
import {profileData} from '../../../store/profileSlice';

function MachineryView({data: localMachinery}) {
  const dispatch = useDispatch();
  const status = useSelector(reqDataStatus);
  const profile = useSelector(profileData);

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);

  useEffect(() => {
    setSelectedRowIds([]);
  }, [localMachinery])

  const handleRowSelect = (selectedRow) => {
    let newSelectedRowIds = selectedRowIds.slice();
    if (selectedRow.action === 'checked') {
      newSelectedRowIds.push(selectedRow.id);
    } else if (selectedRow.action === 'unchecked') {
      const i = newSelectedRowIds.indexOf(selectedRow);
      newSelectedRowIds.splice(i, 1)
    } else if (selectedRow.action === 'checked_all') {
      newSelectedRowIds = selectedRow.ids;
    } else if (selectedRow.action === 'unchecked_all') {
      newSelectedRowIds = [];
    }
    setSelectedRowIds(newSelectedRowIds);
  };

  const hasId = !!localMachinery.id;
  const isLoading = status === 'loading';

  const handleDelete = () => {
    const data = {machinery_id: localMachinery.id};
    selectedRowIds.forEach((id, i) => {
      data[`sub_category_ids[${i}]`] = id;
    });
    dispatch(machineryRemoveSubCategoriesAsync(data));
  };

  const header = [
    {
      title: 'Name',
      data: 'name',
    }
  ];

  return (
    <React.Fragment>
      <MachineryForm data={localMachinery}/>
      {
        hasId && (
          <React.Fragment>
            <Row>
              <Divider type="line"/>
            </Row>
            <Row className="display-flex">
              <Col xs={6} className="display-flex align-items-center">
                <h4>Sub Categories</h4>
              </Col>
              <Col xs={6} className="display-flex align-items-center justify-content-end">
                {
                  !showSubCategoryForm
                    && !!profile.permissions['sub_category_create']
                    && <Button type="primary"
                            text="Add Sub Category"
                            onClick={() => setShowSubCategoryForm(!showSubCategoryForm)}/>
                }
              </Col>
            </Row>
            <Row>
              <Divider type="line"/>
            </Row>
            {showSubCategoryForm && <SubCategoryForm machineryId={localMachinery.id}/>}
            <Divider/>
            <Row>
              <Col xs={12}>
                <DataTable
                  data={localMachinery.sub_categories}
                  columns={header}
                  selectedRowIds={selectedRowIds}
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
                  !!selectedRowIds.length
                    && profile.permissions['sub_category_delete']
                    && <Button type="danger"
                               text={`Delete (${selectedRowIds.length})`}
                               onClick={handleDelete}
                               pullRight
                               disabled={isLoading}/>
                }
              </Col>
            </Row>
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
}

export default MachineryView;
