---
title: Forms with validation
summary: Validate input with a pure function, show errors only after the user has visited a field, and disable the submit button until the form is valid.
level: intermediate
runner: react
files:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      // 1. Finish validate(values). It returns an object with one message per BROKEN field:
      //      name:     empty after trimming spaces      -> "Name is required"
      //      email:    empty                            -> "Email is required"
      //                not shaped like a@b.c            -> "Enter a valid email"
      //      password: fewer than 8 characters          -> "Password needs 8 or more characters"
      //    A field that is fine gets NO key. An empty object {} means the whole form is valid.
      //    Hint for the email shape: /^\S+@\S+\.\S+$/.test(text)
      function validate(values) {
        const errors = {};
        return errors;
      }

      // Plain function, no React: we can feed it example data and print the answers.
      const samples = [
        { label: "empty form", values: { name: "", email: "", password: "" } },
        { label: "bad email", values: { name: "Ada", email: "ada.example.com", password: "longenough" } },
        { label: "short password", values: { name: "Ada", email: "ada@example.com", password: "abc" } },
        { label: "all good", values: { name: "Ada", email: "ada@example.com", password: "engine123" } },
      ];

      function summary(errors) {
        const messages = Object.values(errors);
        return messages.length === 0 ? "valid" : messages.join("; ");
      }

      function Field({ label, name, type, value, error, onChange, onBlur }) {
        return (
          <label style={{ display: "block", marginBottom: 8 }}>
            {label}{" "}
            <input name={name} type={type} value={value} onChange={onChange} onBlur={onBlur} />
            {error && <span role="alert" style={{ color: "#b91c1c", marginLeft: 8 }}>{error}</span>}
          </label>
        );
      }

      function SignupForm() {
        const [values, setValues] = useState({ name: "", email: "", password: "" });
        const [touched, setTouched] = useState({});
        const [sentName, setSentName] = useState(null);

        // 2. Compute the errors from the current values, and whether the form is valid
        //    (valid = the errors object has no keys). Do NOT store these in state.
        const errors = {};
        const isValid = true;

        function handleChange(e) {
          // 3. Copy the old values and replace ONE field. The input's name attribute tells you which:
          //    use a computed key (square brackets around the key) built from the input's name.
        }

        function handleBlur(e) {
          // 4. Remember that this field has been visited: copy the old touched object and set the field's name to true.
        }

        function handleSubmit(e) {
          // 5. Stop the browser from reloading the page, then remember the name with setSentName(values.name).
        }

        // Show an error only for fields the user has already visited.
        const show = (name) => (touched[name] ? errors[name] : "");

        return (
          <form onSubmit={handleSubmit}>
            <Field label="Name" name="name" type="text" value={values.name} error={show("name")} onChange={handleChange} onBlur={handleBlur} />
            <Field label="Email" name="email" type="text" value={values.email} error={show("email")} onChange={handleChange} onBlur={handleBlur} />
            <Field label="Password" name="password" type="password" value={values.password} error={show("password")} onChange={handleChange} onBlur={handleBlur} />
            {/* 6. Turn the button off while the form is not valid. */}
            <button type="submit">Sign up</button>
            {sentName && <p>Welcome, {sentName}!</p>}
          </form>
        );
      }

      function App() {
        return (
          <div>
            <h2>Sign up</h2>
            <SignupForm />
            <h3>Self-test of validate()</h3>
            <ul>
              {samples.map((s) => (
                <li key={s.label}>{s.label}: {summary(validate(s.values))}</li>
              ))}
            </ul>
          </div>
        );
      }

      export default App;
check:
  dom:
    selectors: ['input[name="email"]', "button[disabled]"]
    text:
      - "empty form: Name is required; Email is required; Password needs 8 or more characters"
      - "bad email: Enter a valid email"
      - "short password: Password needs 8 or more characters"
      - "all good: valid"
  code:
    - pattern: "\\[\\s*(e|event)\\.target\\.name\\s*\\]"
      message: "Update one field with a computed key:  { ...values, [e.target.name]: e.target.value }"
    - pattern: "(e|event)\\.preventDefault\\s*\\("
      message: "Call e.preventDefault() in handleSubmit so the page does not reload."
    - pattern: "disabled\\s*=\\s*\\{"
      message: "Disable the button while the form is not valid:  disabled={!isValid}"
    - pattern: "setTouched\\s*\\(\\s*\\{\\s*\\.\\.\\.touched"
      message: "Mark the field as visited in handleBlur: setTouched({ ...touched, [e.target.name]: true })."
