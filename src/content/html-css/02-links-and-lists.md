---
title: Links and lists
summary: Connect pages with links and organise content with lists.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <body>
          <h1>My favourite languages</h1>

          <!-- 1. Add an unordered list with three items -->

          <!-- 2. Add a link to https://developer.mozilla.org -->

        </body>
      </html>
check:
  dom:
    selectors: ["ul", "a[href]"]
  code:
    - pattern: "<li[^>]*>[\\s\\S]*<li[^>]*>[\\s\\S]*<li"
      message: "Your list needs at least three <li> items."
hints:
  - "You need two things: a list (a container with items inside) and a link. Think about which tags are used for each."
  - "A bullet list is a ul tag with li tags inside it, one li per item. A link is an a tag with an href attribute."
  - "Write: <ul> <li>HTML</li> <li>CSS</li> <li>JavaScript</li> </ul> and then <a href=\"https://developer.mozilla.org\">Learn more on MDN</a>"
solution:
  - code: |
      <!doctype html>
      <html>
        <body>
          <h1>My favourite languages</h1>

          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>

          <a href="https://developer.mozilla.org">Learn more on MDN</a>
        </body>
      </html>
quiz:
  - q: Which tag creates a bullet-point list?
    options: ["<ul>", "<list>", "<bullet>"]
    answer: 0
    explain: "<ul> is an unordered list. Each item inside it is wrapped in <li>."
  - q: Where does a link's destination go?
    options: ["In the text between the tags", "In the <p> tag", "In the href attribute"]
    answer: 2
    explain: The href attribute holds the address the link points to.
  - q: Which tag makes a numbered list?
    options: ["<nl>", "<ol>", "<num>"]
    answer: 1
  - q: What is the text between <a> and </a> used for?
    options: ["It is the address of the link", "It is hidden from the visitor", "It is the clickable words the visitor sees"]
    answer: 2
---

Two things you will use on almost every page are **lists** and **links**. Lists organise information, and links are what make the web a *web*.

## Lists

An **unordered list** shows bullet points. It uses the `<ul>` tag, and every item inside it is wrapped in `<li>` (list item).

```html
<ul>
  <li>Apples</li>
  <li>Bananas</li>
  <li>Cherries</li>
</ul>
```

That shows:

- Apples
- Bananas
- Cherries

If order matters (like steps in a recipe) use an **ordered list**, `<ol>`. The items are still `<li>`, but the browser numbers them 1, 2, 3 for you:

```html
<ol>
  <li>Boil water</li>
  <li>Add pasta</li>
  <li>Wait ten minutes</li>
</ol>
```

Notice that `<li>` only ever appears inside a `<ul>` or `<ol>`. The list is the container and the items live inside it.

## Links

A link is an `<a>` tag. The "a" stands for *anchor*. A link has two important parts:

```html
<a href="https://example.com">Visit Example</a>
```

- `href="https://example.com"` is an **attribute**. Attributes go inside the opening tag and look like `name="value"`. The `href` attribute holds the address the link goes to.
- `Visit Example` is the **link text**: the words the visitor sees and clicks.

Links can also point to other pages of your own site using a relative address, like `<a href="about.html">About me</a>`.

By default a link opens in the same tab. To open it in a new tab add `target="_blank"`:

```html
<a href="https://example.com" target="_blank">Open in a new tab</a>
```

## Putting them together

You can put links inside list items to build a menu:

```html
<ul>
  <li><a href="index.html">Home</a></li>
  <li><a href="about.html">About</a></li>
</ul>
```

> **Watch out:**
> - Forgetting the quotes around the attribute value, as in `<a href=https://example.com>`. Always wrap values in quotes.
> - Writing the address without `https://` for an outside site, like `href="example.com"`. The browser thinks it is a file called `example.com` on your own site and the link breaks.
> - Putting `<li>` items directly in the body without a `<ul>` or `<ol>`. It is not a valid list, and you will not get bullets.
> - Writing `Click here` as link text. It is better to describe where the link goes, like `Read the MDN guide`.

## Going further

Change your `<ul>` to an `<ol>` and watch the bullets turn into numbers. Add a second link inside a `<li>`.

> **Your turn:** add a list with three `<li>` items, and a link to `https://developer.mozilla.org`.
