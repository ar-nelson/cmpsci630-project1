 
module Python.Bin {

  /**
   * Python bytecode instruction codes.
   *
   * Instruction names and documentation were copied from:
   * https://docs.python.org/2/library/dis.html
   */
  export enum Opcode {

    /** Indicates end-of-code to the compiler, not used by the interpreter. */
    STOP_CODE = 0,
    
    /** Do nothing code. Used as a placeholder by the bytecode optimizer. */
    NOP = 9,

    /** Removes the top-of-stack(TOS) item. */
    POP_TOP = 1,

    /** Swaps the two top-most stack items. */
    ROT_TWO = 2,

    /** Lifts second and third stack item one position up, moves top down to position three. */
    ROT_THREE = 3,

    /** Lifts second, third and fourth stack item one position up, moves top down to position four. */
    ROT_FOUR = 5,

    /** Duplicates the reference on top of the stack. */
    DUP_TOP = 4,

    /** Implements TOS = +TOS. */
    UNARY_POSITIVE = 10,

    /** Implements TOS = -TOS. */
    UNARY_NEGATIVE = 11,

    /** Implements TOS = not TOS. */
    UNARY_NOT = 12,

    /** Implements TOS = `TOS` */
    UNARY_CONVERT = 13,

    /** Implements TOS = ~TOS. */
    UNARY_INVERT = 15,
 
    /** Implements TOS = iter(TOS). */
    GET_ITER = 68,

    /** Implements TOS = TOS1 ** TOS. */
    BINARY_POWER = 19,

    /** Implements TOS = TOS1 * TOS. */
    BINARY_MULTIPLY = 20,

    /** Implements TOS = TOS1 / TOS when from __future__ import division is not in effect. */
    BINARY_DIVIDE = 21,

    /** Implements TOS = TOS1 // TOS */
    BINARY_FLOOR_DIVIDE = 26,

    /** Implements TOS = TOS1 / TOS when from __future__ import division is in effect. */
    BINARY_TRUE_DIVIDE = 27,

    /** Implements TOS = TOS1 % TOS. */
    BINARY_MODULO = 22,

    /** Implements TOS = TOS1 + TOS. */
    BINARY_ADD = 23,

    /** Implements TOS = TOS1 - TOS. */
    BINARY_SUBTRACT = 24,

    /** Implements TOS = TOS1[TOS]. */
    BINARY_SUBSCR = 25,

    /** Implements TOS = TOS1 << TOS. */
    BINARY_LSHIFT = 62,

    /** Implements TOS = TOS1 >> TOS. */
    BINARY_RSHIFT = 63,

    /** Implements TOS = TOS1 & TOS. */
    BINARY_AND = 64,

    /** Implements TOS = TOS1 ^ TOS. */
    BINARY_XOR = 65,

    /** Implements TOS = TOS1 | TOS. */
    BINARY_OR = 66,

    /** Implements in-place TOS = TOS1 ** TOS. */
    INPLACE_POWER = 67,

    /** Implements in-place TOS = TOS1 * TOS. */
    INPLACE_MULTIPLY = 57,

    /** Implements in-place TOS = TOS1 / TOS when from __future__ import division is not in effect. */
    INPLACE_DIVIDE = 58,

    /** Implements in-place TOS = TOS1 // TOS. */
    INPLACE_FLOOR_DIVIDE = 28,

    /** Implements in-place TOS = TOS1 / TOS when from __future__ import division is in effect. */
    INPLACE_TRUE_DIVIDE = 29,

    /** Implements in-place TOS = TOS1 % TOS. */
    INPLACE_MODULO = 59,

    /** Implements in-place TOS = TOS1 + TOS. */
    INPLACE_ADD = 55,

    /** Implements in-place TOS = TOS1 - TOS. */
    INPLACE_SUBTRACT = 56,

    /** Implements in-place TOS = TOS1 << TOS. */
    INPLACE_LSHIFT = 75,

    /** Implements in-place TOS = TOS1 >> TOS. */
    INPLACE_RSHIFT = 76,

    /** Implements in-place TOS = TOS1 & TOS. */
    INPLACE_AND = 77,

    /** Implements in-place TOS = TOS1 ^ TOS. */
    INPLACE_XOR = 78,

