# ──────────────────────────────────────────────
# ARISE Backend — Multi-stage Dockerfile
# ──────────────────────────────────────────────

# ---------- Stage 1: Build dependencies ----------
FROM python:3.12-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---------- Stage 2: Production image ----------
FROM python:3.12-slim AS production

WORKDIR /app

# Copy only the installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Non-root user for security
RUN adduser --disabled-password --no-create-home appuser
USER appuser

EXPOSE 5000

# Use gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "app:app"]
