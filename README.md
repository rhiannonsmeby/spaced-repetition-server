# Spaced Repetition API

## Live app: https://spaced-repetition-rhiannon.vercel.app
## Client repo: https://github.com/rhiannonsmeby/spaced-repetition-client

## Summary

The Spaced Repetition app is a demonstration of the spaced repetition revision technique for learning vocabulary in a foriegn language. Currently, only French is supported, but you can fork this repo and the corresponding server repo if you would like to expand it to include additional languages.

## API Documentation
### Base URL: https://peaceful-savannah-33351.herokuapp.com/api

### Responses
This API returns json responses in the following format
```javascript
{
    "error": "message"
}
```

### Endpoints

#### BaseURL/auth
##### /token
POST - Enables the user to submit login credentials
PUT - Refreshes the auth token

#### BaseURL/language
GET - Returns the user's language data
##### /head
GET - Returns the next word and its data
##### /guess
POST - Enables the user to submit a guess for the translation of the word

### Status codes
* 200 OK
* 201 CREATED
* 400 BAD REQUEST
* 500 INTERNAL SERVER ERROR


## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
