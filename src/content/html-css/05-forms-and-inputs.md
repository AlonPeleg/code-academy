---
title: Forms and inputs
summary: Collect information from visitors with labels, inputs and buttons.
level: beginner
runner: web
files:
  - name: index.html
    code: |
      <!doctype html>
      <html>
        <body>
          <h1>Join the club</h1>

          <form>
            <!-- 1. A label for "username" and a text input with id "username" -->

            <!-- 2. A label for "email" and an email input with id "email" -->

            <!-- 3. A textarea for a message -->

            <!-- 4. A submit button that says "Join" -->
          </form>
        </body>
      </html>
check:
  dom:
    selectors:
      - "form"
      - "label[for=\"username\"]"
      - "input#username[type=\"text\"]"
      - "label[for=\"email\"]"
      - "input#email[type=\"email\"]"
      - "textarea"
      - "button[type=\"submit\"]"
hints:
  - "Each field is a pair: a label that names it, and an input that the visitor types into. The two are linked through the for and id attributes."
  - "For the first pair: <label for=\"username\">...</label> and <input type=\"text\" id=\"username\" />. The email one is the same with type=\"email\" and id=\"email\"."
  - "Add <textarea></textarea> for the message, and finish with <button type=\"submit\">Join</button> before </form>."
solution:
  - code: |
      <!doctype html>
      <html>
        <body>
          <h1>Join the club</h1>

          <form>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />

            <label for="email">Email</label>
            <input type="email" id="email" name="email" />

            <textarea name="message" placeholder="Tell us about yourself"></textarea>

            <button type="submit">Join</button>
          </form>
        </body>
      </html>
quiz:
  - q: Which attribute connects a label to its input?
    options: ["label uses for, and it must match the input's id", "label uses name, and it must match the button", "label uses src, and it must match the form"]
    answer: 0
  - q: What does type="email" do on an input?
    options: ["Sends the form by email", "Hides the text like a password", "Makes the browser check the text looks like an email address"]
    answer: 2
  - q: Which tag lets visitors type several lines of text?
    options: ["<input type=\"multi\">", "<textarea>", "<text>"]
    answer: 1
  - q: What happens when a visitor clicks a button with type="submit" inside a form?
    options: ["The form is submitted", "The page is deleted", "Nothing, buttons only work with JavaScript"]
    answer: 0
---

Forms are how websites listen: sign-ups, search boxes, comments, checkouts. In this lesson you will build a small sign-up form using the right tags so it works for everybody, including people who use screen readers.

## The form tag

Everything lives inside a `<form>` element. When the visitor presses the submit button, the browser collects the values of all the fields inside it. (Sending them to a server is a topic for later; for now we are building the front end.)

```html
<form>
  ...fields go here...
</form>
```

## Label plus input

Most fields are a **label** and an **input**:

```html
<label for="username">Username</label>
<input type="text" id="username" name="username" />
```

- `<label>` is the visible name of the field. Its `for` attribute holds the `id` of the input it belongs to. Because of that link, clicking the label puts the cursor in the input, and screen readers announce the field name.
- `<input>` is a void element (no closing tag), like `<img>`. Its `type` attribute decides what kind of field it is.
- `id` is a unique name for one element on the page. Only one element may have a given id.
- `name` is the name the form uses when it sends the value. Always give your inputs a `name`.

## Different input types

| `type` | What you get |
| --- | --- |
| `text` | A one-line text box |
| `email` | Like text, but the browser checks for an `@` and shows an email keyboard on phones |
| `password` | Dots instead of letters |
| `number` | Only numbers, with up/down arrows |
| `checkbox` | A tick box |
| `date` | A date picker |

Useful extras: `placeholder="..."` shows grey hint text inside the box, and `required` stops the form from being submitted while the field is empty.

## Multi-line text and buttons

For a long message, use `<textarea>`. Unlike `<input>` it does have a closing tag:

```html
<textarea name="message" rows="4"></textarea>
```

A button that sends the form:

```html
<button type="submit">Join</button>
```

## Dropdowns (bonus)

```html
<select name="level">
  <option>Beginner</option>
  <option>Expert</option>
</select>
```

> **Watch out:**
> - A `for` that does not match any `id`. The label then does nothing. Check the spelling carefully: `for="email"` needs `id="email"`.
> - Using the same `id` twice on a page. Ids must be unique.
> - Using `placeholder` instead of a label. A placeholder disappears when you type, and screen readers may ignore it. Use a real label.
> - Putting content inside an `<input>` such as `<input>Name</input>`. Inputs are void elements; the visible name belongs in a `<label>`.
> - A button outside the `<form>`. It will not submit the form.

## Going further

Add the `required` attribute to your email input and the `placeholder="you@example.com"` attribute. Try the type `number` on a new field and see how it refuses letters.

> **Your turn:** inside the form, add a `username` text field and an `email` field (each with a matching label), a `textarea`, and a submit button that says `Join`.
