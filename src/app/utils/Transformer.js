export default class Transformer {
  static fetchCollection(data, Model) {
    return data.map(item => this.fetchObject(item, Model));
  }

  static fetchObject(data, Model) {
    return new Model(data);
  }

  static toIcon(icon) {
    const match = icon ? icon.match(/^([fab|fas|far]*)-?(.+)/) : null;
    if (match != null) {
      const [one, two] = match.splice(1, 2).filter((p) => p.length > 0);
      return [one, two];
    }
    return ['far', 'question-circle'];
  }

  static toFormError(errors) {
    const error = {};
    errors.items.forEach(e => error[e.field] = e.msg);
    return error;
  }

  static toSelectOptions(items, valueKey) {
    return items.map(item => ({
      value: item.name || item[valueKey]
    }))
  }
}