    /** Implements in -place TOS = TOS1 | TOS. */
    INPLACE_OR = 79,

    /** Implements TOS = TOS[:]. */
    SLICE_0 = 30,

    /** Implements TOS = TOS1[TOS:]. */
    SLICE_1 = 31,

    /** Implements TOS = TOS1[:TOS]. */
    SLICE_2 = 32,

    /** Implements TOS = TOS2[TOS1:TOS]. */
    SLICE_3 = 33,

    /** Implements TOS[:] = TOS1. */
    STORE_SLICE_0 = 40,

    /** Implements TOS1[TOS:] = TOS2. */
    STORE_SLICE_1 = 41,

    /** Implements TOS1[:TOS] = TOS2. */
    STORE_SLICE_2 = 42,

    /** Implements TOS2[TOS1:TOS] = TOS3. */
    STORE_SLICE_3 = 43,

    /** Implements del TOS[:]. */
    DELETE_SLICE_0 = 50,

    /** Implements del TOS1[TOS:]. */
    DELETE_SLICE_1 = 51,

    /** Implements del TOS1[:TOS]. */
    DELETE_SLICE_2 = 52,

    /** Implements del TOS2[TOS1:TOS]. */
    DELETE_SLICE_3 = 53,

    /** Implements TOS1[TOS] = TOS2. */
    STORE_SUBSCR = 60,

    /** Implements del TOS1[TOS]. */
    DELETE_SUBSCR = 61,

    /**
     * Implements the expression statement for the interactive mode. TOS is removed from the stack
     * and printed. In non-interactive mode, an expression statement is terminated with POP_STACK.
     */
    PRINT_EXPR = 70,

    /**
     * Prints TOS to the file-like object bound to sys.stdout. There is one such instruction for
     * each item in the print statement.
     */
    PRINT_ITEM = 71,

    /**
     * Like PRINT_ITEM, but prints the item second from TOS to the file-like object at TOS. This is
     * used by the extended print statement.
     */
    PRINT_ITEM_TO = 73,

    /**
     * Prints a new line on sys.stdout. This is generated as the last operation of a print
     * statement, unless the statement ends with a comma.
     */
    PRINT_NEWLINE = 72,

    /**
     * Like PRINT_NEWLINE, but prints the new line on the file-like object on the TOS. This is used
     * by the extended print statement.
     */
    PRINT_NEWLINE_TO = 74,

    /** Terminates a loop due to a break statement. */
    BREAK_LOOP = 80,

    /**
     * Continues a loop due to a continue statement. target is the address to jump to (which should
     * be a FOR_ITER instruction).
     */
    CONTINUE_LOOP = 119,

    /**
     * Calls list.append(TOS[-i], TOS). Used to implement list comprehensions. While the appended
     * value is popped off, the list object remains on the stack so that it is available for
     * further iterations of the loop.
     */
    LIST_APPEND = 94,

    /**
     * Pushes a reference to the locals of the current scope on the stack. This is used in the code
     * for a class definition: After the class body is evaluated, the locals are passed to the
     * class definition.
     */
    LOAD_LOCALS = 82,

    /** Returns with TOS to the caller of the function. */
    RETURN_VALUE = 83,

    /** Pops TOS and yields it from a generator. */
    YIELD_VALUE = 86,

    /**
     * Loads all symbols not starting with '_' directly from the module TOS to the local namespace.
     * The module is popped after loading all names. This opcode implements from module import *.
     */
    IMPORT_STAR = 84,

    /** Implements exec TOS2, TOS1, TOS. The compiler fills missing optional parameters with None. */
    EXEC_STMT = 85,

    /**
     * Removes one block from the block stack. Per frame, there is a stack of blocks, denoting
     * nested loops, try statements, and such.
     */
    POP_BLOCK = 87,

    /**
     * Terminates a finally clause. The interpreter recalls whether the exception has to be
     * re-raised, or whether the function returns, and continues with the outer-next block.
     */
    END_FINALLY = 88,

    /**
     * Creates a new class object. TOS is the methods dictionary, TOS1 the tuple of the names of
     * the base classes, and TOS2 the class name.
     */
    BUILD_CLASS = 89,

