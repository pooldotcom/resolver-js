# resolver-js

This resolver resolves domains on the following web3 domain platforms: 

* Infinity Domains by [Pool.com](https://pool.com) Resolver
* [ENS Domains](https://ens.domains/)
* [Unstoppable Domains](https://unstoppabledomains.com/)

More to come! If you want to see support of another one, please create an issue or a pull request. 

## Demo

[Demo](https://pooldotcom.github.io/resolver-js/)

## Using the library

We've tried to make this as simple as possible and it doesn't get much simpler than this:

```js
// import the resolver library
import { resolve } from 'https://cdn.jsdelivr.net/gh/pooldotcom/resolver-js@0/resolver.js'

// then use it with
let answer = await resolve(name, {type:"ETH"})
console.log(answer)
```

* `type` in the options can be anything the particular domain provider supports, such as ETH, BTC, REDIR 

## Run demo locally

Run `make run`
