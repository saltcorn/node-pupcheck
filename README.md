# node-pupcheck

Simple file format for puppeteer-based End-to-end tests

### Command line tool

run with

`npx pupcheck`

```
pupcheck [-Hhv] [file ...]

Command line switches:

  -H         : Headful; open browser window
  -v         : verbose
  -h, --help : help

```

### pupcheck file (\*.pch) commands:

`# This is a comment but only if # is first character`

```
goto {url}
  Navigate to this URL
  Example: goto https://google.com

status {status code}
  Assert this status code
  Example: status 200

contains {contents}
  Assert this is in the page contents
  Example: contains Tasks completed

containsnot {contents}
  Assert this is in not in the page contents
  Example: contains An error occurred

click {selector}
  Click the selected element and wait for navigation to complete
  Example: click button#click_me

type {selector} {text}
  Type the text into the selected input element
  Example: type input#full_name John Smith

sleep {milliseconds}
  Sleep for this many milliseconds
  Example: sleep 1000
```

Example pupcheck file:

`example.pch` contents:

```
goto https://example.com/
type input#id_username egergerarg@gmail.com
type input#id_password grehq4hhq32534534t
click input[type=submit]
contains Tasks completed
```
