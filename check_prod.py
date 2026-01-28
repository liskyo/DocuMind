import requests
import sys

def check_prod():
    url = "https://docu-mind-beta.vercel.app/api/analyze"
    print(f"Testing URL: {url}")
    
    # Create a small dummy file in memory or use an existing one
    files = {'file': ('test.txt', 'This is a test contract clause to verify deployment.')}
    
    try:
        resp = requests.post(url, files=files, timeout=30)
        print(f"Status Code: {resp.status_code}")
        print(f"Response Body: {resp.text[:500]}") # Print first 500 chars
        
        if resp.status_code == 200:
            if "error" in resp.text:
                 print("Result: 200 OK but contains error (Soft Fail)")
            else:
                 print("Result: SUCCESS")
        else:
            print("Result: FAIL")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    check_prod()
