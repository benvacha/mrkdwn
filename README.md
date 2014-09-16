[![mrkdwn](http://mrkdwn.org/brand/logo.png)](http://mrkdwn.org)

One Markdown To Rule Them All

**mrkdwn** combines the [original markdown specification](http://daringfireball.net/projects/markdown/) created by John Gruber, the latest and greatest flavors of markdown, various other lightweight markup languages, and new syntax for semantic notation and improved machine readability. **mrkdwn** seeks to provide the most complete set of syntax while considering both backward compatibility and future need. While **mrkdwn** may stray from full backward compatability, it is with the goal of improving speed, usability, and readability.

**mrkdwn**'s ultimate goal is to the be the one markdown to rule them all, the one markdown to bring them all and in the darkness bind them. With this in mind, **mrkdwn** will work to provide translation packages in all major languages. **mrkdwn** will also provide GUI packages for live editing, including syntax highlighting, real time output, and media management.

Try the live demo at [http://mrkdwn.org](http://mrkdwn.org)

---

Table of Contents
-----------------

- [Syntax Cheatsheet](#syntax-cheatsheet)
- [Full Syntax](#full-syntax)
- [Javascript Implementation](#javascript-implementation)
  - [NodeJS Usage](#nodejs-usage)
  - [Web Usage](#web-usage)
  - [Live Usage](#live-usage)
  - [Javascript Implementation Status](#javascript-implementation-status)

---

Syntax Cheatsheet
-----------------

| description | mrkdwn example |
| ----------- | -------------- |
| [escaped characters](#escaped-characters) | `\*` |
| [comment mrkdwn](#comments) | `/// text ///` |
| [comment html](#comments) | `///! text ///` |
| [bold](#phrase-formattings) | `*text*` |
| [strong](#phrase-formattings) | `**text**` |
| [emphasis](#phrase-formattings) | `***text***` |
| [italic](#phrase-formattings) | `~text~` |
| [strikethrough](#phrase-formattings) | `~~text~~` |
| [mark](#phrase-formattings) | `~~~text~~~` |
| [superscript](#phrase-formattings) | `^text^` |
| [subscript](#phrase-formattings) | `^^text^^` |
| [underline](#phrase-formattings) | `_text_` |
| [header auto link](#headers) | `# text` |
| [header manual link](#header) | `#(!anchor) text` |
| [horizontal rule](#horizontal-rules) | `---` |
| [blockquote cite](#blockquotes) | `>! cite` |
| [blockquote content](#blockquotes) | `> text` |
| [details summary](#details) | `<! cite` |
| [details content](#details) | `< text` |
| [list unordered](#unordered-lists) | `- text` |
| [list ordered](#ordered-lists) | `1. text` |
| [list task unchecked](#task-lists) | `- [ ] text` |
| [list task checked](#task-lists) | `- [x] text` |
| [list accordian](#accordian-lists) | `-< text` |
| [list definition term](#definition-lists) | `: text` |
| [list definition definition](#definition-lists) | `  : text` |
| [span](#spans) | `[text]` |
| [span class](#spans) | `[text]<class>` |
| [link url](#links) | `[text](url title)` |
| [link anchor](#links) | `[text](!anchor title)` |
| [link reference definition](#links) | `[reference]: url title` |
| [link reference usage](#links) | `[text][reference]` |
| [link reference usage short](#links) | `[reference][]` |
| [link auto url](#links) | `[[url]]` |
| [link auto email](#links) | `[[email]]` |
| [link auto parsed](#links) | `[[[url_to_parse]]]` |
| [image simple](#images) | `![text](url width height)` |
| [image reference definition](#images) | `![reference]: url width height` |
| [image reference usage](#images) | `![text][reference]` |
| [image reference usage short](#images) | `![reference][]` |
| [macro simple](#macros) | `%[text](macro args)` |
| [macro reference definition](#macros) | `%[reference]: macro args` |
| [macro reference usage](#macros) | `%[text][reference]` |
| [macro reference usage short](#macros) | `%[reference][]` |
| [citation definition](#citations) | `@[reference]: type args` |
| [citation usage](#citations) | `@[reference]` |
| [citation usage short](#citations) | `@reference` |
| [note definition](#notes) | `&[reference]: note` |
| [note usage](#notes) | `&[reference]` |
| [note usage short](#notes) | `&reference` |
| [variable definition](#variables) | `$[reference]: value` |
| [variable usage](#variables) | `$[reference]` |
| [variable usage short](#variables) | `$reference` |
| [abbreviation definition](#abbreviations) | `+[abbreviation]: text` |
| [inline code](#inline-codes) | &#96;text&#96; |
| [inline sample](#inline-samples) | &#96;!text&#96; |
| [block code](#block-pre-codes) | &#96;&#96;&#96; syntax text &#96;&#96;&#96; |
| [block sample](#block-pre-samples) | &#96;&#96;&#96;! syntax text &#96;&#96;&#96; |
| [table row](#tables) | &#124; text &#124; text &#124; |
| [meta mrkdwn](#metas) | `{{{ text }}}` |
| [meta comment](#metas) | `{{{! text }}}` |
| [class](#classes) | `<class-one class-two>` |

---

Full Syntax
-----------

- [Escaped Characters](#escaped-characters)
- [Comments](#comments)
- [Paragraphs](#paragraphs)
- [Phrase Formattings](#phrase-formattings)
- [Headers](#headers)
- [Horizontal Rules](#horizontal-rules)
- [Blockquotes](#blockquotes)
- [Details](#details)
- [Unordered Lists](#unordered-lists)
- [Ordered Lists](#ordered-lists)
- [Task Lists](#task-lists)
- [Accordian Lists](#accordian-lists)
- [Definition Lists](#definition-lists)
- [Nested Lists](#nested-lists)
- [Links](#links)
- [Automatic Links](#automatic-links)
- [Images](#images)
- [Macros](#macros)
- [Citations](#citations)
- [Notes](#notes)
- [Variables](#variables)
- [Abbreviations](#abbreviations)
- [Inline Codes](#inline-codes)
- [Block Pre Codes](#block-pre-codes)
- [Inline Samples](#inline-samples)
- [Block Pre Samples](#block-pre-samples)
- [Tables](#tables)
- [Metas](#metas)
- [Spans](#spans)
- [Classes](#classes)

### Escaped Characters
- Any non whitespace character can be escaped with `\` to markup the ascii representation and remove its mrkdwn meaning.
- Applied to escaped characters anywhere, without exception. Including pre and comments.

###### mrkdwn
```
\*Actual asterisk surrounded text\*
```
###### markup
```
&#42;Actual asterisk surrounded text&#42;
```


### Comments
- Pairs of three or more `/` will be removed from markup.
- Pairs of three or more `/` with a `!` will be markuped to a html comment.
- Can be applied inline or block.
- Pairs of n or more `/` can be used to comment n - 1 `/`
- Applied anywhere, without exception

###### mrkdwn
```
Hide /// the comment /// from this sentence.

///
Hide this block.
///

Put in a ///! comment ///

///!
Comment block
///

Comment out three //// /// //// slashes
```
###### markup
```
Hide  from this sentence.


Put in a <!-- comment -->

<!--
Comment Block
-->

Comment out three  slashes
```


### Paragraphs
- Text preceeded and proceeded by a blank line or block syntax will be wrapped in a paragraph.
- Line returns without following whitespace will be treated as breaks within a single paragraph.
- Text within pre block syntax or comment syntax should not be markuped.
- A blank line is a line that appears to be blank. This includes lines with no characters, lines with only spaces and tabs, and the start and end of a file.
- Note: diverges from daringfireball by not allowing "hard-wrapped" text paragraphs.

###### mrkdwn
```
The first paragraph

This is one paragraph
with a manual break inserted
```
###### markup
```
<p>
The first paragraph
</p>

<p>
This one paragraph
<br />
with a manual break inserted
</p>
```


### Phrase Formattings
- Phrase formatting can be nested inside of any other syntax, except code or sample blocks.
- Phrase formatting is only translated when both starting and ending syntax is found in the same line.
- Phrase formatting can be inside of words, with the exception of underline.
- Opening phrase formatting proceeded by whitespace and closing phrase formatting preceeded by whitespace will not be translated as phrase formatting.
- Note: diverges almost completely from daringfireball.

###### mrkdwn
```
*bold*  **strong**  ***emphasis***
~italic~  ~~strikethrough~~  ~~~mark~~~~
~*italic bold*~
^superscript^  ^^subscript^^
_underline_
some_file_name
some_file_ name
put a * in the **
```
###### markup
```
<em>emphasis</em>  <b>bold</b>  <strong>strong</strong>
<i>italic</i>  <mark>mark</mark>  <strike>strikethrough</strike>
<i><b>italic bold</b></i>
<sup>superscript</sup>  <sub>subscript</sub>
<u>underline</u>
some_file_name
some_file_ name
put a * in the **
```


### Headers
- Lines of text with 3 or more `=` alone on the proceeding line will be markuped to h1 tags.
- Lines of text with 3 or more `-` alone on the proceeding line will be markuped to h2 tags.
- Lines of text beginning with 1 or more `#` will be markuped to h tags with level indicated by the number of `#`.
- Headers are automatically given internal anchor links based on header text, or can be manually defined.
- Headers with identical header text will be given unique numbered anchors based on header text.
- Note: diverges from daringfireball by not markuping trailing `#`.

###### mrkdwn
```
Header 1
========

Header 2
--------

# Header 1

## Header 2

### Header 3

#### Header 4

##### Header 5

###### Header 6

##(!anchor) Header 2
```
###### markup
```
<h1><a name="header-1">Header 1</a></h1>

<h2><a name="header-2">Header 2</a></h2>

<h1><a name="header-1">Header 1</a></h1>

<h2><a name="header-2">Header 2</a></h2>

<h3><a name="header-3">Header 3</a></h3>

<h4><a name="header-4">Header 4</a></h4>

<h5><a name="header-5">Header 5</a></h5>

<h6><a name="header-6">Header 6</a></h6>

<h2><a name="anchor">Header 2</a></h2>
```


### Horizontal Rules
- Three or more `-` or `*` on a line, alone, will create a horizontal rule. 
- `-` and `*` may be seperated by spaces.

###### mrkdwn
```
---

- - - - - - - -

*********

 * * * * *
```
###### markup
```
<hr />

<hr />

<hr />

<hr />
```


### Blockquotes
- Blockquotes can be nested as needed and can contain any other syntax.
- All lines of a blockquote must begin with `>`.
- `>>` can be used to signify the end of a blockquote, including nested blockquotes, to avoid translation errors.
- One are more blank lines between blockquote lines will markup the lines as difference blockquotes.
- Blockquotes can be nested a max of 10 times.
- Note: diverges from daringfireball by requiring that all lines of a blockquote be preceeded by `>`.

###### mrkdwn
```
> Paragraph one
> 
>> Second paragraph

>! cite 
> Block Quote
>> with citation

> level one
> >! cite
> > level two
> > also level two
> back on level one
> >> level two again
> > level two, but not the same as the above line
```
###### markup
```
<blockquote>
<p>
Paragraph one
</p>
<p>
Second paragraph
</p>
</blockquote><!-- -->

<blockquote cite="cite">
<p>
Block Quote<br />
with citation
</p>
</blockquote><!-- -->

<blockquote>
<p>
level one
</p>
<blockquote cite="cite">
<p>
level two<br />
also level two
</p>
</blockquote>
<p>
back on level two
</p>
<blockquote>
<p>
level two again
</p>
</blockquote><!-- -->
<blockquote>
<p>
level two, but not the same as the above live
</p>
</blockquote>
</blockquote>
```


### Details
- The first line of a details must include `!` and will always be used as its summary.
- All lines of a details must begin with `<`.
- `<<` can be used to signify the end of a details, including nested details, to avoid translation errors. 
- One are more blank lines between details lines will markup the lines as difference details.
- Detail blocks can be nested up to 10 times and can contain any other syntax.

###### mrkdwn
```
<! summary
< Paragaph One
<
< Second Paragraph
```
###### markup
```
<details>
<summary>summary</summary>
<p>
Paragraph One
</p>
<p>
Second Paragraph
</p>
</details>
```


### Unordered Lists
- A `- `, `* `, or `+ ` followed by text will be markuped to an unordered lists. 
- Multiple line list items will be translated into paragraphs.
- Lists should be followed by two or more blankish lines to signify the list end.
- Two or more blankish lines between list items will be markuped as two seperate lists.
- `--` can be used to signify the end of a list to prevent translation errors.

###### mrkdwn
```
- Item
- Item
- Item


* Item

* Item
   
  With a second paragraph
* Item
```
###### markup
```
<ul>
<li>Item</li>
<li>Item</li>
<li>Item</li>
</ul>


<ul>
<li>
<p>
Item
</p>
</li>
<li>
<p>
Item
</p>
<p>
With a second paragraph
</p>
</li>
<li>Item</li>
</ul>
```


### Ordered Lists
- Numbering does not need to be unique or sequential.
- The first number will be used as the starting value of the list.
- Multiple line list items will be translated into paragraphs.
- Lists should be followed by two or more blankish lines to signify the list end.
- Two or more blankish lines between list items will be markuped as two seperate lists.
- A number with `..` instead of `.` can be used to signify the end of a list to prevent translation errors.

###### mrkdwn
```
1. One
2. Two
3. Three


50. Fifty
34. Fifty One
34. Fifty Two
```
###### markup
```
<ol>
<li>One</li>
<li>Two</li>
<li>Three</li>
</ol>


<ol start="50">
<li>Fifty</li>
<li>Fifty One</li>
<li>fifty Two</li>
</ol>
```


### Task Lists
- Task lists can be used with ordered or unordered lists, and follow their respective syntax.

###### mrkdwn
```
- [ ] Task 1
- [x] Task 2
- [ ] Task 3
  1. [x] Sub Task 1
  2. [x] Sub Task 2
  3. [ ] Sub Task 3
```
###### markup
```
<ul>
<li><input type="checkbox" /> Task 1</li>
<li><input type="checkbox" checked /> Task 2</li>
<li><input type="checkbox" /> Task 3
<ol>
<li><input type="checkbox" checked /> Sub Task 1</li>
<li><input type="checkbox" checked /> Sub Task 2</li>
<li><input type="checkbox" /> Sub Task 3</li>
</ol>
</li>
</ul>
```


### Accordian Lists
- Accordians can be used with ordered or unordered lists, and follow their respective syntax.
- Accordian effect requires CSS.

###### mrkdwn
```
-< Visible
  - Hidden
- Item
  1.< Visible
    - Hidden
  2. Item
```
###### markup
```
<ul>
<li class="accordian">Visible
<ul>
<li>Hidden</li>
</ul>
</li>
<li>Item
<ol>
<li class="accordian">Visible
<ul>
<li>Hidden</li>
</ul>
</li>
</ol>
</li>
</ul>
```


### Definition Lists
- `:` with no preceeding whitespace, will be markuped to a definition term.
- `:` with any number of preceeding whitespaces, will be markuped to a definition definition. 
- A term may have multiple definitions.
- Multiple line list items will be translated into paragraphs.
- Lists should be followed by two or more blankish lines to signify the list end.
- Two or more blankish lines between list items will be markuped as two seperate lists.
- `::` can be used to signify the end of a list to prevent translation errors.

###### mrkdwn
```
: Term One
  : Definition
: Term Two
  : Definition One
  
    With a second paragraph.
  : Definition Two
```
###### markup
```
<dl>
<dt>Term One</dt>
<dd>Definition</dd>
<dt>Term Two</dt>
<dd>
<p>
Definition One
</p>
</dd>
<dd>Definition Two</dd>
</dl>
```


### Nested Lists
- All list types may be nested in each other.

###### mrkdwn
```
- Item
  1. One
  2. Two
- Item
  - Sub Item
    1. One
    2. Two
- Item
```
###### markup
```
<ul>
<li>Item
<ol>
<li>One</li>
<li>Two</li>
</ol>
</li>
<li>Item
<ul>
<li>Sub Item
<ul>
<li>One</li>
<li>Two</li>
</ul>
</li>
</ul>
<li>
<li>Item</li>
</ul>
```


### Links
- `[linked text](url title)` will be markuped to a tags.
- `[linked text][linkReference]` will be markuped to a tags.
- `[[url]]` or `[[email]]` will be markuped to a tags.
  - Must contain atleast one non-whitespace character
- `[[[url]]]` or `[[[email]]]` will be parsed on `_` and will be markuped to a tags.
  - Must contain atlease one non-whitespace character
- `[linkReference]: url title` will be removed from markup, but used to define a link reference.
  - Must be at start of new line.
- Links must be preceeded by whitespace or line start.
- Urls can be absolute or relative, and will be automatically uri encoded.
- Urls containing whitespace should be wrapped in single or double quotes.
- Emails are automatically markuped to ascii decimal encoding.
- Urls beginning with `!` will define an anchor.
- Urls beginning with `#` will link to an anchor.
- Title is optional, and linked text will be used if not explicitly defined.
- Note: diverges from daringfireball by not allowing `()` to surround titles.
- Note: diverges from daringfireball by not allowing multi-line references.
- Note: diverges from daringfireball by using `[[]]` instead of `<>` for automatic links.

###### mrkdwn
```
[text](url)
[text](url "Title")

[text](!anchor title)
[text](#anchor "long title")

[text][reference]
[reference]: url 'long title'

[[url]]
[[[auto_parsed_url]]]
[[!anchor]]
[[#anchor]]
[[[parsed_url#anchor]]]
```
###### markup
```
<a href="url">text</a>
<a href="url" title="Title">text</a>

<a name="anchor" title="title">text</a>
<a href="#anchor" title="long title">text</a>

<a href="url" title="long title">text</a>

<a href="url">url</a>
<a href="auto/parsed/url">auto parsed url</a>
<a name="anchor">anchor</a>
<a href="#anchor">anchor</a>
<a href="parsed/url#anchor">parsed url anchor</a>
```


### Automatic Links
- Absolute urls and email addresses will be automatically markuped to a tags.
- Links must be preceeded by whitespace.
- Urls are automatically url encoded.
- Emails are automatically ascii decimal encoded.

###### mrkdwn
```
Go to index.html
Go to http://url.com
Email addr@email.com
```
###### markup
```
Go to index.html
Go to <a href="http://url.com">http://url.com</a>
Email <a href="mailto:&#97;&#100;&#100;&#114;&#64;&#101;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;" title="&#97;&#100;&#100;&#114;&#64;&#101;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;">&#97;&#100;&#100;&#114;&#64;&#101;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;</a>
```


### Images
- `![alt text](url title class width height)` will be markuped to img tags.
- `![alt text][imageReference]` will be markuped to img tags.
- `![imageReference]: url title class width height` will be removed from markup, but will define an image.
- urls can be absolute or relative.
- title, class, width, and height are optional.
- Usage of an undefined imageReference will be markuped to img tags with only alt text.

###### mrkdwn
```
![alt text](url title)
![alt text](url "Title" bordered 350px 100%)
![alt text](url '' '' 100%)

![alt text][reference]
![reference]: url "Title Long" class width height
```
###### markup
```
<img src="url" title="title" alt="alt text" />
<img src="url" title="Title" class="bordered" alt="alt text" width="350px" height="100%" />
<img src="url" alt="alt text" width="100%" />

<img src="url" title="Title Long" class="class" alt="alt text" width="width" height="height" />
```


### Macros
- `%[alt text](macro arg1 ...)` will be markuped depending on the macro.
- `%[alt text][macroReference]` will be markuped depending on the macro.
- `%[macroReference]: macro arg1 ...` will be removed from markup, but will define a macro.
- Macros can be used to embed video, other media, or custom markups.
- Usage of an undefined or invalid macroReference will be markuped to the alt text.
- The first argument must be the macro name. 
- Any number and type of arguments can be included after the first argument depending on the macro.

###### mrkdwn
```
%[alt text](macro arg1 arg2 arg3 ...)

%[alt text][reference]
%[reference]: macro arg1 arg2 arg3 arg4
```
###### markup
```
varied based on macro

varied based on macro
```


### Citations
- `@[citationReference]` will be markuped to a superscript numbered anchor linked to the citation in page.
- `@citationReference` will be markuped to a superscript numbered anchor linked to the citation in page.
- `@[citationReference]: type arg1 ...` will be markuped depending on type, and will define a citation.
- Citation references must be placed together in the document where they should be displayed and will be translated as a list. 
- Citation reference names must begin with an alphanumeric character, contain no spaces, and are case sensative. 
- Citations are automatically numbered based on list order. 
- Any number and type of arguments can be included after the first argument depending on the citation type.
- If the first argument in a citation reference is a known type of citation its arguments will be used to autoformat a citation in MLA. 
- If the first argument is not a known citation type, the string will be used directly.

###### mrkdwn
```
This sentence is from something trustworthy @[refOne]. 
This sentence is way less trustworthy @refTwo.

@[refOne]: type arg1 arg2
@[refTwo]: type arg1 arg2 arg3
@[refThree]: A preformated citation
```
###### markup
```
This sentence is from something trustworthy<sup class="citation"><a href="#cite-1" title="bibliography">1</a></sup>. 
This sentence is way less trustworthy<sup class="citation"><a href="#cite-2" title="bibliography">2</a></sup>.

<ol>
  <li><a name="cite-1">bibliography based on type</a></li>
  <li><a name="cite-2">bibliography based on type</a></li>
  <li><a name="cite-3">A preformatted citation</a></li>
</ol>
```


### Notes
- `&[noteReference]` will be markuped to a superscript numbered anchor linked to the note in page.
- `&noteReference` will be markuped to a superscript numbered anchor linked to the note in page.
- `&[noteReference]: note text` will be markuped as a list, and will define a citation.
- Note references must be placed together in the document where they should be displayed and will be translated as a list.
- Note reference names must begin with an alphanumeric character, contain no spaces, and are case sensative. 
- Notes are automatically numbered based on list order.

###### mrkdwn
```
This sentence needs a note &[refOne]. 
This sentence also needs a note &refTwo. 
This sentence gets a fancy note &[refTwo].

&[refOne]: note text
&[refTwo]: note text
```
###### markup
```
This sentence needs a note<sup class="note"><a href="#note-1" title="note text">1</a></sup>. 
This sentence also needs a note<sup class="note"><a href="#note-2" title="note text">2</a></sup>.

<ol>
  <li><a name="note-1">note text</a></li>
  <li><a name="note-2">note text</a></li>
</ol>
```


### Variables
- `$[variableName]` will be markuped to the variable value, or variable name if definition not found.
- `$[variableName]: variable value` will be removed from markup, but used to define a variable.
- Variable definitions can be anywhere in the markdown and will be markuped before any variable usage.
- Variable definitions are case sensative.
- Duplicate variable definitions will overwrite previous values.

###### mrkdwn
`Current version $[variable]`  
`$[variable]: value`
###### markup
```
Current version value
```


### Abbreviations
- Defined abbreviations used in text are automatically markuped and do not need special markdown.
- `$[abbreviation]: full` will be removed from markup, but used to define an abbreviation.
- Abbreviation definitions can be anywhere in the markdown and will be markuped before any usage.
- Abbreviation definitions are case sensative and can contain multiple words and spaces.
- Duplicate abbreviation definitions will overwrite previous values.

###### mrkdwn
```
The HTML specification
The Primary Standard is good

+[HTML]: Hyper Text Markup Language
+[Primary Standard]: Main Standard
```
###### markup
```
The <abbr title="Hyper Text Markup Language">HTML</abbr> specification
The <abbr title="Main Standard">Primary Standard</abbr> is good
```


### Inline Codes
- Pairs of one or more backticks on the same line will be markuped to code tags. 
- Pairs of n backticks can contain groups of less than n backticks.
- All special characters are markuped to their ascii representation.
- Must contain at least one whitespace or non backtick character.

###### mrkdwn
```
The `<body></body>` tags
Encase `` `ticks` ``
```
###### markup
```
The <code>&lt;body&gt;&lt;/body&gt;</code> tags
Encase <code> &#96;ticks&#96; </code>
```


### Block Pre Codes
- Pairs of three or more backticks at the start of a line and not on the same line will be markuped to pre and code tags. 
- Pairs of n backticks can contain groups of less than n backticks.
- All special characters are markuped to their ascii representation.
- Text on the same line as the opening backticks will be markuped as class on the code tag.

###### mrkdwn
```
'''
<body></body>
'''
  
'''' syntax
<body></body>
''''
```
###### markup
```
<pre><code>
&lt;body&gt;&lt;/body&gt;
</code></pre>

<pre><code class="syntax">
&lt;body&gt;&lt;/body&gt;
</code></pre>
```


### Inline Samples
- Pairs of one or more backticks on the same line with a `!` will be markuped to samp tags. 
- Pairs of n backticks can contain groups of less than n backticks.
- All special characters are markuped to their ascii representation.
- Must contain at least one whitespace or non backtick character.

###### mrkdwn
```
The `!<body></body>` tags
Encase ``! `ticks` ``
```
###### markup
```
The <samp>&lt;body&gt;&lt;/body&gt;</samp> tags
Encase <samp> &#96;ticks&#96; </samp>
```


### Block Pre Samples
- Pairs of three or more backticks with a `!` at the start of a line and not on the same line will be markuped to pre and samp tags. 
- Pairs of n backticks can contain groups of less than n backticks.
- All special characters are markuped to their ascii representation.
- Text on the same line as the opening backticks will be markuped as class on the samp tag.

###### mrkdwn
```
'''!
> Output from a bash script
'''

'''''! syntax
sample output
'''''
```
###### markup
```
<pre><samp>
&gt; Output from a bash script
</samp></pre>

<pre><samp class="syntax">
sample output
</samp></pre>
```


### Tables
- Tables must have preceeding and proceeding `|`.
- Column text lengths do not need to be equal between columns or rows.

###### mrkdwn
```
| Header One | Header Two |
| ---------- | ---------- |
| Content    | Content    |

| Left | Center | Right |
| :--- | :----: | ----: |
| Content    |   Content  |    Content |
```
###### markup
```
<table>
  <thead>
    <tr>
      <th>Header One</th>
      <th>Header Two</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content</td>
      <td>Content</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th>Left</th>
      <th>Center</th>
      <th>Right</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="left">Content</td>
      <td align="center">Content</td>
      <td align="right">Content</td>
    </tr>
  </tbody>
</table>
```


### Metas
- `{{{ }}}` will be treated as meta data (sematic data) and can be retrieved and used for machine magic.
- `{{{ }}}` will be removed from markup and not parsed.
- `{{{! }}}` will be parsed and markuped as an html comment.
- Meta can be used inline or block.
- Applied anywhere, without exception.
- Meta parser
  - `( )` can be used to define an array. 
  - `[ ]` can be used to define a json-ish data structure. 
  - Whitespace is used for parsing and is otherwise ignored.

###### mrkdwn
```
{{{ pageTitle "The page title" }}}
{{{ author (
  [
    first: "Author",
    last: "One",
    role: "Contributor"
  ],
  [
    first: "Author",
    last: "Two",
    role: "Editor"
  ]
) }}}
{{{ backPage url }}}
{{{ nextPage url }}}
{{{ siblings (Sibling One, Sibling Two) }}}
{{{ isA Object url }}}
{{{ hasA Object url }}}
```
###### markup
```

```


### Spans
- `[text]` will be markuped to a span tag.
- Spans can be on multiple lines.
- Spans can be used inside any other syntax.
- Spans can be used within words.
- Spans are primarily used with class syntax.

###### mrkdwn
```
Put a span [around this text].

something[SpannedUp]<class>.
```
###### markup
```
Put a span <span>around this text</span>

something<span class="class">SpannedUp</span>.
```


### Classes
- `<class>` can be added to any other syntax to add a css class to its markup.
- Classes can define more than one class.

###### mrkdwn
```
#<class> Header

---<class>

-<class> Item
- Item

[linked text](url title)<classOne classTwo>

How about [some styled text]<class>!
```
###### markup
```
<h1 class="class"><a name="header">Header</a></h1>

<hr class="class" />

<ul class="class">
<li>
Item
</li>
<li>
Item
</li>
</ul>

<a href="url" title="title" class="classOne classTwo">linked text</a>

How about <span class="class">some styled text</span>!
```

---

Javascript Implementation
-------------------------

### NodeJS Usage
**mrkdwn** can be imported and used as a module in Node.JS. The module has access to all methods in mrkdwn.

###### javascript
```
var mrkdwn = require('pathtofile/mrkdwn.js'),
    mrkdwnString = from_an_API_or_other_source,
    markupString = mrkdwn.markup.all(mrkdwnString);
```

### Web Usage
**mrkdwn** can be used to perform a one-time translation on a string. It is possible to only perform a subset of available markups, but the below example shows using all markups.

###### html
```
<head>
  <script type="text/javascript" src="pathtofile/mrkdwn.js"></script>
```
###### javascript
```
var mrkdwnString = from_an_API_or_other_source,
    markupString = mrkdwn.markup.all(mrkdwnString);
```

### Live Usage
**mrkdwn**, when used in the browser, contains functionality to enable editing with live markup and live preview. Input from the markdown textarea is read on initiation and input change, markuped for all syntax, and output to the markup textarea and or preview element.

###### html
```
<textarea id="markdown"></textarea>
<textarea id="markup" disabled></textarea>
<div id="preview"></div>
```
###### javascript
```
// get the elements
var markdownTextarea = document.getElementById('markdown'),
    markupTextarea = document.getElementById('markup'),
    previewElement = document.getElementById('preview');
// start live markup and output
// will markup and ouput on init
mrkdwn.live.markup(markdownTextarea, markupTextarea, previewElement);

// markupTextarea can be omitted if not needed or used
// mrkdwn.live.markup(markdownTextarea, null, previewElement);

// previewElement can be omitted if not needed or used
// mrkdwn.live.markup(markdownTextarea, markupTextarea);

```

### Javascript Implementation Status
These are observed implementation state, errata, bugs, and future plans for the javascript (node) implementation of mrkdwn. All of these will be resolved as soon as possible.

- Lists cannot be nested.
  - Nested lists are markuped as a single level.
  - Differing list types interfere when nested.
- Task Lists are not implemented.
- Classes are not universally implemented.
- Tables are not implemented.
- Metas are barely implemented.
  - Does not do any parsing.
  - Does not insert comment.
- Blank image syntax markups button for file browser in live.
- Blank link syntax markups button for file browser in live.
















