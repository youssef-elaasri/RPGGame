FROM python:3.9-slim

WORKDIR /app

COPY ./loader.sh /app/loader.sh
#COPY ./python_scripts/ /app/python_scripts/


# Set the default entrypoint to the loader script
ENTRYPOINT ["./loader.sh"]
