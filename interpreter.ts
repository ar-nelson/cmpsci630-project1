
module Python {
  export interface StackFrame {
    lastpc: number
    pc: number
    code: PyCodeObject
    locals: { [name: string]: PyObject }
    blockStack: Block[]
  }

  export enum BlockType {
    FUNCTION, LOOP, EXCEPT, FINALLY, WITH
  }

  export interface Block {
    type: BlockType
    start: number
    end: number
    stack: PyObject[]
  }

  export interface Traceback {
    tb_next?: Traceback
    tb_frame: StackFrame
    tb_lasti: number[]
  }

  export var interpreter: Interpreter = null

  var zero = new PyInt(0)
  var maxint = new PyInt(Math.pow(2, 31))

  export class Interpreter {
    private lastpc: number = 0
    private pc: number = 0
    private code: PyCodeObject
    private codeStack: StackFrame[] = []
    private locals: { [name: string]: PyObject } = {}
    private blockStack: Block[]
    private globals: { [name: string]: PyObject } = {}
    private unwinding = false

    private stack() {return this.blockStack[this.blockStack.length - 1].stack}

    constructor(code: Bin.CodeObject, public printer?: Printer) {
      this.code = <any>unmarshalObject(code)
      this.blockStack = [{
        type: BlockType.FUNCTION,
        start: 0,
        end: code.code.byteLength,
        stack: []
      }]
    }

    exec(): void {
      interpreter = this
      //try {
        while (this.pc < this.code.code.byteLength) {
          this.lastpc = this.pc
          var instr = this.code.code.getUint8(this.pc++)
          var arg: number = null
          if (instr >= Bin.HAVE_ARGUMENT) {
            arg = this.code.code.getUint16(this.pc, true)
            this.pc += 2
          }
          try {
            if (this.execInstr(instr, arg)) return
          } catch (ex) {
            if (ex instanceof PyException) {
              var except = this.unwindTo(BlockType.EXCEPT, ex)
              this.pc = except.end
            } else {
              console.dir(this.traceback())
              throw ex
            }
          }
        }
        throw Error("Reached end of code without a RETURN_VALUE")
      //} finally {
      //  interpreter = null
      //}
    }

    traceback(): Traceback {
      var lasti = this.code.code.getUint8(this.lastpc)
      var tb: Traceback = {
        tb_frame: {
          lastpc: this.lastpc,
          pc: this.pc,
          code: this.code,
          locals: this.locals,
          blockStack: this.blockStack
        },
        tb_lasti: lasti >= Bin.HAVE_ARGUMENT ?
          [this.lastpc, lasti, this.code.code.getUint16(this.lastpc+1, true)] :
          [this.lastpc, lasti]
      }
      for (var i = this.codeStack.length - 1; i >= 0; i--) {
        lasti = this.codeStack[i].code.code.getUint8(this.codeStack[i].lastpc)
        tb = {
          tb_next: tb,
          tb_frame: this.codeStack[i],
          tb_lasti: lasti >= Bin.HAVE_ARGUMENT ?
            [this.codeStack[i].lastpc, lasti, this.codeStack[i].code.code.getUint16(
              this.codeStack[i].lastpc + 1, true)] :
            [this.codeStack[i].lastpc, lasti]
        }
      }
      return tb
    }

    pushCode(newCode: PyCodeObject, newLocals: { [name: string]: PyObject }): void {
      if (this.codeStack.length >= 128) throw new Error("stack overflow")
      this.codeStack.push({
        lastpc: this.lastpc,
        pc: this.pc,
        code: this.code,
        locals: this.locals,
        blockStack: this.blockStack
      })
      this.lastpc = 0
      this.pc = 0
      this.code = newCode
      this.locals = newLocals
      this.blockStack = [{
        type: BlockType.FUNCTION, start: 0, end: newCode.code.byteLength, stack: []
      }]
    }

    pushStackValue(value: PyObject): void {this.stack().push(value)}

