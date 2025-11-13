# 🚀 IoT Monitoring System

This project is an **IoT-based monitoring system** built with **Quasar Framework (Frontend)** and **Node.js (Express) Backend**, using **MySQL** as the database and **RabbitMQ** as the message broker.

---

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── .envex
│   └── README.md
└── frontend/
    ├── src/
    ├── quasar.config.js
    ├── package.json
    └── README.md
```

---

## ⚙️ System Requirements

- **Linux (Ubuntu/Debian recommended)**
- **Node.js** v18+
- **npm** or **yarn**
- **MySQL** 8+
- **RabbitMQ**
- **Git**

---

## 🧩 Project Installation

### 1. Clone the Repository
```bash
git clone https://github.com/username/project-name.git
cd project-name
```

---

## 🖥️ Backend Setup (Node.js + Express)

Go to the backend folder:
```bash
cd backend
```

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment file
Copy the `.envex` file to `.env`:
```bash
cp .envex .env
```

Edit the `.env` file as needed:
```bash
nano .env
```

Example content:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=iot_database

RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

### 3. Run Backend Server
```bash
npm run dev
```

The backend server will run at:  
👉 `http://localhost:5000`

---

## 🧠 Frontend Setup (Quasar)

Go to the frontend folder:
```bash
cd frontend
```

### 1. Install dependencies
```bash
npm install
```

### 2. Run frontend
```bash
quasar dev
```

The frontend app will run at:  
👉 `http://localhost:9000`

---

## 🐬 Install MySQL on Linux

### 1. Install MySQL
```bash
sudo apt update
sudo apt install mysql-server -y
```

### 2. Secure MySQL installation
```bash
sudo mysql_secure_installation
```

### 3. Access MySQL
```bash
sudo mysql -u root -p
```

### 4. Create Database & User
```sql
CREATE DATABASE notterdb;
CREATE USER 'iotuser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON notterdb.* TO 'iotuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🐇 Install RabbitMQ on Linux

### 1. Install Erlang (dependency)
```bash
sudo apt update
sudo apt install erlang -y
```

### 2. Install RabbitMQ
```bash
sudo apt install rabbitmq-server -y
```

### 3. Enable and start RabbitMQ
```bash
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
```

### 4. (Optional) Enable RabbitMQ Management Plugin
```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

Access RabbitMQ Dashboard at:  
👉 `http://localhost:15672`  
Default credentials:  
- **Username:** guest  
- **Password:** guest  

---

## 🧾 Troubleshooting

### Port already in use
Find and kill the process:
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### RabbitMQ not starting
Check status:
```bash
sudo systemctl status rabbitmq-server
```

If it fails, try restarting:
```bash
sudo systemctl restart rabbitmq-server
```

---

## 🧰 Quick Commands

### Backend
| Command | Description |
|----------|-------------|
| `npm run dev` | Run server in development mode |
| `npm start` | Run server in production mode |
| `cp .envex .env` | Copy default environment file |

### Frontend
| Command | Description |
|----------|-------------|
| `quasar dev` | Run development mode |
| `quasar build` | Build for production |

---


## ✨ Contributors
- **Romantsa** — Research & Development
  MAN 2 Kota Malang
