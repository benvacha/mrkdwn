mrkdwn
======

One Markdown To Rule Them All

**mrkdwn** combines the original markdown specification created by John Gruber, the latest and greatest flavors of markdown, and new syntax for semantic notation. **mrkdwn** seeks to provide the most complete set of syntax while considering both backward compatibility and future need. 

**mrkdwn**'s ultimate goal is to the be the one markdown to rule them all, the one markdown to bring them all and in the darkness bind them. With this in mind, **mrkdwn** will work to provide translation packages in all major languages as well as GUI packages for live editing, including syntax highlighting and real time output.

---

Proposed Syntax
---------------

### Paragraphs
Plain text preceeded and followed by a blank line or block syntax will be wrapped in a paragraph. Manual line returns will be treated as manual breaks within a single paragraph.
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
Phrase formatting can be nested inside of any other syntax, except code blocks. Phrase formatting is only translated when both starting end ending syntax is found. Phrase formatting can be done inside of words, with the exception of underline. Phrase formatting surrounded with whitespace will not be translated as phrase formatting.
##### mrkdwn
```
*emphasis*  **bold**  ***strong***
~italic~  ~~mark~~  ~~~strikethrough~~~~
~*italic bold*~
^superscript^  ^^subscript^^
_underline_
```
##### html
```
<em>emphasis</em>  <b>bold</b>  <strong>strong</strong>
<i>italic</i>  <mark>mark</mark>  <strike>strikethrough</strike>
<i><b>italic bold</b></i>
<sup>superscript</sup>  <sub>subscript</sub>
<u>underline</u>
```

### Headers
Headers are automatically given anchor links based on text content
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
```
##### html
```
<h1>Header 1</h1>

<h2>Header 2</h2>

<h1>Header 1</h1>
<h2>Header 2</h2>
<h3>Header 3</h3>
<h4>Header 4</h4>
<h5>Header 5</h5>
<h6>Header 6</h6>
```

### Horizontal Rules
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
##### mrkdwn
```
> Block
> Quoted
> Lines

> Block Quote
> with citation
>! cite
```
##### html
```
<blockquote>
 Block
 Quoted
 Lines
</blockquote>

<blockquote cite="cite">
 Block Quote
 with citation
</blockquote>
```

### Detail
A detail block must start with `<!` or it will be translated as a accordian list.
##### mrkdwn
```
<! summary
< Content
<
< Content
```
##### html
```
<details>
  <summary>summary</summary>
  <p>Content</p>
  <p>Content</p>
</details>
```

### Unordered List
Unordered lists must be denoted using `-`, `*` and `+` will not be translated to unordered lists. Multiple line list items will be translated into paragraphs.
##### mrkdwn
```
- Item
- Item
- Item

- Item

- Item
  
  With a second paragraph
- Item
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
Numbering does not need to be unique or sequential. The first number will be used as the starting value of the list.
##### mrkdwn
```
1. One
2. Two
3. Three

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

### Nested Lists
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

### Task List
##### mrkdwn
```
- [ ] Task 1
- [x] Task 2
- [ ] Task 3
  - [x] Sub Task 1
  - [x] Sub Task 2
  - [ ] Sub Task 3
```
##### html
```
<ul>
  <li><input type="checkbox" /> Task 1</li>
  <li><input type="checkbox" checked /> Task 2</li>
  <li><input type="checkbox" /> Task 3
    <ul>
      <input type="checkbox" checked /> Sub Task 1</li>
      <input type="checkbox" checked /> Sub Task 2</li>
      <input type="checkbox" /> Sub Task 3</li>
    </ul>
  </li>
</ul>
```

### Definition List
##### mrkdwn
```
: Term
  : Definition
: Term
  : Definition
```
##### html
```
<dl>
  <dt>Term</dt>
    <dd>Definition</dd>
  <dt>Term</dt>
    <dd>Defintion</dd>
</dl>
```

### Accordian List
##### mrkdwn
```
< Visible
  < Hidden
