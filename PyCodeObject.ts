
module Python {

  export module Types {
    export var CodeType = buildType('code', [ObjectType], {})
    export var FunctionType = buildType('function', [ObjectType], {})
  }

  export class PyCodeObject extends PyInstanceBase implements PyObject {
    type = Types.CodeType
    argcount: number
    nlocals: number
    stacksize: number
    hasVarargs: boolean
    hasKwArgs: boolean
    isGenerator: boolean
    code: DataView
    consts: PyObject[]
    names: string[]
    varnames: string[]
    freevars: string[]
    cellvars: string[]
    filename: string
    name: string
    // TODO: Line number information?

    constructor(bin: Bin.CodeObject) {
      super()
      this.argcount = bin.argcount
      this.nlocals = bin.nlocals
      this.stacksize = bin.stacksize
      this.hasVarargs = (bin.flags & Bin.CodeFlag.HAS_VARARGS) != 0
      this.hasKwArgs = (bin.flags & Bin.CodeFlag.HAS_KWARGS) != 0
      this.isGenerator = (bin.flags & Bin.CodeFlag.IS_GENERATOR) != 0
      this.code = bin.code
      this.consts = []
      for (var i = 0; i < bin.consts.length; i++) this.consts.push(unmarshalObject(bin.consts[i]))
      this.names = bin.names
      this.varnames = bin.varnames
      this.cellvars = bin.cellvars
      this.filename = bin.filename
      this.name = bin.name
    }

    isTrue() {return true}
  }

  export class PyFunction extends PyInstanceBase implements PyObject {
    type = Types.FunctionType
    hasDefaults: boolean
    defaults: { [key: string]: PyObject } = {}

    constructor(public code: PyCodeObject, defaults: PyObject[]) {
      super()
      this.hasDefaults = defaults.length > 0
      for (var i = 0; i < defaults.length; i++) {
        this.defaults[code.varnames[code.argcount - 1 - i]] = defaults[i]
      }
    }

    isTrue() {return true}

    isCallable() {return true}

    call(args: SequenceLikeObject, kwargs?: DictLikeObject): PyObject {
      var locals: { [key: string]: PyObject } = {}
      var extraArgs = [], extraKeys = [], extraValues = []
      if (this.hasDefaults) for (var dkey in this.defaults) {
        if (Object.prototype.hasOwnProperty.call(this.defaults, dkey)) {
          locals[dkey] = this.defaults[dkey]
        }
      }
      for (var i = 0; i < args.seqValue.length; i++) {
        if (i < this.code.argcount) locals[this.code.varnames[i]] = args.seqValue[i]
        else extraArgs.push(args.seqValue[i])
      }
      if (kwargs) {
        var entries = kwargs.entries()
        for (i = 0; i < entries.length; i++) {
          var key = (<StringLikeObject>entries[i][0]).strValue
          if (arrayContains(this.code.varnames, key, this.code.argcount)) {
            locals[key] = entries[i][1]
          } else if (this.code.hasKwArgs) {
            extraKeys.push(entries[i][0])
            extraValues.push(entries[i][1])
          } else {
            throw Errors.typeError(this.code.name +
              "() got an unexpected keyword argument " + JSON.stringify(key))
          }
        }
      }
      if (this.code.hasVarargs) {
        locals[this.code.varnames[this.code.argcount]] = new PyTuple(extraArgs)
      } else if (extraArgs.length > 0) {
        throw Errors.typeError(this.code.name + "() takes at most " +
          this.code.argcount + " arguments (" + (this.code.argcount + extraArgs.length) +
          " given)")
      }
      if (this.code.hasKwArgs) {
        var kwArgsName = this.code.varnames[this.code.argcount + (this.code.hasVarargs ? 1 : 0)]
        locals[kwArgsName] = new PyDict(extraKeys, extraValues)
      }
      for (i = 0; i < this.code.argcount; i++) {
        if (!Object.hasOwnProperty.call(locals, this.code.varnames[i])) {
          throw Errors.typeError(this.code.name + "() takes " + (
            (this.hasDefaults || this.code.hasVarargs || this.code.hasKwArgs) ?
            "at least " : "exactly "
          ) + this.code.argcount + " arguments (" + countKeys(locals) + " given)")
        }
      }
      interpreter.pushCode(this.code, locals)
      return null // Signals to the interpreter to keep executing.
    }
  }
}

function arrayContains(arr: string[], item: string, n: number) {
  for (var i = 0; i < n; i++) if (arr[i] == item) return true
  return false
}

function countKeys(obj: Object): number {
  var n = 0
  for (var k in obj) if (Object.hasOwnProperty.call(obj, k)) n++
  return n
}
