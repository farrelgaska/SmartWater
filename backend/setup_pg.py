import sys
import psycopg2
from app.core.database import engine, Base, SessionLocal
from app.services.seed_service import seed_database

if len(sys.argv) > 1:
    pwd = sys.argv[1]
    host = sys.argv[2] if len(sys.argv) > 2 else "localhost"
    port = sys.argv[3] if len(sys.argv) > 3 else "5432"
    user = sys.argv[4] if len(sys.argv) > 4 else "postgres"
    
    print(f"Connecting to PostgreSQL as '{user}' on {host}:{port}...")
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=user,
            password=pwd,
            host=host,
            port=port
        )
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname='smartwater_db'")
        if not cur.fetchone():
            cur.execute("CREATE DATABASE smartwater_db")
            print("Berhasil membuat database: 'smartwater_db'!")
        else:
            print("Database 'smartwater_db' sudah ada.")
        conn.close()
        print("KONEKSI_BERHASIL")
    except Exception as e:
        print(f"GAGAL_KONEKSI: {e}")
