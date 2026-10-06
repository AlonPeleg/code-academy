---
title: Your first web page
summary: Headings, paragraphs and how a browser reads HTML.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <body>
          <!-- Write your code below -->

        </body>
      </html>
check:
  dom:
    selectors: ["h1", "p"]
hints:
  - "You need two different kinds of tag: one for a heading and one for a paragraph. Both belong inside the body."
  - "The main heading tag is h1 and the paragraph tag is p. Each one needs an opening tag and a closing tag with a slash."
  - "Inside the body, write: <h1>My first page</h1> and then <p>I am learning HTML!</p>"
solution:
  - code: |
      <!doctype html>
      <html>
        <body>
          <h1>My first page</h1>
          <p>I am learning HTML!</p>
        </body>
      </html>
quiz:
  - q: What does HTML stand for?
    options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language"]
    answer: 0
    explain: HTML is the markup language that describes the structure of a web page.
  - q: Which tag creates the biggest, most important heading?
    options: ["<h6>", "<head>", "<h1>"]
    answer: 2
    explain: Headings go from <h1> (most important) down to <h6>. Do not confuse <h1> with <head>, which holds information about the page.
  - q: Which tag creates a paragraph?
    options: ["<para>", "<p>", "<text>"]
    answer: 1
  - q: Where does the content a visitor can see belong?
    options: ["Inside <body>", "Before <!doctype html>", "Only inside comments"]
    answer: 0
    explain: Everything visible goes inside <body>. Comments are for notes to yourself and are never shown.
---

Every web page you have ever visited is built from **HTML**. In this lesson you will learn how HTML is written and build a tiny page of your own.

## Tags tell the browser what things are

HTML is made of *tags*. A tag is a word wrapped in angle brackets, like `<p>`. Most tags come in pairs: an **opening tag** and a **closing tag** that has a `/` in front of the name. The text between them is the **content**.

```html
<h1>Hello!</h1>
<p>This is a paragraph.</p>
```

Together, the opening tag, the content and the closing tag are called an **element**. Here we have two elements: a heading and a paragraph.

- `<h1>` is the main heading of the page. There are also `<h2>` to `<h6>`, each a little smaller and less important.
- `<p>` is a paragraph of text. The browser puts some space above and below it for you.

## The skeleton of a page

Every HTML page has the same basic shape:

```html
<!doctype html>
<html>
  <head>
    <title>My page</title>
  </head>
  <body>
    <h1>Welcome</h1>
  </body>
</html>
```

- `<!doctype html>` tells the browser "this is a modern HTML page".
- `<html>` wraps everything.
- `<head>` holds information *about* the page (like its title in the browser tab). Nobody sees it on the page itself.
- `<body>` holds everything the visitor **can** see. This is where you will do most of your work.

## Nesting and indentation

Elements can go inside other elements. This is called **nesting**. In the skeleton above, `<h1>` is nested inside `<body>`, which is nested inside `<html>`. We indent nested elements with two spaces to make the page easy to read. The browser does not care about the spaces, but you will.

## Comments

You can leave notes for yourself that the browser ignores:

```html
<!-- This is a comment. Nobody sees it on the page. -->
```

## What you will see

The preview on the right updates as you type. If you write `<h1>Hello!</h1>` you will see big, bold text. If you write `<p>` text, you will see normal-sized text underneath.

> **Watch out:**
> - Forgetting the closing tag, as in `<h1>Hello` with no `</h1>`. The browser guesses what you meant, and the rest of your page may suddenly look big and bold. There is no error message in HTML, so check your tags in pairs.
> - Typing the slash the wrong way, like `<\h1>`. The closing slash goes forward: `</h1>`.
> - Writing your content outside `<body>`. The browser may still show it, but it is messy and can break later when you add styles.
> - Using `<h1>` just to make text big. Headings are for meaning (titles). Later you will make text bigger with CSS.

## Going further

Try adding `<h2>` and `<h3>` headings under your `<h1>` and watch the sizes step down. Add a second `<p>`. Notice how each paragraph starts on a new line even if you write them side by side in the code.

> **Your turn:** inside `<body>`, add an `<h1>` heading and a `<p>` paragraph with any text you like, then press **Check answer**.
