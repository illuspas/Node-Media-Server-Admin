const ENABLE_DEVELOP = process.env.NODE_ENV === "development" ? true : false;
export const API_URL = ENABLE_DEVELOP ? "http://localhost:8000/api" : "/api"
export const AUTH_URL = ENABLE_DEVELOP ? "http://localhost:8000/auth" : "/auth"