    /**
     * This opcode performs several operations before a with block starts. First, it loads
     * __exit__() from the context manager and pushes it onto the stack for later use by
     * WITH_CLEANUP. Then, __enter__() is called, and a finally block pointing to delta is pushed.
     * Finally, the result of calling the enter method is pushed onto the stack. The next opcode
     * will either ignore it (POP_TOP), or store it in (a) variable(s) (STORE_FAST, STORE_NAME, or
     * UNPACK_SEQUENCE).
     */
    SETUP_WITH = 143,

    /**
     * Cleans up the stack when a with statement block exits. On top of the stack are 1–3 values
     * indicating how/why the finally clause was entered:
     * 
     * TOP = None
     * (TOP, SECOND) = (WHY_{RETURN, CONTINUE}), retval
     * TOP = WHY_*; no retval below it
     * (TOP, SECOND, THIRD) = exc_info()
     *
     * Under them is EXIT, the context manager’s __exit__() bound method.
     *
     * In the last case, EXIT(TOP, SECOND, THIRD) is called, otherwise EXIT(None, None, None).
     *
     * EXIT is removed from the stack, leaving the values above it in the same order. In addition,
     * if the stack represents an exception, and the function call returns a ‘true’ value, this
     * information is “zapped”, to prevent END_FINALLY from re-raising the exception. (But
     * non-local gotos should still be resumed.)
     */
    WITH_CLEANUP = 81,

    /**
     * Implements name = TOS. namei is the index of name in the attribute co_names of the code
     * object. The compiler tries to use STORE_FAST or STORE_GLOBAL if possible.
     */
    STORE_NAME = 90,

    /** Implements del name, where namei is the index into co_names attribute of the code object. */
    DELETE_NAME = 91,

    /** Unpacks TOS into count individual values, which are put onto the stack right-to-left. */
    UNPACK_SEQUENCE = 92,

    /** 
     * Duplicate count items, keeping them in the same order. Due to implementation limits, count
     * should be between 1 and 5 inclusive.
     */
    DUP_TOPX = 99,

    /** Implements TOS.name = TOS1, where namei is the index of name in co_names. */
    STORE_ATTR = 95,

    /** Implements del TOS.name, using namei as index into co_names. */
    DELETE_ATTR = 96,

    /** Works as STORE_NAME, but stores the name as a global. */
    STORE_GLOBAL = 97,

    /** Works as DELETE_NAME, but deletes a global name. */
    DELETE_GLOBAL = 98,

    /** Pushes co_consts[consti] onto the stack. */
    LOAD_CONST = 100,

    /** Pushes the value associated with co_names[namei] onto the stack. */
    LOAD_NAME = 101,

    /**
     * Creates a tuple consuming count items from the stack, and pushes the
     * resulting tuple onto the stack.
     */
    BUILD_TUPLE = 102,

    /** Works as BUILD_TUPLE, but creates a list. */
    BUILD_LIST = 103,
    
    /** Not documented. */
    BUILD_SET = 104,

    /** Pushes a new dictionary object onto the stack. The dictionary is pre-sized to hold count entries. */
    BUILD_MAP = 105,

    /** Replaces TOS with getattr(TOS, co_names[namei]). */
    LOAD_ATTR = 106,

    /** Performs a Boolean operation. The operation name can be found in cmp_op[opname]. */
    COMPARE_OP = 107,

    /**
     * Imports the module co_names[namei]. TOS and TOS1 are popped and provide the fromlist and
     * level arguments of __import__(). The module object is pushed onto the stack. The current
     * namespace is not affected: for a proper import statement, a subsequent STORE_FAST
     * instruction modifies the namespace.
     */
    IMPORT_NAME = 108,

    /**
     * Loads the attribute co_names[namei] from the module found in TOS. The resulting object is
     * pushed onto the stack, to be subsequently stored by a STORE_FAST instruction.
     */
    IMPORT_FROM = 109,

    /** Increments bytecode counter by delta. */
    JUMP_FORWARD = 110,

    /** If TOS is true, sets the bytecode counter to target. TOS is popped. */
    POP_JUMP_IF_TRUE = 115,

    /** If TOS is false, sets the bytecode counter to target. TOS is popped. */
    POP_JUMP_IF_FALSE = 114,

