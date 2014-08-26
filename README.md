mrkdwn
======

One Markdown To Rule Them All

**mrkdwn** combines the original markdown specification created by John Gruber, the latest and greatest flavors of markdown, and new syntax for semantic notation and improved machine readability. **mrkdwn** seeks to provide the most complete set of syntax while considering both backward compatibility and future need. While **mrkdwn** may stray from full backward compatability, it is with the goal of improving speed, reliability, and readability.

**mrkdwn**'s ultimate goal is to the be the one markdown to rule them all, the one markdown to bring them all and in the darkness bind them. With this in mind, **mrkdwn** will work to provide translation packages in all major languages as well as GUI packages for live editing, including syntax highlighting and real time output.

---

Proposed Syntax
---------------

### Backslash Escaped Characters
* Any non whitespace character can be escaped with `\` to markup the ascii representation and remove its mrkdwn meaning.
* Applied to escaped characters anywhere, without exception.

##### mrkdwn
```
\*Actual asterisk surrounded text\*
```
##### markup
```
&#42;Actual asterisk surrounded text&#42;
```

### Comments
* Pairs of three or more `/` will be removed from markup.
* Pairs of three or more '/' with a '!' will be markuped to a html comment.
* Can be applied inline or block.
* Pairs of n or more '/' can be used to comment n - 1 '/'
* Applied anywhere, without exception

##### mrkdwn
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
##### markup
```
Hide  from this sentence.


Put in a <!-- comment -->

<!--
Comment Block
-->

Comment out three  slashes
```

### Paragraphs
Text followed by a blank line or block syntax will be wrapped in a paragraph. Line returns without following whitespace will be treated as breaks within a single paragraph.
##### mrkdwn
```
The first paragraph

This is one paragraph
with a manual break inserted
```
##### html
```
<p>The first paragraph</p>

<p>This one paragraph<br />
with a manual break inserted</p>
```

### Phrase Formatting
Phrase formatting can be nested inside of any other syntax, except code or sample blocks. Phrase formatting is only translated when both starting and ending syntax is found in the same paragraph. Phrase formatting can be inside of words, with the exception of underline. Opening phrase formatting followed by whitespace will not be translated as phrase formatting.
##### mrkdwn
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
##### html
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
* Headers are automatically given internal anchor links based on header text, or can be manually defined.
* Trailing `#` will not be translated.

##### mrkdwn
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
##### markup
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
Three or more `-` on a line, alone, preceeded by a blank line, will create a horizontal rule. '*' are not valid horizontal rule syntax.
##### mrkdwn
```
---
- - - - - - - -
```
##### html
```
<hr>
<hr>
```

### Blockquote
Blockquotes can be nested as needed and can contain any other syntax. `>>` can be used to signify the end of a blockquote, including nested blockquotes, to avoid translation errors. Blockquotes can be nested a max of 10 times.
##### mrkdwn
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
##### html
```
<blockquote>
  <p>Paragraph one</p>
  <p>Second paragraph</p>
</blockquote>&nbsp;

<blockquote cite="cite">
  <p>Block Quote<br />
  with citation</p>
</blockquote>&nbsp;

<blockquote>
  <p>level one</p>
  <blockquote cite="cite">
    <p>level two<br />
    also level two</p>
  </blockquote>
  <p>back on level two</p>
  <blockquote>
    <p>level two again</p>
  </blockquote>&nbsp;
  <blockquote>
    <p>level two, but not the same as the above live</p>
  </blockquote>
</blockquote>
```

### Details
The first line of a details must include `!` and will always be used as its summary. `<<` can be used to signify the end of a details, including nested details, to avoid translation errors. Detail blocks can be nested up to 10 times and can contain any other syntax.
##### mrkdwn
```
<! summary
< Paragaph One
<
< Second Paragraph
```
##### html
```
<details>
  <summary>summary</summary>
  <p>Paragraph One</p>
  <p>Second Paragraph</p>
</details>
```

