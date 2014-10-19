
module Python {
  export module Types {
    export var BaseException = buildType('BaseException', [ObjectType], {
      __repr__: (self: PyException) => {
        var str = self.type.name + "("
        for (var i = 0; i < self.args.length; i++) {
          str += (<StringLikeObject>self.args[i].repr()).strValue + ","
        }
        return new PyString(str + ")")
      },
      __str__: (self: PyException) => {
        if (self.args.length > 0) {
          return new PyString(self.type.name + ": " +
            (<StringLikeObject>self.args[0].str()).strValue)
        } else return new PyString(self.type.name + ": (no message)")
      }
    })
    export var Exception = buildType('Exception', [BaseException], {})
    export var StandardError = buildType('StandardError', [Exception], {})
    export var ArithmeticError = buildType('ArithmeticError', [StandardError], {})
    export var LookupError = buildType('LookupError', [StandardError], {})
    export var AttributeError = buildType('AttributeError', [StandardError], {})
    export var ImportError = buildType('ImportError', [StandardError], {})
    export var IndexError = buildType('IndexError', [LookupError], {})
    export var KeyError = buildType('KeyError', [LookupError], {})
    export var NameError = buildType('NameError', [StandardError], {})
    export var RuntimeError = buildType('RuntimeError', [StandardError], {})
    export var StopIteration = buildType('StopIteration', [Exception], {})
    export var SystemError = buildType('SystemError', [StandardError], {})
    export var TypeError = buildType('TypeError', [StandardError], {})
    export var ZeroDivisionError = buildType('ZeroDivisionError', [ArithmeticError], {})
  }

  export class PyException extends PyInstanceBase implements PyObject {
    constructor(public type: PyTypeObject, public args: PyObject[], public traceback?: Traceback) {
      super()
      this.args = args
      if (!this.traceback) this.traceback = interpreter.traceback()
    }

    isTrue() {return true}

    toString(): string {
      var str = "Traceback (most recent call last)"
      var tb = this.traceback
      while (tb) {
        str += "\n    " + tb.tb_frame.code.name + " -> "
        var hex = tb.tb_lasti[0].toString(16)
        while (hex.length < 4) hex = '0' + hex
        str += hex + ": " + Bin.Opcode[tb.tb_lasti[1]]
        if (tb.tb_lasti.length > 2) str += " " + tb.tb_lasti[2]
        tb = tb.tb_next
      }
      str += "\n\n" + this.type.name + ": "
      if (this.args.length > 0) str += (<StringLikeObject>this.args[0].str()).strValue
      else str += "(no message)"
      return str
    }
  }

  export function buildException(type: PyTypeObject, message: string, ...args: PyObject[]):
      PyException {
    return new PyException(type, (<PyObject[]>[new PyString(message)]).concat(args))
  }

  Errors.attributeError = (message: string) => buildException(Types.AttributeError, message)
  Errors.indexError = (message: string) => buildException(Types.IndexError, message)
  Errors.keyError = (message: string) => buildException(Types.KeyError, message)
  Errors.nameError = (message: string) => buildException(Types.NameError, message)
  Errors.typeError = (message: string) => buildException(Types.TypeError, message)
}
