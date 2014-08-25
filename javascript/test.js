/* mrkdwn v0.1.0 : github.com/benvacha/mrkdwn */

/* 
Test suite for javascript mrkdwn implementation.
Exercises the mrkdwn implementation through node interface.

Requires:
    colors : https://github.com/Marak/colors.js
    diff : https://github.com/kpdecker/jsdiff

Initial Setup
    npm install colors
    npm install diff
    
Run All Tests, prints pass or fail
    node path/test.js path/test/
    
Run A Test, prints pass or fail and diff
    node path/test.js path/test/ testName
    
Run Multiple Tests, prints pass or fail and diff
    node path/test.js path/test/ testName testName testName

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
var testDirectory = process.argv[2],
    testRuns = [];
for(var i=3; i<process.argv.length; i++) {
    testRuns.push(process.argv[i]);
}

// exit if missing or invalid test directory, ensure trailing slash
if(!testDirectory) {
    console.log('# Missing test directory');
    console.log('# Usage: node path/test.js path/test/ [[[testName] testName] ...]');
    process.exit();
}
if(testDirectory.charAt(testDirectory.length-1) !== '/') {
    testDirectory += '/';
}
if(!fs.existsSync(testDirectory)) {
    console.log('# Invalid test directory');
    console.log('# Usage: node path/test.js path/test/ [[[testName] testName] ...]');
    process.exit();
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
    
    // print if the test passed or failed, print color coded diff
    printDiff: function(testName, diff) {
        utils.printPassFail(testName, diff);
        diff.forEach(function(part){
            if(part.added || part.removed) {
                part.value = part.value.replace(/ /g, '_');
            }
            process.stdout.write(part.value.replace(/\n/g, '\\n\n')[part.added ? 'green' : part.removed ? 'red' : 'grey']);
        });
        console.log('\n# End Test: ' + testName);
    },
    
    // print if the test passed or failed
    printPassFail: function(testName, diff) {
        if(diff.length === 1) {
            console.log('# Passed Test: ' + testName);
        } else {
            console.log('# Failed Test: ' + testName);
        }
    }
    
};

/*
 *
*/

var tests = {
    
    // test mrkdwn.markup.escapedChars(markdown)
    escapedChars: function() {
        var markdown = utils.readFile('escaped-chars.markdown'),
            markup = utils.readFile('escaped-chars.markup');
        return jsdiff.diffChars(markup, mrkdwn.markup.escapedChars(markdown));
    },
    
    // test mrkdwn.markup.comments(markdown)
    comments: function() {
        var markdown = utils.readFile('comments.markdown'),
            markup = utils.readFile('comments.markup');
        return jsdiff.diffChars(markup, mrkdwn.markup.comments(markdown));
    },
    
    // test mrkdwn.markup.codes(markdown)
    codes: function() {
        var markdown = utils.readFile('codes.markdown'),
            markup = utils.readFile('codes.markup');
        return jsdiff.diffChars(markup, mrkdwn.markup.codes(markdown));
    }
    
};

/*
 *
*/

// if tests specified, run just those and print pass or fail and diff
// if no tests specified, run all tests and print pass or fail only
var diff;
if(testRuns.length) {
    console.log('');
    for(var i=0; i<testRuns.length; i++) {
        if(tests[testRuns[i]]) {
            diff = tests[testRuns[i]]();
            utils.printDiff(testRuns[i], diff);
        } else {
            console.log('# Invalid Test: ' + testRuns[i]);
        }
        console.log('');
    }
} else {
    console.log('');
    for(var test in tests) {
        diff = tests[test]();
        utils.printPassFail(test, diff);
    }
    console.log('');
}