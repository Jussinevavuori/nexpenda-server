ECHO @ Starting migration script


ECHO @ Moving default ENV
cd ..
move .env .env_temporary
cd ./prisma


ECHO @ Loading PROD environment
move .prod_env .env
cd ..


ECHO @ Creating migrations
call npx prisma migrate save --experimental


ECHO @ Running migrations on PROD
call npx prisma migrate up --experimental


ECHO @ Returning environments
cd .\prisma
move .env .dev_env


ECHO @ Generating Prisma client
cd ..
call npx prisma generate


ECHO @ Restoring default ENV
move .env_temporary .env
cd ./prisma


ECHO @ Done
EXIT /B 0