ECHO @ Starting migration script

ECHO .
ECHO ##########################################
ECHO (01 / 13) Moving default .env
ECHO ##########################################
ECHO .
cd ..
move .env .env_temporary
cd ./prisma
ECHO .

ECHO .
ECHO ##########################################
ECHO (02 / 13) Loading .dev_env into .env
ECHO ##########################################
ECHO .
move .dev_env .env
cd ..
ECHO .

ECHO .
ECHO ##########################################
ECHO (03 / 13) Creating migrations in .dev_env
ECHO ##########################################
ECHO .
call npx prisma migrate save --experimental
ECHO .

ECHO .
ECHO ##########################################
ECHO (04 / 13) Running migrations in .dev_env
ECHO ##########################################
ECHO .
call npx prisma migrate up --experimental
ECHO .

ECHO .
ECHO ##########################################
ECHO (05 / 13) Loading .test_env into .env
ECHO ##########################################
ECHO .
cd .\prisma
move .env .dev_env
move .test_env .env
cd ..
ECHO .

ECHO .
ECHO ##########################################
ECHO (06 / 13) Creating migrations in .test_env
ECHO ##########################################
ECHO .
call npx prisma migrate save --experimental
ECHO .

ECHO .
ECHO ##########################################
ECHO (07 / 13) Running migrations in .test_env
ECHO ##########################################
ECHO .
call npx prisma migrate up --experimental
ECHO .

ECHO .
ECHO ##########################################
ECHO (08 / 13) Loading .prod_env into .env
ECHO ##########################################
ECHO .
cd .\prisma
move .env .test_env
move .prod_env .env
cd ..
ECHO .

ECHO .
ECHO ##########################################
ECHO (09 / 13) Creating migrations in .prod_env
ECHO ##########################################
ECHO .
call npx prisma migrate save --experimental
ECHO .

ECHO .
ECHO ##########################################
ECHO (10 / 13) Running migrations in .prod_env
ECHO ##########################################
ECHO .
call npx prisma migrate up --experimental
ECHO .

ECHO .
ECHO ##########################################
ECHO (11 / 13) Returning temporary environments
ECHO ##########################################
ECHO .
cd .\prisma
move .env .prod_env
ECHO .

ECHO .
ECHO ##########################################
ECHO (12 / 13) Generating prisma client
ECHO ##########################################
ECHO .
cd ..
call npx prisma generate
ECHO .

ECHO .
ECHO ##########################################
ECHO (13 / 13) Restoring default environment
ECHO ##########################################
ECHO .
move .env_temporary .env
cd ./prisma
ECHO .

EXIT /B 0