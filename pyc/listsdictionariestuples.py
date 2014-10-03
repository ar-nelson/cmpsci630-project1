months=('january','february','march','april','may','june','july','august','september','october','november','december')
names=['john','james','ted','luke']
for i in range(len(names)):
    print names[i]
print names[0:2]
names.append('eric')
print names
del names[2]
print names
print months[0:6]

phonebook ={'name1:2234567866','name2:6783020833'}
print phonebook
#phonebook['name2']=657839029
#print phonebook
#del phonebook['name2']
#print phonebook


ages = {}

#Add a couple of names to the dictionary
ages['Sue'] = 23
ages['Peter'] = 19
ages['Andrew'] = 78
ages['Karren'] = 45

#Use the function has_key() - 
if ages.has_key('Sue'):
    print "Sue is in the dictionary. She is", \
ages['Sue'], "years old"

else:
    print "Sue is not in the dictionary"


#Use the function keys()
print "The following people are in the dictionary:"
print ages.keys()


keys = ages.keys()
print keys

print "People are aged the following:"
print ages.values()

#Put it in a list:
values = ages.values()
print values

#sort() function
keys.sort()
print keys

values.sort()
print values

#You can find the number of entries
#with the len() function:
print "The dictionary has", \
len(ages), "entries in it"
