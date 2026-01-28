import requests

def test_analyze():
    url = "http://127.0.0.1:8000/api/analyze"
    files = {'file': ('test_1_employment_slave_contract.pdf', open('test_1_employment_slave_contract.pdf', 'rb'))}
    try:
        resp = requests.post(url, files=files)
        print(f"Status: {resp.status_code}")
        print(f"Content: {resp.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_analyze()
