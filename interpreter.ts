
module Python {
  interface StackFrame {
    pc: number
    code: PyCodeObject
  }

  export class Interpreter {
    private pc: number = 0
    private stack: PyObject[] = []
    private code: PyCodeObject
    private codeStack: StackFrame[] = []
    private locals: { [name: string]: PyObject } = {}
    private localsStack: { [name: string]: PyObject }[] = [this.locals]
    private globals: { [name: string]: PyObject } = {}

    constructor(code: Bin.CodeObject, public importer?: Importer, public printer?: Printer) {
      this.code = <any>unmarshalObject(code)
    }

    exec(): void {
      while (true) {
        while (this.pc < this.code.code.byteLength) {
          var instr = this.code.code.getUint8(this.pc++)
          var arg: number = null
          if (instr >= Bin.HAVE_ARGUMENT) {
            arg = this.code.code.getUint16(this.pc, true)
            this.pc += 2
          }
          this.execInstr(instr, arg)
        }
        if (this.codeStack.length === 0) break
        else {
          var nextFrame = this.codeStack.pop()
          this.pc = nextFrame.pc
          this.code = nextFrame.code
        }
      }
    }

    private execInstr(opcode: Bin.Opcode, arg?: number): void {
      var stack = this.stack
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
          stack.push(stack.pop().callMethodObjArgs("__not__"))
          break
        case Bin.Opcode.UNARY_CONVERT:
          // Not sure what this does.
          stack.pop()
          stack.push(NotImplemented)
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

        // TODO: Slice operations

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

        // TODO: BREAK_LOOP, CONTINUE_LOOP

        case Bin.Opcode.LIST_APPEND:
          stack[stack.length - arg].callMethodObjArgs("append", stack.pop())
          break

        // TODO: LOAD_LOCALS

        case Bin.Opcode.RETURN_VALUE:
          if (this.codeStack.length === 0) {
            // End of program. Print the returned value.
            if (this.printer) this.printer.printReturnValue(stack.pop())
            return
          } else {
            // Pop the function stack.
            this.locals = this.localsStack.pop()
            var codeTos = this.codeStack.pop()
            this.code = codeTos.code
            this.pc = codeTos.pc
          }
          break

        // TODO: Several more instrs, randomly inserted between these...

        case Bin.Opcode.STORE_NAME:
          this.locals[this.code.names[arg]] = stack.pop()
          break
        case Bin.Opcode.DELETE_NAME:
          delete this.locals[this.code.names[arg]]
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
          } else {
            throw Errors.nameError("name '" + name + "' is not defined")
          }
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

        case Bin.Opcode.LOAD_GLOBAL:
          name = this.code.names[arg]
          if (Object.prototype.hasOwnProperty.call(this.globals, name)) {
            stack.push(this.globals[name])
          } else {
            throw Errors.nameError("global name '" + name + "' is not defined")
          }
          break

        default:
          throw new Error("Unimplemented opcode: " +
             (Bin.Opcode[opcode] || "0x" + opcode.toString(16)))
      }
    }
  }

  export interface Printer {
    /** Prints `text` to the console, without a trailing newline. */
    print(text: string): void
    /** Prints a newline character to the console. */
    printNewline(): void
    /** Prints the final return value of a program. */
    printReturnValue(value: PyObject): void
  }

  export interface Importer {
    /**
     * Attempts to import the module `moduleName`, and calls `callback` with a binary ArrayBuffer
     * if the import succeeded. The first argument of `callback` is an error, which will be
     * non-null if the import failed.
     */
    importModule(moduleName: string, callback: (err: any, bin: ArrayBuffer) => void): void
  }
}