### Unordered List
Unordered lists must be denoted using `-`, `*` and `+` will not be translated to unordered lists. Multiple line list items will be translated into paragraphs. `--` can be used to signify the end of a list to prevent translation errors.
##### mrkdwn
```
- Item
- Item
-- Item

- Item

- Item
   
   With a second paragraph
-- Item

```
##### html
```
<ul>
  <li>Item</li>
  <li>Item</li>
  <li>Item</li>
</ul>

<ul>
  <li>
    <p>Item</p>
  </li>
  <li>
    <p>Item</p>
    <p>With a second paragraph</p>
  </li>
  <li>
    <p>Item</p>
  </li>
</ul>
```

### Ordered List
Numbering does not need to be unique or sequential. The first number will be used as the starting value of the list. Multiple line list items will be translated into paragraphs. A number with `..` instead of `.` can be used to signify the end of a list to prevent translation errors.
##### mrkdwn
```
1. One
2. Two
3.. Three

50. Fifty
34. Fifty One
25. Fifty Two
```
##### html
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

### Task List
Task lists can be used as ordered or unordered lists, and follow their respective syntax.
##### mrkdwn
```
- [ ] Task 1
- [x] Task 2
- [ ] Task 3
  1. [x] Sub Task 1
  2. [x] Sub Task 2
  3. [ ] Sub Task 3
```
##### html
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

### Accordian List
Accordians can be used on ordered or unordered lists, and follow their respective syntax.
##### mrkdwn
```
-< Visible
  - Hidden
- Item
  1.< Visible
    - Hidden
  2. Item
```
##### html
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

### Definition List
A term may have multiple definitions. Multiple line list items will be translated into paragraphs.
##### mrkdwn
```
: Term One
  : Definition
: Term Two
  : Definition One
  : Definition Two
```
##### html
```
<dl>
  <dt>Term One</dt>
    <dd>Definition</dd>
  <dt>Term Two</dt>
    <dd>Definition One</dd>
    <dd>Definition Two</dd>
</dl>
```

### Nested Lists
All list types may be nested in each other.
##### mrkdwn
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
##### html
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
* `[linked text](url title)` will be markuped to a tags.
* `[linked text][linkReference]` will be markuped to a tags.
* `[url]` or `[email]` will be markuped to a tags.
  * Must contain atleast one non-whitespace character
* `[[url]]` or `[[email]]` will be parsed on `_` and will be markuped to a tags.
  * Must contain atlease one non-whitespace character
* `[linkReference]: url title` will be removed from markup, but used to define a link reference.
  * Must be at start of new line.
  * Cannot be on first line.
* Links must be surrounded by whitespace, and cannot be at the start of the first line or end of the last line.
* Urls can be absolute or relative, and will be automatically uri encoded.
* Urls containing whitespace should be wrapped in quotes.
* Urls beginning with `!` will define an anchor.
* Urls beginning with `#` will link to an anchor.
* Title is optional, and linked text will be used if not explicitly defined.

##### mrkdwn
```
[text](url)
[text](url "Title")

[text](!anchor title)
[text](#anchor title)

[text][reference]
[reference]: url title

[url]
[[auto_parsed_url]]
[!anchor]
[#anchor]
[[parsed_url#anchor]]
```
##### markup
```
<a href="url">text</a>
<a href="url" title="Title">text</a>

<a name="anchor" title="title">text</a>
<a href="#anchor" title="title">text</a>

<a href="url" title="title">text</a>

<a href="url">url</a>
<a href="auto/parsed/url">auto parsed url</a>
<a name="anchor">anchor</a>
<a href="#anchor">anchor</a>
<a href="parsed/url#anchor">parsed url anchor</a>
```


### Automatic Links
* Absolute urls and email addresses will be automatically markuped to a tags.
* Links must be preceeded by whitespace.

##### mrkdwn
```
Go to index.html
Go to http://url.com
Email addr@email.com
```
##### markup
```
Go to index.html
Go to <a href="http://url.com">http://url.com</a>
Email <a href="mailto:addr@email.com">addr@email.com</a>
```


