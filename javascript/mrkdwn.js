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
            markdown = mrkdwn.markup.metas(markdown);
            markdown = mrkdwn.markup.variables(markdown);
            markdown = mrkdwn.markup.abbreviations(markdown);
            markdown = mrkdwn.markup.images(markdown);
            markdown = mrkdwn.markup.macros(markdown);
            markdown = mrkdwn.markup.citations(markdown);
            markdown = mrkdwn.markup.notes(markdown);
            markdown = mrkdwn.markup.links(markdown);
            markdown = mrkdwn.markup.headers(markdown);
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
        codesSamples: function(markdown, noSamples) {
            // TODO: if noSamples, markup all matches as code
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
        
        // three curly brackets >> nothing
        metas: function(markdown, singleComment) {
            // TODO: if singleComment, parse and cache meta then insert a single comment
            return markdown.replace(/\{\{\{(!)?[\s\S]*?\}\}\}/g, function(match, bang, content) {
                // TODO: if bang, parse meta and insert comment
                return '';
            });
        },
        
        // dollar square brackets colon >> nothing
        // dollar square brackets >> text
        variables: function(markdown, runtimeDefinitions) {
            var defs = (runtimeDefinitions) ? runtimeDefinitions : {};
            // find, cache, remove definitions
            markdown = markdown.replace(/\$\[(.*?)\]:(.*)(\n)?/g, function(match, name, value) {
                defs[name] = value.trim();
                return '';
            });
            // find, replace usage
            return markdown.replace(/\$\[(.*?)\]/g, function(match, name) {
                return (defs[name]) ? defs[name] : name;
            });
        },
        
        // plus square brackets colon >> nothing
        // matching text >> <abbr></abbr>
        abbreviations: function(markdown, runtimeDefinitions) {
            var def, defs = (runtimeDefinitions) ? runtimeDefinitions : {};
            // find, cache, remove definitions
            markdown = markdown.replace(/\+\[(.*?)\]:(.*)(\n)?/g, function(match, name, value) {
                defs[name] = value.trim();
                return '';
            });
            // find, markup usage
            for(def in defs) {
                markdown = markdown.replace(new RegExp('\\b' + def + '\\b'), 
                    '<abbr title="' + mrkdwn.util.asciiEncode(defs[def]) + '">' + def + '</abbr>');
            }
            return markdown;
        },
        
        // bang square brackets colon >> nothing
        // bang square brackets square brackets >> <img />
        // bang square brackets round brackets >> <img />
        images: function(markdown, runtimeDefinitions) {
            var defs = (runtimeDefinitions) ? runtimeDefinitions : {},
                buildTag = function(altText, value) {
                    // if no value, return empty-ish tag
                    if(!value) return '<img alt="' + altText + '" />';
                    // if value, return fully formed tag as possible
                    var alt, src, title, width, height,
                        tokens = mrkdwn.util.tokenize(value);
                    alt = ' alt="' + altText + '"';
                    src = (tokens[0]) ? ' src="' + tokens[0] + '"' : '';
                    title = (tokens[1]) ? ' title="' + tokens[1] + '"' : '';
                    width = (tokens[2]) ? ' width="' + tokens[2] + '"' : '';
                    height = (tokens[3]) ? ' height="' + tokens[3] + '"' : '';
                    return '<img' + alt + src + title + width + height + ' />';
                };
            // find, cache, remove definitions
            markdown = markdown.replace(/\!\[(.*?)\]:(.*)(\n)?/g, function(match, name, value) {
                defs[name] = value;
                return '';
            });
            // find, replace reference usage
            markdown = markdown.replace(/\!\[(.*?)\]\[(.*?)\]/g, function(match, altText, name) {
                return buildTag(altText, defs[name]);
            });
            // find, replace inline usage
            markdown = markdown.replace(/\!\[(.*?)\]\((.*?)\)/g, function(match, altText, value) {
                return buildTag(altText, value);
            });
            //
            return markdown;
        },
        
        // percent square brackets colon >> nothing
        // percent square brackets square brackets >> macro dependent
        // percent square brackets round brackets >> macro dependent
        macros: function(markdown, runtimeDefinitions) {
            var defs = (runtimeDefinitions) ? runtimeDefinitions : {},
                runMacro = function(altText, value) {
                    // if no value, return alt text
                    if(!value) return altText;
                    // if value, split it into tokens
                    var tokens = mrkdwn.util.tokenize(value),
                        macro = tokens.shift();
                    // if invalid macro, return alt text
                    if(!mrkdwn.macro[macro]) return altText;
                    // if valid macro, return its output
                    return mrkdwn.macro[macro].apply(null, tokens);
                };
            // find, cache, remove definitions
            markdown = markdown.replace(/\%\[(.*?)\]:(.*)(\n)?/g, function(match, name, value) {
                defs[name] = value;
                return '';
            });
            // find, replace reference usage
            markdown = markdown.replace(/\%\[(.*?)\]\[(.*?)\]/g, function(match, altText, name) {
                return runMacro(altText, defs[name]);
            });
            // find, replace inline usage
            markdown = markdown.replace(/\%\[(.*?)\]\((.*?)\)/g, function(match, altText, value) {
                return runMacro(altText, value);
            });
            //
            return markdown;
        },
        
        // at square brackets colon >> citation list
        // at square brackets >> <sup><a></a></sup>
        // at text >> <sup><a></a></sup>
        citations: function(markdown, linkPrefix) {
            var linkPrefix = (linkPrefix) ? linkPrefix : 'cite-',
                defCount = 0, defs = {},
                buildTags = function(altText, name) {
                    if(defs[name]) {
                        return '<sup class="citation"><a href="#' + linkPrefix + defs[name].id + '" title="' + 
                            mrkdwn.util.asciiEncode(defs[name].bib) + '">' + defs[name].id + '</a></sup>';
                    }
                    return altText;
                };
            // find, cache, create list
            markdown = markdown.replace(/\@\[(.*?)\]:(.*)(\n)?/g, function(match, name, value) {
                var tokens = mrkdwn.util.tokenize(value),
                    type = tokens.shift(), bib;
                if(mrkdwn.citation[type]) {
                    bib = mrkdwn.citation[type].apply(null, tokens);
                } else {
                    bib = value.trim();
                }
                defs[name] = {id: ++defCount, bib: bib};
                return '<ol><li><a name="' + linkPrefix + defCount + '">' + bib + '</a></li></ol>';
            });
            // clean up list
            markdown = markdown.replace(/<\/ol>\s{0,2}<ol>/g, '');
            // find, replace inline usage
            markdown = markdown.replace(/\s?\@\[(.*?)\]/g, function(match, name) {
                return buildTags(match, name);
            });
            markdown = markdown.replace(/\s?\@(\w\S+?)\b/g, function(match, name) {
                return buildTags(match, name);
            });
            return markdown;
        },
        
        // amp square brackets colon >> note list
        // amp square brackets >> <sup><a></a></sup>
        // amp text >> <sup><a></a></sup>
        notes: function(markdown, linkPrefix) {
            var linkPrefix = (linkPrefix) ? linkPrefix : 'note-',
                defCount = 0, defs = {},
                buildTags = function(altText, name) {
                    if(defs[name]) {
                        return '<sup class="note"><a href="#' + linkPrefix + defs[name].id + '" title="' + 
                            mrkdwn.util.asciiEncode(defs[name].note) + '">' + defs[name].id + '</a></sup>';
                    }
                    return altText;
                };
            // find, cache, create list
            markdown = markdown.replace(/\&\[(.*?)\]:(.*)(\n)?/g, function(match, name, value) {
                defs[name] = {id: ++defCount, note: value};
                return '<ol><li><a name="' + linkPrefix + defCount + '">' + value.trim() + '</a></li></ol>';
            });
            // clean up list
            markdown = markdown.replace(/<\/ol>\s{0,2}<ol>/g, '');
            // find, replace inline usage
            markdown = markdown.replace(/\s?\&\[(.*?)\]/g, function(match, name) {
                return buildTags(match, name);
            });
            markdown = markdown.replace(/\s?\&(\w\S+?)\b/g, function(match, name) {
                return buildTags(match, name);
            });
            return markdown;
        },
        
        // square brackets colon >> nothing
        // square brackets square brackets >> <a></a>
        // square brackets round brackets >> <a></a>
        // single or double square brackets >> <a></a>
        links: function(markdown, runtimeDefinitions, disableAutoLinks) {
            var defs = (runtimeDefinitions) ? runtimeDefinitions : {},
                buildTag = function(text, value) {
                    // if no value, return unaltered text
                    if(!value) return text;
                    // if value, split it into tokens and return tag
                    var tokens = mrkdwn.util.tokenize(value),
                        url, email, name, title;
                    //
                    url = email = name = '';
                    if(tokens[0].charAt(0) === '!') {
                        name = ' name="' + tokens[0].substring(1) + '"';
                    } else if(tokens[0].indexOf('@') > 0) {
                        email = ' href="mailto:' + tokens[0] + '"';
                    } else {
                        url = ' href="' + encodeURI(tokens[0]) + '"';
                    }
                    //
                    if(tokens[1]) {
                        title = ' title="' + mrkdwn.util.asciiEncode(tokens[1]) + '"';
                    } else {
                        title = ' title="' + mrkdwn.util.asciiEncode(text) + '"';
                    }
                    //
                    return '<a' + url + email + name + title + '>' + text + '</a>';
                };
            // find, cache, remove definitions
            markdown = markdown.replace(/\n\[(.*?)\]:(.*)/g, function(match, name, value) {
                defs[name] = value;
                return '';
            });
            // find, replace reference usage
            markdown = markdown.replace(/(\s)\[(.*?)\]\[(.*?)\]/g, function(match, whitespace, text, name) {
                return whitespace + buildTag(text, defs[name]);
            });
            // find, replace inline usage
            markdown = markdown.replace(/(\s)\[(.*?)\]\((.*?)\)/g, function(match, whitespace, text, value) {
                return whitespace + buildTag(text, value);
            });
            // find, replace simple usage
            markdown = markdown.replace(/(\s)\[([^\[\]].*?\S.*?)\]/g, function(match, whitespace, text) {
                return whitespace + buildTag(text.replace(/^[!#]/, ''), text);
            });
            // find, replace simple parsed usage
            markdown = markdown.replace(/(\s)\[\[([^\[\]].*?\S.*?)\]\]/g, function(match, whitespace, text) {
                var shown = text.replace(/^[!#]|["']/g, '').replace(/[_#]/g, ' '),
                    value = text.replace(/_/g, '/');
                return whitespace + buildTag(shown, value);
            });
            // find, replace absolute urls and email address
            if(!disableAutoLinks) {
                // find, replace absolute links
                markdown = markdown.replace(/(\s)(http[s]?:\/\/\S+?\.\S+?)\b/g, '$1<a href="$2" title="$2">$2</a>');
                // find, replace email addresses
                markdown = markdown.replace(/(\s)([^\s"\(\),:;<>@\[\]\\]+?\@\S+?\.\S+?)\b/g, '$1<a href="mailto:$2" title="$2">$2</a>');
            }
            //
            return markdown;
        },
        
        // === >> <h1><a></a></h1>
        // --- >> <h2><a></a><h2>
        // ### >> <h#><a></a><h#>
        headers: function(markdown, linkPrefix, disableAutoLinks) {
            var linkPrefix = (linkPrefix) ? linkPrefix : '',
                buildTag = function(hNum, name, content) {
                    if(disableAutoLinks) return '<h' + hNum + '>' + content + '</h' + hNum + '>';
                    return '<h' + hNum + '><a name="' + linkPrefix + name.replace(' ', '-').toLowerCase() + 
                        '" title="' + mrkdwn.util.asciiEncode(content) + '">' + content + '</a></h' + hNum + '>';
                };
            // find, replace ===
            markdown = markdown.replace(/(^|\n)([\S ]+?)\n===+\n/g, function(match, newline, content) {
                return newline + buildTag('1', content, content) + '\n';
            });
            // find, replace ---
            markdown = markdown.replace(/(^|\n)([\S ]+?)\n---+\n/g, function(match, newline, content) {
                return newline + buildTag('2', content, content) + '\n';
            });
            // find, replace #s
            markdown = markdown.replace(/(^|\n)(\#+)(\(\!(.*)?\))? ([\S ]+?)\n/g, function(match, newline, hashes, fullName, name, content) {
                if(name) return newline + buildTag(hashes.length, name, content) + '\n';
                return newline + buildTag(hashes.length, content, content) + '\n';
            });
            //
            return markdown;
        },
        
        /*
         *
        */
        
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
            regex = (regex) ? regex : /([^\w\s&#;])/g;
            return str.replace(regex, function(match, specialChar) {
                return '&#' + specialChar.charCodeAt() + ';';
            });
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






















