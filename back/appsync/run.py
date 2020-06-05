#!/usr/bin/env python3

import sys
import importlib
import json

print('functions.' + sys.argv[1] + '.' + sys.argv[1])

function = importlib.import_module('functions.' + sys.argv[1] + '.' + sys.argv[1])

event = json.loads(sys.argv[2]) if len(sys.argv) > 2 else None
lambda_context = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None

function.endpoint(event, lambda_context)
