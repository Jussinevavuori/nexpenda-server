

ECHO @ Starting migration script



ECHO @ Loading DEV environment

move .dev_env .env

cd ..



ECHO @ Creating migrations

call npx prisma migrate save --experimental



ECHO @ Running migrations on DEV

call npx prisma migrate up --experimental



ECHO @ Loading TEST environment

cd .\prisma

move .env .dev_env

move .test_env .env

cd ..



ECHO @ Running migrations on TEST

call npx prisma migrate up --experimental



ECHO @ Loading PROD environment

cd .\prisma

move .env .test_env

move .prod_env .env

cd ..



ECHO @ Running migrations on PROD

call npx prisma migrate up --experimental



ECHO @ Returning environments

cd .\prisma

move .env .prod_env



ECHO @ Generating Prisma client

cd ..

call npx prisma generate



ECHO @ Done

EXIT /B 0