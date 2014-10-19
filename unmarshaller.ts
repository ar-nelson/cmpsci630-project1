
module Python {
  export function unmarshalObject(object: Bin.Object): PyObject {
    var binKeys: Bin.Object[], binItems: Bin.Object[], keys: PyObject[], items: PyObject[], i: number
    switch (object.type) {
      case Bin.Type.NULL: return null
      case Bin.Type.NONE: return None
      case Bin.Type.FALSE: return False
      case Bin.Type.TRUE: return True
      case Bin.Type.STOPITER: return buildException(Types.StopIteration, "StopIteration")
      case Bin.Type.ELLIPSIS: return Ellipsis
      case Bin.Type.INT:
        return new PyInt((<Bin.NumberObject><any>object).n)
      case Bin.Type.INT64:
        throw new Error("INT64 is not yet supported.")
      case Bin.Type.FLOAT:
      case Bin.Type.BINARY_FLOAT:
        return new PyFloat((<Bin.NumberObject><any>object).n)
      case Bin.Type.COMPLEX:
      case Bin.Type.BINARY_COMPLEX:
        return new PyComplex(
          (<Bin.ComplexObject><any>object).real,
          (<Bin.ComplexObject><any>object).imag)
      case Bin.Type.LONG:
        throw new Error("LONG is not yet supported")
      case Bin.Type.STRING:
      case Bin.Type.INTERNED:
      case Bin.Type.STRINGREF:
      case Bin.Type.UNICODE:
        return new PyString((<Bin.StringObject><any>object).str)
      case Bin.Type.TUPLE:
        binItems = (<Bin.SequenceObject><any>object).items
        items = []
        for (i = 0; i < binItems.length; i++) items.push(unmarshalObject(binItems[i]))
        return new PyTuple(items)
      case Bin.Type.LIST:
        binItems = (<Bin.SequenceObject><any>object).items
        items = []
        for (i = 0; i < binItems.length; i++) items.push(unmarshalObject(binItems[i]))
        return new PyList(items)
      case Bin.Type.DICT:
        binKeys = (<Bin.DictObject><any>object).keys
        binItems = (<Bin.DictObject><any>object).values
        keys = []
        items = []
        for (i = 0; i < binItems.length; i++) {
          keys.push(unmarshalObject(binKeys[i]))
          items.push(unmarshalObject(binItems[i]))
        }
        return new PyDict(keys, items)
      case Bin.Type.FROZENSET:
        binItems = (<Bin.SequenceObject><any>object).items
        items = []
        for (i = 0; i < binItems.length; i++) items.push(unmarshalObject(binItems[i]))
        return new PyFrozenSet(items)
      case Bin.Type.CODE:
        return new PyCodeObject(<Bin.CodeObject><any>object)
      default:
        throw new Error("Unrecognized type: " + object.type)
    }
  }
}
