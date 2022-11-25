# Pupcheck

Simple file format for puppeteer-based End-to-end tests:

```
goto https://saltcorn.com
status 200
contains platform for building database
containsnot platform for building databse
```

## Command line tool

run with

`npx pupcheck`

```
pupcheck [-Hhv] [file ...]

Command line switches:

  -H         : Headful; open browser window
  -v         : verbose
  -h, --help : help

```

Chrome or chromium need to be installed and accessible. If this is in a non-standard location, set the
`PUPPETEER_CHROMIUM_BIN` environment variable.

## Upgrade

`npx clear-npx-cache` to delete an old version of pupcheck installed with `npx`, then run `npx pupcheck`0 again.

## pupcheck file commands

The pupcheck file consists of a number of one-word commands, followed by the arguments to that command.
If the command takes a free text argument, this will be the last argument and will consist of the rest of the line.

The command is case insensitive, so you can use camelCase.

`# This is a comment but only if # is first character`

If your selector has a space due to choosing a child element, wrap in parentheses.

### Permitted commands

- `goto {url}`

  Navigate to this URL

  Example: `goto https://google.com`

- `status {status code}`

  Assert this status code

  Example: `status 200`

- `contains {contents}`

  Assert this is in the page contents

  Example: `contains Tasks completed`

- `containsnot {contents}` (also `contains_not`)

  Assert this is in not in the page contents

  Example: `containsNot An error occurred`

- `click {selector}`

  Click the selected element and wait for navigation to complete

  Example: `click button#click_me`

- `type {selector} {text}`

  Type the text into the selected input element.

  Examples: `type input#full_name John Smith`, `type (#question-name input) Walt Whitman`

- `erase {selector} {nchars}`

  Erase characters from the selected input element.

  Examples: `erase input#full_name 9`

- `evaltrue {js-expr-string}` (also `eval_true`)

  Assert that this expression must evaluate to true

  Examples: `eval_true $("input#full_name").val()==="Miles Davis"`

- `sleep {milliseconds}`

  Sleep for this many milliseconds

  Example: `sleep 1000`

### Example pupcheck file

`example.pch` contents:

```
goto https://example.com/

# Login
type input#id_username egergerarg@gmail.com
type input#id_password grehq4hhq32534534t
click input[type=submit]

# Check dashboard loads
contains Tasks completed
```

How to run:

`npx pupcheck example.pch`
