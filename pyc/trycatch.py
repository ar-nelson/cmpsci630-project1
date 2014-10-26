try:
  print foo
except NameError:
  print "Got a NameError!"

def divideFinally(a, b):
  try:
    return a / b
  finally:
    print "In finally statement."

try:
  print divideFinally(10, 2)
  print divideFinally(10, 0)
except ArithmeticError:
  print "Caught divide-by-zero error!"