### Images
* `![alt text](url title width height)` will be markuped to img tags.
* `![alt text][imageReference]` will be markuped to img tags.
* `![imageReference]: url title width height` will be removed from markup, but will define an image.
* urls can be absolute or relative.
* title, width, and height are optional.
* Usage of an undefined imageReference will be markuped to img tags with only alt text.

##### mrkdwn
```
![alt text](url title width height)
![alt text](url "Title" 350px 100%)

![alt text][reference]
![reference]: url "Title" width height
```
##### markup
```
<img src="url" title="title" alt="alt text" />
<img src="url" title="Title" alt="alt text" width="350px" height="100%" />

<img src="url" title="Title" alt="alt text" width="width" height="height" />
```


### Macros
* `%[alt text](macro arg1 ...)` will be markuped depending on the macro.
* `%[alt text][macroReference]` will be markuped depending on the macro.
* `%[macroReference]: macro arg1 ...` will be removed from markup, but will define a macro.
* Macros can be used to embed video, other media, or custom markups.
* Usage of an undefined or invalid macroReference will be markuped to the alt text.
* The first argument must be the macro name. 
* Any number and type of arguments can be included after the first argument depending on the macro.

##### mrkdwn
```
%[alt text](macro arg1 arg2 arg3 ...)

%[alt text][reference]
%[reference]: macro arg1 arg2 arg3 arg4
```
##### markup
```
varied based on macro

varied based on macro
```


### Citations
* `@[citationReference]` will be markuped to a superscript numbered anchor linked to the citation in page.
* `@citationReference` will be markuped to a superscript numbered anchor linked to the citation in page.
* `@[citationReference]: type arg1 ...` will be markuped depending on type, and will define a citation.
* Citation references must be placed together in the document where they should be displayed and will be translated as a list. 
* Citation reference names must begin with an alphanumeric character, contain no spaces, and are case sensative. 
* Citations are automatically numbered based on list order. 
* Any number and type of arguments can be included after the first argument depending on the citation type.
* If the first argument in a citation reference is a known type of citation its arguments will be used to autoformat a citation in MLA. 
* If the first argument is not a known citation type, the string will be used directly.

##### mrkdwn
```
This sentence is from something trustworthy @[refOne]. 
This sentence is way less trustworthy @refTwo.

@[refOne]: type arg1 arg2
@[refTwo]: type arg1 arg2 arg3
@[refThree]: A preformated citation
```
##### markup
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
* `&[noteReference]` will be markuped to a superscript numbered anchor linked to the note in page.
* `&noteReference` will be markuped to a superscript numbered anchor linked to the note in page.
* `&[noteReference]: note text` will be markuped as a list, and will define a citation.
* Note references must be placed together in the document where they should be displayed and will be translated as a list.
* Note reference names must begin with an alphanumeric character, contain no spaces, and are case sensative. 
* Notes are automatically numbered based on list order.

##### mrkdwn
```
This sentence needs a note &[refOne]. 
This sentence also needs a note &refTwo. 
This sentence gets a fancy note &[refTwo].

&[refOne]: note text
&[refTwo]: note text
```
##### markup
```
This sentence needs a note<sup class="note"><a href="#note-1" title="note text">1</a></sup>. 
This sentence also needs a note<sup class="note"><a href="#note-2" title="note text">2</a></sup>.

<ol>
  <li><a name="note-1">note text</a></li>
  <li><a name="note-2">note text</a></li>
</ol>
```


### Variables
* `$[variableName]` will be markuped to the variable value, or variable name if definition not found
* `$[variableName]: variable value` will be removed from markup, but used to define a variable
* Variable definitions can be anywhere in the markdown and will be markuped before any variable usage
* Variable definitions are case sensative
* Duplicate variable definitions will overwrite previous values

##### mrkdwn
`Current version $[variable]`  
`$[variable]: value`
##### markup
```
Current version value
```


### Abbreviations
* Defined abbreviations used in text are automatically markuped and do not need special markdown
* `$[abbreviation]: full` will be removed from markup, but used to define an abbreviation
* Abbreviation definitions can be anywhere in the markdown and will be markuped before any usage
* Abbreviation definitions are case sensative and can contain multiple words and spaces
* Duplicate abbreviation definitions will overwrite previous values

