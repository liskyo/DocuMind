import requests

def test_chinese_pdf():
    url = "http://127.0.0.1:8000/api/analyze"
    print(f"Testing local API with Chinese PDF...")
    
    filename = "tw_test_1_slave_contract.pdf"
    try:
        files = {'file': (filename, open(filename, 'rb'))}
        resp = requests.post(url, files=files, timeout=60)
        print(f"Status Code: {resp.status_code}")
        print(f"Response snippet: {resp.text[:1000]}")
    except Exception as e:
        print(f"Failed to upload/analyze: {e}")

if __name__ == "__main__":
    test_chinese_pdf()