< Visible
  < Hidden
```
##### html
```
<ul class="accordian">
  <li>Visible
    <ul>
      <li>Hidden</li>
    </ul>
  </li>
  <li>Visible
    <ul>
      <li>Hidden</li>
    </ul>
  </li>
</ul>
```

### Inline Link
##### mrkdwn
```
[text](url)
[text](url "Title")
```
##### html
```
<a href="url">text</a>
<a href="url" title="Title">text</a>
```

### Anchor Links
##### mrkdwn
```
Define a [text](!anchor)
Define a [text](!anchor "Title")

Go to [text](#anchor) in same page
Go to [text](#anchor "Title") in same page

Go to [text](url#anchor) in external page
Go to [text](url#anchor "Title") in external page
```
##### html
```
Define a <a name="anchor">text</a>
Define a <a name="anchor" title="Title">text</a>

Go to <a href="#anchor">text</a> in same page
Go to <a href="#anchor" title="Title">text</a> in same page

Go to <a href="url#anchor">text</a> in external page
Go to <a href="url#anchor" title="Title">text</a> in external page
```

### Reference Link
##### mrkdwn
`[text][reference]`  
`[reference]: url "Title"`
##### html
```
<a href="url" title="Title">text</a>
```

### Automatic Link
##### mrkdwn
```
Go to <url.com>

Go to http://url.com

Email <addr@email.com>

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
##### mrkdwn
```
![alt text](url "Title")
```
##### html
```
<img src="url" title="Title" alt="alt text" />
```

### Reference Image
##### mrkdwn
`![alt text][reference]`  
`[reference]: url "Title"`
##### html
```
<img src="url" title="Title" alt="alt text" />
```

### Inline Video
Video will be embedded based on video content provider
##### mrkdwn
```
!![alt text](url "Title")
```
##### html
```
varied based on provider
```

### Reference Video
##### mrkdwn
`!![alt text][reference]`  
`[reference]: url "Title"`
##### html
```
varied based on provider
```

### Inline Pre
All special characters within an inline pre syntax is escaped to it's ascii representation.
##### mrkdwn
```
The `<body></body>` tags
```
##### html
```
The <pre>&lt;body&gt;&lt;/body&gt;</pre> tags
```

### Block Pre and Code
All special characters within a block pre code syntax is escaped to it's ascii represenation. Reference syntax inside block code will not be translated as reference syntax. The absense of absence of a syntax will translate the block without a code tag. The syntax does not need to be a valid syntax name to translate with the code tag.
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
All special characters within the block is escaped to it's ascii representation. Reference syntax inside the block will not be translated as reference syntax. 
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

### Inline Table
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
Any character used in mrkdwn syntax can be escaped with `\` to produce the actual character and remove it's mrkdwn meaning. This includes `\, *, _, {, }, [, ], (, ), <, >, #, +, -, ., !, :`.
##### mrkdwn
```
\*Actual asterisk surrounded text\*
```
##### html
```
&#42;Actual asterisk surrounded text&#42;
```

### Tags
##### mrkdwn
```
#tag
```
##### html
```

```

### Authorship
##### mrkdwn
```
@username
```
##### html
```

```

### Automatic Quotation
##### mrkdwn
```
He said "Something worth remembering".
```
##### html
```
He said <q>Something worth remembering</q>.
```

### Document Attributes
A mrkdwn document may begin with a section of attributes that may be used elsewhere in the document, but are not displayed where they are defined.
##### mrkdwn
```
% title Page Title
% author Author One Name
% author Author Two Name
% created Date Created
% updated Date Updated
% customAttribute Custom Value
```
```
%[title]
%[author]
%[created] - %[updated]
%[customAttribute]
```
##### html
```
Page Title
Author One Name, Author Two Name
Date Created - Date Updated
Custom Value
```

### Abbreviations
Abbreviations can be defined anywhere and are automatically translated everyone in the document. Abbreviations are case sensative.
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




