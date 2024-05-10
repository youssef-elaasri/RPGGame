FROM python:3.9-slim

WORKDIR /app

# Copy loader.sh into the /app directory in the container
COPY loader.sh /app/loader.sh

RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Set the default entrypoint to the loader script
ENTRYPOINT ["./loader.sh"]

