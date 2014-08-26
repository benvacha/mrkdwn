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

var testFiles = {
    escapedChars: {
        markdown: 'escaped-chars.markdown',
        markup: 'escaped-chars.markup'
    },
    comments: {
        markdown: 'comments.markdown',
        markup: 'comments.markup'
    },
    codes: {
        markdown: 'codes.markdown',
        markup: 'codes.markup'
    },
    samples: {
        markdown: 'samples.markdown',
        markup: 'samples.markup'
    },
    metas: {
        markdown: 'metas.markdown',
        markup: 'metas.markup'
    },
    variables: {
        markdown: 'variables.markdown',
        markup: 'variables.markup'
    },
    abbreviations: {
        markdown: 'abbreviations.markdown',
        markup: 'abbreviations.markup'
    },
    images: {
        markdown: 'images.markdown',
        markup: 'images.markup'
    },
    macros: {
        markdown: 'macros.markdown',
        markup: 'macros.markup'
    },
    citations: {
        markdown: 'citations.markdown',
        markup: 'citations.markup'
    },
    notes: {
        markdown: 'notes.markdown',
        markup: 'notes.markup'
    },
    links: {
        markdown: 'links.markdown',
        markup: 'links.markup'
    },
    headers: {
        markdown: 'headers.markdown',
        markup: 'headers.markup'
    },
    horizontalRules: {
        markdown: 'horizontal-rules.markdown',
        markup: 'horizontal-rules.markup'
    },
    phraseFormattings: {
        markdown: 'phrase-formattings.markdown',
        markup: 'phrase-formattings.markup'
    }
}

var tests = {
    
    //
    all: function() {
        var testFile, markdown = '', markup = '';
        for(testFile in testFiles) {
            markdown += utils.readFile(testFiles[testFile].markdown),
            markup += utils.readFile(testFiles[testFile].markup);
        }
        return jsdiff.diffChars(markup, mrkdwn.markup.all(markdown));
    },
    
    // test mrkdwn.markup.escapedChars(markdown)
    escapedChars: function() {
        var markdown = utils.readFile(testFiles.escapedChars.markdown),
            markup = utils.readFile(testFiles.escapedChars.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.escapedChars(markdown));
    },
    
    // test mrkdwn.markup.comments(markdown)
    comments: function() {
        var markdown = utils.readFile(testFiles.comments.markdown),
            markup = utils.readFile(testFiles.comments.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.comments(markdown));
    },
    
    // test mrkdwn.markup.codesSamples(markdown)
    codes: function() {
        var markdown = utils.readFile(testFiles.codes.markdown),
            markup = utils.readFile(testFiles.codes.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.codesSamples(markdown));
    },
    
    // test mrkdwn.markup.codesSamples(markdown)
    samples: function() {
        var markdown = utils.readFile(testFiles.samples.markdown),
            markup = utils.readFile(testFiles.samples.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.codesSamples(markdown));
    },
    
    // test mrkdwn.markup.metas(markdown)
    metas: function() {
        var markdown = utils.readFile(testFiles.metas.markdown),
            markup = utils.readFile(testFiles.metas.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.metas(markdown));
    },
    
    // test mrkdwn.markup.variables(markdown)
    variables: function() {
        var markdown = utils.readFile(testFiles.variables.markdown),
            markup = utils.readFile(testFiles.variables.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.variables(markdown));
    },
    
    // test mrkdwn.markup.abbreviations(markdown)
    abbreviations: function() {
        var markdown = utils.readFile(testFiles.abbreviations.markdown),
            markup = utils.readFile(testFiles.abbreviations.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.abbreviations(markdown));
    },
    
    // test mrkdwn.markup.images(markdown)
    images: function() {
        var markdown = utils.readFile(testFiles.images.markdown),
            markup = utils.readFile(testFiles.images.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.images(markdown));
    },
    
    // test mrkdwn.markup.macros(markdown)
    macros: function() {
        var markdown = utils.readFile(testFiles.macros.markdown),
            markup = utils.readFile(testFiles.macros.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.macros(markdown));
    },
    
    // test mrkdwn.markup.citations(markdown)
    citations: function() {
        var markdown = utils.readFile(testFiles.citations.markdown),
            markup = utils.readFile(testFiles.citations.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.citations(markdown));
    },
    
    // test mrkdwn.markup.notes(markdown)
    notes: function() {
        var markdown = utils.readFile(testFiles.notes.markdown),
            markup = utils.readFile(testFiles.notes.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.notes(markdown));
    },
    
    // test mrkdwn.markup.links(markdown)
    links: function() {
        var markdown = utils.readFile(testFiles.links.markdown),
            markup = utils.readFile(testFiles.links.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.links(markdown));
    },
    
    // test mrkdwn.markup.headers(markdown)
    headers: function() {
        var markdown = utils.readFile(testFiles.headers.markdown),
            markup = utils.readFile(testFiles.headers.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.headers(markdown));
    },
    
    // test mrkdwn.markup.horizontalRules(markdown)
    horizontalRules: function() {
        var markdown = utils.readFile(testFiles.horizontalRules.markdown),
            markup = utils.readFile(testFiles.horizontalRules.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.horizontalRules(markdown));
    },
    
    // test mrkdwn.markup.phraseFormattings(markdown)
    phraseFormattings: function() {
        var markdown = utils.readFile(testFiles.phraseFormattings.markdown),
            markup = utils.readFile(testFiles.phraseFormattings.markup);
        return jsdiff.diffChars(markup, mrkdwn.markup.phraseFormattings(markdown));
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