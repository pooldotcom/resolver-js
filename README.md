# resolver-js

Infinity Domains by [Pool.com](https://pool.com) Resolver

## Demo

[Demo](https://pooldotcom.github.io/resolver-js/)

## Using the library

We've tried to make this as simple as possible and it doesn't get much simpler than this:

```js
// import the resolver library
import { resolve } from 'https://cdn.jsdelivr.net/gh/treeder/resolver-js@main/resolver.js'

// then use it with
let metadata = await resolve(name)
console.log(metadata)
```

## Run demo locally

Run `python -m http.server 3000`
