# Practical 11: Containerization with Docker and Docker Compose

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To containerize the full-stack application (React frontend, Node/Express backend, and MongoDB database) using Docker and orchestrate all three services with Docker Compose to start the entire system with a single command.

---

## 2. Multi-Container Architecture

```text
docker-compose.yml
       ├── frontend   (React 19 Vite, built & previewed, port 5173:5173)
       ├── backend    (Node/Express API, port 5000:5000)
       └── mongodb    (Official Mongo 6 image, port 27017:27017, volume: mongo-data)

Network: app-network (Bridge)
       frontend ──► backend ──► mongodb
```

---

## 3. Project Structure

```text
practical-11/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose Task schema (reused from Practical 6)
│   ├── .dockerignore        # Excludes node_modules, .env, and logs
│   ├── Dockerfile           # Backend container build instructions
│   ├── package.json
│   └── server.js            # Express REST API connecting to mongodb://mongodb:27017
├── frontend/
│   ├── src/                 # Reusable React frontend
│   ├── .dockerignore        # Excludes node_modules and dist
│   ├── Dockerfile           # Multi-stage build & production preview
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml       # Multi-service orchestration config with bridge network & volumes
├── .gitignore
└── README.md
```

---

## 4. Dockerfiles and Compose Configuration

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### Orchestration (`docker-compose.yml`)
- **Inter-service Communication:** Backend references `mongodb://mongodb:27017/awdf_practical11` using Docker's internal DNS.
- **Data Persistence:** Uses named volume `mongo-data:/data/db` so MongoDB data remains intact across container restarts.
- **Isolated Network:** Services communicate on a private bridge network (`app-network`).

---

## 5. Answers to Key Lab Questions

### Q1: Why does the backend container need to reference the MongoDB container by its service name (e.g., `mongodb`) rather than `localhost`?
Inside Docker, each container has its own isolated network stack and unique loopback interface (`localhost`/`127.0.0.1`).
If the backend attempts to connect to `localhost:27017`, it looks for MongoDB running inside its *own* container, which fails.
Docker Compose provides automatic **service discovery via internal DNS**; referencing the service name `mongodb` resolves directly to the internal IP address of the MongoDB container on the shared bridge network.

### Q2: What is the difference between `EXPOSE` in a Dockerfile and the `ports` mapping in `docker-compose.yml`?
- **`EXPOSE` (Documentation):** Informs Docker and developers that the container listens on the specified network port at runtime. It does *not* publish or make the port accessible to the host machine.
- **`ports` (Port Forwarding):** Actually maps a port on the host machine to a container port (e.g. `"5173:5173"`). This makes the container accessible from your host machine browser (`http://localhost:5173`).

### Q3: Why is it considered bad practice to copy `node_modules` into a Docker image instead of running `npm install` inside the container?
1. **OS & Architecture Incompatibility:** Native binary modules (compiled with node-gyp or C++) compiled on the host OS (e.g., Windows x64) will fail or crash inside a Linux-based Docker container (`node:18-alpine`).
2. **Build Context Bloat:** The `node_modules` directory often contains tens of thousands of files, slowing down the `docker build` context transfer significantly.
Using `.dockerignore` to exclude `node_modules` and running `RUN npm install` inside the Dockerfile ensures a clean, platform-native installation.

---

## 6. How to Run the Entire Stack

### Single-Command Startup
To build and start all 3 containers:
```bash
cd d:/AWDF/practical-11
docker compose up --build
```

### Verify Running Containers
In another terminal:
```bash
docker ps
```
You will see 3 healthy containers running:
- `practical11-frontend` on port `5173`
- `practical11-backend` on port `5000`
- `practical11-mongodb` on port `27017`

### Access in Browser
- Frontend Task Manager: `http://localhost:5173`
- Backend API Status: `http://localhost:5000`

### Stop the Containers
```bash
docker compose down
```
*(Data in MongoDB is preserved inside the `mongo-data` volume!)*
