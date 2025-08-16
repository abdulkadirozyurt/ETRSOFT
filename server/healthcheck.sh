#!/bin/sh
# simple healthcheck script
curl -f http://localhost:3000/ || exit 1