    private popCode() {
      if (this.codeStack.length === 0) throw new Error("stack underflow")
      var nextStackFrame = this.codeStack.pop()
      this.code = nextStackFrame.code
      this.lastpc = nextStackFrame.lastpc
      this.pc = nextStackFrame.pc
      this.locals = nextStackFrame.locals
      this.blockStack = nextStackFrame.blockStack
    }

    private unwindTo(type: BlockType, exception?: PyException): Block {
      while (this.blockStack.length > 0) {
        var block = this.blockStack.pop()
        if (block.type === type) {
          if (exception) {
            this.stack().push(None) // Should be traceback, but traceback objects aren't implemented.
            this.stack().push(exception.args.length > 0 ? exception.args[0] : None)
            this.stack().push(exception)
          }
          return block
        }
        else if (block.type === BlockType.FINALLY) {
          this.pc = block.end
          if (exception) {
            this.stack().push(None) // Should be traceback, but traceback objects aren't implemented.
            this.stack().push(exception.args.length > 0 ? exception.args[0] : None)
            this.stack().push(exception)
          } else {
            this.stack().push(new PyInt(91)) // Ignored WHY value.
          }
          this.unwinding = true
          this.exec()
          this.unwinding = false
        }
      }
      if (exception) {
        if (this.codeStack.length > 0) {
          this.popCode()
          return this.unwindTo(type, exception)
        } else {
          throw exception
        }
      } else {
        throw new Error("expected, but did not find, enclosing block of type " + BlockType[type])
      }
    }

