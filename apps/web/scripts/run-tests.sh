#!/bin/bash

echo "========================================"
echo "   HANOTEX Frontend Test Suite"
echo "========================================"
echo

echo "Running all tests..."
npm run test:ci

echo
echo "========================================"
echo "   Test Results Summary"
echo "========================================"
echo

echo "Tests completed! Check the output above for results."
echo
echo "Available test commands:"
echo "  npm run test          - Run tests once"
echo "  npm run test:watch    - Run tests in watch mode"
echo "  npm run test:coverage - Run tests with coverage report"
echo "  npm run test:ci       - Run tests for CI/CD"
echo
