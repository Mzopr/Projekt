var express = require("express");
var router = express.Router();
var db = require("../db");
const config = require("../config");
var jsonwebtoken = require("jsonwebtoken");

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

/* GET users listing. */
router.get("/", function (req, res, next) {
  const sql = `SELECT * FROM famousPeople`;

  db.all(sql, [], (err, rows) => {
    if (err)
      return console.error("Błąd przy próbie pobrania klientów z bazy", err);
    const isAdmin = getIsAdmin(req.session.token, res);
    if (isAdmin === 0) {
      res.render("famousPeople/list", {
        title: "Sławni ludzie",
        username: getUserName(req.session.token, res),
        data: rows,
      });
    } else if (isAdmin === 1) {
      res.render("famousPeople/listAdmin", {
        title: "Sławni ludzie",
        username: getUserName(req.session.token, res),
        data: rows,
      });
    }
  });
});

router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;

  const sql = `SELECT * FROM famousPeople WHERE id=$1`;

  db.all(sql, [id], (err, rows) => {
    if (err) return console.error("Błąd przy próbie pobrania klientów", err);
    const isAdmin = getIsAdmin(req.session.token, res);
    if (isAdmin === 1) {
      res.render("famousPeople/edit", {
        title: `Edycja filmu: ${rows[0].imie}`,
        data: rows,
        username: getUserName(req.session.token, res),
      });
    } else {
      res.redirect("/famousPeople");
    }
  });
});

router.post("/edit/:id", (req, res, next) => {
  const { imie, nazwisko, wiek, czyŻywy } = req.body;
  const { id } = req.params;

  const isAdmin = getIsAdmin(req.session.token, res);
  if (isAdmin === 1) {
    const sql = `UPDATE famousPeople SET imie=$1, nazwisko=$2, wiek=$3, czyŻywy=$4 WHERE id=$5`;
    db.all(sql, [imie, nazwisko, wiek, czyŻywy, id], (err, result) => {
      if (err) return console.error("Błąd przy aktualizacji", err);
      res.redirect("/famousPeople");
    });
  } else {
    res.redirect("/famousPeople");
  }
});

router.get("/delete/:id", (req, res, next) => {
  const { id } = req.params;

  const isAdmin = getIsAdmin(req.session.token, res);
  if (isAdmin === 1) {
    const sql = `DELETE FROM famousPeople WHERE id=$1`;
    db.all(sql, [id], (err, result) => {
      if (err)
        return console.error("Błąd przy próbie usunięcia klienta z bazy", err);

      res.redirect("/famousPeople");
    });
  } else {
    res.redirect("/famousPeople");
  }
});



module.exports = router;
