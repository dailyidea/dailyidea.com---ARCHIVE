from datetime import date
import random
import json

class GenerateQuote(object):
    def __init__(self):
        self.quotes_list = self.load_quotes_json()

    def load_quotes_json(self):
        with open("static/quotes.json") as quotes:
            return json.load(quotes)

    def get_random_quote(self):
        return random.choice(self.quotes_list)

    def get_todays_quote(self):
        day_today = date.today().day
        return self.get_quote(day_today - 1)

    def get_quote(self, index):
        adjusted_index = abs(index) % len(self.quotes_list)
        return self.quotes_list[adjusted_index]
