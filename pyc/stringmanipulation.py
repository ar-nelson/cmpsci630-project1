var1 = 'Hello World!'
var2 = "Python Programming"
print "string slice and range:"
print "var1[0]: ", var1[0]
print "var2[1:5]: ", var2[1:5]
print "concatenation:"
print "Updated String :- ", var1[:6] + 'Python'
a='Hello'
b='Python'
print "given:",a,"and",b
c=a+b
print c
print "repeat:"
d=a*2
print d

print "string membership:"
if('s' in a):
   print "s is in ",a
else:
   print "s is not in ",a
   
print "using formatter:"   
print "My name is %s and weight is %d kg!" % ('Zara', 21)

print "STRING FUNCTIONS::"

name="john"
print "capitalize:"
Name=name.capitalize()
print "capitalizing ",Name

str = "this is string example";
print "centre the string with specified padding:"
print "str.center(40, '*') : ", str.center(40, '*')

sub = "t";
print "count no. of substrings",sub,"in string",str
print "str.count(str, 4, 40) : ", str.count(sub, 4, 40)
print "str.count(sub) : ", str.count(sub)

str = "this is string example...wow";
suffix = "wow";
print "check if string",str," ends with suffix",suffix
print str.endswith(suffix);
print str.endswith(suffix,20);
suffix = "is";
print "check if string",str," ends with suffix",suffix
print str.endswith(suffix, 2, 4);
print str.endswith(suffix, 2, 6);

print "expand tabs"
str = "this is\tstring example";
print "Original string: " + str;
print "Default expanded tab: " +  str.expandtabs();
print "Double expanded tab: " +  str.expandtabs(16);

str1 = "this is a string example";
str2 = "exam";
print "find",str2,"in",str1
print "exam found at index ",str1.find(str2);
print "exam found at index ",str1.find(str2, 10);
print "exam found at index ", str1.find(str2, 40);
print "exam found at (using index()) ",str1.index(str2, 10);


str='101abc'
print "Is the string 101abc entirely alpha-numeric?",str.isalnum()
print "Is the string 101abc entirely alphabetic?",str.isalpha()
str1='101'
print "is the string 101 entirely composed of digits?",str1.isdigit()

str = "THis"; 
print str,"is entirely lower?",str.islower();
str="this"
print str,"is entirely lower?",str.islower();

print "toying with unicode"
str = u"this2009";  
print str.isnumeric();
str = u"23443434";
print str.isnumeric();

print "isspace function"
str = "       "; 
print str.isspace();
str = "This is a string example";
print str.isspace();

print "istitle function"
str = "This Is a String Example";
print str, "is ",str.istitle();
str = "This is a string example";
print str, "is ",str.istitle();

print "isupper function"
str = "THIS IS STRING EXAMPLE"; 
print str, "is ",str.isupper();
str = "THIS is string example";
print str,"is ",str.isupper();

print "join function"
str = "-";
seq = ("a", "b", "c"); # This is sequence of strings.
print str.join( seq );

str = "this is string example";
print "Length of the string",str,"is", len(str);

print "left justifying with padding"
print str.ljust(50, '0');

print "convert to lower case"
str = "THIS IS STRING EXAMPLE";
print str.lower();

print "stripping characters from the beginning"
str = "     this is string example     ";
print str.lstrip();
str = "88888888this is string example8888888";
print str.lstrip('8');

print "1-1 translation of characters" 
from string import maketrans   # Required to call maketrans function.
intab = "aeiou"
outtab = "12345"
trantab = maketrans(intab, outtab)
str = "this is a string example";
print str.translate(trantab);

str = "this is really a string example";
print "Max character: " + max(str);
str = "this is a string example";
print "Max character: " + max(str);

str = "this-is-a-string-example";
print "Min character: " + min(str);

print "replace"
str = "this is a string example. This is really a string";
print str.replace("is", "was");
print str.replace("is", "was", 3);

print "find and index backwards"
str = "this is really a string example";
str1 = "is";
print str.rfind(str1);
print str.rfind(str1, 0, 10);
print str.rfind(str1, 10, 0);
str1 = "this is a string example";
str2 = "is";
print str1.rindex(str2);
print str1.index(str2);

print "right justification"
str = "this is a string example";
print str.rjust(50, '0');

print "stripping from end of string"
str = "     this is a string example     ";
print str.rstrip();
str = "88888888this is a string example8888888";
print str.rstrip('8');

print "split function"
str = "Line1-abcdef \nLine2-abc \nLine4-abcd";
print str.split( );
print str.split(' ', 1 );

print "splitlines function"
str = "Line1-a b c d e f\nLine2- a b c\n\nLine4- a b c d";
print str.splitlines( );
print str.splitlines( 0 );
print str.splitlines( 3 );
print str.splitlines( 4 );
print str.splitlines( 5 );

print "startswith function"
str = "this is a string example";
print str.startswith( 'this' );
print str.startswith( 'is', 2, 4 );
print str.startswith( 'this', 2, 4 );

print "strip from both sides"
str = "0000000this is string example0000000";
print str.strip( '0' );

print "swap case"
str = "this is a string example";
print str.swapcase();
str = "THIS IS A STRING EXAMPLE";
print str.swapcase();


print "title-ize"
str = "this is a string example";
print str.title();

print "translate with delete"
intab = "aeiou"
outtab = "12345"
trantab = maketrans(intab, outtab)
print str.translate(trantab, 'xm');

print "str.capitalize() : ", str.upper()

print "left pad with 0s"
print str.zfill(40);
print str.zfill(50);

print "isdecimal function"
str = u"this2009";  
print str.isdecimal();
str = u"23443434";
print str.isdecimal();
