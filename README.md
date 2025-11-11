
# Gopam: AI-Powered Recipe & Ingredient Management System

## Project Description

## Project Overview

Gopam is a modern, **full-stack application** designed to revolutionize home cooking, ingredient management, and meal planning. It seamlessly integrates traditional relational data (recipes, pantry inventory) with cutting-edge **Artificial Intelligence and Machine Learning (AI/ML)** capabilities to deliver highly personalized recipe recommendations, smart ingredient substitutions, and real-time food waste analysis.

This project is highly relevant in the current tech landscape, solving a common household problem by combining a classic database challenge with modern, interactive AI features to create a powerful, intuitive user experience.

---

## 💡 Case Study: The Home Chef's Dilemma

The primary problem Gopam solves is the **"What can I cook with what I have?"** dilemma, aimed at reducing food waste and optimizing meal preparation. 

* **Problem:** Home chefs often have disorganized pantries and struggle to find relevant recipes without manually cross-referencing items. This leads to **food waste** from forgotten ingredients and inefficient grocery shopping.
* **Gopam's Solution (Latest Features):**
    * **Pantry-to-Plate Matching:** Users log their current pantry items via the dedicated **`/api/pantry`** endpoint. The AI backend analyzes this inventory against the entire recipe database.
    * **AI-Driven Recommendation:** Using a sophisticated **content-based recommendation engine** (e.g., leveraging ingredient tags, user history, and nutritional data), Gopam suggests recipes that maximize the use of available ingredients.
    * **Smart Meal Planning:** The **`/meal-plan`** feature allows users to generate full weekly menus based on dietary needs and existing inventory, minimizing trips to the store and significantly reducing food waste.
---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Database (SQL)** | **SQLAlchemy / PostgreSQL** | Robust ORM (SQLAlchemy) for reliable data handling, connected to a powerful, feature-rich database (PostgreSQL is recommended). |
| **Authentication** | **JWT (JSON Web Tokens)** | Industry standard for secure, stateless user authentication, managed via helper functions in `api/dependencies.py`. |
| **Backend (Server)** | **Python (FastAPI)** | Modern, high-performance web framework. Excellent for fast APIs and integrates seamlessly with Python's leading AI/ML libraries (TensorFlow, PyTorch, Scikit-learn). |
| **Frontend (Client)** | **React with Next.js** | Next.js enables Server-Side Rendering (SSR) for fast loading and SEO. React provides a modern, component-based UI for complex interfaces (meal planning, interactive ingredient lists). |
| **Styling/UI** | **Tailwind CSS / Shadcn UI** | Utility-first CSS for rapid styling and a collection of accessible, pre-built UI components (`Button`, forms) for a professional user experience. |
| **Development OS** | **Windows** | |
| **CLI** | **PowerShell** | |
| **Code Editor** | **Visual Studio Code (VS Code)** | |

---

## 📂 Project File Structure

The project uses a clean, two-part **Monorepo structure** (Client/Server) with a flattened backend for easier development and deployment using Uvicorn.

```
gopam/
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── users.py       # User management (Auth, Profile)
│   │   │   ├── recipes.py     # Recipe CRUD and search
│   │   │   ├── pantry.py      # Inventory/Pantry Item management
│   │   │   └── ai.py          # AI recommendations, recipe generation
│   │   └── dependencies.py   # Auth (JWT) and Password Hashing logic
│   ├── models/
│   │   ├── __init__.py        # Initializes package (Required for imports)
│   │   ├── user.py
│   │   ├── recipe.py
│   │   ├── ingredient.py
│   │   └── pantry_item.py     # Assumed model for pantry tracking
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py            # Pydantic schemas (UserCreate, Token)
│   │   ├── recipe.py
│   │   └── pantry.py          # Pydantic schemas (PantryItem, etc.)
│   ├── services/
│   │   ├── recipe_matcher.py
│   │   └── ai_recommender.py
│   ├── tests/
│   │   └── test_api.py
│   ├── main.py                # FastAPI entry point (Moved to root)
│   ├── config.py              # Configuration settings (Moved to root)
│   ├── database.py            # SQLAlchemy engine and get_db() (Moved to root)
│   ├── requirements.txt       
│   ├── .env.example
│   └── alembic.ini            
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── recipes/
│   │   │   │   └── page.tsx
│   │   │   ├── pantry/
│   │   │   │   └── page.tsx
│   │   │   ├── meal-plan/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx         
│   │   │   └── page.tsx           
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── button.tsx     # Generic UI button (Needed for MealPlanner)
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── MealPlanner.tsx   # Main meal planner component
│   │   │   └── Footer.tsx         # Global footer
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── package.json               
│   ├── tsconfig.json
│   └── next.config.js
├── database/
│   └── init.sql                   
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to set up and run the Gopam project locally.

### Prerequisites

* Python 3.10+
* Node.js & npm
* PostgreSQL or SQLite (for local development simplicity)

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd gopam/backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate  # On Windows PowerShell
    # source venv/bin/activate # On Linux/macOS
    ```
3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure environment variables:** Create a `.env` file based on `.env.example` and set your database connection URL (`DATABASE_URL`) and JWT secret keys (`SECRET_KEY`).
5.  **Initialize the database (run tables):**
    ```bash
    python -c "from database import init_db; init_db()"
    # Or use Alembic migrations if configured
    ```
6.  **Start the FastAPI server:**
    ```bash
    uvicorn main:app --reload
    ```
    The API should be available at `http://localhost:8000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install Node dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    The frontend should be available at `http://localhost:3000`.

---

## 🧭 Key API Endpoints

The FastAPI backend exposes the following primary endpoints, which can be explored in detail via the interactive documentation at `http://localhost:8000/docs`.

| Route | Method | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `/api/users/register` | `POST` | Create a new user account. | Public |
| `/api/users/login` | `POST` | Authenticate user and receive a JWT access token. | Public |
| `/api/recipes/` | `POST` | Create a new recipe. | Required |
| `/api/recipes/` | `GET` | Retrieve a paginated list of all recipes. | Public |
| `/api/pantry/` | `GET` | View the current user's ingredient inventory. | Required |
| `/api/ai/recommend` | `POST` | Get personalized recipe recommendations based on pantry items. | Required |

---

## 🤝 How to Contribute

We welcome contributions! If you're interested in improving Gopam, please follow these guidelines:

1.  **Fork the Repository** (Assume this is hosted on GitHub).
2.  **Create a Feature Branch:** `git checkout -b feature/your-feature-name`
3.  **Commit your changes:** Write clear, concise commit messages.
4.  **Run Tests:** Ensure all existing tests pass and write new tests for your features (if applicable).
5.  **Push to the Branch:** `git push origin feature/your-feature-name`
6.  **Open a Pull Request (PR):** Target the `main` branch and provide a detailed description of your changes.