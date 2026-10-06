---
title: Images and attributes
summary: Show pictures with the img tag and learn how attributes work.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <body>
          <h1>My gallery</h1>

          <!-- Add an image here with three attributes:
               src (use the address below), alt (a short description)
               and width set to 200.

               src address to use:
               data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='%236d5efc'/%3E%3C/svg%3E
          -->

        </body>
      </html>
check:
  dom:
    selectors: ["img[src]", "img[alt]", "img[width=\"200\"]"]
  code:
    - pattern: "<img[^>]*alt=\"[^\"]+\""
      message: "Give the image an alt attribute with a short description, like alt=\"A purple rectangle\"."
hints:
  - "Pictures use a tag that has no closing tag and no text inside. Everything it needs goes into attributes inside the tag."
  - "The tag is img, and it needs three attributes written as name=\"value\": src, alt and width."
  - "Write: <img src=\"data:image/svg+xml,...\" alt=\"A purple rectangle\" width=\"200\" /> and paste the long address from the comment into src."
solution:
  - code: |
      <!doctype html>
      <html>
        <body>
          <h1>My gallery</h1>

          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='%236d5efc'/%3E%3C/svg%3E"
            alt="A purple rectangle"
            width="200"
          />
        </body>
      </html>
quiz:
  - q: Which attribute tells the browser WHERE the picture file is?
    options: ["alt", "href", "src"]
    answer: 2
    explain: src stands for source. href is used on links, not on images.
  - q: Why should every image have an alt attribute?
    options: ["It makes the image load faster", "It describes the picture for screen readers and shows if the image fails to load", "It sets the size of the image"]
    answer: 1
  - q: Which of these is a correct image tag?
    options: ["<img>cat.png</img>", "<image src=\"cat.png\">", "<img src=\"cat.png\" alt=\"A cat\" />"]
    answer: 2
    explain: The tag is img, it has no closing tag, and the file goes in the src attribute.
  - q: What kind of address is src="photos/cat.png"?
    options: ["A relative path to a file next to your page", "A website on the internet", "A CSS rule"]
    answer: 0
---

Pictures make a page come alive. In this lesson you will add an image and, along the way, learn exactly how **attributes** work, because you will use them on almost every tag from now on.

## The img tag

Images use the `<img>` tag. Unlike `<p>` or `<h1>`, it has **no closing tag** and **no content between tags**. All the information goes in attributes. Tags like this are called *void elements*.

```html
<img src="cat.png" alt="An orange cat asleep on a sofa" width="300" />
```

## Attributes, piece by piece

An **attribute** gives extra information to a tag. It always sits inside the opening tag, and has the shape `name="value"`. You can have as many as you like, separated by spaces.

- `src` (source) says where the image file lives. This can be a file next to your page like `cat.png`, a file in a folder like `images/cat.png` (a **relative path**), or a full web address like `https://example.com/cat.png`.
- `alt` (alternative text) is a short written description of the picture. Screen readers read it aloud to people who cannot see the image, and the browser shows it if the picture fails to load. Search engines use it too.
- `width` (and `height`) set the size in pixels. If you set only the width, the browser keeps the picture's proportions by itself.

The same idea works on other tags. You have already seen `href` on `<a>`. Here is a link wrapped around an image, so the picture itself becomes clickable:

```html
<a href="https://example.com">
  <img src="logo.png" alt="Example logo" width="80" />
</a>
```

## Where do the picture files live?

When you write `src="cat.png"` the browser looks for a file called `cat.png` in the same folder as your HTML file. In this lesson's editor we can not upload files, so the starter gives you a tiny built-in picture as a long `data:` address. It has the whole image written inside the address, which is why it is so long. Real sites use short file names.

## What a good alt text looks like

- Describe what is in the picture: `alt="Two children flying a red kite"`.
- Do not start with "Image of..." because the screen reader already says it is an image.
- If the image is purely decoration you can use an empty `alt=""`, but the attribute should still be there.

> **Watch out:**
> - Writing `<img>cat.png</img>`. An image has no content between tags: use `<img src="cat.png" />`.
> - A broken picture icon with the alt text. This means the `src` is wrong. Check the spelling, the capital letters (`Cat.png` is not `cat.png`) and the folder.
> - Using `href` instead of `src` on an image. `href` is for links.
> - Forgetting the quotes: `alt=A cat` only takes the word `A` as the value.
> - Setting both `width` and `height` to numbers that do not match the real proportions. The picture will look squashed.

## Going further

Try changing the width to `100` and then `400`. Wrap the `<img>` in an `<a href="...">` and click it in the preview.

> **Your turn:** add an `<img>` to the page with a `src` (use the address from the comment), a descriptive `alt` text, and `width="200"`.
