class OrderedEnumProperty {
  constructor(name, order) {
    this.order = order;
    this.name = name;
  }
  toString() {
    return this.name;
  }
  valueOf() {
    return this.order;
  }
}

class OrderedEnum {
  constructor(enumNames) {
    this.enumNames = [...enumNames];

    enumNames.forEach((name, order) => {
      this[`_${name}`.toUpperCase()] = new OrderedEnumProperty(name, order);
    });
  }

  get getterProxy() {
    return {
      get: function (target, prop, receiver) {
        if (prop === "names") return target.enumNames;

        prop = addUnderscore(prop.toUpperCase());
        return target[prop];

        function addUnderscore(prop) {
          return prop[0] == "_" ? prop : `_${prop}`;
        }
      },
    };
  }
}
module.exports = OrderedEnum;
