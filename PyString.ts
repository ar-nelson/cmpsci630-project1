
module Python {

  export module Types {
    export var StringType = buildType('str', [ObjectType], {
      __add__: (self: PyString, other: PyString): PyObject => {
        if (other.strValue === undefined) return NotImplemented
        return new PyString(self.strValue + other.strValue)
      },
      __cmp__: (self: PyString, other: PyString): PyObject => {
        if (other.strValue === undefined) return NotImplemented
        return new PyInt(self.strValue.localeCompare(other.strValue))
      },
      __contains__: (self: PyString, contained: PyString): PyObject => {
        if (contained.strValue === undefined) return NotImplemented
        return Bool(self.strValue.indexOf(contained.strValue) > -1)
      },
      __getitem__: (self: PyString, index: PyInt) => {
        if (index.numberSize !== NumberSize.INT) throw Errors.typeError(
          "str indices must be integers, not " + index.type.name)
        var i = index.intValue()
        while (i < 0) i += self.strValue.length
        if (i > self.strValue.length) throw Errors.indexError("str index out of range")
        return new PyString(self.strValue.charAt(i))
      },
      __getslice__: (self: PyString, from: PyInt, to: PyInt) => {
        if (from.numberSize !== NumberSize.INT) throw Errors.typeError(
          "str indices must be integers, not " + from.type.name)
        if (to.numberSize !== NumberSize.INT) throw Errors.typeError(
          "str indices must be integers, not " + to.type.name)
        var i = from.intValue(), j = to.intValue()
        while (i < 0) i += self.strValue.length
        while (j < 0) j += self.strValue.length
        if (i > self.strValue.length) i = self.strValue.length
        if (j > self.strValue.length) j = self.strValue.length
        return new PyString(self.strValue.slice(i, j))
      },
      __hash__: (self: PyString) => {
        // http://stackoverflow.com/a/7616484/548027
        var hash = 0, i: number, chr: number, len: number
        if (self.strValue.length == 0) return new PyInt(hash)
        for (i = 0, len = self.strValue.length; i < len; i++) {
          chr = self.strValue.charCodeAt(i)
          hash = ((hash << 5) - hash) + chr
          hash |= 0 // Convert to 32-bit integer
        }
        return new PyInt(hash)
      },
      __len__: (self: PyString) => new PyInt(self.strValue.length),
      __mul__: (self: PyString, other: PyInt): PyObject => {
        if (other.numberSize !== NumberSize.INT) return NotImplemented
        var str = ""
        for (var i = 0; i < other.intValue(); i++) str += self.strValue
        return new PyString(str)
      },
      __repr__: (self: PyString) => new PyString(JSON.stringify(self.strValue)),
      __str__: (self: PyString) => self,
      endswith: (self: PyString, suffix: PyString) => {
        if (suffix.strValue === undefined) throw Errors.typeError(
          "suffix must be a str; got " + suffix.type.name)
        return Bool(self.strValue.lastIndexOf(suffix.strValue) === 
          self.strValue.length - suffix.strValue.length)
      },
      find: (self: PyString, substr: PyString) => {
        if (substr.strValue === undefined) throw Errors.typeError(
          "substr must be a str; got " + substr.type.name)
        return new PyInt(self.strValue.indexOf(substr.strValue))
      },
      index: (self: PyString, substr: PyString) => {
        if (substr.strValue === undefined) throw Errors.typeError(
          "substr must be a str; got " + substr.type.name)
        var result = self.strValue.indexOf(substr.strValue)
        if (result < 0) throw buildException(Types.ValueError, "could not find " +
          JSON.stringify(substr.strValue) + " in " + JSON.stringify(self.strValue))
        return new PyInt(result)
      },
      isalnum: (self: PyString) => Bool(/^\w*$/.test(self.strValue)),
      isalpha: (self: PyString) => Bool(/^[a-zA-Z]*$/.test(self.strValue)),
      isdigit: (self: PyString) => Bool(/^[0-9]*$/.test(self.strValue)),
      islower: (self: PyString) => Bool(self.strValue == self.strValue.toLowerCase()),
      isspace: (self: PyString) => Bool(/^\s*$/.test(self.strValue)),
      isupper: (self: PyString) => Bool(self.strValue == self.strValue.toUpperCase()),
      join: (self: PyString, iterable: PyObject) => {
        var iter = iterable.getIter()
        var str = ""
        while (true) {
          try {
            var next = iter.callMethodObjArgs("next")
            if (str != "") str += self.strValue
            str += (<StringLikeObject>next.str()).strValue
          } catch (ex) {
            if (ex instanceof PyException && ex.type === Types.StopIteration) {
              return new PyString(str)
            } else throw ex
          }
        }
      },
      lower: (self: PyString) => new PyString(self.strValue.toLowerCase()),
      replace: (self: PyString, oldstr: PyString, newstr: PyString) => {
        if (oldstr.strValue === undefined) throw Errors.typeError(
          "replace args must be a str; got " + oldstr.type.name)
        if (newstr.strValue === undefined) throw Errors.typeError(
          "replace args must be a str; got " + newstr.type.name)
        var s1 = self.strValue, s2 = s1
        while ((s2 = s1.replace(oldstr.strValue, newstr.strValue)) != s1) {s1 = s2}
        return new PyString(s1)
      },
      rfind: (self: PyString, substr: PyString) => {
        if (substr.strValue === undefined) throw Errors.typeError(
          "substr must be a str; got " + substr.type.name)
        return new PyInt(self.strValue.lastIndexOf(substr.strValue))
      },
      rindex: (self: PyString, substr: PyString) => {
        if (substr.strValue === undefined) throw Errors.typeError(
          "substr must be a str; got " + substr.type.name)
        var result = self.strValue.lastIndexOf(substr.strValue)
        if (result < 0) throw buildException(Types.ValueError, "could not find " +
          JSON.stringify(substr.strValue) + " in " + JSON.stringify(self.strValue))
        return new PyInt(result)
      },
      split: (self: PyString, sep: PyString) => {
        if (sep.strValue === undefined) throw Errors.typeError(
          "split separator must be a str; got " + sep.type.name)
        var split: any[] = self.strValue.split(sep.strValue)
        for (var i = 0; i < split.length; i++) split[i] = new PyString(split[i])
        return new PyList(split)
      },
      startswith: (self: PyString, prefix: PyString) => {
        if (prefix.strValue === undefined) throw Errors.typeError(
          "prefix must be a str; got " + prefix.type.name)
        return Bool(self.strValue.indexOf(prefix.strValue) === 0)
      },
      upper: (self: PyString) => new PyString(self.strValue.toUpperCase())
    })
  }

  export class PyString extends PyInstanceBase implements StringLikeObject {
    type = Types.StringType
    constructor(public strValue: string) {super()}
    isTrue() {return this.strValue.length > 0}
    str() {return this}
    repr() {return new PyString(JSON.stringify(this.strValue))}
  }
}
