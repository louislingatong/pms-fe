import React, {useState} from 'react';

function VesselSubCategoryForm(props) {
  const {machineryCode, subCategories, defaultVesselSubCategories, vesselMachineryId} = props;

  const renderItems = () => {
    return subCategories.map((item, i) => (
      <tr key={item.id}>
        <td>
          <input type="checkbox" />
        </td>
        <td>
          {`${machineryCode}-${(i + 1).toString().padStart(3, 0)}`}
        </td>
        <td className="text-nowrap">
          {item.name}
        </td>
        <td>
          <textarea className="form-control" rows="3" />
        </td>
        <td>
          <input className="form-control" id="inputInterval" />
        </td>
        <td>
          <input className="form-control" id="inputInstallationDate" />
        </td>
      </tr>
    ))
  }

  const loadingItem = () => <tr><td colSpan={6} className="text-center">Loading...</td></tr>
  const noItemAvailable = () => <tr><td colSpan={6}>No sub categories available</td></tr>

  return (
    <React.Fragment>
      <div className="card-body table-responsive p-0" style={{maxHeight: '400px'}}>
        <table className="table table-head-fixed table-hover table-striped">
          <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Code</th>
            <th>Sub Category</th>
            <th>Description</th>
            <th>Interval</th>
            <th>Installation Date</th>
          </tr>
          </thead>
          <tbody>
          {subCategories.length > 0 ? renderItems() : noItemAvailable()}
          </tbody>
        </table>
      </div>
      <div className="card-footer">
        <button type="button" className="btn btn-primary float-right">
          <i className="fas fa-save mr-2" />
          Save
        </button>
      </div>
    </React.Fragment>
  );
}

export default VesselSubCategoryForm;
