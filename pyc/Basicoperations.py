#identity 
a = 20
b = 20
print a,b
print "Identity operators"
if ( a is b ):
   print "a and b have same identity"
else:
   print "a and b do not have same identity"

print "using id()"
if ( id(a) == id(b) ):
   print "a and b have same identity"
else:
   print "a and b do not have same identity"

b = 30
print "b changed to 30"
if ( a is b ):
   print "a and b have same identity"
else:
   print "a and b do not have same identity"

if ( a is not b ):
   print "a and b do not have same identity"
else:
   print "a and b have same identity"
   
#membership
a = 10
b = 20
list = [1, 2, 3, 4, 5 ];
print "membership operators"
print "a is",a
print "b is",b
print list
if ( a in list ):
   print "a is available in the given list"
else:
   print "a is not available in the given list"

if ( b not in list ):
   print "b is not available in the given list"
else:
   print "b is available in the given list"

#bitwise
a = 60            # 60 = 0011 1100 
b = 13            # 13 = 0000 1101 
c = 0
print "bitwise operators"
c = a & b;        # 12 = 0000 1100
print "&: Value of c is ", c

c = a | b;        # 61 = 0011 1101 
print "|: Value of c is ", c

c = a ^ b;        # 49 = 0011 0001
print "^: Value of c is ", c

c = ~a;           # -61 = 1100 0011
print "~: Value of c is ", c

c = a << 2;       # 240 = 1111 0000
print "Left shift: Value of c is ", c

c = a >> 2;       # 15 = 0000 1111
print "Right shift: Value of c is ", c
