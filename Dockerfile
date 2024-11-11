FROM python:3.8

# Create a working directory
RUN mkdir /app
WORKDIR /app

# Copy the files in the current directory to the working directory
COPY . /app

# export FLASK env vars
ENV FLASK_APP=baxters_stuff
ENV PIP_ROOT_USER_ACTION=ignore

# Install required packages
RUN pip3 install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Expose port 80
EXPOSE 80

# Run the web service
CMD ["gunicorn", "inventory:create_app()", "-b", "0.0.0.0:80", "-w", "4", "-n", "baxters_inventory"]
