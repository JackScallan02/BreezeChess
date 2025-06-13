# puzzle_service/Dockerfile

# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# - build-essential: Provides essential build tools like gcc, make, etc.
# - libpq-dev: Provides PostgreSQL client development libraries, including pg_config.
# - python3-dev: Provides Python header files needed for compiling Python C extensions.
#
# The `&& rm -rf /var/lib/apt/lists/*` command is used to clean up the
# apt cache layers, which helps in reducing the final Docker image size.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container at /app
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run main.py when the container launches
# Use --host 0.0.0.0 to make it accessible from other containers
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
