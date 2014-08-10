mrkdwn
======

One Markdown To Rule Them All

Syntax
------

### Paragraphs
##### mrkdwn
```
The first paragraph

The second paragraph
on multiple different lines
```
##### html
```
<p>The first paragraph</p>
<p>The second paragraph 
on multiple different lines</p>
```

### Forced Line Breaks
##### mrkdwn
```
Two spaces at the end of a line  
forces a break.
```
##### html
```
<p>Two spaces at the end of a line<br />
forces a break.</p>
```

### Phrase Emphasis
##### mrkdwn
```
*italic*  **bold**  ***strong***
_italic_  __bold__  ___strong___
```
##### html
```
<i>italic</i> <b>bold</b> <strong>strong</strong>
<i>italic</i> <b>bold</b> <strong>strong</strong>
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
* Item
* Item
* Item
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
* Item
  1. One
  2. Two
* Item
  * Sub Item
    1. One
    2. Two
* Item
```
##### html
```
<ul>
  <li>
    <ol>
      <li>One</li>
      <li>Two</li>
    </ol>
  </li>
  <li>
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
  
'''type
<body></body>
'''
```
##### html
```
<code class="block">
&lt;body&gt;&lt;/body&gt;
</code>

<code class="block type">
&lt;body&gt;&lt;/body&gt;
</code>
```
