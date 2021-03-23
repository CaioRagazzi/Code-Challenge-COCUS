## Description

[COCUS] code challenge.
<br>
<br>
[Criterias]:

- Given an username and header Accept: application/json, list all his GiHub repositories which are not forks.
- The response should include: 1 - Repository Name 2- Owner username 3 - Each branch name and last commit's SHA.
- Given an username that does not exists in GitHub, return a 404 respose.
- Given a header Accept: application/xml, return 406 response.
- Error response should have the followin schema:
  ```
  {
  "status": RESPONSE_CODE,
  "message": WHY_IT_FAILED
  }
  ```
- Use https://developer.github.com/v3 as the backing API.
- Use any Node.js framework, libraries or tools that you see fit.
- Use good practices and impress us with your code.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Caio Ragazzi](https://www.caioragazzi.com/)
