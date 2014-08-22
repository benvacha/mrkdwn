/* mrkdwn v0.1.0 : github.com/benvacha/mrkdwn */

/* 
Test suite for javascript mrkdwn implementation.
Exercises the mrkdwn implementation through node interface.

Requires:
    colors : https://github.com/Marak/colors.js
    diff : https://github.com/kpdecker/jsdiff

Initial Setup (from javascript directory)
    npm install colors
    npm install diff
Run All Tests (from javascript directory)
    node test.js

*/

// import node modules
var fs = require('fs'),
    colors = require('colors'),
    jsdiff = require('diff'),
    mrkdwn = require('./mrkdwn.js');


/*
// declare global variables
var testDirectory = '../test/',
    testCSV, i, lines, tokens,
    test, tests = {},
    markdown, markup, translation,
    diff, cache, failed;

// translator to method mapping
var translator, translatorMethods = {
    escapedChars: mrkdwn.markup.escapedChars
};

// load available tests
testCSV = fs.readFileSync(testDirectory + 'tests.csv', {encoding:'utf8'});
// parse tests CSV
lines = testCSV.split('\n');
for(i = 0; i < lines.length; i++) {
    //
    if(lines[i].charAt(0) === '#') continue;
    //
    tokens = lines[i].split(',');
    test = tokens[0];
    tests[test] = {
        markdown: testDirectory + test + '.markdown',
        markup: testDirectory + test + '.markup',
        translators: tokens.slice(1)
    };
}

// run all available tests
for(test in tests) {
    // reset loop variants
    cache = ''; failed = false;
    // load markdown and markup files
    markdown = fs.readFileSync(tests[test].markdown, {encoding:'utf8'});
    markup = fs.readFileSync(tests[test].markup, {encoding:'utf8'});
    // run each translator defined by the test
    translation = markdown;
    for(i = 0; i < tests[test].translators.length; i++) {
        translator = tests[test].translators[i];
        if(translatorMethods[translator]) {
            translation = translatorMethods[translator](translation);
        } else {
            failed = true;
            cache += '## Translator Not Found: ' + tests[test].translators[i] + '\n';
        }
    }
    // diff the markup vs the translation
    diff = jsdiff.diffChars(markup, translation);
    // for each part, if there is a difference, fail the test,
    // change value to make \n and space visible in output
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
*/