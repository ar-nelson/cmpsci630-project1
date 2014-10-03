a = 10
b = 20
c = 0
print a,"and",b
if ( a and b ):
   print "and operation: a and b are true"
else:
   print "and operation: Either a is not true or b is not true"

if ( a or b ):
   print "or operation: Either a is true or b is true or both are true"
else:
   print "or operation: Neither a is true nor b is true"


a = 0
print "a set to 0"
if ( a and b ):
   print "and operation: a and b are true"
else:
   print "and operation: Either a is not true or b is not true"

if ( a or b ):
   print "or operation: Either a is true or b is true or both are true"
else:
   print "or operation: Neither a is true nor b is true"
print "not and"
if not( a and b ):
   print "Either a is not true or b is not true"
else:
   print "a and b are true"
