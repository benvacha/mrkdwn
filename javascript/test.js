/* mrkdwn v0.1.0 : github.com/benvacha/mrkdwn */

/* 
Test suite for javascript mrkdwn implementation.
Exercises the mrkdwn implementation through node interface.

Requires:
    colors : https://github.com/Marak/colors.js
    diff : https://github.com/kpdecker/jsdiff

Initial Setup (from root directory)
    npm install colors
    npm install diff
Run All Tests (from root directory)
    node javascript/test.js

*/

// import node modules
var fs = require('fs'),
    colors = require('colors'),
    jsdiff = require('diff');

// declare global variables
var testDirectory = 'test/',
    testCSV, i, lines, tokens,
    test, tests = {},
    markdown, markup, translation,
    diff, cache, failed;

// load available tests
testCSV = fs.readFileSync(testDirectory + 'tests.csv', {encoding:'utf8'});
// parse tests CSV
lines = testCSV.split('\n');
for(i = 0; i < lines.length; i++) {
    //
    if(lines[i].charAt(0) === '#') continue;
    //
    tokens = lines[i].split(',');
    tests[tokens[0]] = {
        markdown: tokens[1],
        markup: tokens[2]
    };
}

// run all available tests
for(test in tests) {
    // load markdown and markup files
    markdown = fs.readFileSync(testDirectory + tests[test].markdown, {encoding:'utf8'});
    markup = fs.readFileSync(testDirectory + tests[test].markup, {encoding:'utf8'});
    // TODO: actually run translation, actually do the test
    translation = markdown;
    // diff the strings
    diff = jsdiff.diffChars(markup, translation);
    // for each part, if there is a difference, fail the test,
    // change value to make \n and space visible in output
    cache = ''; failed = false;
    diff.forEach(function(part){
        if(part.added || part.removed) {
            failed = true;
            part.value = part.value.replace(/ /g, '_');
        }
        cache += part.value.replace(/\n/g, '\\n\n')[part.added ? 'green' : part.removed ? 'red' : 'grey'];
    });
    // if no differences, pass test
    // if differences, fail test and print diff
    if(!failed) {
        process.stdout.write('\n### Passed Test: ' + test + '\n');
    } else {
        process.stdout.write('\n##### Failed Test: ' + test + '\n');
        process.stdout.write(cache);
        process.stdout.write('\n#####\n');
    }
    
}

// give a little breathing room
process.stdout.write('\n');
