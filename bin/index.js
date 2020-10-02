#!/usr/bin/env node

const cached = require("../cache_checker");


// process command line argument
if (!process.argv[2]) {
    console.log('Please enter a URL...');
    process.exit(1);
  } else {
    cached.is_cached(process.argv[2]);
  }