    private execInstr(opcode: Bin.Opcode, arg?: number): boolean {
      var stack = this.stack()
      var tos: PyObject, tos1: PyObject, tos2: PyObject, tos3: PyObject, res: PyObject
      var op: string, rop: string, opsym: string, name: string
      
      switch (opcode) {
        case Bin.Opcode.POP_TOP:
          stack.pop()
          break
        case Bin.Opcode.ROT_TWO:
          tos = stack.pop(); tos1 = stack.pop()
          stack.push(tos); stack.push(tos1)
          break
        case Bin.Opcode.ROT_THREE:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop()
          stack.push(tos); stack.push(tos2); stack.push(tos1)
          break
        case Bin.Opcode.DUP_TOP:
          tos = stack.pop()
          stack.push(tos); stack.push(tos)
          break
        case Bin.Opcode.ROT_FOUR:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop(); tos3 = stack.pop()
          stack.push(tos); stack.push(tos3); stack.push(tos2); stack.push(tos1)
          break
        case Bin.Opcode.NOP:
          break
        case Bin.Opcode.UNARY_POSITIVE:
          stack.push(stack.pop().callMethodObjArgs("__pos__"))
          break
        case Bin.Opcode.UNARY_NEGATIVE:
          stack.push(stack.pop().callMethodObjArgs("__neg__"))
          break
        case Bin.Opcode.UNARY_NOT:
          stack.push(stack.pop().not())
          break
        case Bin.Opcode.UNARY_CONVERT:
          stack.push(stack.pop().callMethodObjArgs("__repr__"))
          break
        case Bin.Opcode.UNARY_INVERT:
          stack.push(stack.pop().callMethodObjArgs("__invert__"))
          break
        case Bin.Opcode.GET_ITER:
          stack.push(stack.pop().callMethodObjArgs("__iter__"))
          break
        case Bin.Opcode.BINARY_POWER:
          if (!op) {op="__pow__"; rop="__rpow__"; opsym="**"}
        case Bin.Opcode.BINARY_MULTIPLY:
          if (!op) {op = "__mul__"; rop = "__rmul__"; opsym = "*"}
        case Bin.Opcode.BINARY_DIVIDE:
          if (!op) {op = "__div__"; rop = "__rdiv__"; opsym = "/"}
        case Bin.Opcode.BINARY_FLOOR_DIVIDE:
          if (!op) {op = "__floordiv__"; rop = "__rfloordiv__"; opsym = "//"}
        case Bin.Opcode.BINARY_TRUE_DIVIDE:
          if (!op) {op = "__truediv__"; rop = "__rtruediv__"; opsym = "/"}
        case Bin.Opcode.BINARY_MODULO:
          if (!op) {op = "__mod__"; rop = "__rmod__"; opsym = "%"}
        case Bin.Opcode.BINARY_ADD:
          if (!op) {op = "__add__"; rop = "__radd__"; opsym = "+"}
        case Bin.Opcode.BINARY_SUBTRACT:
          if (!op) {op = "__sub__"; rop = "__rsub__"; opsym = "-"}
        case Bin.Opcode.BINARY_LSHIFT:
          if (!op) {op = "__lshift__"; rop = "__rlshift__"; opsym = "<<"}
        case Bin.Opcode.BINARY_RSHIFT:
          if (!op) {op = "__rshift__"; rop = "__rrshift__"; opsym = ">>"}
        case Bin.Opcode.BINARY_AND:
          if (!op) {op = "__and__"; rop = "__rand__"; opsym = "&"}
        case Bin.Opcode.BINARY_XOR:
          if (!op) {op = "__xor__"; rop = "__rxor__"; opsym = "^"}
        case Bin.Opcode.BINARY_OR:
          if (!op) {op = "__or__"; rop = "__ror__"; opsym = "|"}
          tos = stack.pop(); tos1 = stack.pop()
          res = tos1.hasAttrString(op) ? tos1.callMethodObjArgs(op, tos) : NotImplemented
          if (res === NotImplemented && tos.hasAttrString(rop)) res = tos.callMethodObjArgs(rop, tos1)
          if (res === NotImplemented) throw Errors.typeError("unsupported operand type(s) for " +
            opsym + ": '" + tos1.type.name + "' and '" + tos.type.name + "'")
          stack.push(res)
          break
        case Bin.Opcode.BINARY_SUBSCR:
          tos = stack.pop(); tos1 = stack.pop()
          stack.push(tos1.getItem(tos))
          break
        case Bin.Opcode.INPLACE_POWER:
          if (!op) { op = "__ipow__"; opsym = "**=" }
        case Bin.Opcode.INPLACE_MULTIPLY:
          if (!op) { op = "__imul__"; opsym = "*=" }
        case Bin.Opcode.INPLACE_DIVIDE:
          if (!op) { op = "__idiv__"; opsym = "/=" }
        case Bin.Opcode.INPLACE_FLOOR_DIVIDE:
          if (!op) { op = "__ifloordiv__"; opsym = "//=" }
        case Bin.Opcode.INPLACE_TRUE_DIVIDE:
          if (!op) { op = "__itruediv__"; opsym = "/=" }
        case Bin.Opcode.INPLACE_MODULO:
          if (!op) { op = "__imod__"; opsym = "%=" }
        case Bin.Opcode.INPLACE_ADD:
          if (!op) { op = "__iadd__"; opsym = "+=" }
        case Bin.Opcode.INPLACE_SUBTRACT:
          if (!op) { op = "__isub__"; opsym = "-=" }
        case Bin.Opcode.INPLACE_LSHIFT:
          if (!op) { op = "__ilshift__"; opsym = "<<=" }
        case Bin.Opcode.INPLACE_RSHIFT:
          if (!op) { op = "__irshift__"; opsym = ">>=" }
        case Bin.Opcode.INPLACE_AND:
          if (!op) { op = "__iand__"; opsym = "&=" }
        case Bin.Opcode.INPLACE_XOR:
          if (!op) { op = "__ixor__"; opsym = "^=" }
        case Bin.Opcode.INPLACE_OR:
          if (!op) { op = "__ior__"; opsym = "|=" }
          tos = stack.pop(); tos1 = stack.pop()
          res = tos1.hasAttrString(op) ? tos1.callMethodObjArgs(op, tos) : NotImplemented
          if (res === NotImplemented) throw Errors.typeError("unsupported operand type(s) for " +
            opsym + ": '" + tos1.type.name + "' and '" + tos.type.name + "'")
          stack.push(res)
          break
        case Bin.Opcode.SLICE_0:
          stack.push(stack.pop().callMethodObjArgs("__getslice__", zero, maxint))
          break
        case Bin.Opcode.SLICE_1:
          tos = stack.pop(); tos1 = stack.pop()
          stack.push(tos1.callMethodObjArgs("__getslice__", tos, maxint))
          break
        case Bin.Opcode.SLICE_2:
          tos = stack.pop(); tos1 = stack.pop()
          stack.push(tos1.callMethodObjArgs("__getslice__", zero, tos))
          break
        case Bin.Opcode.SLICE_3:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop()
          stack.push(tos2.callMethodObjArgs("__getslice__", tos1, tos))
          break
        case Bin.Opcode.STORE_SLICE_0:
          tos = stack.pop(); tos1 = stack.pop()
          tos.callMethodObjArgs("__setslice__", zero, maxint, tos1)
          break
        case Bin.Opcode.STORE_SLICE_1:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop()
          tos1.callMethodObjArgs("__setslice__", tos, maxint, tos2)
          break
        case Bin.Opcode.STORE_SLICE_2:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop()
          tos1.callMethodObjArgs("__setslice__", zero, tos, tos2)
          break
        case Bin.Opcode.STORE_SLICE_3:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop(); tos3 = stack.pop()
          tos2.callMethodObjArgs("__setslice__", tos1, tos, tos3)
          break
        case Bin.Opcode.DELETE_SLICE_0:
          stack.pop().callMethodObjArgs("__delslice__", zero, maxint)
          break
        case Bin.Opcode.DELETE_SLICE_1:
          tos = stack.pop(); tos1 = stack.pop()
          tos1.callMethodObjArgs("__delslice__", tos, maxint)
          break
        case Bin.Opcode.DELETE_SLICE_2:
          tos = stack.pop(); tos1 = stack.pop()
          tos1.callMethodObjArgs("__delslice__", zero, tos)
          break
        case Bin.Opcode.DELETE_SLICE_3:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop()
          tos2.callMethodObjArgs("__delslice__", tos1, tos)
          break
        case Bin.Opcode.STORE_MAP:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop()
          tos2.setItem(tos, tos1)
          stack.push(tos2)
          break
        case Bin.Opcode.STORE_SUBSCR:
          tos = stack.pop(); tos1 = stack.pop(); tos2 = stack.pop()
          tos1.setItem(tos, tos2)
          break
        case Bin.Opcode.DELETE_SUBSCR:
          tos = stack.pop(); tos1 = stack.pop()
          tos1.delItem(tos)
          break

        // TODO: PRINT_EXPR, PRINT_ITEM_TO, PRINT_NEWLINE_TO

        case Bin.Opcode.PRINT_ITEM:
          this.printer.print((<StringLikeObject><any>stack.pop().str()).strValue)
          break
        case Bin.Opcode.PRINT_NEWLINE:
          this.printer.printNewline()
          break
        case Bin.Opcode.BREAK_LOOP:
          var block = this.unwindTo(BlockType.LOOP)
          this.pc = block.end
          break
        case Bin.Opcode.CONTINUE_LOOP:
          var block = this.unwindTo(BlockType.LOOP)
          this.blockStack.push(block)
          this.pc = arg
          break
        case Bin.Opcode.LIST_APPEND:
          stack[stack.length - (arg+1)].callMethodObjArgs("append", stack.pop())
          break

        // TODO: LOAD_LOCALS

        case Bin.Opcode.RETURN_VALUE:
          if (this.codeStack.length === 0) {
            // End of program. Print the returned value.
            if (this.printer) this.printer.printReturnValue(stack.pop())
            interpreter = null
            return true
          } else {
            tos = stack.pop()
            this.unwindTo(BlockType.FUNCTION)
            this.popCode()
            this.stack().push(tos)
          }
          break

        // TODO: Several more instrs, randomly inserted between these...

        case Bin.Opcode.POP_BLOCK:
          this.blockStack.pop()
          break
        case Bin.Opcode.END_FINALLY:
          tos = stack.pop()
          if (tos.isInstance(Types.IntType)) {
            if (this.unwinding) return true
            else throw buildException(Types.SystemError,
              "encountered END_FINALLY outside of a finally block")
          } else if (tos.isInstance(Types.BaseException)) {
            tos1 = stack.pop()
            tos2 = stack.pop()
            if (this.unwinding) return true
            else throw buildException(Types.SystemError,
              "encountered END_FINALLY outside of a finally block")
          } else if (tos === None) {
            // Do nothing.
          } else {
            throw buildException(Types.SystemError, "'finally' pops bad exception")
          }
        case Bin.Opcode.STORE_NAME:
          this.locals[this.code.names[arg]] = stack.pop()
          break
        case Bin.Opcode.DELETE_NAME:
          delete this.locals[this.code.names[arg]]
          break

        case Bin.Opcode.FOR_ITER:
          var exception
          tos = stack.pop()
          try {
            tos1 = tos.callMethodObjArgs("next")
            stack.push(tos)
            stack.push(tos1)
          } catch (ex) {
            if (ex instanceof PyException && ex.type === Types.StopIteration) this.pc += arg
            else throw ex
          }
          break

        case Bin.Opcode.STORE_ATTR:
          stack.pop().setAttrString(this.code.names[arg], stack.pop())
          break
        case Bin.Opcode.DELETE_ATTR:
          stack.pop().delAttrString(this.code.names[arg])
          break
        case Bin.Opcode.STORE_GLOBAL:
          this.globals[this.code.names[arg]] = stack.pop()
          break
        case Bin.Opcode.DELETE_GLOBAL:
          delete this.globals[this.code.names[arg]]
          break
        case Bin.Opcode.LOAD_CONST:
          stack.push(this.code.consts[arg])
          break
        case Bin.Opcode.LOAD_NAME:
          name = this.code.names[arg]
          if (Object.prototype.hasOwnProperty.call(this.locals, name)) {
            stack.push(this.locals[name])
          } else if (Object.prototype.hasOwnProperty.call(this.globals, name)) {
            // FIXME: Should it actually be trying globals?
            stack.push(this.globals[name])
          } else if (Object.prototype.hasOwnProperty.call(builtins, name)) {
            stack.push(builtins[name])
          } else {
            throw Errors.nameError("name '" + name + "' is not defined")
          }
          break
        case Bin.Opcode.BUILD_TUPLE:
          var items: PyObject[] = []
          for (var i = 0; i < arg; i++) items.unshift(stack.pop())
          stack.push(new PyTuple(items))
          break
        case Bin.Opcode.BUILD_LIST:
          var items: PyObject[] = []
          for (var i = 0; i < arg; i++) items.unshift(stack.pop())
          stack.push(new PyList(items))
          break
        case Bin.Opcode.BUILD_SET:
          var items: PyObject[] = []
          for (var i = 0; i < arg; i++) items.unshift(stack.pop())
          stack.push(new PySet(items))
          break
        case Bin.Opcode.BUILD_MAP:
          stack.push(new PyDict([], []))
          break

        case Bin.Opcode.LOAD_ATTR:
          stack.push(stack.pop().getAttrString(this.code.names[arg]))
          break
        case Bin.Opcode.COMPARE_OP:
          tos = stack.pop(); tos1 = stack.pop()
          res = tos1.richCompare(tos, arg)
          if (res === NotImplemented) {
            res = tos.richCompare(tos1, arg)
            if (res === NotImplemented) throw Errors.typeError("unsupported operand type(s) for " +
              cmp_op[arg] + ": '" + tos1.type.name + "' and '" + tos.type.name + "'")
            else res = res.callMethodObjArgs("__neg__")
          }
          stack.push(res)
          break

        case Bin.Opcode.JUMP_FORWARD:
          this.pc += arg
          break
        case Bin.Opcode.JUMP_IF_FALSE_OR_POP:
          tos = stack.pop()
          if (!tos.isTrue()) { stack.push(tos); this.pc = arg }
          break
        case Bin.Opcode.JUMP_IF_TRUE_OR_POP:
          tos = stack.pop()
          if (tos.isTrue()) { stack.push(tos); this.pc = arg }
          break
        case Bin.Opcode.JUMP_ABSOLUTE:
          this.pc = arg
          break
        case Bin.Opcode.POP_JUMP_IF_FALSE:
          if (!stack.pop().isTrue()) this.pc = arg
          break
        case Bin.Opcode.POP_JUMP_IF_TRUE:
          if (stack.pop().isTrue()) this.pc = arg
          break

        case Bin.Opcode.LOAD_GLOBAL:
          name = this.code.names[arg]
          if (Object.prototype.hasOwnProperty.call(this.globals, name)) {
            stack.push(this.globals[name])
          } else if (Object.prototype.hasOwnProperty.call(builtins, name)) {
            stack.push(builtins[name])
          } else {
            throw Errors.nameError("global name '" + name + "' is not defined")
          }
          break
        case Bin.Opcode.SETUP_LOOP:
          this.blockStack.push({
            type: BlockType.LOOP,
            start: this.pc,
            end: this.pc + arg,
            stack: []
          })
          break
        case Bin.Opcode.SETUP_EXCEPT:
          this.blockStack.push({
            type: BlockType.EXCEPT,
            start: this.pc,
            end: this.pc + arg,
            stack: []
          })
          break
        case Bin.Opcode.SETUP_FINALLY:
          this.blockStack.push({
            type: BlockType.FINALLY,
            start: this.pc,
            end: this.pc + arg,
            stack: []
          })
          break
        case Bin.Opcode.LOAD_FAST:
          name = this.code.varnames[arg]
          if (Object.prototype.hasOwnProperty.call(this.locals, name)) {
            stack.push(this.locals[name])
          } else {
            throw Errors.nameError("name '" + name + "' is not defined")
          }
          break
        case Bin.Opcode.STORE_FAST:
          this.locals[this.code.varnames[arg]] = stack.pop()
          break
        case Bin.Opcode.DELETE_FAST:
          delete this.locals[this.code.varnames[arg]]
          break

        case Bin.Opcode.CALL_FUNCTION:
          var nargs: number = arg & 0xff // low byte
          var nkwargs: number = (arg & 0xff00) >> 8 // high byte
          var args: PyObject[] = [], kwkeys: PyObject[] = [], kwvalues: PyObject[] = []
          for (var i = 0; i < nkwargs; i++) {
            kwvalues.push(stack.pop())
            kwkeys.push(stack.pop())
          }
          for (var i = 0; i < nargs; i++) args.unshift(stack.pop())
          res = stack.pop().call(new PyTuple(args),
            nkwargs > 0 ? new PyDict(kwkeys, kwvalues) : null)
          if (res === PauseInterpreter) return true
          if (res !== null) stack.push(res)
          break
        case Bin.Opcode.MAKE_FUNCTION:
          tos = stack.pop()
          if (!(tos instanceof PyCodeObject)) throw Errors.typeError(
            "function can only be created from a code object")
          var defaults: PyObject[] = []
          for (var i = 0; i < arg; i++) defaults.push(stack.pop())
          stack.push(new PyFunction(<PyCodeObject>tos, defaults))
          break

        default:
          throw buildException(Types.SystemError, "Unimplemented opcode: " +
            (Bin.Opcode[opcode] || "0x" + opcode.toString(16)))
      }
      return false
    }
  }

  export interface Printer {
    /** Prints `text` to the console, without a trailing newline. */
    print(text: string): void
    /** Prints a newline character to the console. */
    printNewline(): void
    /** Prints the final return value of a program. */
    printReturnValue(value: PyObject): void
    /** Prompts the user for input, which will be provided to `callback`. */
    rawInput(callback: (input: string) => void, prompt?: string): void
  }
}
