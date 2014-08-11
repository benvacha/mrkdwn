mrkdwn
======

One Markdown To Rule Them All

**mrkdwn** combines the original markdown specification created by John Gruber, the latest and greatest flavors of markdown, and new syntax for semantic notation. **mrkdwn** seeks to provide the most complete set of syntax while considering both backward compatibility and future need. 

**mrkdwn**'s ultimate goal is to the be the one markdown to rule them all, the one markdown to bring them all and in the darkness bind them. With this in mind, **mrkdwn** will work to provide translation packages in all major languages as well as GUI packages for live editing, including syntax highlighting and real time output.

---

Proposed Syntax
---------------

### Paragraphs
##### mrkdwn
```
The first paragraph

This is split into two
seperate paragraphs
```
##### html
```
<p>The first paragraph</p>

<p>This is split into two</p>
<p>seperate paragraphs</p>
```

### Phrase Emphasis
##### mrkdwn
```
*italic*  **bold**  ***strong***
****strikethrough****
```
##### html
```
<i>italic</i> <b>bold</b> <strong>strong</strong>
<strike>strikethrough</strike>
```

### Headers
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
>[cite]
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

### Unordered List
##### mrkdwn
```
- Item
- Item
- Item
```
##### html
```
<ul>
  <li>Item</li>
  <li>Item</li>
  <li>Item</li>
</ul>
```

### Ordered List
##### mrkdwn
```
1. One
2. Two
3. Three
```
##### html
```
<ol>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
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

### Task Lists
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

### Inline Code
##### mrkdwn
```
The `<body></body>` tags
```
##### html
```
The <code>&lt;body&gt;&lt;/body&gt;</code> tags
```

### Block Code
##### mrkdwn
```
'''
<body></body>
'''
  
'''syntax
<body></body>
'''
```
##### html
```
<code class="block">
&lt;body&gt;&lt;/body&gt;
</code>

<code class="block syntax">
&lt;body&gt;&lt;/body&gt;
</code>
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



