export default function Meta(data = {}) {
  this.total = data.total ? data.total : 0;
  this.current_page = data.current_page ? data.current_page : 1;
  this.last_page = data.last_page ? data.last_page : 1;
  this.per_page = data.per_page ? data.per_page : 20;
  this.previous_page_url = data.previous_page_url ? data.previous_page_url : null;
  this.next_page_url = data.next_page_url ? data.next_page_url : null;
  this.url = data.url ? data.url : '';
}
