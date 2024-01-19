var express = require("express")
var router = express.Router();
var bcrypt = require("bcrypt")
var db = require("../db")
const config = require('../config')
var jsonwebtoken = require('jsonwebtoken');
const logs = require("../logs/logs");

router.get('/logout', (req, res, next)=> {
    const userName = getUserName(req.session.token, res);

    logs.info(userName+ 'logout');
    res.clearCookie('session');
    res.redirect('/login')
})

const loggedIn = (req, res, next) => {
    try {
        const sessionToken = req.session.token;
        const tokenVerify = jsonwebtoken.verify(sessionToken, config.SECRET);
        return next()
    } catch (e) {
        return res.redirect("/login")
    }
}

function getIsAdmin(token, res) {
    try {
      const tokenVerify = jsonwebtoken.verify(token, config.SECRET);
      return tokenVerify.czyAdmin;
    } catch (e) {
      return res.redirect("/login");
    }
}

function getUserName(token, res) {
    try {
      const tokenVerify = jsonwebtoken.verify(token, config.SECRET);
      return tokenVerify.login;
    } catch (e) {
      return res.redirect("/login");
    }
  }


router.all('*', loggedIn, (req, res, next) => {
    const isAdmin = getIsAdmin(req.session.token, res);
    if (isAdmin !== 1) {
        return res.redirect("/famousPeople")
    }

    next()
})


router.get('/', function (req, res, next) {
    res.render("admin/welcome", {
        title: "Admin - strona powitalna",
    });
})

router.get('/adduser', function (req, res, next) {
    try {
        res.render("admin/addUser", {
            title: "Admin - dodawanie użytkownika",
            message: "",
            username: ""
        })
    } catch (e) {
        return next(e)
    }
})


router.post("/adduser", function (req, res, next) {
    const { imię, nazwisko, login, hasło, email ,telefon, czyAdmin } = req.body

    const sql = `SELECT * FROM users WHERE login=$1 LIMIT 1`;

    db.all(sql, [login], async (err, rows) => {
        if (err) return console.error("Błąd przy próbie odczytu z bazy", err.message);

        if (rows.length === 1) {
            return res.render("admin/addUser", {
                title: "Admin - dodawanie użytkownika",
                message: "Użytkownik już istnieje",
                username: ""
            })
        }

        const hashedPassword = await bcrypt.hash(hasło, 10);

        const sqlInsert = `INSERT INTO users(imię, nazwisko, login, hasło, email ,telefon, czyAdmin) VALUES($1, $2, $3, $4, $5, $6, $7)`;

        db.all(sqlInsert, [imię, nazwisko, login, hashedPassword, email, telefon, czyAdmin], (err, rows) => {
            if (err) {
                console.error("Błąd przy próbie zapisu do bazy", err.message);
                res.render("admin/addUser", {
                    title: "Admin - dodawanie użytkownika",
                    message: `Błąd przy próbie zapisu do bazy ${err.message}`,
                    username: ""
                })
            }

            res.render("admin/addUser", {
                title: "Admin - dodawanie użytkownika",
                message: "Użytkownik został dodany",
                username: ""
            })

        })

    })

})

module.exports = router