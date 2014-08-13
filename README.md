mrkdwn
======

One Markdown To Rule Them All

**mrkdwn** combines the original markdown specification created by John Gruber, the latest and greatest flavors of markdown, and new syntax for semantic notation. **mrkdwn** seeks to provide the most complete set of syntax while considering both backward compatibility and future need. While **mrkdwn** may stray from full backward compatability, it is with the goal of improving speed, reliability, and readability.

**mrkdwn**'s ultimate goal is to the be the one markdown to rule them all, the one markdown to bring them all and in the darkness bind them. With this in mind, **mrkdwn** will work to provide translation packages in all major languages as well as GUI packages for live editing, including syntax highlighting and real time output.

---

Proposed Syntax
---------------

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
Phrase formatting can be nested inside of any other syntax, except code blocks. Phrase formatting is only translated when both starting and ending syntax is found in the same paragraph. Phrase formatting can be inside of words, with the exception of underline. Phrase formatting surrounded with whitespace will not be translated as phrase formatting.
##### mrkdwn
```
*emphasis*  **bold**  ***strong***
~italic~  ~~mark~~  ~~~strikethrough~~~~
~*italic bold*~
^superscript^  ^^subscript^^
_underline_
some_file_name
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
put a * in the **
```

### Headers
Headers are automatically given internal anchor links based on header text, or can be manually defined. Trailing `#` will not be translated.
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

## [Header 2](!anchor)
```
##### html
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
Three or more `-` on a line, alone, will create a horizontal rule. '*' are not valid horizontal rule syntax.
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
Blockquotes can be nested as needed and can contain any other syntax. All lines in a blockquote must begin with a `>`.
##### mrkdwn
```
> Paragraph one
> 
> Second paragraph

> Block Quote
> with citation
>! cite
```
##### html
```
<blockquote>
  <p>Paragraph one</p>
  <p>Second paragraph</p>
</blockquote>

<blockquote cite="cite">
  <p>Block Quote<br />
  with citation</p>
</blockquote>
```

### Detail
The first line of a detail will always be used as it's summary. All lines in a detail must begin with `<`. Detail blocks can be nested as needed and can contain any other syntax.
##### mrkdwn
```
< summary
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

### Inline Link
Brackets preceeded by whitespace and proceeded by parenthesis will be translated as links. Bracketed text preceeded and proceeded by whitespace will be exploded on `_` and linked. The url can be absolute or relative.
##### mrkdwn
```
[text](url)
[text](url "Title")

[url]
[auto_parsed_url]
```
##### html
```
<a href="url">text</a>
<a href="url" title="Title">text</a>

<a href="url">url</a>
<a href="auto/parsed/url">auto parsed url</a>
```

### Anchor Links
Parenthesis beginning with `!` will define an anchor. Parenthesis beginning with `#` will link to an anchor. Bracketed text preceeded and proceeded by whitespace and beginning with a `!` will define an anchor. Bracketed text preceeded and proceeded by whitespace and beginning with `#` will link to an anchor; text will be parsed based on `_` and `#`. The url can be absolute or relative.
##### mrkdwn
```
Define a [text](!anchor)
Define a [text](!anchor "Title")

Define a [!anchor]

Go to [text](#anchor) in same page
Go to [text](#anchor "Title") in same page

Go to [text](url#anchor) in external page
Go to [text](url#anchor "Title") in external page

[#anchor]
[parsed_url#anchor]
```
##### html
```
Define a <a name="anchor">text</a>
Define a <a name="anchor" title="Title">text</a>

Define a <a name="anchor">anchor</a>

Go to <a href="#anchor">text</a> in same page
Go to <a href="#anchor" title="Title">text</a> in same page

Go to <a href="url#anchor">text</a> in external page
Go to <a href="url#anchor" title="Title">text</a> in external page

<a href="#anchor">anchor</a>
<a href="parsed/url#anchor">parsed url anchor</a>
```

### Reference Link
Bracketed text preceeded by whitespace and proceeded by bracketed text will be translated as a reference link. Bracketed text preceeded by whitespace and proceeded by `:` will define a link reference and can be anywhere in the document.
##### mrkdwn
`[text][reference]`  
`[reference]: url "Title"`
##### html
```
<a href="url" title="Title">text</a>
```

### Automatic Link
Absolute urls and email addresses will be automatically linked.
##### mrkdwn
```
Go to http://url.com

Email addr@email.com
```
##### html
```
Go to <a href="url.com">url.com</a>

Go to <a href="http://url.com">http://url.com</a>

Email <a href="mailto:addr@email.com">addr@email.com</a>

Email <a href="mailto:addr@email.com">addr@email.com</a>
```

