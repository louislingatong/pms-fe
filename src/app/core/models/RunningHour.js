export default function RunningHour(data = {}) {
  this.id = data.id ? data.id : 0;
  this.running_hours = data.running_hours ? data.running_hours : 0;
  this.updating_date = data.updating_date ? data.updating_date : '';
  this.created_at = data.created_at ? data.created_at : '';
  this.creator = data.creator ? data.creator : '';
}
