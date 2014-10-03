i=5
def f(arg=i):
    print arg
    
def add(a,b):
    return a+b

def closeprogram(prompt, retries=4, complaint='Yes or no, please!'):
    while True:
        ok = raw_input(prompt)
        if ok in ('y', 'ye', 'yes'):
            print "Qutting"
            break
        if ok in ('n', 'no', 'nop', 'nope'):
            print "Not quitting"
            retries=retries-1
        if(retries==0):
                print "time out"
                break
x=add(5,4)
print x
closeprogram('Quit?')

#pass
def newfunction():
    pass
    
i = 6
f() #calls f with default arg which is the old value of i
f(i) 
