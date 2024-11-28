# Create a Docker network
docker network create my_net

# Create a Docker volume for Database data
docker volume create my_vol

# Run Database container
docker run --name my_db --network my_net -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=store -v my_vol:/var/lib/postgresql/data -p 5432:5432 -d postgres

# Build Backend application Docker image
docker build -t my_backend -f .\backend\dockerfile .\backend

# Run Flask application container
docker run -d --name my_backend --network my_net -p 5000:5000 my_backend

# Build Frontend application Docker image
docker build -t my_frontend -f .\Frontend\your-project-name\dockerfile .\Frontend\your-project-name

# Run Frontend application container
docker run -d --name my_frontend -p 4200:4200 --network my_net my_frontend