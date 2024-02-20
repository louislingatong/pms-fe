import MachinerySubCategory from './MachinerySubCategory';
import MachinerySubCategoryDescription from './MachinerySubCategoryDescription';
import Interval from './Interval';
import Work from './Work';

export default function VesselMachinerySubCategoryWork(data = {}) {
  this.id = data.id ? data.id : 0;
  this.code = data.code ? data.code : '';
  this.installed_date = data.installed_date ? data.installed_date : '';
  this.due_date = data.due_date ? data.due_date : '';
  this.interval = data.interval
    ? new Interval(data.interval)
    : new Interval();
  this.isEngineMachinery = data.isEngineMachinery ?? false
  this.sub_category = data.sub_category
    ? new MachinerySubCategory(data.sub_category)
    : new MachinerySubCategory();
  this.description = data.description
    ? new MachinerySubCategoryDescription(data.description)
    : new MachinerySubCategoryDescription();
  this.installed_date = data.installed_date ? data.installed_date : null;
  this.status = data.status ? data.status : null;
  this.current_work = data.current_work
    ? new Work(data.current_work)
    : new Work();
  this.work_history = data.work_history
    ? data.work_history.map(work => new Work(work))
    : []
}
