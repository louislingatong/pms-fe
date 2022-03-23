import Interval from './Interval';
import MachinerySubCategory from './MachinerySubCategory';
import MachinerySubCategoryDescription from './MachinerySubCategoryDescription';

export default function VesselMachinerySubCategories(data = {}) {
  this.id = data.id ? data.id : 0;
  this.code = data.code ? data.code : '';
  this.installed_date = data.installed_date ? data.installed_date : '';
  this.interval = data.interval ? new Interval(data.interval) : new Interval();
  this.sub_category = data.sub_category
    ? new MachinerySubCategory(data.sub_category)
    : new MachinerySubCategory();
  this.description = data.description
    ? new MachinerySubCategoryDescription(data.description)
    : new MachinerySubCategoryDescription();
}
