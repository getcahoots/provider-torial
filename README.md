# Cahoots - Provider - torial

The torial provider module for the Cahoots provider abstraction

## Usage example

```js
var torial = require('@getcahoots/provider-torial');

var person = torial('person'); // or: 'organizations'

function onFind (err, persons) {
	if (err) {
		return console.error('Meh!');
	}

	console.log(persons[0]);
}

person.query({name: 'André König'}, onFind);
```

## Configuration

  * `CAHOOTS_PROVIDER_TORIAL_API_ENDPOINT`: The endpoint of the torial API.
  * `CAHOOTS_PROVIDER_TORIAL_DATABASE_PATH`: The path to the internal torial database.
  * `CAHOOTS_PROVIDER_TORIAL_SYNC_INTERVAL`: The sync interval in ms. Default `(60 * 1000) * 60 * 24` (24h).

## License

The MIT License (MIT)

Copyright (c) 2015 Cahoots, Germany <info@cahoots.pw>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
