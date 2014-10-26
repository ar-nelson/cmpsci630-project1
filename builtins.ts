 
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
    Exception: Types.Exception,
    StandardError: Types.StandardError,
    ArithmeticError: Types.ArithmeticError,
    LookupError: Types.LookupError,
    AttributeError: Types.AttributeError,
    ImportError: Types.ImportError,
    IndexError: Types.IndexError,
    KeyError: Types.KeyError,
    NameError: Types.NameError,
    RuntimeError: Types.RuntimeError,
    StopIteration: Types.StopIteration,
    SystemError: Types.SystemError,
    TypeError: Types.TypeError,
    ValueError: Types.ValueError,
    ZeroDivisionError: Types.ZeroDivisionError,

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
    raw_input: new BuiltinFunction('raw_input', (prompt?: PyString) => {
      var interp = interpreter
      interp.printer.rawInput((input: string) => {
        interp.pushStackValue(new PyString(input))
        interp.exec()
      }, prompt ? (<StringLikeObject>prompt.str()).strValue : undefined)
      return PauseInterpreter
    }, 0, 1),
    sorted: new BuiltinFunction('sorted', (seq: PyObject) => {
      var iter = seq.getIter()
      var list = []
      while(true) {
        try {
          list.push(iter.callMethodObjArgs("next"))
        } catch (ex) {
          if (ex instanceof PyException && ex.type === Types.StopIteration) {
            return new PyList(list.sort((a, b) => a.compare(b)))
          } else throw ex
        }
      }
    })
  };

  (<DictProxy>Types.TupleType.__dict__).contents["__call__"] = new BuiltinFunction('tuple',
    (iter?: PyObject) => {
      if (iter) {
        var items = []
        while (true) {
          try {
            items.push(iter.callMethodObjArgs("next"))
          } catch (ex) {
            if (ex instanceof PyException && ex.type === Types.StopIteration) {
              return new PyTuple(items)
            } else throw ex
          }
        }
      } else return new PyTuple([])
    }, 0, 1);

  (<DictProxy>Types.ListType.__dict__).contents["__call__"] = new BuiltinFunction('list',
    (iter?: PyObject) => {
      if (iter) {
        var items = []
        while (true) {
          try {
            items.push(iter.callMethodObjArgs("next"))
          } catch (ex) {
            if (ex instanceof PyException && ex.type === Types.StopIteration) {
              return new PyList(items)
            } else throw ex
          }
        }
      } else return new PyList([])
    }, 0, 1)

  // TODO: Other type constructors.
}
