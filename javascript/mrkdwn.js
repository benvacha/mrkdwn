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
        
        // change all syntax to markup
        all: function(markdown, insertMetaComments, runtimeVariables) {
            markdown = mrkdwn.markup.escapedChars(markdown);
            markdown = mrkdwn.markup.inlineCodeSample(markdown);
            markdown = mrkdwn.markup.blockCodeSample(markdown);
            markdown = mrkdwn.markup.meta(markdown, insertMetaComments);
            markdown = mrkdwn.markup.variables(markdown, runtimeVariables);
            return markdown;
        },
        
        // escaped chars >> ascii html encoding
        escapedChars: function(markdown) {
            return mrkdwn.util.asciiEncode(markdown, /\\(\S)/g);
        },
        
        // pair of one or two backticks on a line >> <code></code>
        // pair of one or two backticks with bang on a line >> <samp></samp>
        inlineCodeSample: function(markdown) {
            var onMatch = function(match, $1, $2, $3) {
                if($2) {
                    return '<samp>' + mrkdwn.util.asciiEncode($3, /([^\w\s&#;])/g) + '</samp>';
                }
                return '<code>' + mrkdwn.util.asciiEncode($3, /([^\w\s&#;])/g) + '</code>';
            };
            return markdown.replace(/(`{1,2})(?!`)(!|)(.*)\1/g, onMatch);
        },
        
        // pair of three or more backticks on multiple lines >> <pre><code></code></pre>
        // pair of three or more backticks with bang on multiple lines >> <pre><samp></samp></pre>
        blockCodeSample: function(markdown) {
            var onMatch = function(match, $1, $2, $3, $4) {
                if($2 && $3) {
                    return '<pre><samp class="' + $3.trim() + '">' + mrkdwn.util.asciiEncode($4, /([^\w\s&#;])/g) + '</samp></pre>';
                } else if($2) {
                    return '<pre><samp>' + mrkdwn.util.asciiEncode($4, /([^\w\s&#;])/g) + '</samp></pre>';
                } else if($3) {
                    return '<pre><code class="' + $3.trim() + '">' + mrkdwn.util.asciiEncode($4, /([^\w\s&#;])/g) + '</code></pre>';
                }
                return '<pre><code>' + mrkdwn.util.asciiEncode($4, /([^\w\s&#;])/g) + '</code></pre>';
            };
            return markdown.replace(/(```+)(?!`)(!|)(.*)\n([\s\S]*?)\1/g, onMatch);
        },
        
        // curly brackets >> nothing or comments
        meta: function(markdown, insertComments) {
            // TODO: if comments then parse meta and insert comment block
            return markdown.replace(/\{[\s\S]*?\}/g, '');
        },
        
        // percent square brackets colon >> nothing
        // percent square brackets >> text
        variables: function(markdown, runtimeDefinitions) {
            // TODO: include runtimeDefinitions
            // find, cache, remove definitions
            var defs = {},
                onMatch = function(match, $1, $2) {
                    defs[$1] = $2.trim();
                    return '';
                };
            markdown = markdown.replace(/%\[(.*?)\]:(.*)\n/g, onMatch);
            // find, replace usage
            onMatch = function(match, $1) {
                if(defs[$1]) return defs[$1];
                return '';
            };
            return markdown.replace(/%\[(.*?)\]/g, onMatch);
        },
        
        /*
                
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
        */
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

























