FROM python:3.11

ENV TZ=Asia/Kolkata \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app
COPY . /app

# Add Microsoft GPG key and repo securely (apt-key is deprecated)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    unixodbc-dev \
    curl \
    gnupg \
    poppler-utils && \
    mkdir -p /etc/apt/keyrings && \
    curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/keyrings/microsoft.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/10/prod buster main" > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

CMD ["python3", "main.py"]
