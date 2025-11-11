from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Gopam Backend API"
    VERSION: str = "0.1.0"
    SECRET_KEY: str
    ALGORITHM: str

    # Database connection URL
    DATABASE_URL: str

    class Config:
        case_sensitive = True
        # Reads from the .env file in the backend directory
        env_file = ".env"

settings = Settings()