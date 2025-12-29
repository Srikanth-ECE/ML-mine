from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import api

# Create FastAPI app
app = FastAPI(
    title="Smart PPE Compliance System",
    description="AI-powered PPE detection for underground coal mines",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (restrict in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api.router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Smart PPE Compliance System",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "check_compliance": "/api/check-compliance",
            "register_worker": "/api/register-worker",
            "dashboard": "/api/dashboard"
        }
    }