import Vessel from './Vessel';
import Machinery from './Machinery';
import InChargeRank from './InChargeRank';
import VesselMachinerySubCategories from './VesselMachinerySubCategories';
import MachineryModel from './MachineryModel';
import MachineryMaker from './MachineryMaker';

export default function Interval(data = {}) {
  this.id = data.id ? data.id : 0;
  this.vessel = data.vessel ? new Vessel(data.vessel) : new Vessel();
  this.machinery = data.machinery ? new Machinery(data.machinery) : new Machinery();
  this.incharge_rank = data.incharge_rank ? new InChargeRank(data.incharge_rank) : new InChargeRank();
  this.model = data.model ? new MachineryModel(data.model) : new MachineryModel();
  this.maker = data.maker ? new MachineryMaker(data.maker) : new MachineryMaker();
  this.sub_categories = data.sub_categories
    ? data.sub_categories.map(subCategory => new VesselMachinerySubCategories(subCategory))
    : [];
}
