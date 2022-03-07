import Vessel from './Vessel';
import Machinery from './Machinery';
import InChargeRank from './InChargeRank';
import VesselMachinerySubCategories from './VesselMachinerySubCategories';

export default function Interval(data = {}) {
  this.id = data.id ? data.id : 0;
  this.installed_date = data.installed_date ? data.installed_date : '';
  this.vessel = data.vessel ? new Vessel(data.vessel) : new Vessel();
  this.machinery = data.machinery ? new Machinery(data.machinery) : new Machinery();
  this.incharge_rank = data.incharge_rank ? new InChargeRank(data.incharge_rank) : new InChargeRank();
  this.sub_categories = data.sub_categories
    ? data.sub_categories.map(subCategory => new VesselMachinerySubCategories(subCategory))
    : [];
}
