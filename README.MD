# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of URLs page"](https://raw.githubusercontent.com/DJVinyl/tinyapp/master/docs/Main%20Page.png)
!["Screenshot of Edit page"](https://raw.githubusercontent.com/DJVinyl/tinyapp/master/docs/Edit%20Page.png)
!["Screenshot of Login page"](https://raw.githubusercontent.com/DJVinyl/tinyapp/master/docs/Login%20Page.png)
!["Screenshot of Register page"](https://raw.githubusercontent.com/DJVinyl/tinyapp/master/docs/Register%20Page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs/bcrypt (5.0.0)
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Navigate to localhost:8080
- Register an account and begin making short URLs
- From there, add websites to create unique short URLS. Edit the website as you wish, or delete the website from your list of of shortURLs

## Future Development

- Add Database Implementation
- Add server-side storage of URLs
- Clean up CSS on login and register pages

____________________________

# Requirements of the project

### Display Requirements
- [x] Site Header:
  - if a user is logged in, the header shows:
    the user's email
    - a logout button which makes a POST request to /logout
  - if a user is not logged in, the header shows:
    - a link to the login page (/login)
    - a link to the registration page (/register)

  
### Behaviour Requirements

- [x] GET /
    - if user is logged in:
        - (Minor) redirect to /urls
    - if user is not logged in:
        - (Minor) redirect to /login

- [x] GET /urls
  - [x] if user is logged in:
    - returns HTML with:
      - the site header (see Display Requirements above)
      - a list (or table) of URLs the user has created, each list item containing:
        - a short URL
        - the short URL's matching long URL
        - an edit button which makes a GET request to /urls/:id
        - a delete button which makes a POST request to /urls/:id/delete
        - (Stretch) the date the short URL was created
        - (Stretch) the number of times the short URL was visited
        - (Stretch) the number number of unique visits for the short URL
      - (Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new
    - [x] if user is not logged in:
      returns HTML with a relevant error message
- [x] GET /urls/new
  - [x] if user is logged in:
    - returns HTML with:
    - the site header (see Display Requirements above)
    - a form which contains:
      - a text input field for the original (long) URL
      - a submit button which makes a POST request to /urls
  - [x] if user is not logged in:
      - redirects to the /login page

- [x] GET /urls/:id
  - [x] if user is logged in and owns the URL for the given ID:
    - returns HTML with:
    - the site header (see Display Requirements above)
    - the short URL (for the given ID)
    - a form which contains:
      - the corresponding long URL
      - an update button which makes a POST request to /urls/:id
    - (Stretch) the date the short URL was created
    - (Stretch) the number of times the short URL was visited
    - (Stretch) the number of unique visits for the short URL
  - [x] if a URL for the given ID does not exist:
    - (Minor) returns HTML with a relevant error message
  - [x] if user is not logged in:
    - returns HTML with a relevant error message
  - [x] if user is logged in but does not own the URL with the given ID:
    - returns HTML with a relevant error message

- [x] GET /u/:id
  - if URL for the given ID exists:
    - redirects to the corresponding long URL
  - if URL for the given ID does not exist:
    - (Minor) returns HTML with a relevant error message

- [x] POST /urls
  - if user is logged in:
    - generates a short URL, saves it, and associates it with the user
    - redirects to /urls/:id, where :id matches the ID of the newly saved URL
  - if user is not logged in:
    - (Minor) returns HTML with a relevant error message

- [x] POST /urls/:id
  - [x] if user is logged in and owns the URL for the given ID:
    - updates the URL
    - redirects to /urls
  - [x] if user is not logged in:
    - (Minor) returns HTML with a relevant error message
  - [x] if user is logged it but does not own the URL for the given ID:
    - (Minor) returns HTML with a relevant error message
  - [x] POST /urls/:id/delete
    - if user is logged in and owns the URL for the given ID:
      - deletes the URL
      - redirects to /urls
    - if user is not logged in:
      - (Minor) returns HTML with a relevant error message
    - if user is logged it but does not own the URL for the given ID:
      - (Minor) returns HTML with a relevant error message

- [x] GET /login
  - [x] if user is logged in:
    - (Minor) redirects to /urls *****
  - [x] if user is not logged in:
    - returns HTML with:
    - a form which contains:
      - input fields for email and password
      - submit button that makes a POST request to /login

- [x] GET /register
  - [x] if user is logged in:
    - (Minor) redirects to /urls  *****
  - [x] if user is not logged in:
    - returns HTML with:
    - a form which contains:
      - input fields for email and password
      - a register button that makes a POST request to /register

- [x] POST /login
  - if email and password params match an existing user:
    - sets a cookie
    - redirects to /urls
  - if email and password params don't match an existing user:
    - returns HTML with a relevant error message

- [x] POST /register
  - if email or password are empty:
    - returns HTML with a relevant error message
  - if email already exists:
    - returns HTML with a relevant error message
  - otherwise:
    - creates a new user
    - encrypts the new user's password with bcrypt
    - sets a cookie
    - redirects to /urls

- [x] POST /logout
  - deletes cookie
  - redirects to /urls
