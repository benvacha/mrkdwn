/* mrkdwn v0.1.0 : github.com/benvacha/mrkdwn /*

/*
The MIT License (MIT)

Copyright (c) 2014 Benjamin Vacha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.  
*/

/*
*/
var mrkdwn = {
    
    /*
     * 
     */
    
    // return the html representation of the markdown
    getHtml: function(markdown) {
        markdown = mrkdwn.decode.escapedChars(markdown);
        markdown = mrkdwn.decode.blockPreSample(markdown);
        markdown = mrkdwn.decode.blockPreCode(markdown);
        markdown = mrkdwn.decode.inlineCode(markdown);
        return markdown;
    },
    
    /*
    */
    
    decode: {
        
        // ascii encode all escaped characters
        escapedChars: function(markdown) {
            return mrkdwn.util.asciiEncode(markdown, /\\(\S)/g);
        },
        
        // create pre sample blocks, ascii encode most special characters inside the block
        blockPreSample: function(markdown) {
            var onMatch = function(match, $1, $2, $3) {
                var openTags = ($2.trim()) ? '<pre><samp class="' + $2.trim() + '">' : '<pre><samp>';
                return openTags + mrkdwn.util.asciiEncode($3, /([^\w\s&#;])/g) + '</samp></pre>';
            };
            return markdown.replace(/(```+)!(.*)\n([\s\S]*?)\1/g, onMatch);
        },
        
        // create pre code blocks, ascii encode most special characters inside the block
        blockPreCode: function(markdown) {
            var onMatch = function(match, $1, $2, $3) {
                var openTags = ($2.trim()) ? '<pre><code class="' + $2.trim() + '">' : '<pre><code>';
                return openTags + mrkdwn.util.asciiEncode($3, /([^\w\s&#;])/g) + '</code></pre>';
            };
            return markdown.replace(/(```+)(.*)\n([\s\S]*?)\1/g, onMatch);
        },
        
        // create inline code, ascii encode most special characters inside
        inlineCode: function(markdown) {
            var onMatch = function(match, $1) {
                return '<code>' + mrkdwn.util.asciiEncode($1, /([^\w\s&#;])/g) + '</code>';
            };
            return markdown.replace(/`(.*?)`/g, onMatch);
        }
        
    },
    
    /*
     *
     */
    
    util: {
        
        // ascii encode all characters matched by the regex
        asciiEncode: function(str, regex) {
            var onMatch = function(match, $1) {
                    return '&#' + $1.charCodeAt() + ';';
                };
            return str.replace(regex, onMatch);
        }
        
    }
};

























