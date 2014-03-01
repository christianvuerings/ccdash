# ccdash - The CalCentral Dashboard

http://ccdash.herokuapp.com/

## Configuration

### Environment variables

Copy the template to the global `.env` file.

```
cp .env_template .env
```

Edit the `.env` file.

## Start server

```
foreman run nodemon server.js
```

## Heroku

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
