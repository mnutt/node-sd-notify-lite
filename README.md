# sd-notify-lite

## Rationale

[sd-notify](https://github.com/systemd/node-sd-notify) exists, but it links
against the native systemd library. `sd-notify-lite` uses unix sockets directly.
Reasons for using `sd-notify-lite`:

* easy to include and test on MacOS and Linux, even without systemd installed
* linking to things unnecessarily [can be dangerous](https://archlinux.org/news/the-xz-package-has-been-backdoored/)

## Dependencies

Relies on `unix-dgram` module, which works on MacOS and Linux. Does not work
on Windows.

## Installation

```
npm install sd-notify-lite
```

## Usage

`sd-notify-lite` relies on the `NOTIFY_SOCKET` and `WATCHDOG_USEC` environment
variables, which are typically set by systemd prior to executing your process.

```
const sdNotify = require('sd-notify-lite');

sdNotify.notifyReady(); // process is fully initialized
sdNotify.startWatchdog(); // periodically ping
```

## License

Copyright (c) 2024 Michael Nutt

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

