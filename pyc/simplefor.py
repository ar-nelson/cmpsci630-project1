#for loops
mylist=["chair","table","shelf","bench"]
for item in mylist:
    print item

for item in mylist[:]:
    print len(item)

for item in mylist[1:3]:
    print item

for i in range(5,15):
    print i,"in range"

for num in range(1,20,5):
    print num

names=['John', 'Oliver', 'James', 'Harry', 'Ted']
for i in range(len(names)):
    print i, names[i]
