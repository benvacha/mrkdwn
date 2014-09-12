#!/usr/bin/env node
/* mrkdwn v0.1.0 : github.com/benvacha/mrkdwn */

/* 
Test suite for javascript mrkdwn implementation.
Exercises the mrkdwn implementation through node interface.

Requires:
    colors : https://github.com/Marak/colors.js
    diff : https://github.com/kpdecker/jsdiff

All Commands From Root (not javascript) Directory

Initial Setup
    npm install colors
    npm install diff
    
Run All Tests, prints pass or fail
    node javascript/test.js
    
Run All Tests, prints pass or fail and diff
    node javascript/test.js -v
    
Run A Test, prints pass or fail
    node javascript/test.js testName
    
Run A Test, prints pass or fail and diff
    node javascript/test.js -v testName
    
Run Multiple Tests, prints pass or fail
    node javascript/test.js testName testName testName
    
Run Multiple Tests, prints pass or fail and diff
    node javascript/test.js -v testName testName testName

*/

/*
 *
*/

// import node modules
var fs = require('fs'),
    colors = require('colors'),
    jsdiff = require('diff'),
    mrkdwn = require('./mrkdwn.js');
    
// parse command line arguements
var testDirectory = 'test/',
    verbose = false,
    testRuns = [];
for(var i=2; i<process.argv.length; i++) {
    if(process.argv[i] === '-v') {
        verbose = true;
    } else {
        testRuns.push(process.argv[i]);
    } 
}

/*
 *
*/

var utils = {
    
    // return blank string if invalid file, else return file contents as string
    readFile: function(fileName) {
        fileName = testDirectory + fileName;
        if(!fs.existsSync(fileName)) {
            console.log('## Invalid File: ' + fileName);
            return '';
        }
        return fs.readFileSync(fileName, {encoding:'utf8'})
    },
    
    // load markdownFile and markupFile, run testMethod on the markdown, return diff
    runTest: function(test) {
        if(!test) return null;
        var markdown = utils.readFile(test.markdown),
            markup = utils.readFile(test.markup);
        return jsdiff.diffChars(markup, test.method(markdown));
    },
    
    // print if the test passed or failed
    printPassFail: function(testName, diff) {
        if(diff && diff.length === 1) {
            console.log('# Passed Test: ' + testName);
        } else if(diff) {
            console.log('# Failed Test: ' + testName);
        } else {
            console.log('# Invalid Test: ' + testName);
        }
    },
    
    // print if the test passed or failed, print color coded diff
    printPassFailDiff: function(testName, diff) {
        utils.printPassFail(testName, diff);
        if(diff) {
            diff.forEach(function(part){
                if(part.added || part.removed) {
                    part.value = part.value.replace(/ /g, '_');
                }
                process.stdout.write(part.value.replace(/\n/g, '\\n\n')[part.added ? 'green' : part.removed ? 'red' : 'grey']);
            });
        }
        console.log('# End Test: ' + testName + '\n');
    }
    
};

/*
 *
*/

var tests = {
    
    escapedChars: {
        markdown: 'unit/escaped-chars.markdown',
        markup: 'unit/escaped-chars.markup',
        method: mrkdwn.markup.escapedChars
    }, 
    
    paragraphs: {
        markdown: 'unit/paragraphs.markdown',
        markup: 'unit/paragraphs.markup',
        method: mrkdwn.markup.paragraphs
    }
    
};

/*
 *
*/

// if tests specified, run just those
// if no tests specified, run all tests
// if verbose print pass or fail and diff
// if not verbose print pass or fail
var diff;
if(testRuns.length) {
    for(var i=0; i<testRuns.length; i++) {
        diff = utils.runTest(tests[testRuns[i]]);
        if(verbose) {
            utils.printPassFailDiff(testRuns[i], diff);
        } else {
            utils.printPassFail(testRuns[i], diff);
        }
    }
} else {
    for(var test in tests) {
        diff = utils.runTest(tests[test]);
        if(verbose) {
            utils.printPassFailDiff(test, diff);
        } else {
            utils.printPassFail(test, diff);
        }
    }
}