<!-- command create project -->
- mkdir <name project>
- npm init
- npm install express body-parser dotenv nodemon typescript ts-node prisma @prisma/client @types/cors @types/morgan @types/helmet @types/compression @types/node @types/express --save-dev
- npm prisma init

<!-- migrateion prisma -->
- npx prisma migrate dev --name init 

<!-- intall sdk temporal -->
- npm i @temporalio/activity @temporalio/client @temporalio/common @temporalio/worker @temporalio/workflow   

<!-- install axios -->
- npm i axios

<!-- running temporal -->
- temporal server start-dev --db-filename temporal.db

<!-- running -->

- npm run worker
- npm run dev

<!-- auth frappe -->
# key
# 736960728528a1c
# secret
# 4d043b927a0449d