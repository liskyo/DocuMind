import os
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ==========================================
# ⚠️ 設定字型路徑 (請根據你的作業系統調整)
# ==========================================
# 選項 A: 如果你在 Windows，通常直接用這個：
FONT_PATH = "C:\\Windows\\Fonts\\msjh.ttc" 
FONT_NAME = "MicrosoftJhengHei"

# 選項 B: 如果你有下載 NotoSansTC-Regular.ttf 放在同目錄：
# FONT_PATH = "NotoSansTC-Regular.ttf"
# FONT_NAME = "NotoSansTC"

# 檢查字型是否存在
if not os.path.exists(FONT_PATH):
    print(f"❌ 錯誤: 找不到字型檔案: {FONT_PATH}")
    print("請修改程式碼中的 FONT_PATH 變數，指向正確的中文字型路徑 (.ttf 或 .ttc)。")
    exit()

# 註冊字型
try:
    pdfmetrics.registerFont(TTFont(FONT_NAME, FONT_PATH))
except Exception as e:
    print(f"⚠️ 字型註冊失敗: {e}")
    print("嘗試使用預設字型 (但不支援中文)...")
    FONT_NAME = "Helvetica"

# ==========================================
# 定義三份不合理的繁體中文合約內容
# ==========================================
contracts = [
    {
        "filename": "tw_test_1_slave_contract.pdf",
        "title": "員工僱傭合約書 (機密)",
        "content": """
第三條：智慧財產權歸屬
本公司擁有員工在受僱期間所產生之任何發明、創作、開發、概念、改進、設計、發現、構想、商標或商業機密之所有權利、所有權及利益。無論該產出是否可申請專利或版權，亦無論員工是否係單獨或共同開發。**此條款適用範圍包括：員工於下班時間、使用員工私人電腦設備、且與本公司業務無直接關聯之所有創作，其智慧財產權均無條件歸屬於本公司。**

第五條：競業禁止與禁止招攬
無論因何種原因終止僱傭關係，員工同意在終止生效日後的 **十(10)年** 內，不得直接或間接從事、擁有、管理、經營、控制或參與任何與本公司業務構成競爭之事業。**此競業禁止範圍適用於全宇宙任何地點（包括但不限於地球、月球及火星殖民地）。**

第七條：離職懲罰性違約金
若員工在入職後 **三(3)年** 內自願離職，員工同意支付相當於 **離職時十二(12)個月全薪** 之懲罰性違約金予本公司，以賠償本公司之招募與教育訓練損失。
        """
    },
    {
        "filename": "tw_test_2_predatory_saas.pdf",
        "title": "軟體服務授權合約 (SaaS)",
        "content": """
第八條：責任限制 (Limitation of Liability)
在法律允許的最大範圍內，服務提供商（以下簡稱甲方）不對任何直接、間接、附帶、特殊、後果性或懲罰性損害負責。**甲方因本合約引起或與之相關的累計賠償責任上限，不得超過客戶在索賠事件發生前一(1)個月內向甲方支付的費用總額，或美金十元 ($10.00)，以兩者中較低者為準。**

第九條：賠償條款
客戶同意賠償甲方及其高階主管、董事和員工因客戶使用本服務而產生之任何索賠、責任、損害、損失或費用（含律師費）。**即便該索賠係因甲方自身之重大過失、疏忽或故意不當行為所導致，客戶仍須負擔完全之賠償責任。**

第十一條：終止合約
甲方可隨時以任何理由或無理由終止本合約，且僅需在網站上公告即刻生效，無需另行通知。**客戶若欲終止本合約，必須於一百八十(180)天前以書面形式通知甲方，否則視為違約。**
        """
    },
    {
        "filename": "tw_test_3_forever_lease.pdf",
        "title": "商業租賃契約書",
        "content": """
第四條：自動續約陷阱
本合約將自動續約，每次續約期間為 **五(5)年**，除非承租人嚴格於目前租期屆滿前一年的 **12月24日至12月25日之間（僅此24小時窗口）** 提出書面不續約通知。若未於此特定時間窗口內提出通知，即視為不可撤銷地同意續約五年。

第十五條：管轄法律與法院
本合約之解釋與執行應依據 **西蘭公國 (Principality of Sealand)** 之法律。凡因本合約引起之任何爭議，雙方同意提交至 **馬利共和國廷巴克圖 (Timbuktu, Mali)** 之法院進行專屬管轄，雙方特此放棄對此管轄地之任何異議權。
        """
    }
]

def create_pdf(filename, title, text_content):
    c = canvas.Canvas(filename, pagesize=LETTER)
    width, height = LETTER
    
    # 使用註冊的中文字型
    c.setFont(FONT_NAME, 16) # 標題字型
    c.drawString(72, height - 72, title)
    
    # 內文字型
    c.setFont(FONT_NAME, 11)
    text_object = c.beginText(72, height - 100)
    
    # 設定行距 (Leading)
    text_object.setLeading(16)
    
    lines = text_content.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            text_object.moveCursor(0, 12)
            continue
            
        # 簡單的手動換行處理 (這裡假設一行約 35 個中文字)
        char_limit = 35 
        for i in range(0, len(line), char_limit):
             chunk = line[i:i+char_limit]
             text_object.textLine(chunk)
             
    c.drawText(text_object)
    c.save()
    print(f"✅ 已生成檔案: {filename}")

if __name__ == "__main__":
    print("正在生成測試用 PDF 合約 (繁體中文版)...")
    for contract in contracts:
        create_pdf(contract["filename"], contract["title"], contract["content"])
    print("\n完成！請查看你的資料夾。")