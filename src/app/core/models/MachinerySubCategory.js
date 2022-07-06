import MachinerySubCategoryDescription from './MachinerySubCategoryDescription';

export default function MachinerySubCategory(data = {}) {
  this.id = data.id ? data.id : 0;
  this.code = data.code ? data.code : '';
  this.name = data.name ? data.name : '';
  this.descriptions = data.descriptions
    ? data.descriptions.map(description => new MachinerySubCategoryDescription(description))
    : []
}
