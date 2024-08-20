<div align="center">
  <h1>Kidzo</h1>
  <img src=https://res.cloudinary.com/dkhpios4h/image/upload/v1723943215/github/kidzo/onfjrgxovrsr1wq4zmas.png width=400>
</div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

## ❔ About Project

This project is designed to make the learning process more enjoyable for children, while making it easier for parents or teachers to monitor their progress.

## 🛠️ Tech Stack

This project was built using these technologies.

- [NextJS](https://nextjs.org/) 🚀
- [NextAuth.js](https://next-auth.js.org/) with Google OAuth 🔐
- [TailwindCSS](https://tailwindcss.com/) and [NextUI](https://nextui.org/) 🎨
- [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) 🗄️

## Variabel env

### NextAuth

Generate a safe NextAuth Secret using this command:

```
openssl rand -base64 32
```

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### Google OAuth

You can get it from [Google API Console](https://console.developers.google.com/)

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### PostgreSQL Prisma

You can create it with [Vercel Postgree](https://vercel.com/docs/storage)

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

## 🚀 Deployment

### Dev (local) 🖥️

- Clone the repository

  ```bash
  git clone https://github.com/gbagush/kidzo.git
  ```

- Move to project directory

  ```bash
  cd kidzo
  ```

- Install all dependecies

  ```bash
  npm install
  ```

- Setup your environment variables, you can see `.env.example` for the example

- Apply prisma schema

  ```bash
  npm exec prisma migrate dev
  ```

- Generate prisma client

  ```bash
  npm exec prisma generate
  ```

- Run project localy

  ```bash
  npm run dev
  ```

Finaly, you can access that website on http://localhost:3000/ by default.

### Production (Vercel) 🌍

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgbagush%2Fkidzo%2Ftree%2Fmain&env=NEXTAUTH_URL,NEXTAUTH_SECRET,GOOGLE_CLIENT_ID,POSTGRES_PRISMA_URL,POSTGRES_URL_NON_POOLING)

- Click that button

- Fill your environment variables

- ✨ Daboom! Your website its ready

## 🎯 ToDo List

- [ ] More games 🎲
- [ ] Better stas page 📊
- [ ] More exciting gameplay 🎉

## ✊ Show Your Support

Give me a ⭐ if you like this project.

[contributors-shield]: https://img.shields.io/github/contributors/gbagush/kidzo.svg?style=for-the-badge
[contributors-url]: https://github.com/gbagush/kidzo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/gbagush/kidzo.svg?style=for-the-badge
[forks-url]: https://github.com/gbagush/kidzo/network/members
[stars-shield]: https://img.shields.io/github/stars/gbagush/kidzo.svg?style=for-the-badge
[stars-url]: https://github.com/gbagush/kidzo/stargazers
[issues-shield]: https://img.shields.io/github/issues/gbagush/kidzo.svg?style=for-the-badge
[issues-url]: https://github.com/gbagush/kidzo/issues
[license-shield]: https://img.shields.io/github/license/gbagush/kidzo.svg?style=for-the-badge
[license-url]: https://github.com/gbagush/kidzo/blob/master/LICENSE
