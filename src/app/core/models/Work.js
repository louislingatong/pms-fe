export default function Work(data = {}) {
  this.id = data.id ? data.id : 0;
  this.last_done = data.last_done ? data.last_done : '';
  this.running_hours = data.running_hours ? data.running_hours : '';
  this.instructions = data.instructions ? data.instructions : '';
  this.remarks = data.remarks ? data.remarks : '';
  this.created_at = data.created_at ? data.created_at : '';
  this.creator = data.creator ? data.creator : '';
}
