FROM python:3.9

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the requirements file into the container
COPY ./requirements.txt ./

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set the environment variables
ENV FLASK_APP=main.py
ENV FLASK_ENV=development
ENV DATABASE_URL=postgresql://postgres:1234@my_db:5432/store


# Command to run the Flask application
CMD ["python", "main.py"]
