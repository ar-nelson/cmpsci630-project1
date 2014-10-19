 
module Python.Bin {
  export class Parser {
    offset: number = 0
    interned: string[] = []

    parse(pyc: ArrayBuffer): CodeObject {
      this.offset = 9
      this.interned = []
      var data = new DataView(pyc)
      // TODO: Check magic number?
      return this.parseCodeObject(data)
    }

    private parseObject(data: DataView): Object {
      var offset = this.offset++
      switch (data.getUint8(offset)) {
        case Type.NULL:
        case Type.NONE:
        case Type.TRUE:
        case Type.FALSE:
        case Type.STOPITER:
        case Type.ELLIPSIS:
          return { type: data.getUint8(offset) }
        case Type.INT:
          this.offset += 4
          return {
            type: Type.INT,
            n: data.getInt32(offset + 1, true)
          }
        case Type.INT64:
          throw ParseError("INT64 is not yet supported.", offset)
        case Type.FLOAT:
          return {
            type: Type.FLOAT,
            n: this.parseStringEncodedNumber(data)
          }
        case Type.BINARY_FLOAT:
          this.offset += 8
          return {
            type: Type.FLOAT,
            n: data.getFloat64(offset + 1, true)
          }
        case Type.COMPLEX:
          return {
            type: Type.COMPLEX,
            real: this.parseStringEncodedNumber(data),
            imag: this.parseStringEncodedNumber(data)
          }
        case Type.BINARY_COMPLEX:
          this.offset += 16
          return  {
            type: Type.COMPLEX,
            real: data.getFloat64(offset + 1, true),
            imag: data.getFloat64(offset + 9, true)
          }
        case Type.LONG:
          throw ParseError("LONG is not yet supported.", offset)
        case Type.STRING:
          return this.parseString(data)
        case Type.INTERNED:
          var strResult = this.parseString(data)
          this.interned.push(strResult.str)
          return strResult
        case Type.STRINGREF:
          this.offset += 4
          return {
            type: Type.STRING,
            str: this.interned[data.getInt32(offset + 1, true)]
          }
        case Type.UNICODE:
          throw ParseError("UNICODE is not yet supported.", offset)
        case Type.TUPLE:
        case Type.LIST:
        case Type.FROZENSET:
          return {
            type: data.getUint8(offset),
            items: this.parseSequence(data)
          }
        case Type.DICT:
          return this.parseDictionary(data)
        case Type.CODE:
          return this.parseCodeObject(data)
        default:
          throw ParseError("Unrecognized binary object type: " + data.getUint8(offset) + " ('" +
            String.fromCharCode(data.getUint8(offset)) + "')", offset)
      }
    }

    private parseStringEncodedNumber(data: DataView): number {
      console.debug("Parsing string-encoded number at 0x" + this.offset.toString(16))
      var len = data.getUint8(this.offset) + 1
      var bytes = []
      for (var i = 0; i < len; i++) bytes.push(data.getUint8(this.offset +i))
      this.offset += len
      return Number(String.fromCharCode.apply(String.prototype, bytes))
    }

    private parseString(data: DataView): StringObject {
      var len = data.getUint32(this.offset, true)
      console.log("Parsing string of length " + len + " at 0x" + this.offset.toString(16))
      var bytes = []
      for (var i = 0; i < len; i++) bytes.push(data.getUint8(this.offset+4+i))
      this.offset += len + 4
      return {
        type: Type.STRING,
        str: String.fromCharCode.apply(String.prototype, bytes)
      }
    }

    private parseSequence(data: DataView): Object[] {
      console.debug("Parsing sequence at 0x" + this.offset.toString(16))
      var len = data.getUint32(this.offset, true)
      this.offset += 4
      var seq: Object[] = []
      for (var i = 0; i < len; i++) seq.push(this.parseObject(data))
      return seq
    }

    private parseDictionary(data: DataView): DictObject {
      console.debug("Parsing dictionary at 0x" + this.offset.toString(16))
      var keys: Object[] = []
      var values: Object[] = []
      while (true) {
        var nextKey = this.parseObject(data)
        if (nextKey.type === Type.NULL) return {
          type: Type.DICT,
          keys: keys,
          values: values
        }
        keys.push(nextKey)
        values.push(this.parseObject(data))
      }
    }

    private toStrings(seq: Object[]): string[] {
      var result: string[] = []
      for (var i = 0; i < seq.length; i++) {
        if (seq[i].hasOwnProperty("str")) result.push((<any>seq[i]).str)
        else throw ParseError("Expected String; got " + Type[seq[i].type] + ".",  this.offset)
      }
      return result
    }

    private parseCodeObject(data: DataView): CodeObject {
      console.debug("Parsing code object at 0x" + this.offset.toString(16))
      return {
        type: Type.CODE,
        argcount: this.readUint32(data),
        nlocals: this.readUint32(data),
        stacksize: this.readUint32(data),
        flags: this.readUint32(data),
        code: this.parseInstructionString(data),
        consts: this.checkType(data, Type.TUPLE).parseSequence(data),
        names: this.toStrings(this.checkType(data, Type.TUPLE).parseSequence(data)),
        varnames: this.toStrings(this.checkType(data, Type.TUPLE).parseSequence(data)),
        freevars: this.toStrings(this.checkType(data, Type.TUPLE).parseSequence(data)),
        cellvars: this.toStrings(this.checkType(data, Type.TUPLE).parseSequence(data)),
        filename: (<StringObject>this.parseObject(data)).str,
        name: (<StringObject>this.parseObject(data)).str,
        firstlineno: this.readUint32(data),
        lnotab: (<StringObject>this.parseObject(data)).str
      }
    }

    private readUint32(data: DataView): number {
      console.debug("Parsing uint32 at 0x" + this.offset.toString(16))
      this.offset += 4;
      return data.getUint32(this.offset - 4, true)
    }

    private checkType(data: DataView, type: Type): Parser {
      if (data.getUint8(this.offset) !== type) {
        throw ParseError("Expected " + Type[type] + "; got " + Type[data.getUint8(this.offset)] +
          ".", this.offset)
      }
      this.offset++
      return this
    }

    private parseInstructionString(data: DataView): DataView {
      console.debug("Parsing instruction string at 0x" + this.offset.toString(16))
      var len = data.getUint32(this.offset+1, true)
      var instrs = new DataView(data.buffer, this.offset+5, len)
      this.offset += len + 5
      return instrs
    }
  }

  export function ParseError(message: string, offset: number): Error {
    return new Error("Binary parse error at byte offset 0x" + offset.toString(16) + ": " + message)
  }
}