    /** 
     * If TOS is true, sets the bytecode counter to target and leaves TOS on the stack. Otherwise
     * (TOS is false), TOS is popped.
     */
    JUMP_IF_TRUE_OR_POP = 112,

    /**
     * If TOS is false, sets the bytecode counter to target and leaves TOS on the stack. Otherwise
     * (TOS is true), TOS is popped.
     */
    JUMP_IF_FALSE_OR_POP = 111,

    /** Set bytecode counter to target. */
    JUMP_ABSOLUTE = 113,

    /**
     * TOS is an iterator. Call its next() method. If this yields a new value, push it on the stack
     * (leaving the iterator below it). If the iterator indicates it is exhausted TOS is popped,
     * and the bytecode counter is incremented by delta.
     */
    FOR_ITER = 93,

    /** Loads the global named co_names[namei] onto the stack. */
    LOAD_GLOBAL = 116,

    /**
     * Pushes a block for a loop onto the block stack. The block spans from the current instruction
     * with a size of delta bytes.
     */
    SETUP_LOOP = 120,

    /**
     * Pushes a try block from a try-except clause onto the block stack. delta points to the first
     * except block.
     */
    SETUP_EXCEPT = 121,

    /**
     * Pushes a try block from a try-except clause onto the block stack. delta points to the
     * finally block.
     */
    SETUP_FINALLY = 122,

    /**
     * Store a key and value pair in a dictionary. Pops the key and value while leaving the
     * dictionary on the stack.
     */
    STORE_MAP = 54,

    /** Pushes a reference to the local co_varnames[var_num] onto the stack. */
    LOAD_FAST = 124,

    /** Stores TOS into the local co_varnames[var_num]. */
    STORE_FAST = 125,

    /** Deletes local co_varnames[var_num]. */
    DELETE_FAST = 126,

    /**
     * Pushes a reference to the cell contained in slot i of the cell and free variable storage.
     * The name of the variable is co_cellvars[i] if i is less than the length of co_cellvars.
     * Otherwise it is co_freevars[i - len(co_cellvars)].
     */
    LOAD_CLOSURE = 135,

    /**
     * Loads the cell contained in slot i of the cell and free variable storage. Pushes a reference
     * to the object the cell contains on the stack.
     */
    LOAD_DEREF = 136,

    /** Stores TOS into the cell contained in slot i of the cell and free variable storage. */
    STORE_DEREF = 137,

    /** This opcode is obsolete. */
    SET_LINENO = 127,

    /**
     * Raises an exception. argc indicates the number of parameters to the raise statement, ranging
     * from 0 to 3. The handler will find the traceback as TOS2, the parameter as TOS1, and the
     * exception as TOS.
     */
    RAISE_VARARGS = 130,

    /**
     * Calls a function. The low byte of argc indicates the number of positional parameters, the
     * high byte the number of keyword parameters. On the stack, the opcode finds the keyword
     * parameters first. For each keyword argument, the value is on top of the key. Below the
     * keyword parameters, the positional parameters are on the stack, with the right-most
     * parameter on top. Below the parameters, the function object to call is on the stack. Pops
     * all function arguments, and the function itself off the stack, and pushes the return value.
     */
    CALL_FUNCTION = 131,

    /**
     * Pushes a new function object on the stack. TOS is the code associated with the function. The
     * function object is defined to have argc default parameters, which are found below TOS.
     */
    MAKE_FUNCTION = 132,

    /**
     * Creates a new function object, sets its func_closure slot, and pushes it on the stack. TOS
     * is the code associated with the function, TOS1 the tuple containing cells for the closure’s
     * free variables. The function also has argc default parameters, which are found below the
     * cells.
     */
    MAKE_CLOSURE = 134,

    /**
     * Pushes a slice object on the stack. argc must be 2 or 3. If it is 2, slice(TOS1, TOS) is
     * pushed; if it is 3, slice(TOS2, TOS1, TOS) is pushed. See the slice() built-in function for
     * more information.
     */
    BUILD_SLICE = 133,

    /**
     * Prefixes any opcode which has an argument too big to fit into the default two bytes. ext
     * holds two additional bytes which, taken together with the subsequent opcode’s argument,
     * comprise a four-byte argument, ext being the two most-significant bytes.
     */
    EXTENDED_ARG = 145,

