import VesselDepartment from './VesselDepartment';
import MachineryMaker from './MachineryMaker';
import MachineryModel from './MachineryModel';
import MachinerySubCategory from './MachinerySubCategory';

export default function Machinery(data = {}) {
  this.id = data.id ? data.id : 0;
  this.name = data.name ? data.name : '';
  this.code_name = data.code_name ? data.code_name : '';
  this.department = data.department ? new VesselDepartment(data.department ) : new VesselDepartment();
  this.model = data.model ? new MachineryModel(data.model ) : new MachineryModel();
  this.maker = data.maker ? new MachineryMaker(data.maker ) : new MachineryMaker();
  this.sub_categories = data.sub_categories
    ? data.sub_categories.map(subCategory => new MachinerySubCategory(subCategory))
    : []
}
