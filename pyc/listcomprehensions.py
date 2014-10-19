#list comprehensions words
words = 'The quick brown fox jumps over the lazy dog'.split(' ')
print words
['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']
stuff = [[w.upper(), w.lower(), len(w)] for w in words]
for i in stuff:
    print i

#list comprehensions numbers
S = [x**2 for x in range(10)]
V = [2**i for i in range(13)]
M = [x for x in S if x % 2 == 0]
print S
print V
print M

primes = [x for x in range(2, 50) if x not in [j for i in range(2, 8) for j in range(i*2, 50, i)]]
print primes