    /**
     * Calls a function. argc is interpreted as in CALL_FUNCTION. The top element on the stack
     * contains the variable argument list, followed by keyword and positional arguments.
     */
    CALL_FUNCTION_VAR = 140,

    /**
     * Calls a function. argc is interpreted as in CALL_FUNCTION. The top element on the stack
     * contains the keyword arguments dictionary, followed by explicit keyword and positional
     * arguments.
     */
    CALL_FUNCTION_KW = 141,

    /**
     * Calls a function. argc is interpreted as in CALL_FUNCTION. The top element on the stack
     * contains the keyword arguments dictionary, followed by the variable-arguments tuple,
     * followed by explicit keyword and positional arguments.
     */
    CALL_FUNCTION_VAR_KW = 142,

    /** Not documented. */
    SET_ADD = 146,
    
    /** Not documented. */
    MAP_ADD = 147
  }

  /** Opcodes >= this have an argument. */
  export var HAVE_ARGUMENT = 90

  /**
   * Type indicator chars from the Python bytecode format.
   *
   * Names and documentation copied from:
   * http://daeken.com/2010-02-20_Python_Marshal_Format.html
   */
  export enum Type {

    /**
     * Used to null-terminate dictionaries and to represent the serialization of a null object
     * internally (not sure if this can happen or not).
     */
    NULL = 0x30, // 0

    /** Represents the `None` object. */
    NONE = 0x4E, // N

    /** Represents the `False` object. */
    FALSE = 0x46, // F

    /** Represents the `True` object. */
    TRUE = 0x54, // T

    /** Represents the `StopIteration` exception object. */
    STOPITER = 0x53, // S

    /** Represents the `Ellipsis` object. */
    ELLIPSIS = 0x2E, // .

    /** Represents an `int` on a 32-bit machine. Stored as an `int32`. */
    INT = 0x69, // i

    /**
     * Represents an `int` on a 64-bit machine. Stored as an `int64`. When read on a 32-bit
     * machine, this may automatically become a `long` (if it's above `2**31`).
     */
    INT64 = 0x49, // I

    /** 
     * Represents a `float` in the old (< 1) marshal format. Stored as a string with a `uint8`
     * before it indicating the size.
     */
    FLOAT = 0x66, // f
    
    /** Represents a `float` in the new marshal format. Stored as a `float64`. */
    BINARY_FLOAT = 0x67, // g

    /**
     * Represents a `complex` in the old (< 1) marshal format. Contains the real and imaginary
     * components stored like `FLOAT`; that is, as strings.
     */
    COMPLEX = 0x78, // x

    /** 
     * Represents a `complex` in the new marshal format. Stored as two `float64`s representing the
     * real and imaginary components.
     */
    BINARY_COMPLEX = 0x79, // y

    /** Represents a `long`. Haven't yet figured out how this works. */
    LONG = 0x6C, // l

    /** 
     * Represents a `str`. Stored as a `int32` representing the size, followed by that many bytes.
     */
    STRING = 0x73, // s

    /** 
     * Represents a `str`. Identical to `STRING`, with the exception that it's added to an
     * "interned" list as well.
     */
    INTERNED = 0x74, // t

    /**
     * Represents a `str`. Stored as a `int32` reference into the interned list mentioned above.
     * Note that this is zero-indexed.
     */
    STRINGREF = 0x52, // R

    /**
     * Represents a `unicode`. Stored as a `int32` representing the size, followed by that many
     * bytes. This is always UTF-8.
     */
    UNICODE = 0x75, // u

    /**
     * Represents a `tuple`. Stored as a `int32` followed by that many objects, which are
     * marshalled as well.
     */
    TUPLE = 0x28, // (
    
    /** Represents a `list`. Stored identically to `TUPLE`. */
    LIST = 0x5B, // [

    /**
     * Represents a `dict`. Stored as a series of marshalled key-value pairs. At the end of the
     * dict, you'll have a "key" that consists of a `NULL`; there's no value following it.
     */
    DICT = 0x7B, // {

    /** Represents a `frozenset`. Stored identically to `TUPLE`. */
    FROZENSET = 0x3E, // >

