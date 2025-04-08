#!/bin/bash

# Run the tests for the grocery_list app
python manage.py test grocery_list.tests

# If you want to run tests with coverage
# python -m coverage run --source='.' manage.py test grocery_list.tests
# python -m coverage report
