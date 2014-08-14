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
    
    // return the html representation of the markdown
    getHtml: function(markdown) {
        markdown = mrkdwn.util.asciiEncodeEscapedChars(markdown);
        return markdown;
    },
    
    // return the mrkdwn representation of the html
    getMrkdwn: function(html) {
        return html;
    },
    
    /*
     *
     */
    
    util: {
        
        // return the ascii representation of escaped special charaters
        asciiEncodeEscapedChars: function(str) {
            return str.replace(/\\\!/g, '&#33;')
                .replace(/\\\"/g, '&#34;')
                .replace(/\\\#/g, '&#35;')
                .replace(/\\\$/g, '&#36;')
                .replace(/\\\%/g, '&#37;')
                .replace(/\\\&/g, '&#38;')
                .replace(/\\\(/g, '&#40;')
                .replace(/\\\)/g, '&#41;')
                .replace(/\\\*/g, '&#42;')
                .replace(/\\\+/g, '&#43;')
                .replace(/\\\-/g, '&#45;')
                .replace(/\\\./g, '&#46;')
                .replace(/\\\:/g, '&#58;')
                .replace(/\\\=/g, '&#61;')
                .replace(/\\\@/g, '&#64;')
                .replace(/\\\[/g, '&#91;')
                .replace(/\\\\/g, '&#92;')
                .replace(/\\\]/g, '&#93;')
                .replace(/\\\^/g, '&#94;')
                .replace(/\\\_/g, '&#95;')
                .replace(/\\\`/g, '&#96;')
                .replace(/\\\{/g, '&#123;')
                .replace(/\\\}/g, '&#125;')
                .replace(/\\\~/g, '&#126;');
        }
        
    }
};

























