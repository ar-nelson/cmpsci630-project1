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

print "STRING FUNCTIONS::"

str = "this is string example...wow";
suffix = "wow";
print "check if string",str," ends with suffix",suffix
print str.endswith(suffix);
print str[20:].endswith(suffix);
suffix = "is";
print "check if string",str," ends with suffix",suffix
print str[2:4].endswith(suffix);
print str[2:6].endswith(suffix);

str1 = "this is a string example";
str2 = "exam";
print "find",str2,"in",str1
print "exam found at index ",str1.find(str2);
print "exam found at index ",str1[10:].find(str2);
print "exam found at index ", str1[40:].find(str2);
print "exam found at (using index()) ",str1[10:].index(str2);


str='101abc'
print "Is the string 101abc entirely alpha-numeric?",str.isalnum()
print "Is the string 101abc entirely alphabetic?",str.isalpha()
str1='101'
print "is the string 101 entirely composed of digits?",str1.isdigit()

str = "THis"; 
print str,"is entirely lower?",str.islower();
str="this"
print str,"is entirely lower?",str.islower();

print "isspace function"
str = "       "; 
print str.isspace();
str = "This is a string example";
print str.isspace();

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

print "convert to lower case"
str = "THIS IS STRING EXAMPLE";
print str.lower();

print "replace"
str = "this is a string example. This is really a string";
print str.replace("is", "was");
print str.replace("is", "was", 3);

print "find and index backwards"
str = "this is really a string example";
str1 = "is";
print str.rfind(str1);
print str[0:10].rfind(str1);
print str[10:0].rfind(str1);
str1 = "this is a string example";
str2 = "is";
print str1.rindex(str2);
print str1.index(str2);

print "split function"
str = "Line1-abcdef \nLine2-abc \nLine4-abcd";
print str.split( );
print str.split(' ', 1 );

print "startswith function"
str = "this is a string example";
print str.startswith( 'this' );
print str.startswith( 'is', 2, 4 );
print str.startswith( 'this', 2, 4 );

print "str.upper() : ", str.upper()