    /** A code object, which represents a function. */
    CODE = 0x63 // c
  }

  export interface Object {
    type: Type
  }

  export interface StringObject extends Object {
    str: string
  }

  export interface NumberObject extends Object {
    n: number
  }

  export interface ComplexObject extends Object {
    real: number
    imag: number
  }

  export interface SequenceObject extends Object {
    items: Object[]
  }

  export interface DictObject extends Object {
    keys: Object[]
    values: Object[]
  }

  /** 
   * A binary code object.
   *
   * Names and documentation copied from:
   * http://daeken.com/2010-02-20_Python_Marshal_Format.html
   */
  export interface CodeObject extends Object {
    /** Number of arguments. */
    argcount: number
    /** Number of local variables. */
    nlocals: number
    /** Max stack depth used. */
    stacksize: number
    /** Flags for the function. See the `Bin.CodeFlag` enum. */
    flags: number
    /** The bytecode of the function, as [opcode, arg] pairs. */
    code: number[][]
    /** Tuple of constants used. */
    consts: Object[]
    /** Tuple of names. */
    names: Object[]
    /** Tuple of variable names (this includes arguments and locals). */
    varnames: Object[]
    /** Tuple of free variables (meaning unclear). */
    freevars: Object[]
    /** Tuple of variables used in nested functions. */
    cellvars: Object[]
    /** String containing the original filename this code object was generated from. */
    filename: string
    /** Name of the function. If it's the top level code object in a .pyc, this will be <module>.*/
    name: string
    /** First line number of the code this code object was generated from. */
    firstlineno: number
    /** String mapping bytecode offsets to line numbers. */
    lnotab: string
  }

  export enum CodeFlag {
    HAS_VARARGS  = 0x04,
    HAS_KWARGS   = 0x08,
    IS_GENERATOR = 0x20
  }
  