### Inline Image
Bracketed text preceeded by `!` and proceeded by parenthesis will be translated as images. url can be absolute or relative. title, width, and height are optional.
##### mrkdwn
```
![alt text](url title width height)
![alt text](url "Title" 350px 100%)

```
##### html
```
<img src="url" title="title" alt="alt text" />
<img src="url" title="Title" alt="alt text" width="350px" height="100%" />
```

### Reference Image
Bracketed text preceeded by `!` and proceeded by bracketed text will be translated as a reference image. Bracketed text preceeded by `!` and proceeded by `:` will define a image reference and can be anywhere in the document.
##### mrkdwn
`![alt text][reference]`  
`![reference]: url "Title" width height`
##### html
```
<img src="url" title="Title" alt="alt text" width="width" height="height" />
```

### Inline Macro
Bracketed text preceeded by `@` and proceeded by parenthesis will be translated as a macro. Macros can be used to embed video or other media, or whatever else comes around. alt text is displayed is macro fails to return translation. The first argument in the parenthesis must be the macro name. Arguments after the first will vary with the macro.
##### mrkdwn
```
@[alt text](macro arg1 arg2 arg3 ...)
```
##### html
```
varied based on macro
```

### Reference Macro
Bracketed text preceeded by `@` and proceeded by bracketed text will be translated as a reference macro. Bracketed text preceeded by `@` and proceeded by `:` will define a macro reference and can be anywhere in the document.
##### mrkdwn
`@[alt text][reference]`  
`@[reference]: macro arg1 arg2 arg3 arg4`
##### html
```
varied based on macro
```

### Variables
Bracketed text preceeded by `%` and proceeded by bracketed text will be translated as a variable. Bracketed text preceeded by `%` and proceeded by `:` will define a variable and can be anywhere in the document.
##### mrkdwn
`Current version %[variable]`
`%[variable]: value`
##### html
```
Current version value
```

### Abbreviations
Bracketed text preceeded by `+` and proceeded by `:` will define an abbreviation and can be anywhere in the document. Abbreviations are automatically applied to case sensative matching text anywhere in the document.
##### mrkdwn
```
The HTML specification
The Primary Standard is good

+[HTML]: Hyper Text Markup Language
+[Primary Standard]: Main Standard
```
##### html
```
The <abbr title="Hyper Text Markup Language">HTML</abbr> specification
The <abbr title="Main Standard">Primary Standard</abbr> is good
```

### Inline Pre
Pairs of single backticks will be translated as inline pre. All special characters within an inline pre syntax is escaped to it's ascii representation.
##### mrkdwn
```
The `<body></body>` tags
```
##### html
```
The <pre>&lt;body&gt;&lt;/body&gt;</pre> tags
```

### Block Pre and Code
Pairs of three backticks, alone on lines, will be translated as block pre. Pairs of three backticks, with text on the line, will be translated as block pre code. All special characters within a block are escaped to their ascii represenation. Reference syntax inside block code will not be translated as reference syntax. The absence of a syntax will translate the block without a code tag. The syntax does not need to be a valid syntax name to translate with the code tag.
##### mrkdwn
```
'''
<body></body>
'''
  
''' syntax
<body></body>
'''
```
##### html
```
<pre>
&lt;body&gt;&lt;/body&gt;
</pre>

<pre><code class="syntax">
&lt;body&gt;&lt;/body&gt;
</code></pre>
```

### Block Sample
Pairs of four backticks, alone of lines, will be translated as block pre sample. All special characters within the block is escaped to it's ascii representation. Reference syntax inside the block will not be translated as reference syntax. 
##### mrkdwn
```
''''
> Output from a bash script
''''
```
###### html
```
<pre><samp>
&gt; Output from a bash script
</samp></pre>
```

### Table
Tables must have preceeding and proceeding `|`. Column text lenghts do not need to be equal between columns or rows.
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

### Backslash Escape
Any character used in mrkdwn syntax can be escaped with `\` to produce the actual character and remove it's mrkdwn meaning. This includes `\, *, _, {, }, [, ], (, ), <, >, #, +, -, ., !, :, @`.
##### mrkdwn
```
\*Actual asterisk surrounded text\*
```
##### html
```
&#42;Actual asterisk surrounded text&#42;
```

### Automatic Quotation
Quotations marks will be automatically translated to use quotations tags.
##### mrkdwn
```
He said "Something worth remembering".
```
##### html
```
He said <q>Something worth remembering</q>.
```

### Semantics and Meta
`{ }` will be treated as meta or sematic data. It will be removed from the final translation, but can be retrieved and used for special magic. `( )` can be used to define an array. `{ }` can be used to define a json-ish data structure. Whitespace within is ignored.
##### mrkdwn
```
{pageTitle "The page title"}
{author (
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
)}
{backPage url}
{nextPage url}
{siblings (Sibling One, Sibling Two)}
{isA Object url}
{hasA Object url}
```
##### html
```

```




