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

## pupcheck file commands

The pupcheck file consists of a number of one-word commands, followed by the arguments to that command.
If the command takes a free text argument, this will be the last argument and will consist of the rest of the line.

The command is case insensitive, so you can use camelCase.

`# This is a comment but only if # is first character`

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

- `containsnot {contents}`

  Assert this is in not in the page contents

  Example: `containsNot An error occurred`

- `click {selector}`

  Click the selected element and wait for navigation to complete

  Example: `click button#click_me`

- `type {selector} {text}`

  Type the text into the selected input element

  Example: `type input#full_name John Smith`

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
