import sys
import re
# data = sys.stdin.read()
data = '''Text(
    'test',
    fontSize: 12
)'''
matches = re.match(r'\s*(\w+)\(\s*((?:.|\n)*?)\)', data)
if not matches:
    print(data)
    quit()
func = matches.group(1)
body = matches.group(2)
flattened = ' '.join(line.strip() for line in body.splitlines() if line.strip())

print(f'{func}({flattened})')