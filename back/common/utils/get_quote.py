import json
import os
import random

def relative_path(path):
    my_path = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(my_path, path)

def get_quote():
    with open(relative_path('../qoutes.json')) as f:
      quotes = json.load(f)
      filteredQuotes = filter(lambda c: c['include'], quotes)
      return random.choice(list(filteredQuotes))