  export function stringifyCodeObject(object: Object, indent: string = "   "): string
    {
        var s: string = ""
            switch (object.type) {
            case Python.Bin.Type.CODE: {
                var codeobject: CodeObject = <CodeObject> object
                //argcount component of codeobject
                s = s +indent+"[\n"+indent+"*argcount*: " + codeobject.argcount
                //nlocals component
                s = s + "\n"+indent+"*nlocals*: " + codeobject.nlocals
                //stacksize component
                s = s + "\n"+indent+"*stacksize*: " + codeobject.stacksize
                //flags component
                s = s + "\n"+indent+"*flags*: " + codeobject.flags
                //code component
                s = s + "\n"+indent+"*Code*:\n"                 
                for (var i = 0; i < codeobject.code.length; i++)
                {
                    s = s + indent + Opcode[codeobject.code[i][0]] + " "
                    if (codeobject.code[i][0] >= Python.Bin.HAVE_ARGUMENT) { s = s + codeobject.code[i][1] + "\n" }
                    else { s = s + "\n" }

                }
                //consts component
                s = s + "\n" + indent + "*consts*:\n"
              
                for (var j = 0; j < codeobject.consts.length; j++) {

                    var t: string = stringifyCodeObject(codeobject.consts[j], indent+"    ")
                    s=s+indent+t+"\n"
                }
                //names component 
                s = s + "\n" + indent + "*names*:\n"
                
                for (var i = 0; i < codeobject.names.length; i++)
                {
                    
                    var t: string = stringifyCodeObject(codeobject.names[i], indent+"    ")
                    s=s+indent+t+"\n"

                }
                //varnames component
                s = s + "\n"+indent+"*varnames*:\n"
               
                for (var i = 0; i < codeobject.varnames.length; i++) {
                   
                    var t:string=stringifyCodeObject(codeobject.varnames[i],indent+"    ")
                    s=s+indent+t+"\n"

                }
               //freevars component
                s = s + "\n"+indent+"*freevars*:\n"
                
                for (var j = 0; j < codeobject.freevars.length; j++) {
                    
                    var t: string = stringifyCodeObject(codeobject.freevars[j], indent+"    ")
                    s=s+indent+t+"\n"
                }
               
                //cellvars component
                s = s + "\n"+indent+"*cellvars*:\n"
                
                for (var j = 0; j < codeobject.cellvars.length; j++) {
                   
                    var t: string = stringifyCodeObject(codeobject.cellvars[j], indent+"    ")
                    s=s+indent+t+"\n"


                }
                
                 //filename component
                
                s=s+"\n"+indent+"*filename*: "+codeobject.filename
                //name component 
                s = s + "\n"+indent+"*name*: " + codeobject.name
                //firstlineno component
                s = s+"\n"+indent+"*firstlineno*: " + codeobject.firstlineno
                //lnotab component
                s=s+"\n"+indent+"*lnotab*: "+codeobject.lnotab+"\n"+indent+"]"


               return s

            }

            case Python.Bin.Type.STRING:
                {
                   var stringob: StringObject = <StringObject>object
                    return stringob.str

                }
            case Python.Bin.Type.INT:
                {
                    var numberob: NumberObject = <NumberObject> object
                    return ""+numberob.n

                }
                case Python.Bin.Type.FALSE: {


                   return "" + false
                   



                }
                case Python.Bin.Type.TRUE: {

                    return ""+true
                }

                case Python.Bin.Type.FLOAT: {

                    var numberobj : NumberObject = <NumberObject>object
                    return ""+numberobj.n

                }

                case Python.Bin.Type.COMPLEX: {

                    var complexob: ComplexObject = <ComplexObject> object
                    return "real: "+complexob.real+" imag: "+complexob.imag

                }
                case Python.Bin.Type.BINARY_COMPLEX: {


                    var bincomplexob: ComplexObject = <ComplexObject> object
                    return "real: "+bincomplexob.real+" imag: "+complexob.imag


                }
                case Python.Bin.Type.BINARY_FLOAT: {

                    var binfloat: NumberObject = <NumberObject> object
                    return ""+binfloat.n
                }
                case Python.Bin.Type.LONG: {

                    var longob: NumberObject = <NumberObject> object
                    return ""+longob.n


                }
                case Python.Bin.Type.NONE: {

                    return Type[Python.Bin.Type.NONE]
                }
                case Python.Bin.Type.STRINGREF: {

                    var stringobj: StringObject = <StringObject>object
                    return stringobj.str



                }

                case Python.Bin.Type.INT64: {
                    var int64ob: NumberObject = <NumberObject> object
                    return "" + int64ob.n


                }
                case Python.Bin.Type.INTERNED: {

                    var stringobject: StringObject = <StringObject>object
                    return stringobject.str


                }
                case Python.Bin.Type.UNICODE: {


                    var unicodeob: NumberObject = <NumberObject> object
                    return "" + unicodeob.n
                    


                }


                case Python.Bin.Type.LIST: {


                    var listob: SequenceObject = <SequenceObject>object
                    var st: string = ""
                  
                    for (var i = 0; i < listob.items.length; i++) {

                        var tem:string= "" +stringifyCodeObject(listob.items[i], indent)
                        st=st+indent+tem+"\n"
                    }
                    return st


                }
                case Python.Bin.Type.TUPLE: {

                    var str: string = ""
                    
                    var tupleob: SequenceObject = <SequenceObject>object
                    for (var i = 0; i < tupleob.items.length; i++) {

                        var temp:string="" + stringifyCodeObject(tupleob.items[i], indent)
                        str=str+indent+temp+"\n"
                 }
                    return str
                }
                case Python.Bin.Type.FROZENSET: {
                    var strin: string = ""
                    
                    var frozenob: SequenceObject = <SequenceObject>object
                    for (var i = 0; i < frozenob.items.length; i++) {

                        var temp:string="" + stringifyCodeObject(frozenob.items[i], indent)
                        strin=strin+indent+temp+"\n"
                 }
                    return strin
                }


                case Python.Bin.Type.DICT: {
                    var pairs: string = ""
                   
                    var dictob: DictObject = <DictObject> object
                    for (var j = 0, i = 0; j < dictob.keys.length, i < dictob.values.length; j++, i++) {

                        var temp:string="" + stringifyCodeObject(dictob.keys[j], indent) + "|" + stringifyCodeObject(dictob.values[i], indent )
                        pairs=pairs+indent+temp+"\n"
                    }
                    return pairs
                }
        }
    }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}
