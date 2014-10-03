import math
import datetime
import cmath
print "2 + 3 =", 2+3
print "log(1e23) =", math.log(1e23)
print "2*sin(3.1414) = ", 2*math.sin(3.1414)
now = datetime.datetime.now()
print "Now is", now.strftime("%d-%m-%Y"), "at", now.strftime("%H:%M")
print "or, more precisely, %s" % now
print "sqrt(-1)"
if(cmath.sqrt(-1)==1j):
    print 'i'
x=complex(4,5)
print x
print x.real
print x.imag*1j

print "argument of x",cmath.phase(x)
print "abs and phase of x",cmath.polar(x)
print "value of pi", cmath.pi
print "value of e",cmath.e

print cmath.isinf(x)
print cmath.isnan(x)

print cmath.exp(5)
print cmath.log(5,10)
print cmath.log10(5)


print cmath.acos(2.5).real
print cmath.asin(3.5).real
print cmath.atan(2.3).real

print cmath.cos(1.2)
print cmath.sin(2.5)
print cmath.tan(3.2)

