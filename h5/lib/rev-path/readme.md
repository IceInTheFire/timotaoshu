# rev-path [![Build Status](https://travis-ci.org/sindresorhus/rev-path.svg?branch=master)](https://travis-ci.org/sindresorhus/rev-path)

> Create a [revved file path](http://blog.risingstack.com/automatic-cache-busting-for-your-css/)


## Install

```
$ npm install rev-path
```


## Usage

```js
const revPath = require('rev-path');
const hash = 'bb9d8fe615'

const path = revPath('src/unicorn.png', hash);
//=> 'src/unicorn-bb9d8fe615.png'

revPath('src/unicorn.png', Date.now());
//=> 'src/unicorn-1432309925925.png'

// You can also revert an already hashed path
revPath.revert(path, hash);
//=> 'src/unicorn.png'
```


## Related

- [rev-file](https://github.com/sindresorhus/rev-file) - Get the revved file path of a file


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
