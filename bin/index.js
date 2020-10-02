#!/usr/bin/env node

const cached = require("../cache_checker");
const [url,flag] = process.argv.slice(2);
if (!url) {
    exitScript("please enter a valid link")
} else {
    if(url.startsWith("--")) exitScript("please enter a valid link");
    is_cached(url,flag);
}

function exitScript(message){
    console.log(message);
    process.exit(1);
}
