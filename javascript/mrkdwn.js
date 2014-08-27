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
            markdown = mrkdwn.markup.codesSamples(markdown);
            markdown = mrkdwn.markup.metas(markdown);
            markdown = mrkdwn.markup.escapedChars(markdown);
            markdown = mrkdwn.markup.comments(markdown);
            markdown = mrkdwn.markup.variables(markdown);
            markdown = mrkdwn.markup.abbreviations(markdown);
            markdown = mrkdwn.markup.images(markdown);
            markdown = mrkdwn.markup.macros(markdown);
            markdown = mrkdwn.markup.citations(markdown);
            markdown = mrkdwn.markup.notes(markdown);
            markdown = mrkdwn.markup.links(markdown);
            markdown = mrkdwn.markup.headers(markdown);
            markdown = mrkdwn.markup.horizontalRules(markdown);
            markdown = mrkdwn.markup.phraseFormattings(markdown);
            markdown = mrkdwn.markup.blockquotes(markdown);
            markdown = mrkdwn.markup.details(markdown);
            markdown = mrkdwn.markup.lists(markdown);
            //markdown = mrkdwn.markup.tables(markdown);
            //markdown = mrkdwn.markup.paragraphs(markdown);
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
        
        // --- >> <hr />
        // - - - >> <hr />
        horizontalRules: function(markdown) {
            // find, replace ---
            return markdown.replace(/((?:^|\n)\n) ?- ?- ?-[- ]*/g, '$1<hr />');
        },
        
        // *t*, **t**, ***t*** >> bold, strong, emphasis
        // ~t~, ~~t~~, ~~~t~~~ >> italic, strike, mark
        // ^t^, ^^t^^ >> superscript, subscript
        // _t_ >> underline
        phraseFormattings: function(markdown) {
            // find, replace emphasis, strong, bold
            markdown = markdown.replace(/(\*+)([^\*\s].*?)\1(?!\*)/g, function(match, asterisks, content) {
                if(asterisks.length === 1) {
                    return '<b>' + content + '</b>';
                } else if(asterisks.length === 2) {
                    return '<strong>' + content + '</strong>';
                } else if(asterisks.length === 3) {
                    return '<em>' + content + '</em>';
                }
                return match;
            });
            // find, replace mark, strike, italic
            markdown = markdown.replace(/(\~+)([^\~\s].*?)\1(?!\~)/g, function(match, tildes, content) {
                if(tildes.length === 1) {
                    return '<i>' + content + '</i>';
                } else if(tildes.length === 2) {
                    return '<strike>' + content + '</strike>';
                } else if(tildes.length === 3) {
                    return '<mark>' + content + '</mark>';
                }
                return match;
            });
            // find, replace subscript, superscript
            markdown = markdown.replace(/(\^+)([^\^\s].*?)\1(?!\^)/g, function(match, carets, content) {
                if(carets.length === 1) {
                    return '<sup>' + content + '</sup>';
                } else if(carets.length === 2) {
                    return '<sub>' + content + '</sub>';
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
            // TODO: better document this recursive nightmare
            // onMatch is recursivelly called
            var maxNest = 10, onMatch = function(match, whitespace, ender, fullCite, cite, content) {
                ender = (ender) ? '<!-- -->' : '';
                cite = (cite) ? ' cite="' + cite + '"' : '';
                whitespace = whitespace.replace(/[\t ]/g, ''); // make markup flat
                // if the blockquote content contains another valid blockquote syntax, recall onMatch on it
                if(content.search(/(\s)\>(.*)/g) > -1) {
                    content = content.replace(/(\s)\>(\>?)[ ]?(?!\>)(\! ?(.*))?(.*)/g, onMatch);
                }
                // return the whole mess back up 
                // main diffence between returns is to not include a newline with cite
                if(cite) return whitespace + '<blockquote' + cite + '>' + content + '\n</blockquote>' + ender;
                return whitespace + '<blockquote>\n' + content + '\n</blockquote>' + ender;
            }
            // find all of the first level >, optionally match first level >>, optionally match ! cite
            markdown = markdown.replace(/(\n)\>(\>?)[ ]?(?!\>)(\! ?(.*))?(.*)/g, onMatch);
            // as long as the extra (incorrect) ending and starting blockquote tags are found, remove them
            while(markdown.search(/<\/blockquote>(\s{0,2})<blockquote.*?>/g) > -1 && maxNest--) {
                markdown = markdown.replace(/\n<\/blockquote>(\s{0,2})<blockquote.*?>\n/g, '$1');
            }
            //
            return markdown;
        },
        
        // < >> details
        details: function(markdown) {
            // TODO: better document this recursive nightmare
            // onMatch is recursivelly called
            var maxNest = 10, onMatch = function(match, whitespace, ender, fullSummary, summary, content) {
                ender = (ender) ? '<!-- -->' : '';
                summary = (summary) ? '<summary>' + summary + '</summary>' : '';
                whitespace = whitespace.replace(/[\t ]/g, ''); // make markup flat
                // if the content contains another valid details syntax, recall onMatch on it
                if(content.search(/()\<(.*)/g) > -1) {
                    content = content.replace(/()\<(\<?)(?:(\! (.*))| )(.*)/g, onMatch);
                }
                // return the whole mess back up 
                return whitespace + '<details>\n' + summary + content + '\n</details>' + ender;
            }
            // find all of the first level <, optionally match first level <<, optionally match ! summary
            markdown = markdown.replace(/(\n)\<(\<?)(?:(\! (.*))| )(.*)/g, onMatch);
            // as long as the extra (incorrect) ending and starting details tags are found, remove them
            while(markdown.search(/<\/details>(\s{0,2})<details.*?>/g) > -1 && maxNest--) {
                markdown = markdown.replace(/\n<\/details>(\s{0,2})<details.*?>\n/g, '$1');
            }
            //
            return markdown;
        },
        
        // - >> <ul></ul>
        // #. >> <ol></ol>
        // : >> <dl></dl>
        lists: function(markdown) {
            // TODO: markup nested lists
            // TODO: markup task lists
            // find, replace ul and ol lists, treat everything as one level
            markdown = markdown.replace(/\n([\t ]*?)(\d+)?(-|\.)(-|\.)?(\<)? (.*)/g, function(match, space, number, marker, ender, accordian, content) {
                ender = (ender) ? '<!-- -->' : '';
                accordian = (accordian) ? ' class="accordian"' : '';
                //
                if(marker === '-') {
                    return '\n<ul>\n<li' + accordian + '>' + content + '</li>\n</ul>' + ender;
                } else {
                    number = (number)? ' start="' + number + '"' : '';
                    return '\n<ol' + number + '>\n<li' + accordian + '>' + content + '</li>\n</ol>' + ender;
                }
            });
            // find, replace dl lists, cannot be nested
            markdown = markdown.replace(/\n([\t ]*?)\:(\:)? (.*)/g, function(match, space, ender, content) {
                ender = (ender) ? '<!-- -->' : '';
                //
                if(space.length) {
                    return '\n<dl>\n<dd>' + content + '</dd>\n</dl>' + ender;
                } else {
                    return '\n<dl>\n<dt>' + content + '</dt>\n</dl>' + ender;
                }
            });
            // clean up first level lists
            markdown = markdown.replace(/\n<\/(?:ul|ol|dl)>(\s{0,2})<(?:ul|ol|dl).*?>\n/g, '$1');
            //
            return markdown;
        },
        
        // >> <table></table>
        tables: function(markdown) {
            // TODO: implement tables
        },
        
        // text followed by blank line >> <p></p>
        paragraphs: function(markdown) {
            // TODO: harden this very liquid attempt
            markdown = '\n' + markdown + '\n\n';
            // find, markup paragraphs
            markdown = markdown.replace(/\n([^\n][\S\s]+?)(?=\n\n)/g, function(match, content) {
                if(content.search(/^<\/?(ul|ol|li|h|p|bl)/) > -1) {
                    return match;
                }
                return '\n<p>' + content.replace(/\n/g, '<br />') + '</p>';
            });
            //
            return markdown.substring(1, markdown.length - 2);
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






















