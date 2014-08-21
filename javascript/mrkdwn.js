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
    
    markup: {
        
        // change all syntax to markup
        all: function(markdown) {
            markdown = mrkdwn.markup.escapedChars(markdown);
            markdown = mrkdwn.markup.comments(markdown);
            markdown = mrkdwn.markup.inlineCodeSamples(markdown);
            markdown = mrkdwn.markup.blockCodeSamples(markdown);
            markdown = mrkdwn.markup.meta(markdown);
            markdown = mrkdwn.markup.variables(markdown);
            markdown = mrkdwn.markup.abbreviations(markdown);
            markdown = mrkdwn.markup.images(markdown);
            markdown = mrkdwn.markup.macros(markdown);
            markdown = mrkdwn.markup.citations(markdown);
            markdown = mrkdwn.markup.notes(markdown);
            markdown = mrkdwn.markup.links(markdown);
            markdown = mrkdwn.markup.autoLinks(markdown);
            markdown = mrkdwn.markup.headers(markdown);
            markdown = mrkdwn.markup.horizontalRules(markdown);
            return markdown;
        },
        
        // escaped chars >> ascii html encoding
        escapedChars: function(markdown) {
            return mrkdwn.util.asciiEncode(markdown, /\\(\S)/g);
        },
        
        // pair of three or more slashes >> nothing
        // pair of three or more slashes with bang >> <!-- -->
        comments: function(markdown) {
            var onMatch = function(match, $1, $2, $3) {
                if($2) {
                    return '<!-- ' + $3 + ' -->';
                }
                return '';
            };
            return markdown.replace(/(\/\/\/+)(?!\/)(!|)([\s\S]*?)\1/g, onMatch);
        },
        
        // pair of one or two backticks on a line >> <code></code>
        // pair of one or two backticks with bang on a line >> <samp></samp>
        inlineCodeSamples: function(markdown) {
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
        blockCodeSamples: function(markdown) {
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
        
        // dollar square brackets colon >> nothing
        // dollar square brackets >> text
        variables: function(markdown) {
            // TODO: include passed runtime definitions
            // find, cache, remove definitions
            var defs = {},
                onMatch = function(match, $1, $2) {
                    defs[$1] = $2.trim();
                    return '';
                };
            markdown = markdown.replace(/\$\[(.*?)\]:(.*)\n/g, onMatch);
            // find, replace usage
            onMatch = function(match, $1) {
                if(defs[$1]) return defs[$1];
                return '';
            };
            return markdown.replace(/\$\[(.*?)\]/g, onMatch);
        },
        
        // plus square brackets colon >> nothing
        // matching text >> <abbr></abbr>
        abbreviations: function(markdown) {
            // TODO: include passed runtime definitions
            // find, cache, remove definitions
            var defs = {}, def,
                onMatch = function(match, $1, $2) {
                    defs[$1] = $2.trim();
                    return '';
                };
            markdown = markdown.replace(/\+\[(.*?)\]:(.*)\n/g, onMatch);
            // find, markup usage
            for(def in defs) {
                markdown = markdown.replace(new RegExp('\\b'+def+'\\b'), 
                    '<abbr title="' + defs[def] + '">' + def + '</abbr>');
            }
            return markdown;
        },
        
        // bang square brackets colon >> nothing
        // bang square brackets square brackets >> <img />
        // bang square brackets round brackets >> <img />
        images: function(markdown) {
            // TODO: include passed runtime definitions
            // find, cache, remove definitions
            var tokens, defs = {},
                src, title, alt, width, height,
                onMatch = function(match, $1, $2) {
                    tokens = mrkdwn.util.tokenize($2);
                    defs[$1] = {url: tokens[0], title: tokens[1], width: tokens[2], height: tokens[3]};
                    return '';
                };
            markdown = markdown.replace(/\!\[(.*?)\]:(.*)\n/g, onMatch);
            // find, replace reference usage
            onMatch = function(match, $1, $2) {
                alt = ' alt="' + $1 + '"';
                src = (defs[$2] && defs[$2].url) ? ' src="' + defs[$2].url + '"' : '';
                title = (defs[$2] && defs[$2].title) ? ' title="' + defs[$2].title + '"' : '';
                width = (defs[$2] && defs[$2].width) ? ' width="' + defs[$2].width + '"' : '';
                height = (defs[$2] && defs[$2].height) ? ' height="' + defs[$2].height + '"' : '';
                return '<img' + alt + src + title + width + height + ' />';
            };
            markdown = markdown.replace(/\!\[(.*?)\]\[(.*?)\]/g, onMatch);
            // find, replace inline usage
            onMatch = function(match, $1, $2) {
                tokens = mrkdwn.util.tokenize($2);
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
        },
        
        // percent square brackets colon >> nothing
        // percent square brackets square brackets >> <img />
        // percent square brackets round brackets >> <img />
        macros: function(markdown) {
            // TODO: include passed runtime definitions
            // find, cache, remove definitions
            var tokens, macro, defs = {},
                onMatch = function(match, $1, $2) {
                    tokens = mrkdwn.util.tokenize($2);
                    macro = tokens.shift();
                    defs[$1] = {macro: macro, args: tokens};
                    return '';
                };
            markdown = markdown.replace(/\%\[(.*?)\]:(.*)\n/g, onMatch);
            // find, replace reference usage
            onMatch = function(match, $1, $2) {
                if(defs[$2] && mrkdwn.macro[defs[$2].macro]) {
                    return mrkdwn.macro[defs[$2].macro].apply(null, defs[$2].args);
                }
                return $1;
            };
            markdown = markdown.replace(/\%\[(.*?)\]\[(.*?)\]/g, onMatch);
            // find, replace inline usage
            onMatch = function(match, $1, $2) {
                tokens = mrkdwn.util.tokenize($2);
                macro = tokens.shift();
                if(mrkdwn.macro[macro]) {
                    return mrkdwn.macro[macro].apply(null, tokens);
                }
                return $1;
            };
            markdown = markdown.replace(/\%\[(.*?)\]\((.*?)\)/g, onMatch);
            //
            return markdown;
        },
        
        // at square brackets colon >> citation list
        // at square brackets >> <sup><a></a></sup>
        // at text >> <sup><a></a></sup>
        citations: function(markdown) {
            // TODO: allow cite- to be replaced with custom string in anchors
            // find, cache, create list
            var id = 0, tokens, type, bib, defs = {}, def,
                onMatch = function(match, $1, $2) {
                    tokens = mrkdwn.util.tokenize($2);
                    type = tokens.shift();
                    if(mrkdwn.citation[type]) {
                        bib = mrkdwn.citation[type].apply(null, tokens);
                    } else {
                        bib = $2;
                    }
                    defs[$1] = {id: ++id, type: type, bib: bib};
                    return '<ol><li><a name="cite-' + id + '">' + bib + '</a></li></ol>';
                };
            markdown = markdown.replace(/\@\[(.*?)\]:(.*)\n/g, onMatch);
            // clean up list
            markdown = markdown.replace(/<\/ol>\s?<ol>/g, '');
            // find, markup usage
            onMatch = function(match, $1) {
                if(defs[$1]) {
                    return '<sup class="citation"><a href="#cite-' + defs[$1].id + '" title="' + 
                        mrkdwn.util.asciiEncode(defs[$1].bib, /([>"'])/g) + '">' + defs[$1].id + '</a></sup>';
                }
                return '';
            };
            markdown = markdown.replace(/\s\@\[(.*?)\]/g, onMatch);
            markdown = markdown.replace(/\s\@(.+?)\b/g, onMatch);
            return markdown;
        },
        
        // amp square brackets colon >> note list
        // amp square brackets >> <sup><a></a></sup>
        // amp text >> <sup><a></a></sup>
        notes: function(markdown) {
            // TODO: allow note- to be replaced with custom string in anchors
            // find, cache, create list
            var id = 0, defs = {}, def,
                onMatch = function(match, $1, $2) {
                    defs[$1] = {id: ++id, note: $2};
                    return '<ol><li><a name="note-' + id + '">' + $2 + '</a></li></ol>';
                };
            markdown = markdown.replace(/\&\[(.*?)\]:(.*)/g, onMatch);
            // clean up list
            markdown = markdown.replace(/<\/ol>\s?<ol>/g, '');
            // find, markup usage
            onMatch = function(match, $1) {
                if(defs[$1]) {
                    return '<sup class="note"><a href="#note-' + defs[$1].id + '" title="' + 
                        mrkdwn.util.asciiEncode(defs[$1].note, /([>"'])/g) + '">' + defs[$1].id + '</a></sup>';
                }
                return '';
            };
            markdown = markdown.replace(/\s\&\[(.*?)\]/g, onMatch);
            markdown = markdown.replace(/\s\&(.+?)\b/g, onMatch);
            return markdown;
        },
        
        // square brackets colon >> nothing
        // square brackets square brackets >> <a></a>
        // square brackets round brackets >> <a></a>
        // square brackets >> <a></a>
        links: function(markdown) {
            // TODO: include passed runtime definitions
            // TODO: replace bannedChars with negative lookbehind in supported languages
            // find, cache, remove definitions
            var bannedChars = {'!':true,'@':true,'%':true,'&':true,'$':true,'+':true}, 
                tokens, url, name, email, title, defs = {},
                onMatch = function(match, $1, $2, $3) {
                    if($1 in bannedChars) return match;
                    tokens = mrkdwn.util.tokenize($3);
                    url = name = email = undefined;
                    if(tokens[0].charAt(0) === '!') {
                        name = tokens[0].substring(1).replace(' ', '-').toLowerCase();
                    } else if(tokens[0].indexOf('@') > 0) {
                        email = tokens[0];
                    } else {
                        url = tokens[0];
                    }
                    defs[$2] = {url: url, name: name, email: email, title: tokens[1]};
                    return $1;
                };
            markdown = markdown.replace(/(.?)\[(.*?)\]:(.*)\n/g, onMatch);
            // find, replace reference usage
            onMatch = function(match, $1, $2, $3) {
                if($1 in bannedChars) return match;
                url = (defs[$3] && defs[$3].url) ? ' href="' + defs[$3].url + '"' : '';
                name = (defs[$3] && defs[$3].name) ? ' name="' + defs[$3].name + '"' : '';
                email = (defs[$3] && defs[$3].email) ? ' href="mailto:' + defs[$3].email + '"' : '';
                title = (defs[$3] && defs[$3].title) ? ' title="' + defs[$3].title + '"' : '';
                return $1 + '<a' + url + name + email + title + '>' + $2 + '</a>';
            }
            markdown = markdown.replace(/(.?)\[(.*?)\]\[(.*?)\]/g, onMatch);
            // find, replace inline usage
            onMatch = function(match, $1, $2, $3) {
                if($1 in bannedChars) return match;
                tokens = mrkdwn.util.tokenize($3);
                url = name = email = title = undefined;
                if(tokens[0].charAt(0) === '!') {
                    name = tokens[0].substring(1).replace(' ', '-').toLowerCase();
                } else if(tokens[0].indexOf('@') > 0) {
                    email = tokens[0];
                } else {
                    url = tokens[0];
                }
                url = (url) ? ' href="' + url + '"' : '';
                name = (name) ? ' name="' + name + '"' : '';
                email = (email) ? ' href="mailto:' + email + '"' : '';
                title = (tokens[1]) ? ' title="' + tokens[1] + '"' : '';
                return $1 + '<a' + url + name + email + title + '>' + $2 + '</a>';
            }
            markdown = markdown.replace(/(.?)\[(.*?)\]\((.*?)\)/g, onMatch);
            // find, replace simple usage
            onMatch = function(match, $1, $2, $3) {
                if($1 in bannedChars) return match;
                url = name = email = title = undefined;
                if($2.charAt(0) === '!') {
                    name = $2.substring(1).replace(' ', '-').toLowerCase();
                    title = $2.substring(1);
                } else if($2.indexOf('@') > 0) {
                    email = $2;
                    title = email;
                } else if($2.charAt(0) === '#') {
                    url = $2.replace(' ', '-').toLowerCase();
                    title = $2.substring(1);
                } else {
                    url = $2.replace(/_/g, '/');
                    title = $2.replace(/_/g, ' ');
                }
                url = (url) ? ' href="' + url + '"' : '';
                name = (name) ? ' name="' + name + '"' : '';
                email = (email) ? ' href="mailto:' + email + '"' : '';
                return $1 + '<a' + url + name + email + ' title="' + title + '">' + title + '</a>' + $3; 
            }
            markdown = markdown.replace(/(.?)\[(.*?)\](.?)/g, onMatch);
            //
            return markdown;
        },
        
        // absolute links >> <a></a>
        // email addresses >> <a></a>
        autoLinks: function(markdown) {
            // find, replace absolute links
            markdown = markdown.replace(/(\s)(http[s]?:\/\/.*?)(\s)/g, '$1<a href="$2" title="$2">$2</a>$3');
            // find, replace email addresses
            markdown = markdown.replace(/(\s)([\w._-]+?\@[\w._-]+?\.[\w._-]+?)(\s)/g, '$1<a href="mailto:$2" title="$2">$2</a>$3');
            //
            return markdown;
        },
        
        // === >> <h1><a></a></h1>
        // --- >> <h2><a></a><h2>
        // ### >> <h#><a></a><h#>
        headers: function(markdown) {
            // find, replace ===
            var onMatch = function(match, $1) {
                    return '\n<h1><a name="' + $1.replace(' ', '-').toLowerCase() + '" title="' + $1 + '">' + $1 + '</a></h1>\n';
                };
            markdown = markdown.replace(/\n([\S ]+?)\n===+\n/g, onMatch);
            // find, replace ---
            onMatch = function(match, $1) {
                return '\n<h2><a name="' + $1.replace(' ', '-').toLowerCase() + '" title="' + $1 + '">' + $1 + '</a></h2>\n';
            };
            markdown = markdown.replace(/\n([\S ]+?)\n---+\n/g, onMatch);
            // find, replace #s
            onMatch = function(match, $1, $2, $3, $4) {
                if($3) {
                    return '<h' + $1.length + '><a name="' + $3.replace(' ', '-').toLowerCase() + '" title="' + $4 + '">' + $4 + '</a></h' + $1.length + '>\n';
                }
                return '<h' + $1.length + '><a name="' + $4.replace(' ', '-').toLowerCase() + '" title="' + $4 + '">' + $4 + '</a></h' + $1.length + '>\n';
            }
            markdown = markdown.replace(/(\#+)(\(\!(.*)?\))? ([\S ]+?)\n/g, onMatch);
            //
            return markdown;
        },
        
        // --- >> <hr />
        horizontalRules: function(markdown) {
            // find, replace ---
            return markdown.replace(/\n\n ?- ?- ?-[- ]*/g, '\n\n<hr />');
        }
        
    },
    
    /*
     *
     */
    
    macro: {
        
        // get the CSV of the arguments
        csv: function() {
            var i, str = '';
            for(i=0; i<arguments.length; i++) {
                str += ',' + arguments[i];
            }
            return str.substring(1);
        },
        
        // embed youtube video
        youtube: function(videoId, width, height) {
            if(!videoId) return '';
            width = (width) ? ' width="' + width + '"' : '';
            height = (height) ? ' height="' + height + '"' : '';
            return '<iframe src="http://www.youtube.com/embed/' + videoId + '"' + width + height + ' frameborder="0" allowfullscreen></iframe>';
        }
        
    },
    
    /*
     *
     */
    
    citation: {
        
        // citation for a website
        web: function(url, accessDate, pageTitle, websiteTitle, author) {
            author = (author) ? author + '. ' : '';
            pageTitle = (pageTitle) ? '"' + pageTitle + '." ' : '';
            websiteTitle = (websiteTitle) ? '<i>' + websiteTitle + '.</i> ' : '';
            accessDate = (accessDate) ? accessDate + '. ' : '';
            url = (url) ? '<br /><<a href="' + url + '">' + url + '</a>>.' : '';
            return author + pageTitle + websiteTitle + accessDate + url;
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
        },
        
        // tokenize based on white space and quotations
        tokenize: function(str) {
            return str.match(/([^"' ]|\s)*\w(?="|')|[^"' ]+/g);
        }
        
    }
};

























