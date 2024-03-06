# semanteilay-server

noder neder

# to run locally hook postgresql with docker image

docker run --name semanteilay-db -e POSTGRES_PASSWORD=pgsql10 -d -p 5432:5432 postgres

PORT=9000
DATABASE_URL=postgresql://postgres:pgsql10@localhost:5432

in .env 

