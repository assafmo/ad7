# ad7

Command line downloader for subtitles from addic7ed.com.

[![npm version](https://badge.fury.io/js/ad7.svg)](https://badge.fury.io/js/ad7)

## Installation

```
npm install -g ad7
```

## Options

```
Usage: node main.js [options]

Options:
  --lang: Subtitles languege or code (case insensitive)
    (default: "eng")
  --show: Show name
    (default: "")
  --s: Season
    (default: -1)
    (a number)
  --e: Episode
    (default: -1)
    (a number)
  --[no]hi: Hearing impaired
    (default: false)
```

## Usage examples

```bash
ad7 --show "the flash" --s 4 --e 8
ad7 --show "the flash" --s 4 --e 8 --lang english
ad7 --show "the flash" --s 4 --e 8 --hi
seq 1 4 | xargs -n 1 ad7 --show "the flash" --s 4 --e
```

## License

[MIT](/LICENSE)