hints:
  - "validate is an ordinary function: start with const errors = {}, add a key only when a field is broken (errors.name = \"...\"), and return errors at the end. Because it is pure you can see its answers in the self-test list. The errors and isValid values inside the component are just calls to validate(values), not state."
  - "In validate use if (!values.name.trim()) errors.name = ...; for the email check empty first, then the pattern with else if; for the password check values.password.length < 8. In the component: const errors = validate(values); const isValid = Object.keys(errors).length === 0; and on the button add disabled with the opposite of isValid."
  - "setValues({ ...values, [e.target.name]: e.target.value });   setTouched({ ...touched, [e.target.name]: true });   e.preventDefault(); setSentName(values.name);   <button type=\"submit\" disabled={!isValid}>Sign up</button>"
solution:
  - name: App.jsx
    code: |
      import { useState } from 'react';

      function validate(values) {
        const errors = {};
        if (!values.name.trim()) {
          errors.name = "Name is required";
        }
        if (!values.email) {
          errors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
          errors.email = "Enter a valid email";
        }
        if (values.password.length < 8) {
          errors.password = "Password needs 8 or more characters";
        }
        return errors;
      }

      const samples = [
        { label: "empty form", values: { name: "", email: "", password: "" } },
        { label: "bad email", values: { name: "Ada", email: "ada.example.com", password: "longenough" } },
        { label: "short password", values: { name: "Ada", email: "ada@example.com", password: "abc" } },
        { label: "all good", values: { name: "Ada", email: "ada@example.com", password: "engine123" } },
      ];

      function summary(errors) {
        const messages = Object.values(errors);
        return messages.length === 0 ? "valid" : messages.join("; ");
      }

      function Field({ label, name, type, value, error, onChange, onBlur }) {
        return (
          <label style={{ display: "block", marginBottom: 8 }}>
            {label}{" "}
            <input name={name} type={type} value={value} onChange={onChange} onBlur={onBlur} />
            {error && <span role="alert" style={{ color: "#b91c1c", marginLeft: 8 }}>{error}</span>}
          </label>
        );
      }

      function SignupForm() {
        const [values, setValues] = useState({ name: "", email: "", password: "" });
        const [touched, setTouched] = useState({});
        const [sentName, setSentName] = useState(null);

        const errors = validate(values);
        const isValid = Object.keys(errors).length === 0;

        function handleChange(e) {
          setValues({ ...values, [e.target.name]: e.target.value });
        }

        function handleBlur(e) {
          setTouched({ ...touched, [e.target.name]: true });
        }

        function handleSubmit(e) {
          e.preventDefault();
          setSentName(values.name);
        }

        const show = (name) => (touched[name] ? errors[name] : "");

        return (
          <form onSubmit={handleSubmit}>
            <Field label="Name" name="name" type="text" value={values.name} error={show("name")} onChange={handleChange} onBlur={handleBlur} />
            <Field label="Email" name="email" type="text" value={values.email} error={show("email")} onChange={handleChange} onBlur={handleBlur} />
            <Field label="Password" name="password" type="password" value={values.password} error={show("password")} onChange={handleChange} onBlur={handleBlur} />
            <button type="submit" disabled={!isValid}>Sign up</button>
            {sentName && <p>Welcome, {sentName}!</p>}
          </form>
        );
      }

      function App() {
        return (
          <div>
            <h2>Sign up</h2>
            <SignupForm />
            <h3>Self-test of validate()</h3>
            <ul>
              {samples.map((s) => (
                <li key={s.label}>{s.label}: {summary(validate(s.values))}</li>
              ))}
            </ul>
          </div>
        );
      }

      export default App;
