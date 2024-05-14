'use strict';

const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect route to eBird's login page
app.get('/login', (req, res) => {
    // Construct the URL to redirect the user to eBird's login page
    const loginUrl = 'https://secure.birds.cornell.edu/cassso/login';
    // Set the service parameter to a callback URL where eBird will redirect after login
    const callbackUrl = encodeURIComponent('http://localhost:3000/auth/callback');
    const redirectUrl = `${loginUrl}?service=${callbackUrl}`;
    
    // Redirect the user to eBird's login page
    res.redirect(redirectUrl);
});

// Route to handle eBird callback after login
app.get('/auth/callback', (req, res) => {
    // Extract session information from the query parameters
    const session = req.query.EBIRD_SESSIONID;
    if (session === undefined) {
        // Redirect to home page if session ID is undefined
        return res.redirect('/home.html');
    }
    // Output the session information to the browser
    res.send(`Session ID: ${session}`);
    //res.redirect('/home');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
