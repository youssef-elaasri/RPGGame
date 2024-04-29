FROM python:3.9-slim

WORKDIR /app

RUN ls -la

COPY ./loader.py /app/loader.py
#COPY ./python_scripts/ /app/python_scripts/


# Set the default entrypoint to the loader script
ENTRYPOINT ["python", "loader.py"]