##### mrkdwn
```
The HTML specification
The Primary Standard is good

+[HTML]: Hyper Text Markup Language
+[Primary Standard]: Main Standard
```
##### markup
```
The <abbr title="Hyper Text Markup Language">HTML</abbr> specification
The <abbr title="Main Standard">Primary Standard</abbr> is good
```


### Inline Code
* Pairs of one or more backticks on the same line will be markuped to code tags. 
* Pairs of n backticks can contain groups of less than n backticks.
* Most special characters, except `& # ;`, are markuped to their ascii representation.
* Must contain at least one whitespace or non backtick character.

##### mrkdwn
```
The `<body></body>` tags
Encase `` `ticks` ``
```
##### markup
```
The <code>&lt;body&gt;&lt;/body&gt;</code> tags
Encase <code> &#96;ticks&#96; </code>
```


### Block Pre Code
* Pairs of three or more backticks at the start of a line and not on the same line will be markuped to pre and code tags. 
* Pairs of n backticks can contain groups of less than n backticks.
* Most special characters, except `& # ;`, are markuped to their ascii representation.
* Text on the same line as the opening backticks will be markuped as class on the code tag.

##### mrkdwn
```
'''
<body></body>
'''
  
'''' syntax
<body></body>
''''
```
##### markup
```
<pre><code>
&lt;body&gt;&lt;/body&gt;
</code></pre>

<pre><code class="syntax">
&lt;body&gt;&lt;/body&gt;
</code></pre>
```


### Inline Sample
* Pairs of one or more backticks on the same line with a `!` will be markuped to samp tags. 
* Pairs of n backticks can contain groups of less than n backticks.
* Most special characters, except `& # ;`, are markuped to their ascii representation.
* Must contain at least one whitespace or non backtick character.

##### mrkdwn
```
The `!<body></body>` tags
Encase ``! `ticks` ``
```
##### markup
```
The <samp>&lt;body&gt;&lt;/body&gt;</samp> tags
Encase <samp> &#96;ticks&#96; </samp>
```


### Block Pre Sample
* Pairs of three or more backticks with a `!` at the start of a line and not on the same line will be markuped to pre and samp tags. 
* Pairs of n backticks can contain groups of less than n backticks.
* Most special characters, except `& # ;`, are markuped to their ascii representation.
* Text on the same line as the opening backticks will be markuped as class on the samp tag.

##### mrkdwn
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


### Table
Tables must have preceeding and proceeding `|`. Column text lengths do not need to be equal between columns or rows.
##### mrkdwn
```
| Header One | Header Two |
| ---------- | ---------- |
| Content    | Content    |

| Left | Center | Right |
| :--- | :----: | ----: |
| Content    |   Content  |    Content |
```
##### html
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


### Meta
* `{{{ }}}` will be treated as meta data (sematic data) and can be retrieved and used for machine magic.
* `{{{ }}}` will be removed from markup and not parsed.
* `{{{! }}}` will be parsed and markuped as an html comment.
* Meta can be used inline or block.
* Applied anywhere, without exception.
* Meta parser
  * `( )` can be used to define an array. 
  * `[ ]` can be used to define a json-ish data structure. 
  * Whitespace is used for parsing and is otherwise ignored.

##### mrkdwn
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
##### markup
```

```

---

Markup Notes and Tracking
-------------------------

- ~~escaped characters~~
- ~~comments~~
- ~~inline and block code~~
- ~~inline and block sample~~
- ~~meta~~
- ~~variables~~
- ~~abbreviations~~
- ~~images~~
- ~~macros~~
- ~~citations~~
- ~~notes~~
- ~~links~~
- ~~auto links~~
- ~~headers~~
- horizontal rule
- phrase formatting
- blockquote
- detail
- list
  - unordered list
  - ordered list
  - accordian
  - task list
  - definition list
- table
- paragraphs







