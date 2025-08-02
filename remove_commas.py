import sys
import re

data = sys.stdin.read()

count = len(re.findall(r',\s*(?=[\)\]\}])', data))
data = re.sub(r',(?=\s*[\)\]\},])', '', data)

print(data)