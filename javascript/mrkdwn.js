/* mrkdwn v0.1.0 : github.com/benvacha/mrkdwn */

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
            markdown = mrkdwn.markup.codesSamples(markdown);
            return markdown;
        },
        
        // escaped non whitespace chars >> ascii html encoding
        escapedChars: function(markdown) {
            return markdown.replace(/\\(\S)/g, function(match, escapedChar) {
                return '&#' + escapedChar.charCodeAt() + ';';
            });
        },
        
        // pair of three or more slashes >> nothing
        // pair of three or more slashes with bang >> <!-- -->
        comments: function(markdown) {
            return markdown.replace(/(\/{3,})(!)?([^\/][\s\S]*?)\1/g, function(match, slashes, bang, content) {
                if(bang) return '<!-- ' + content + ' -->';
                return '';
            });
        },
        
        // pair of one or more backticks on a line >> <code></code>
        // pair of one or more backticks with ! on a line >> <samp></samp>
        // pair of three or more backticks on multiple lines >> <pre><code></code></pre>
        // pair of three or more backticks with ! on multiple lines >> <pre><samp></samp></pre>
        codesSamples: function(markdown) {
            var asciiEncode = function(str) {
                return str.replace(/([^\w\s&#;])/g, function(match, specialChar) {
                    return '&#' + specialChar.charCodeAt() + ';';
                });
            };
            markdown = markdown.replace(/(`{1,})(!)?([^`\n].*?)\1/g, function(match, ticks, bang, content) {
                if(bang) return '<samp>' + asciiEncode(content) + '</samp>'
                return '<code>' + asciiEncode(content) + '</code>'
            });
            markdown = markdown.replace(/\n(`{3,})(!)?([^`\n].*?|)\n([\s\S]*?)\1/g, function(match, ticks, bang, syntax, content) {
                syntax = (syntax.trim()) ? ' class="' + syntax.trim() + '"' : '';
                if(bang) return '\n<pre><samp' + syntax + '>\n' + asciiEncode(content)  + '</samp></pre>'
                return '\n<pre><code' + syntax + '>\n' + asciiEncode(content)  + '</code></pre>'
            });
            return markdown;
        },
        
        /*
         *
        */
        
        // curly brackets >> nothing or comments
        metas: function(markdown, insertComments) {
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
        },
        
        // *t*, **t**, ***t*** >> bold, strong, emphasis
        // ~t~, ~~t~~, ~~~t~~~ >> italic, strike, mark
        // ^t^, ^^t&& >> superscript, subscript
        // _t_ >> underline
        phraseFormattings: function(markdown) {
            // find, replace emphasis, strong, bold
            markdown = markdown.replace(/(\*+)([^\*\s].*?)\1(?!\*)/g, function(match, $1, $2) {
                if($1.length === 1) {
                    return '<b>' + $2 + '</b>';
                } else if($1.length === 2) {
                    return '<strong>' + $2 + '</strong>';
                } else if($1.length === 3) {
                    return '<em>' + $2 + '</em>';
                }
                return match;
            });
            // find, replace mark, strike, italic
            markdown = markdown.replace(/(\~+)([^\~\s].*?)\1(?!\~)/g, function(match, $1, $2) {
                if($1.length === 1) {
                    return '<i>' + $2 + '</i>';
                } else if($1.length === 2) {
                    return '<strike>' + $2 + '</strike>';
                } else if($1.length === 3) {
                    return '<mark>' + $2 + '</mark>';
                }
                return match;
            });
            // find, replace subscript, superscript
            markdown = markdown.replace(/(\^+)([^\^\s].*?)\1(?!\^)/g, function(match, $1, $2) {
                if($1.length === 1) {
                    return '<sup>' + $2 + '</sup>';
                } else if($1.length === 2) {
                    return '<sub>' + $2 + '</sub>';
                }
                return match;
            });
            // find, replace underline
            markdown = markdown.replace(/(\s)(\_+)([^\_\s].*?)\2(?!\S)/g, "$1<u>$3</u>");
            //
            return markdown;
        },
        
        // > >> blockquote
        blockquotes: function(markdown) {
            // find, replace nested blockquotes
            // TODO: better document this recursive nightmare
            // onMatch is recursivelly called
            // $1 = whitespace before > and should be put back :: $2 = optional second >, forces blockquote end
            // $3 = whole citation including ! :: $4 = citation text :: $5 = blockquote content
            var n = 10, onMatch = function(match, $1, $2, $3, $4, $5) {
                $2 = ($2) ? '&nbsp;' : '';
                $4 = ($4) ? ' cite="' + $4 + '"' : '';
                // if the blockquote content contains another valid blockquote syntax, recall onMatch on it
                if($5.search(/(\s)\>(.*)/g) > -1) {
                    $5 = $5.replace(/(\s)\>(\>?)[ ]?(?!\>)(\! ?(.*))?(.*)/g, onMatch);
                }
                // return the whole mess back up
                return $1 + '<blockquote' + $4 + '>' + $5 + '</blockquote>' + $2;
            }
            // find all of the first level >, optionally match first level >>, optionally match ! citation
            markdown = markdown.replace(/(\s)\>(\>?)[ ]?(?!\>)(\! ?(.*))?(.*)/g, onMatch);
            // as long as the extra (incorrect) ending and starting blockquote tags are found, remove them
            while(markdown.search(/<\/blockquote>(\s*?)<blockquote.*?>/g) > -1 && n--) {
                markdown = markdown.replace(/<\/blockquote>(\s*?)<blockquote.*?>/g, '$1');
            }
            //
            return markdown;
        },
        
        // < >> details
        details: function(markdown) {
            // find, replace nested details
            // TODO: better document this recursive nightmare
            // onMatch is recursivelly called
            // $1 = whitespace before < and should be put back :: $2 = optional second <, forces detail end
            // $3 = whole summary including ! :: $4 = summary text :: $5 = detail content
            var n = 10, onMatch = function(match, $1, $2, $3, $4, $5) {
                $2 = ($2) ? '&nbsp;' : '';
                $4 = ($4) ? '<summary>' + $4 + '</summary>' : '';
                // if the detail content contains another valid detail syntax, recall onMatch on it
                if($5.search(/(\s)\<(.*)/g) > -1) {
                    $5 = $5.replace(/(\s)\<(\<?)[ ]?(?!\<)(\!(?!-) ?(.*))?(?!\S)(.*)/g, onMatch);
                }
                // return the whole mess back up
                return $1 + '<details>' + $4 + $5 + '</details>' + $2;
            }
            // find all of the first level <, optionally match first level <<, match ! summary
            markdown = markdown.replace(/(\s)\<(\<?)[ ]?(?!\<)(\!(?!-) ?(.*))?(?!\S)(.*)/g, onMatch);
            // as long as the extra (incorrect) ending and starting details tags are found, remove them
            while(markdown.search(/<\/details>(\s*?)<details>/g) > -1 && n--) {
                markdown = markdown.replace(/<\/details>(\s*?)<details>/g, '$1');
            }
            //
            return markdown;
        },
        
        // - >> <ul></ul>
        // #. >> <ol></ol>
        // : >> <dl></dl>
        lists: function(markdown) {
            // find, replace nested lists
            // TODO: add custom or dynamic indentSpaceCount
            // TODO: better document this recursive nightmare
            // TODO: better find and document edge cases
            var n = 10, indentSpaceCount = 1,
                onMatch = function(match, space, number, marker, ender, accordian, content) {
                    if(space.length) {
                        content = onMatch(match, space.substring(indentSpaceCount), number, marker, '', accordian, content);
                    }
                    ender = (ender) ? '<!-- -->' : '';
                    accordian = (accordian) ? ' class="accordian"' : '';
                    if(marker === '-') {
                        return '<ul><li' + accordian + '>' + content + '</li></ul>' + ender;
                    } else {
                        number = (number)? ' start="' + number + '"' : '';
                        return '<ol' + number + '><li' + accordian + '>' + content + '</li></ol>' + ender;
                    }
                };
            markdown = markdown.replace(/([\t ]*)(\d+)?(-|\.)(-|\.)?(\<)? ?(.*)/g, onMatch);
            //
            while(markdown.search(/<\/(?:ul|ol)>(?:<\/li>)?(\s*?)(?:<li.*?>)?<(?:ul|ol).*?>/g) > -1 && n--) {
                markdown = markdown.replace(/<\/(?:ul|ol)>(?:<\/li>)?(\s*?)(?:<li.*?>)?<(?:ul|ol).*?>/g, '$1');
            }
            markdown = markdown.replace(/<\/li>(\s*?)<li.*?>(<(?:ul|ol).*?>)/g, '$1$2');
            //
            return markdown;
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

/*
 *
*/

// if available, node module definition
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = mrkdwn;
}






















