#!/usr/bin/env python3

import sys
import importlib
import json

if (len(sys.argv) == 1):
  print('Please specify function')
  exit()

function = importlib.import_module(sys.argv[1])

event = json.loads(sys.argv[2]) if len(sys.argv) > 2 else None
lambda_context = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None

function.endpoint(event, lambda_context)
