def analyze_mcg(X0, a, m):
    print(f"\nAnalyzing MCG with X0={X0}, a={a}, m={m}")
    sequence = []
    x = X0
    while x not in sequence:
        sequence.append(x)
        x = (a * x) % m
    
    period = len(sequence)
    max_period = m / 4 if m % 4 == 0 else "N/A"
    
    print(f"Generated Sequence: {sequence}")
    print(f"Cycle repeats with value: {x}")
    print(f"Period Length: {period}")
    print(f"Max Possible Period for m={m}: {max_period}")
    if period == max_period:
        print("Result: Maximum period was achieved.")
    else:
        print("Result: Maximum period was NOT achieved.")
        
# Parameters from the question
cases = [
    {'X0': 7, 'a': 11, 'm': 16},
    {'X0': 8, 'a': 11, 'm': 16},
    {'X0': 7, 'a': 7, 'm': 16},
    {'X0': 8, 'a': 7, 'm': 16}
]

for case in cases:
    analyze_mcg(case['X0'], case['a'], case['m'])