# Game App - Backend

## Installation & Configuration

1. Install dependencies via npm:

```bash
npm i # (for local setup)
```
Note: If you are facing any dependency issues, you can try  
```---legacy-peer-deps```.

2. Create .env file identical to example.env with valid values
3. We have used keyfile based jwt authentication, so you need to create a valid public and private key. You can create from here https://travistidwell.com/jsencrypt/demo/
4. You need to have twitch api key and secret. You can get it from here https://dev.twitch.tv/console/apps/
5. You need to have a valid postgresql database. You can create one from here https://www.postgresql.org/
6.To start the server

```bash
npm start or npm run start:dev
```

## API Reference

- Please get the `Game-App.postman_collection.json` file from directory and import it in postman.

## Folder Structure

Common structure that is used in this project is as following

```
.
└── src
    └── app
        └── module
            ├── module.entiry.js
            ├── module.controller.js
            ├── module.module.js
            └── module.service.js
```

| File                 | Usage/Description                                                                 |
|----------------------|-----------------------------------------------------------------------------------|
| module.entiry.js     | Entity will be used for define database model                                     |
| module.controller.js | Controller will be used for basic validation and send request to service          |
| module.module.js     | Module used for resolve other module and provider relationships and dependencies. |
| module.service.js    | In service file we write our main business login                                  |

## Migration
For running a migration, you need to run the following command
1. Update Database url in typeorm.json file
2. Run command ```npm run typeorm:run```

## Testing
For testing, you need to run the following command
1. Run command ```npm run test:e2e```

## Thank you for reading this documentation.
