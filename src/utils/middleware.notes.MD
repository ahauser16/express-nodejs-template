# Notes about how to write middleware code according to D.R.Y.

## checkForPassword refactor

Instead of using the code below that repeats the check for the "dogbreath" password we can refactor it by creating a `checkForPassword` function in our `middleware.js` file which we can then import and use in our `app.js` file.

old code from `app.js`
```
app.get('/secret', (req, res, next) => {
    try {
        if (req.query.password !== 'dogbreath') {
            throw new ExpressError('Invalid password', 403);
        }
        return res.send("I LOVE HOUNDS!!!")
    } catch (err) {
        return next(err)
    }
})

app.get('/private', (req, res, next) => {
    try {
        if (req.query.password !== 'dogbreath') {
            throw new ExpressError('Invalid password', 403);
        }
        return res.send("You have reached the private page!")
    } catch (err) {
        return next(err)
    }
})
```

new code from `middleware.js`
```
function checkForPassword(req, res, next) {
    try {
        if (req.query.password !== 'dogbreath') {
            throw new ExpressError('Invalid password', 403);
        }
        res.send("You have reached the private page!")
    } catch (err) {
        return next();
    }
}
```

new code from `app.js`
```
app.get('/secret', middleware.checkForPassword, (req, res, next) => {
    return res.send("I LOVE HOUNDS!!!")
})

app.get('/private', middleware.checkForPassword, (req, res, next) => {
    return res.send("You have reached the private page!")
})
```

