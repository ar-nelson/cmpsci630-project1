print 'prime numbers within 10'
for n in range(2,10):
    for m in range (2,n):
        if n%m==0:
            print n,'is not prime'
            break
    else:
        print n,'is prime'
            

for val in range(2,10):
    if val%2==0:
        print 'EVEN!'
        continue
    print 'found some non even-number'
