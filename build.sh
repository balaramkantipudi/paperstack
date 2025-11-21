#!/bin/bash

# Set environment variables to bypass Node.js version check
export NEXT_IGNORE_NODE_VERSION=true
export NODE_OPTIONS="--max_old_space_size=4096"

# Run the build command
npm run build
