
# Gopam: AI-Powered Recipe & Ingredient Management System

## Project Description

Gopam is a modern, full-stack application designed to revolutionize home cooking and inventory management. It combines traditional database management for recipes and ingredients with cutting-edge Artificial Intelligence and Machine Learning (AI/ML) to offer personalized recipe recommendations and real-time inventory analysis.

This project is highly relevant in the current tech landscape, integrating a classic database challenge (inventory/recipe data) with modern AI/ML capabilities, offering a powerful, interactive user experience.

---

## 💡 Case Study: The Home Chef's Dilemma

The primary problem Gopam solves is the **"What can I cook with what I have?"** dilemma.

* **Problem:** Home chefs often have a pantry full of ingredients but struggle to find relevant recipes without manually cross-referencing items. This leads to food waste from forgotten ingredients and inefficient meal planning.
* **Gopam's Solution:** Users log their current pantry items. The AI backend analyzes this inventory against a database of recipes and uses a recommendation engine (e.g., collaborative filtering or content-based recommendation) to suggest recipes that maximize the use of available ingredients, minimizing trips to the store and reducing food waste. Furthermore, it offers real-time nutritional summaries and smart ingredient substitutions via AI analysis.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Database (SQL)** | **PostgreSQL** (or MySQL) | Open-source, robust, supports advanced features like JSONB (in Postgres) for flexible recipe/ingredient metadata. |
| **Backend (Server)** | **Python (FastAPI)** | Modern, high-performance web framework. Excellent for fast APIs and integrates seamlessly with Python's leading AI/ML libraries (TensorFlow, PyTorch, Scikit-learn). |
| **Frontend (Client)** | **React with Next.js** | Next.js enables Server-Side Rendering (SSR) for fast loading and SEO. React provides a modern, component-based UI for complex interfaces (meal planning, interactive ingredient lists). |
| **Development OS** | **Windows** | |
| **CLI** | **PowerShell** | |
| **Code Editor** | **Visual Studio Code (VS Code)** | |

---

## 📂 Project File Structure

The project adheres to a monolithic repository structure, with a clear separation between client (frontend) and server (backend).

```
gopam/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── users.py       # API router stubs
│   │   │   │   ├── recipes.py     # API router stubs
│   │   │   │   ├── pantry.py
│   │   │   │   └── ai.py
│   │   │   └── dependencies.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── recipe.py
│   │   │   ├── ingredient.py
│   │   │   └── pantry.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── recipe.py
│   │   │   └── pantry.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── recipe_matcher.py
│   │   │   └── ai_recommender.py
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI entry
│   │   ├── config.py              # Configuration settings
│   │   └── database.py            # Database connection logic
│   ├── tests/
│   │   └── test_api.py
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example
│   └── alembic.ini                # Database migrations setup
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── recipes/
│   │   │   │   └── page.tsx
│   │   │   ├── pantry/
│   │   │   │   └── page.tsx
│   │   │   ├── meal-plan/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx         # Next.js Root Layout
│   │   │   └── page.tsx           # Next.js Home Page
│   │   ├── components/
│   │   │   ├── RecipeCard.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── package.json               # Node/Next.js dependencies
│   ├── tsconfig.json
│   └── next.config.js
├── database/
│   └── init.sql                   # Database table creation script
├── .gitignore
└── README.md
```

---