quiz:
  - q: Why is it better to compute errors from the values on every render than to keep them in their own state?
    options: ["State is not allowed to hold objects", "The errors can never get out of sync with the values, because they are derived from them", "Computed values make the component render less often"]
    answer: 1
    explain: "Whenever you can calculate something from existing state, calculate it. Two copies of the same truth will eventually disagree."
  - q: "What does the line { ...values, [e.target.name]: e.target.value } do?"
    options: ["Copies all the fields and replaces only the one whose name matches the input that changed", "Deletes every field except the one that changed", "Changes the old values object in place"]
    answer: 0
  - q: Why do we track which fields were touched?
    options: ["So that the browser can autofill them", "Because validate cannot run on empty fields", "So the user is not shown red error messages for fields they have not even visited yet"]
    answer: 2
  - q: What happens if a submit handler does not call e.preventDefault()?
    options: ["Nothing, React always prevents it", "The browser reloads the page and your state is lost", "The submit button is disabled forever"]
    answer: 1
---

A form that accepts anything is a form that eventually breaks something. **Validation** means checking what the user typed and telling them, kindly and early, what to fix. In this lesson you build a sign-up form with the three habits of a good React form: a pure validation function, errors that appear at the right moment, and a submit button that is switched off until everything is fine.

## Step 1: validation is just a function

The hardest-sounding part is actually the simplest. Write a plain function that takes the form values and returns an object of error messages:

```jsx
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (values.password.length < 8) errors.password = "Password needs 8 or more characters";
  return errors;
}

validate({ name: "", password: "abc" });
// { name: "Name is required", password: "Password needs 8 or more characters" }
```

A field that is fine simply gets no key. An empty object `{}` means "no problems". Because `validate` does not use React at all (it is **pure**: same input, same output), you can test it with example data. The exercise prints a "self-test" list so you can see right away that your rules work.

For the email we use a **regular expression**, a tiny pattern language for text. `/^\S+@\S+\.\S+$/` means: some non-space characters, an `@`, some more, a dot, some more. It is not perfect (real email rules are wild) but it catches the typical typos.

## Step 2: derive, do not store

Inside the component you keep the **values** in state, but you do not keep the errors in state:

```jsx
const errors = validate(values);
const isValid = Object.keys(errors).length === 0;
```

These lines run on every render, so the errors always match the current values. If you stored them in state you would have to remember to update them in every handler, and one day you would forget.

## Step 3: one handler for many inputs

Give each input a `name` attribute equal to its key in `values`. Then a single `handleChange` can serve all of them:

```jsx
function handleChange(e) {
  setValues({ ...values, [e.target.name]: e.target.value });
}
```

`...values` copies the old fields. `[e.target.name]` is a **computed key**: the square brackets mean "use the value of this expression as the property name". If the email box changed, the code reads as `email: "new text"`.

## Step 4: show errors at the right time

Showing "Name is required" the moment the page loads feels rude. The usual rule is: show a field's error only after the user has **touched** it, meaning they clicked into it and left again (the `onBlur` event). Keep a `touched` object in state, set `touched[name] = true` in `handleBlur`, and display `touched[name] ? errors[name] : ""`.

## Step 5: submit

```jsx
function handleSubmit(e) {
  e.preventDefault();   // do not reload the page
  // send the data somewhere
}

<button type="submit" disabled={!isValid}>Sign up</button>
```

`disabled={!isValid}` greys the button out until `validate` returns `{}`. Note that you should still validate on the **server** in real apps: anyone can bypass your browser code. Front-end validation is about being friendly, not about being safe.

> **Watch out:**
> - `Warning: A component is changing an uncontrolled input to be controlled`: a value started as `undefined`. Start every field with `""`, as the exercise does.
> - Typing in one field erases the others because you wrote `setValues({ [e.target.name]: e.target.value })` and forgot `...values`.
> - The page flashes and all your text disappears on submit: you forgot `e.preventDefault()`.
> - `Cannot read properties of undefined (reading 'trim')`: you called `validate` with something that has no `name` field.

## Going further

Try adding a "confirm password" field whose rule is `values.confirm !== values.password`, and a character counter beside the password.

> **Your turn:** finish `validate`, compute `errors` and `isValid` in `SignupForm`, write the three handlers (`handleChange`, `handleBlur`, `handleSubmit`) and make the button disabled while the form is invalid. The self-test list should then show the right message for each sample.
