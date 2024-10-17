const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const cache = require('nocache');
const PORT = 3000;
const username = 'mohd';
const password = '1234';
app.use(express.urlencoded({ extended: true }));
app.use(cache());
app.use(
    session({
        secret: 'your_secret_key',
        resave: false, 
        saveUninitialized: false, 
        cookie: {
            secure: false, 
            maxAge: 1000 * 60 * 60 * 24 
        }
    })
);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home');
    } else {
        res.redirect('/login');
    }
});
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/'); 
    } else {
        res.render('sign');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/login'); 
    });
});
app.post('/logs', (req, res) => {
    const { username: inputUsername, password: inputPassword } = req.body;
    if (inputUsername === username && inputPassword === password) {
        req.session.user = inputUsername; 
        res.redirect('/');
    } else {
        res.render('sign', { error: 'Incorrect username or password' }); 
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
