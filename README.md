# devChart - Android Club Collaboration Hub

An interactive, full-stack Kanban task management and collaboration pipeline built for the **Android Club Recruitment Task 2026 (Technical Department)**. This platform features cross-column task advancement, real-time query searching, multi-tier priority filtering, team member assignments, and a nested database comment logger.

---

## 🚀 Features Implemented

* **Unified Agile Workflow Panel:** A fully integrated screen combining an immediate task generation console with active task tracking lanes (**To Do**, **In Progress**, and **Done**).
* **State-Driven Column Shifting:** Features dynamic functional controls (`← Back`, `Advance →`, and `Finish ✓`) to handle linear step-by-step task progression across status boundaries.
* **Instant Query Search Engine:** A client-side text filtering algorithm that matches key-inputs against task titles and descriptions in real time.
* **Multi-Tier Priority Categorization:** Interactive pill-based controls to slice task views dynamically by structural urgency tags (`High`, `Medium`, `Low`, or `All`).
* **Team Assignee Mapping:** Hardware and software tasks mapped directly to specific core developers via structural dropdown configurations during creation.
* **Persistent Threaded Feedback Logs:** Append-only database schemas supporting real-time team commentary logs directly attached to individual card instances.

---

## 🛠️ Technology Stack Used

* **Frontend Framework:** Next.js (App Router, React 18, TypeScript)
* **Database Management:** MongoDB Atlas (NoSQL cloud persistence layer)
* **Object Modeling ODM:** Mongoose (Strict schema validation)
* **Styling Engine:** Tailwind CSS & Lucide Icons (Responsive layout UI patterns)
* **Hosting & Deployment Platform:** Vercel (Production server runtime)

---

## 📸 Screenshots of the Working Website

### 1. Main Unified Collaboration Hub
![Integrated Workspace Layout](https://raw.githubusercontent.com/arsujithkumar06-byte/devChart/main/public/screenshots/dashboard_main.png)
*(Displays active workflow columns, live input controls, assignment tags, and interactive inline comment logs)*

### 2. Live Task Filtering & Contextual States
![Contextual Dashboard Interface](https://raw.githubusercontent.com/arsujithkumar06-byte/devChart/main/public/screenshots/dashboard_view.png)
*(Visual rendering of high-contrast task lanes displaying individual card priorities, metrics, and state management buttons)*

### 3. Creation Workspace Component Page
![Creation Console Portal Interface](https://raw.githubusercontent.com/arsujithkumar06-byte/devChart/main/public/screenshots/create_task.png)
*(Dedicated interface routing endpoint built to handle schema ingestion structures)*

---

## ⚙️ Setup Instructions

Follow these instructions to configure and run the repository locally:

### 1. Clone the Code Repository
```bash
git clone [https://github.com/arsujithkumar06-byte/devChart.git](https://github.com/arsujithkumar06-byte/devChart.git)
cd devChart

## ⚠️ Known Limitations
* **Ephemeral State Sync on Hard Reloads:** While task creation and column updates persist perfectly across the cloud network, the application currently relies on synchronous client-side routing state to balance column configurations. Performing a hard browser refresh can occasionally cause a brief visual delay while fetching the latest statuses from the MongoDB cluster.
* **Absence of Server-Side Form Validation:** The client application enforces basic frontend validation (such as preventing completely blank input submissions). However, the backend API endpoints currently lack independent request body validation schemas to sanitize payloads before database ingestion.
* **Open Mutation Control Rules:** The platform is designed as an open internal collaboration tool for the club's sprint teams. As a result, it does not include role-based authentication layers or restricted access-control guards—meaning any user accessing the deployed URL has global permission to append comments, modify task cards, or shift lane columns.