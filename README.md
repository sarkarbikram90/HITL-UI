# 🚀 HITL-UI — Human-in-the-Loop Remediation Console

> **Automated Agent-Based Execution with Human Oversight for Infrastructure Alerts**

---

## 🧠 What is HITL-UI?

HITL-UI is a **production-inspired incident response console** that combines:

* 🤖 **AI-driven anomaly detection & remediation suggestions**
* 👨‍💻 **Human-in-the-loop approval workflows**
* ⚙️ **Automated execution with full auditability**

It simulates a real-world system where infrastructure issues are:

> **Detected → Analyzed → Proposed → Approved → Executed → Logged**

---

## 🎯 Why this matters

Modern infrastructure teams face:

* 🚨 Alert fatigue (too many signals, not enough context)
* 🧯 Slow manual remediation
* 🔍 Lack of auditability for automated actions

HITL solves this by introducing a **controlled automation layer**:

* AI suggests actions
* Humans validate decisions
* System executes safely
* Everything is tracked

---

## 🏗️ System Architecture (High-Level)

```text
[ Monitoring System ]
        ↓
[ Anomaly Detection Engine ]
        ↓
[ HITL Console UI ]
        ↓
[ Human Approval Layer ]
        ↓
[ Execution Engine ]
        ↓
[ Audit & Logging System ]
```

> ⚡ Currently implemented with a **mock simulation layer** (no backend required)

---

## ✨ Key Features

### 🔍 Incident Management

* View anomalies across infrastructure
* Filter by severity, category, resource
* Real-time status updates (via polling)

---

### 🧩 Right-Side Action Panel

* Non-blocking workflow (no modals)
* Full incident context:

  * Description
  * RCA notes
  * Proposed commands
  * VPC / firewall checks

---

### ⚙️ Execution Simulation

* Simulated command execution
* Success / failure scenarios
* Configurable failure rates

---

### 🧾 Audit Trail

* Every action is logged:

  * Who approved/rejected
  * When it happened
  * What changed
* Timeline-style visibility

---

### 🧪 Debug Control Center

* Inject custom incidents
* Control failure rates
* Force execution outcomes
* Simulate real-world chaos scenarios

---

### 🔄 Real-Time Behavior (Polling)

* Auto-refresh incidents
* Live execution updates
* Dynamic audit log updates

---

### 🎨 Theme Support

* Light / Dark / System modes
* Clean, operator-focused UI

---

## 🖥️ UI Preview

> Add screenshots here 👇

* Incident Dashboard
* Right-side Remediation Panel
* Debug Simulation Page

---

## ⚙️ Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/sarkarbikram90/HITL-UI.git
cd HITL-UI/frontend
```

---

### 2. Install dependencies

```bash
npm ci
```

---

### 3. Start the app

```bash
npm run dev
```

---

### 4. Open in browser

```
http://localhost:3000   (Next.js)
or
http://localhost:5173   (Vite)
```

---

## 🧪 Running Tests

### Run tests (watch mode)

```bash
npm run test
```

### Run with coverage

```bash
npm run test:coverage
```

---

## 🧱 Project Structure

```text
frontend/
  ├── src/
  │   ├── components/        # UI components (Panel, Table, Actions)
  │   ├── mocks/             # Mock API (incidents, audit, execution)
  │   ├── hooks/             # Custom hooks (polling, state)
  │   ├── pages/             # Routes (dashboard, debug)
  │   └── tests/             # Unit + interaction tests
  ├── vitest.config.ts
  └── package.json
```

---

## 🔄 Workflow Simulation

Example lifecycle:

1. 🚨 Incident detected (e.g., High CPU usage)
2. 🤖 System proposes remediation command
3. 👨‍💻 User reviews and approves
4. ⚙️ Execution runs (success/failure simulated)
5. 🧾 Audit log records the action
6. 📊 UI updates in real-time

---

## 🧪 Simulation Capabilities

* Adjustable failure rates
* Forced success/failure execution
* Dynamic incident injection
* Real-time state transitions

---

## 🔐 Engineering Highlights

* ✅ Fully mocked backend (API simulation)
* ✅ Deterministic CI with `npm ci`
* ✅ Unit + interaction testing (Vitest + RTL)
* ✅ Coverage enforcement
* ✅ Clean state management
* ✅ Modular architecture

---

## 🧭 Roadmap

* 🔜 Real backend (Go / Node API)
* 🔜 WebSocket-based real-time updates
* 🔜 Scenario engine (incident storms, cascading failures)
* 🔜 Role-based access control (RBAC)
* 🔜 Integration with cloud providers (AWS SSM, GCP)

---

## 🚀 Vision

HITL is evolving toward a system where:

> **AI handles scale, humans provide control, and systems execute safely**

This project is a step toward building:

* Autonomous remediation systems
* Trustworthy AI-driven infrastructure tooling
* Next-gen observability platforms

---

## 🤝 Contributing

Contributions are welcome. Open an issue or submit a PR.

---

## 📄 License

MIT License

---

## 👤 Author

**Bikram Sarkar**
Senior Engineer — Infrastructure, Observability, AI Systems

---

## ⭐ If you like this project

Give it a star — it helps visibility and motivation 🚀
