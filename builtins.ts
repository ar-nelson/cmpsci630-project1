 
module Python {

  class BuiltinFunction extends PyInstanceBase implements PyObject {
    type = Types.BuiltinMethodType

    constructor(name: string, fn: Function, minArgs = fn.length, maxArgs = fn.length) {
      super()
      this.call = buildFunction(name, fn, minArgs, maxArgs)
    }

    isTrue() {return true}
    isCallable() {return true}
  }

  export var builtins: { [key: string]: PyObject } = {
    True: True,
    False: False,
    None: None,
    Ellipsis: Ellipsis,
    NotImplemented: NotImplemented,
    "int": Types.IntType,
    "float": Types.FloatType,
    complex: Types.ComplexType,
    str: Types.StringType,
    tuple: Types.TupleType,
    list: Types.ListType,
    dict: Types.ListType,
    set: Types.SetType,
    frozenset: Types.FrozenSetType,

    id: new BuiltinFunction('id', (o: PyObject) => new PyInt(o.id)),
    len: new BuiltinFunction('len', (o: PyObject) => o.callMethodObjArgs("__len__")),
    range: new BuiltinFunction('range', (from: PyInt, to?: PyInt, step?: PyInt) => {
      if (from.numberSize !== NumberSize.INT ||
          (to && to.numberSize !== NumberSize.INT) ||
          (step && step.numberSize !== NumberSize.INT)) {
        throw Errors.typeError("range() arguments must be integers")
      }
      var numbers: PyInt[] = []
      if (!to) for (var i = 0; i < from.intValue(); i++)
        numbers.push(new PyInt(i))
      else if (!step) for (var i = from.intValue(); i < to.intValue(); i++)
        numbers.push(new PyInt(i))
      else for (var i = from.intValue(); i < to.intValue(); i += step.intValue())
        numbers.push(new PyInt(i))
      return new PyTuple(numbers)
    }, 1, 3),
  }
}
