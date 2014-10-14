 
module Python {

  export function add(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT: return new PyInt((a.intValue() + b.intValue()) | 0)
      case NumberSize.LONG: //TODO: longs
      case NumberSize.FLOAT: return new PyFloat(a.floatValue() + b.floatValue())
      case NumberSize.COMPLEX: default:
        return new PyComplex(a.realValue() + b.realValue(), a.imagValue() + b.imagValue())
    }
  }

  export function sub(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT: return new PyInt((a.intValue() - b.intValue()) | 0)
      case NumberSize.LONG: //TODO: longs
      case NumberSize.FLOAT: return new PyFloat(a.floatValue() - b.floatValue())
      case NumberSize.COMPLEX: default:
        return new PyComplex(a.realValue() - b.realValue(), a.imagValue() - b.imagValue())
    }
  }

  export function mod(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT: return new PyInt(a.intValue() % b.intValue())
      case NumberSize.LONG: //TODO: longs
      case NumberSize.FLOAT: return new PyFloat(a.floatValue() % b.floatValue())
      case NumberSize.COMPLEX: default:
        return new PyComplex(a.realValue() % b.realValue(), a.imagValue() % b.imagValue())
    }
  }

  export function mul(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT: return new PyInt((a.intValue() * b.intValue()) | 0)
      case NumberSize.LONG: //TODO: longs
      case NumberSize.FLOAT: return new PyFloat(a.floatValue() * b.floatValue())
      case NumberSize.COMPLEX: default:
        return new PyComplex(a.realValue() * b.realValue(), a.imagValue() * b.imagValue())
    }
  }

  export function floordiv(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT: return new PyInt(Math.floor(a.intValue() / b.intValue()) | 0)
      case NumberSize.LONG: //TODO: longs
      case NumberSize.FLOAT: return new PyFloat(Math.floor(a.floatValue() / b.floatValue()))
      case NumberSize.COMPLEX: default:
        return new PyComplex(
          Math.floor(a.realValue() / b.realValue()),
          Math.floor(a.imagValue() / b.imagValue()))
    }
  }

  export function truediv(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT:
      case NumberSize.LONG:
      case NumberSize.FLOAT: return new PyFloat(a.floatValue() / b.floatValue())
      case NumberSize.COMPLEX: default:
        return new PyComplex(a.realValue() / b.realValue(), a.imagValue() / b.imagValue())
    }
  }

  export function pow(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT: return new PyInt(Math.pow(a.intValue(), b.intValue()) | 0)
      case NumberSize.LONG: //TODO: longs
      case NumberSize.FLOAT: return new PyFloat(Math.pow(a.floatValue(), b.floatValue()))
      case NumberSize.COMPLEX: default:
        // FIXME: This is probably not the right algorithm.
        return new PyComplex(Math.pow(a.realValue(), b.realValue()), Math.pow(a.imagValue(), b.imagValue()))
    }
  }

  export function cmp(a: NumberLikeObject, b: NumberLikeObject): PyObject {
    if (a.numberSize === undefined || b.numberSize === undefined) {
      return NotImplemented
    }
    switch (Math.max(a.numberSize, b.numberSize)) {
      case NumberSize.INT: return new PyInt(
        a.intValue() === b.intValue() ? 0 : (a.intValue() < b.intValue() ? -1 : 1))
      case NumberSize.LONG: //TODO: longs
      case NumberSize.FLOAT: return new PyInt(
        a.floatValue() === b.floatValue() ? 0 : (a.floatValue() < b.floatValue() ? -1 : 1))
      case NumberSize.COMPLEX: default:
        throw Errors.typeError("no ordering relation is defined for complex numbers")
    }
  }

  export module Types {
    export var IntType = buildType('int', [ObjectType], {
      __abs__: (self: PyInt) => new PyInt(Math.abs(self.n)),
      __add__: add,
      __and__: (self: PyInt, b: NumberLikeObject) => new PyInt(self.n & b.intValue()),
      __cmp__: cmp,
      __div__: floordiv,
      __divmod__: (a, b) => new PyTuple([floordiv(a, b), mod(a, b)]),
      __float__: (self: PyInt) => new PyFloat(self.floatValue()),
      __floordiv__: floordiv,
      __hash__: (self: PyInt) => self,
      __int__: (self: PyInt) => self,
      __invert__: (self: PyInt) => new PyInt(~self.n),
      // todo: __long__ = convert to long
      __lshift__: (self: PyInt, b: NumberLikeObject) => new PyInt(self.n << b.intValue()),
      __mod__: mod,
      __mul__: mul,
      __neg__: (self: PyInt) => new PyInt(-self.n),
      __or__: (self: PyInt, b: NumberLikeObject) => new PyInt(self.n | b.intValue()),
      __pow__: pow,
      __repr__: (self: PyInt) => new PyString(self.n.toString()),
      __rshift__: (self: PyInt, b: NumberLikeObject) => new PyInt(self.n >> b.intValue()),
      __sub__: sub,
      __truediv__: truediv,
      __xor__: (self: PyInt, b: NumberLikeObject) => new PyInt(self.n ^ b.intValue()),
    })
    export var BoolType = buildType('bool', [IntType], {
      __repr__: (self: PyObject) => new PyString(self.isTrue() ? "True" : "False")
    })
    export var FloatType = buildType('float', [ObjectType], {
      __abs__: (self: PyFloat) => new PyFloat(Math.abs(self.n)),
      __add__: add,
      __cmp__: cmp,
      __div__: floordiv,
      __divmod__: (a, b) => new PyTuple([floordiv(a, b), mod(a, b)]),
      __float__: (self: PyFloat) => self,
      __floordiv__: floordiv,
      __hash__: (self: PyFloat) => new PyInt(self.intValue()),
      __int__: (self: PyFloat) => new PyInt(self.intValue()),
      // todo: __long__ = convert to long
      __mod__: mod,
      __mul__: mul,
      __neg__: (self: PyFloat) => new PyFloat(-self.n),
      __pow__: pow,
      __repr__: (self: PyFloat) => new PyString(self.n.toString()),
      __sub__: sub,
      __truediv__: truediv,
      is_integer: (self: PyFloat) => Bool(self.intValue() === self.floatValue())
    })
    export var ComplexType = buildType('complex', [ObjectType], {
      __abs__: (self: PyComplex) => new PyComplex(Math.abs(self.real), Math.abs(self.imag)),
      __add__: add,
      __cmp__: cmp,
      __div__: truediv,
      __divmod__: (a, b) => new PyTuple([floordiv(a, b), mod(a, b)]),
      __floordiv__: floordiv,
      __hash__: (self: PyComplex) => new PyInt((self.realValue() + self.imagValue()) | 0),
      __mod__: mod,
      __mul__: mul,
      __neg__: (self: PyComplex) => new PyComplex(-self.realValue(), -self.imagValue()),
      __pow__: pow,
      __repr__: (self: PyComplex) => {
        if (self.realValue() !== 0) {
          return new PyString("(" + self.realValue() + "+" + self.imagValue() + "j)")
        } else {
          return new PyString(self.imagValue() + "j")
        }
      },
      __sub__: sub,
      __truediv__: truediv,
    })
  }

  export class PyInt extends PyInstanceBase implements PyObject, NumberLikeObject {
    type = Types.IntType
    numberSize = NumberSize.INT
    constructor(public n: number) {
      super()
    }
    intValue() {return this.n}
    floatValue() {return this.n }
    realValue() {return this.n}
    imagValue() {return 0}
    isTrue() {return this.n !== 0}
  }

  export class PyFloat extends PyInstanceBase implements PyObject, NumberLikeObject {
    type = Types.FloatType
    numberSize = NumberSize.FLOAT
    constructor(public n: number) {
      super()
    }
    intValue() {return Math.floor(this.n) | 0}
    floatValue() {return this.n}
    realValue() {return this.n}
    imagValue() {return 0}
    isTrue() {return this.n !== 0}
  }

  export class PyComplex extends PyInstanceBase implements PyObject, ComplexLikeObject {
    type = Types.FloatType
    numberSize = NumberSize.COMPLEX
    constructor(public real: number, public imag: number) {
      super()
    }
    realValue() {return this.real}
    imagValue() {return this.imag}
    isTrue() {return this.real !== 0 || this.imag !== 0}
  }

  export var True = new PyInt(1)
  export var False = new PyInt(0)
  True.type = Types.BoolType
  False.type = Types.BoolType

  export function Bool(value: boolean): PyObject {return value ? True : False }
}
