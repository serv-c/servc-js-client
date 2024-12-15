# servc-js-client

JS client to interface with a Serv-C compatible server. Documentation can be found https://docs.servc.io

[![NPM version](https://img.shields.io/npm/v/servc)](https://img.shields.io/npm/v/servc)
![NPM Downloads](https://img.shields.io/npm/d18m/servc)

## Example

Here is the most simple example of use,

```javascript
import get from "servc";

const response = await poll(
  {
    route: "my-microservice",
    argument: {
      method: "my-microservice-method",
      inputs: 123123,
    },
  },
  "http://localhost:3000",
);

console.log(response);
/*
    {
    "id": "asdas-a123ad",
    "progress": 100,
    "statusCode": 200,
    "responseBody": myresponse,
    "isError": false
    }
*/
```
