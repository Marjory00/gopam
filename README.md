
# Gopam: AI-Powered Recipe & Ingredient Management System

## Project Description

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
├── backend/                                 # FastAPI/Python backend root
│   ├── api/                                 # Non-application-specific API tools
│   │   └── dependencies.py                 # Authentication (JWT token), database session, and common utilities
│   ├── app/                                 # Main application logic module
│   │   ├── services/                       # Business logic (processing, matching, AI interaction)
│   │   │   ├── __init__.py                 # Python package initialization
│   │   │   ├── ai_recommender.py           # Logic for calling LLMs/AI to generate recipes/recommendations
│   │   │   └── recipe_matcher.py           # Logic for matching user's pantry items to available recipes
│   │   └── __init__.py                     # Python package initialization for 'app'
│   ├── models/                             # SQLAlchemy ORM models (Database structure definitions)
│   │   ├── __init__.py
│   │   ├── ingredient.py                   # Base ingredient model
│   │   ├── pantry_item.py                  # User-specific inventory tracking model
│   │   ├── recipe_ingredient.py            # Association model (Many-to-Many link between Recipe and Ingredient)
│   │   ├── recipe.py                       # Recipe model
│   │   └── user.py                         # User model
│   ├── schemas/                            # Pydantic Schemas (Request/Response data validation)
│   │   ├── __init__.py
│   │   ├── pantry.py                       # Schemas for PantryItem CRUD
│   │   ├── recipe.py                       # Schemas for Recipe CRUD and search
│   │   └── user.py                         # Schemas for User authentication and profile
│   ├── tests/
│   │   └── test_api.py                     # Integration tests for FastAPI endpoints
│   ├── alembic.ini                         # Configuration file for Alembic (database migration tool)
│   ├── config.py                           # Application settings and environment variable loading
│   ├── database.py                         # SQLAlchemy engine, session setup, and base declarations
│   ├── gopam_dev.db                        # SQLite database file (development environment)
│   ├── main.py                             # Main FastAPI application entry point
│   └── requirements.txt                    # Python dependency list
├── database/                             # Contains external or manual database scripts
│   └── init.sql                          # SQL script for initial database setup or seeding
├── frontend/                             # Next.js frontend root
│   ├── public/                             # Static assets accessible via the root URL
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src/                                # Main source code directory
│   │   ├── app/                            # Next.js App Router directory
│   │   │   ├── match/                      # Route: /match (Page to match pantry ingredients to recipes)
│   │   │   │   └── page.tsx
│   │   │   ├── meal-plan/                  # Route: /meal-plan (Page for weekly/monthly meal planning)
│   │   │   │   └── page.tsx
│   │   │   ├── pantry/                     # Route: /pantry (User inventory management)
│   │   │   │   └── page.tsx
│   │   │   ├── recipes/                    # Route: /recipes (Recipe base page)
│   │   │   │   ├── (list)/                 # Grouping folder for recipe list index
│   │   │   │   │   └── page.tsx            # Route: /recipes (Main listing page)
│   │   │   │   ├── [recipes_id]/           # Dynamic Route: /recipes/[id] (Single recipe view)
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new/                    # Route: /recipes/new (Page for adding a new recipe)
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx                # Recipe root page (may be a shared layout)
│   │   │   ├── recommendations/            # Route: /recommendations (Page for AI recipe suggestions)
│   │   │   │   └── page.tsx
│   │   │   ├── favicon.ico                 # Application favicon
│   │   │   └── page.tsx                    # Route: / (Homepage/Landing page)
│   │   ├── components/                     # Reusable UI components
│   │   │   ├── ui/                         # Shared, atomic components (e.g., ShadCN components)
│   │   │   │   └── button.tsx              # Generic button component
│   │   │   ├── AppWrapper.tsx              # Top-level wrapper (providers, context, auth)
│   │   │   ├── Footer.tsx                  # Global footer component
│   │   │   ├── Header.tsx                  # Global navigation bar component
│   │   │   ├── MealPlanner.tsx             # Complex component for meal planning logic/display
│   │   │   ├── RecipeCard.tsx              # Component for displaying a recipe summary
│   │   │   └── SearchBar.tsx               # Component for searching recipes/ingredients
│   │   ├── lib/                            # Utility and core logic functions
│   │   │   ├── api.ts                      # Functions for interacting with the FastAPI backend
│   │   │   ├── auth.tsx                    # Context or hooks for handling client-side authentication
│   │   │   └── types.ts                    # Shared TypeScript interfaces (e.g., Recipe, User, PantryItem)
│   │   └── styles/
│   │       └── globals.css                 # Global Tailwind CSS styles
│   ├── eslint.config.mjs                   # ESLint configuration
│   ├── next.config.js                      # Next.js build configuration
│   ├── package.json                        # Frontend npm dependencies and scripts
│   ├── postcss.config.js                   # PostCSS configuration (used by Tailwind)
│   ├── tailwind.config.js                  # Tailwind CSS custom configuration
│   └── tsconfig.json                       # TypeScript compiler configuration
├── .hintrc                                 # Configuration for code hints/linters
├── package.json                            # Root dependencies (e.g., workspace configuration, shared scripts)
└── README.md                               # Project description and setup instructions
```

---

## 🛣️ Future Roadmap (Phase II)

The following features are planned for future development to enhance the platform's intelligence and utility:

* **Shopping List Generator:** Automatically create a shopping list based on the selected meal plan, cross-referenced against the current pantry inventory.
* **Image Recognition (ML):** Allow users to upload a picture of a receipt or grocery shelf for automatic ingredient population in the pantry (via a service like OpenCV or a dedicated vision model).
* **Cost Analysis:** Integrate pricing data to estimate the cost per recipe and analyze total potential savings from reduced food waste.
* **External API Integration:** Connect to third-party services for real-time nutritional data verification or recipe source expansion.

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



