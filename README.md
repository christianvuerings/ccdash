# ccdash - The CalCentral Dashboard

http://ccdash.herokuapp.com/

## Installation - Locally

### Prerequisites

* [NodeJS (0.10.x)](http://nodejs.org/)
* [Foreman](https://github.com/ddollar/foreman)
* [Nodemon](https://github.com/remy/nodemon#installation)

### Environment variables

Copy the template to the global `.env` file.

```
cp .env_template .env
```

Edit the `.env` file.

### Start server

```
foreman run nodemon server.js
```

## Installation - Heroku

### Set variable

```
heroku config:set GITHUB_USERNAME=x
```

### Push to Heroku

```
git push heroku
```

## Inspiration:

* http://dashboard.angularjs.org/ - [code](https://github.com/angular/dashboard.angularjs.org)
