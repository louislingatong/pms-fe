import InChargeRankType from './InChargeRankType';

export default function InChargeRank(data = {}) {
  this.id = data.id ? data.id : 0;
  this.name = data.name ? data.name : '';
  this.type = data.type ? new InChargeRankType(data.type) : new InChargeRankType()
}
