# Milestone 3

This is a [T3 Stack](https://create.t3.gg/) project

- MySQL for the database
- Prisma for ORM
- NextJS fullstack framework
- AntDesign UI framework

## Installation

1. Install [Node.js](https://nodejs.org/en)

2. Navigate to the project

```
cd milestone3
```

3. Install the packages

```
npm install
```

4. Create an `.env` at the same level of the `.env.example` file

```
touch .env
```

5. Copy the example file `.env.example` text into the .env file

```
DATABASE_URL="mysql://[USERNAME]:[PASSWORD]@[URL]:[PORT]/[DB NAME]?schema=public"

NEXTAUTH_URL="http://localhost:3000"

NEXTAUTH_SECRET="secret string here"
```

5. Replace `DATABASE_URL` with your MySQL database information that is locally hosted on your machine

Example

```
DATABASE_URL="mysql://root:password123@localhost:3306/milestone3?schema=public"
```

6. Generate the database models with prisma

```
npx prisma migrate dev --name init
```

7. Load in the role tables with ID 1 being instructor and ID 2 being student. Sign in requires that these tables are here for referential integrity.

8. Run the development server then do to [http://localhost:3000/](http://localhost:3000/)

```
npm run dev
```
