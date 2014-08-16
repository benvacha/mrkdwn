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
        markdown = mrkdwn.markup.escapedChars(markdown);
        markdown = mrkdwn.markup.blockPreSample(markdown);
        markdown = mrkdwn.markup.blockPreCode(markdown);
        markdown = mrkdwn.markup.inlineCode(markdown);
        markdown = mrkdwn.markup.removeSemantics(markdown);
        markdown = mrkdwn.markup.variables(markdown);
        markdown = mrkdwn.markup.abbreviations(markdown);
        markdown = mrkdwn.markup.images(markdown);
        return markdown;
    },
    
    /*
    */
    
    markup: {
        
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
        },
        
        // replace inline and block sematic
        removeSemantics: function(markdown) {
            return markdown.replace(/\{[\s\S]*?\}/g, '');
        },
        
        // remove and cache variable references, replace variables
        variables: function(markdown) {
            // variable references
            var vars = {},
                onMatch = function(match, $1, $2) {
                    vars[$1] = $2.trim();
                    return '';
                };
            markdown = markdown.replace(/%\[(.*?)\]:(.*)\n/g, onMatch);
            // variable replace
            onMatch = function(match, $1) {
                if(vars[$1]) return vars[$1];
                return '';
            };
            return markdown.replace(/%\[(.*?)\]/g, onMatch);
        },
        
        // remove and cache abbreviation references, markup abbreviations
        abbreviations: function(markdown) {
            // abbreviation references
            var abbrs = {}, abbr, regex, replace,
                onMatch = function(match, $1, $2) {
                    abbrs[$1] = $2.trim();
                    return '';
                };
            markdown = markdown.replace(/\+\[(.*?)\]:(.*)\n/g, onMatch);
            // abbreviation markup
            for(abbr in abbrs) {
                markdown = markdown.replace(new RegExp('\\b'+abbr+'\\b'), 
                    '<abbr title="' + abbrs[abbr] + '">' + abbr + '</abbr>');
            }
            return markdown;
        },
        
        // remove and cache image references, markup images
        images: function(markdown) {
            // image references
            var tokens, refs = {}, ref,
                src, title, alt, width, height,
                onMatch = function(match, $1, $2) {
                    tokens = $2.match(/([^"' ]|\s)*\w(?="|')|[^"' ]+/g);
                    refs[$1] = {url: tokens[0], title: tokens[1], width: tokens[2], height: tokens[3]};
                    return '';
                };
            markdown = markdown.replace(/\!\[(.*?)\]:(.*)\n/g, onMatch);
            // image reference translation
            onMatch = function(match, $1, $2) {
                alt = ' alt="' + $1 + '"';
                src = (refs[$2] && refs[$2].url) ? ' src="' + refs[$2].url + '"' : '';
                title = (refs[$2] && refs[$2].title) ? ' title="' + refs[$2].title + '"' : '';
                width = (refs[$2] && refs[$2].width) ? ' width="' + refs[$2].width + '"' : '';
                height = (refs[$2] && refs[$2].height) ? ' height="' + refs[$2].height + '"' : '';
                return '<img' + alt + src + title + width + height + ' />';
            };
            markdown = markdown.replace(/\!\[(.*?)\]\[(.*?)\]/g, onMatch);
            // image inline translation
            onMatch = function(match, $1, $2) {
                tokens = $2.match(/([^"' ]|\s)*\w(?="|')|[^"' ]+/g);
                alt = ' alt="' + $1 + '"';
                src = (tokens[0]) ? ' src="' + tokens[0] + '"' : '';
                title = (tokens[1]) ? ' title="' + tokens[1] + '"' : '';
                width = (tokens[2]) ? ' width="' + tokens[2] + '"' : '';
                height = (tokens[3]) ? ' height="' + tokens[3] + '"' : '';
                return '<img' + alt + src + title + width + height + ' />';
            };
            markdown = markdown.replace(/\!\[(.*?)\]\((.*?)\)/g, onMatch);
            //
            return markdown;
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
























