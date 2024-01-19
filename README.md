# Dokumentacja API

## Logowanie

### Generowanie widoku logowania

- **Metoda:** GET
- **Endpoint:** `/login`
- **Opis:** Widok logowania.

### Przesyłanie danych logowania

- **Metoda:** POST
- **Endpoint:** `/login`
- **Opis:** Przesyła dane logowania.
  - `login`
  - `haslo`

## Panel Administratora

### Renderowanie widoku panelu administratora

- **Metoda:** GET
- **Endpoint:** `/admin`
- **Opis:** Widok administratora.

### Wylogowywanie użytkownika

- **Metoda:** GET
- **Endpoint:** `/admin/logout`
- **Opis:** Wylogowuje użytkownika i usuwa sesję cookie.

### Dodawanie nowego użytkownika

- **Metoda:** GET
- **Endpoint:** `/admin/adduser`
- **Opis:** Widok do dodawania nowego użytkownika.

- **Metoda:** POST
- **Endpoint:** `/admin/adduser`
- **Opis:** Dodaje nowego użytkownika do systemu.
  - `imie`
  - `nazwisko`
  - `login`
  - `haslo`
  - `email`
  - `telefon`
  - `czyAdmin`

## Sławni Ludzie

### Edycja informacji o osobie

- **Metoda:** POST
- **Endpoint:** `/famouspeople/edit/:id`
- **Opis:** Edytuje informacje o osobie o określonym ID w bazie danych.
  - `imie`
  - `nazwisko`
  - `wiek`
  - `czyZywy`
  - `id`

### Usuwanie osoby

- **Metoda:** DELETE
- **Endpoint:** `/famouspeople/delete/:id`
- **Opis:** Usuwa osobę z bazy danych o określonym ID.

### Lista Sławnych Ludzi

- **Metoda:** GET
- **Endpoint:** `/famouspeople`
- **Opis:** Pobiera listę sławnych ludzi z bazy danych.