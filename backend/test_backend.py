import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000"

def wait_for_server(retries=5, delay=1):
    for i in range(retries):
        try:
            response = requests.get(f"{BASE_URL}/")
            if response.status_code == 200:
                print("Server is up and running!")
                return True
        except requests.exceptions.ConnectionError:
            pass
        print(f"Waiting for server... ({i+1}/{retries})")
        time.sleep(delay)
    return False

def test_analysis():
    print("\nTesting /api/analyze endpoint...")
    # Create a dummy contract file
    dummy_text = "This is a test contract. The Provider shall have unlimited liability."
    files = {'file': ('test_contract.txt', dummy_text)}
    
    try:
        response = requests.post(f"{BASE_URL}/api/analyze", files=files)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response:", response.json())
            return True
        else:
            print("Error Response:", response.text)
            return False
    except Exception as e:
        print(f"Request failed: {e}")
        return False

if __name__ == "__main__":
    if not wait_for_server():
        print("Server failed to start.")
        sys.exit(1)
    
    success = test_analysis()
    if success:
        print("\n✅ API Key and Backend verification SUCCESSFUL.")
    else:
        print("\n❌ Verification FAILED.")
