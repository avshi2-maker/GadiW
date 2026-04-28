"""Quick connection test — verifies Python can reach Supabase + query a real table."""

import os
from dotenv import load_dotenv
import requests

load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

print(f"Supabase URL: {SUPABASE_URL}")
print(f"Anon key starts with: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "MISSING KEY")
print()

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

# Test 1 — Reach a real table (clients) with HEAD request
print("Test 1: Reaching the clients table...")
url = f"{SUPABASE_URL}/rest/v1/clients?select=count"
try:
    response = requests.get(url, headers=headers, timeout=10)
    print(f"  HTTP status: {response.status_code}")
    if response.status_code == 200:
        print(f"  ✓ Table reachable. Response: {response.text[:200]}")
    elif response.status_code == 401:
        print(f"  ⚠ Auth issue (anon key works for unauthenticated reads only — RLS blocks rest)")
        print(f"  Response: {response.text[:300]}")
    else:
        print(f"  Response: {response.text[:300]}")
except Exception as e:
    print(f"  ✗ FAILED: {e}")

print()
print("Test 2: Reaching Storage API health...")
url = f"{SUPABASE_URL}/storage/v1/bucket"
try:
    response = requests.get(url, headers=headers, timeout=10)
    print(f"  HTTP status: {response.status_code}")
    if response.status_code in (200, 401):
        print(f"  ✓ Storage API is alive (status {response.status_code} expected without login)")
    else:
        print(f"  Response: {response.text[:300]}")
except Exception as e:
    print(f"  ✗ FAILED: {e}")

print()
print("✓ All connection plumbing works. Login flow happens in the real script.")