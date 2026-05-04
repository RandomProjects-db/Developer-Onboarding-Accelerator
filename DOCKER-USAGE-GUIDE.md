# Docker Usage Guide for Developer Onboarding Accelerator

## 🐳 How Docker Can Be Used

You have **3 main Docker use cases** for this project:

---

## 1. **Local Development & Testing** (Most Common)

### Use Case
Run the entire tool in an isolated container without installing Node.js or dependencies on your local machine.

### Commands

**Build the image:**
```bash
docker build -t dev-onboarder .
```

**Run the CLI:**
```bash
docker run --rm \
  -v $(pwd)/output:/app/output \
  -e GROQ_API_KEY=your_key_here \
  dev-onboarder \
  node cli.js https://github.com/expressjs/express
```

**Run the Web UI:**
```bash
docker run --rm \
  -p 3000:3000 \
  -v $(pwd)/output:/app/output \
  -e GROQ_API_KEY=your_key_here \
  dev-onboarder \
  node server.js
```

Then open: `http://localhost:3000`

### What This Does
- **Isolated environment**: No conflicts with your local Node.js version
- **Volume mounting** (`-v`): Output files appear in your local `./output` folder
- **Port forwarding** (`-p 3000:3000`): Access web UI from your browser
- **Environment variables** (`-e`): Pass API keys securely

---

## 2. **Cloud Deployment** (Production)

### Use Case
Deploy your tool to cloud platforms like Railway, Render, Fly.io, or AWS.

### How It Works

**Railway Example:**
```bash
# Railway auto-detects Dockerfile and builds it
railway up
```

**Render Example:**
1. Connect your GitHub repo
2. Render detects `Dockerfile` automatically
3. Set environment variable: `GROQ_API_KEY=your_key`
4. Deploy → Your web UI is live at `https://your-app.onrender.com`

**Docker Hub + Any Cloud:**
```bash
# Build and push to Docker Hub
docker build -t yourusername/dev-onboarder .
docker push yourusername/dev-onboarder

# Pull and run anywhere
docker run -p 3000:3000 -e GROQ_API_KEY=key yourusername/dev-onboarder
```

### What This Enables
- **Production hosting**: Make your tool accessible via URL
- **Scalability**: Cloud platforms can auto-scale containers
- **CI/CD integration**: Automated deployments on git push
- **No server management**: Platform handles infrastructure

---

## 3. **CI/CD & Automated Testing**

### Use Case
Run tests in containers as part of your GitHub Actions or GitLab CI pipeline.

### Example GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t dev-onboarder-test .
      
      - name: Run tests in container
        run: |
          docker run --rm \
            -e GROQ_API_KEY=${{ secrets.GROQ_API_KEY }} \
            dev-onboarder-test \
            npm test
      
      - name: Test CLI against sample repo
        run: |
          docker run --rm \
            -v $(pwd)/test-output:/app/output \
            -e GROQ_API_KEY=${{ secrets.GROQ_API_KEY }} \
            dev-onboarder-test \
            node cli.js https://github.com/lodash/lodash
```

### What This Enables
- **Consistent test environment**: Same container every time
- **Parallel testing**: Run multiple containers simultaneously
- **Integration tests**: Test against real repos in isolation
- **Quality gates**: Block PRs if tests fail in container

---

## 🆚 Codespaces vs Docker: When to Use Each

| Scenario | Use Codespaces | Use Docker |
|----------|----------------|------------|
| **Hackathon judge testing** | ✅ Best (instant, no install) | ❌ Requires Docker installed |
| **Quick demo for users** | ✅ One-click in browser | ⚠️ Requires Docker knowledge |
| **Local development** | ⚠️ Requires GitHub account | ✅ Works offline |
| **Production deployment** | ❌ Not for production | ✅ Perfect for cloud hosting |
| **CI/CD pipelines** | ⚠️ Possible but complex | ✅ Standard practice |
| **Isolated testing** | ⚠️ Costs GitHub minutes | ✅ Free, runs locally |
| **Team collaboration** | ✅ Shared environment | ⚠️ Each person builds locally |

---

## 🎯 Recommended Setup for Your Project

### For Hackathon Judging
**Priority 1**: Codespaces (`.devcontainer/devcontainer.json`)
- Judges click button → instant demo
- No Docker knowledge required

### For Production Deployment
**Priority 2**: Document existing Dockerfile
- Add deployment instructions to README
- Show Railway/Render examples

### For Advanced Users
**Priority 3**: Docker Compose (optional)
- If you add a database or multiple services later

---

## 📝 Your Current Dockerfile

You already have this in your repo:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]  # Or "node", "server.js"
```

### What It Does
1. **Base image**: Uses Node.js 20 on Alpine Linux (small, fast)
2. **Working directory**: Sets `/app` as the container's working directory
3. **Dependencies**: Copies `package.json` and installs production dependencies
4. **Code**: Copies your entire project into the container
5. **Port**: Exposes port 3000 for the web UI
6. **Start command**: Runs `npm start` (or `node server.js`)

### How to Use It Right Now

```bash
# Build
docker build -t dev-onboarder .

# Run Web UI
docker run -p 3000:3000 -e GROQ_API_KEY=your_key dev-onboarder

# Run CLI (override CMD)
docker run --rm \
  -v $(pwd)/output:/app/output \
  -e GROQ_API_KEY=your_key \
  dev-onboarder \
  node cli.js https://github.com/expressjs/express
```

---

## 🚀 Quick Start Commands

### Test Locally with Docker
```bash
# 1. Build image
docker build -t dev-onboarder .

# 2. Run web UI
docker run -p 3000:3000 -e GROQ_API_KEY=your_key dev-onboarder

# 3. Open browser
open http://localhost:3000
```

### Deploy to Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy (auto-detects Dockerfile)
railway up

# 4. Set environment variable
railway variables set GROQ_API_KEY=your_key
```

---

## 💡 Bottom Line

**Codespaces** = Best for **demos and onboarding** (judges, new users)  
**Docker** = Best for **deployment and testing** (production, CI/CD)

Both serve different purposes. Add Codespaces first for the hackathon, then document Docker usage for production deployment.
