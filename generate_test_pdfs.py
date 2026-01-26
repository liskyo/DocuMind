from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# 定義三份合約的內容
contracts = [
    {
        "filename": "test_1_employment_slave_contract.pdf",
        "title": "EMPLOYMENT AGREEMENT (CONFIDENTIAL)",
        "content": """
Article 3. Intellectual Property (IP) Assignment
The Company shall own all right, title, and interest in and to any and all inventions, original works of authorship, developments, concepts, improvements, designs, discoveries, ideas, trademarks, or trade secrets, whether or not patentable or registrable under copyright or similar laws, which the Employee may solely or jointly conceive or develop or reduce to practice, or cause to be conceived or developed or reduced to practice, during the period of time the Employee is in the employ of the Company, including those developed on the Employee's own time, using the Employee's own equipment, and unrelated to the Company's business.

Article 5. Non-Competition and Non-Solicitation
Upon termination of employment for any reason, the Employee agrees that for a period of ten (10) years following the effective date of termination, the Employee shall not, directly or indirectly, engage in, own, manage, operate, control, or participate in the ownership, management, operation, or control of any business that competes with the Company anywhere in the universe.

Article 7. Termination Penalty
In the event the Employee voluntarily resigns within the first three (3) years of employment, the Employee agrees to pay the Company a liquidated damage equal to twelve (12) months of the Employee's then-current base salary to compensate for recruitment and training costs.
        """
    },
    {
        "filename": "test_2_saas_predatory_agreement.pdf",
        "title": "SOFTWARE SERVICES AGREEMENT",
        "content": """
Section 8. Limitation of Liability
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE PROVIDER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE. THE PROVIDER'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY CLIENT TO PROVIDER IN THE ONE (1) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR TEN DOLLARS ($10.00), WHICHEVER IS LESS.

Section 9. Indemnification
Client agrees to indemnify, defend, and hold harmless the Provider, its officers, directors, and employees from and against any and all claims, liabilities, damages, losses, or expenses, including legal fees and costs, arising out of or in any way connected with the Client's access to or use of the Service, including any claims resulting from the Provider's own negligence or willful misconduct.

Section 11. Termination
The Provider may terminate this Agreement at any time, with or without cause, effective immediately upon posting a notice on its website. The Client may terminate this Agreement only by providing one hundred and eighty (180) days' prior written notice to the Provider.
        """
    },
    {
        "filename": "test_3_lease_trap_agreement.pdf",
        "title": "COMMERCIAL LEASE AGREEMENT",
        "content": """
Clause 4. Automatic Renewal
This Agreement shall automatically renew for successive periods of five (5) years (each a "Renewal Term") unless the Lessee provides written notice of its intent not to renew strictly between the dates of December 24th and December 25th of the year preceding the expiration of the current term. Failure to provide notice within this specific 24-hour window shall constitute an irrevocable acceptance of the Renewal Term.

Clause 15. Governing Law and Jurisdiction
This Agreement shall be governed by the laws of the Republic of Sealand. Any dispute arising out of or in connection with this contract shall be submitted to the exclusive jurisdiction of the courts of Timbuktu, Mali, and the parties hereby waive any objection to such venue.
        """
    }
]

def create_pdf(filename, title, text_content):
    c = canvas.Canvas(filename, pagesize=LETTER)
    width, height = LETTER
    
    # 設定標題樣式
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, height - 72, title)
    
    # 設定內文樣式
    c.setFont("Helvetica", 11)
    text_object = c.beginText(72, height - 100)
    
    # 簡單的換行處理
    lines = text_content.strip().split('\n')
    for line in lines:
        # 如果是空行，就多跳一點距離
        if not line.strip():
            text_object.moveCursor(0, 12) 
            continue
            
        # 將長字串簡單切分 (模擬 Wrapping，雖然 ReportLab 有更高級的 Paragraph，但這樣夠用了)
        # 這裡簡單假設一行約 80 個字元
        words = line.split(' ')
        current_line = ""
        for word in words:
            if len(current_line) + len(word) < 80:
                current_line += word + " "
            else:
                text_object.textLine(current_line)
                current_line = word + " "
        text_object.textLine(current_line)
        text_object.moveCursor(0, 4) # 行距

    c.drawText(text_object)
    c.save()
    print(f"✅ 已生成檔案: {filename}")

if __name__ == "__main__":
    print("正在生成測試用 PDF 合約...")
    for contract in contracts:
        create_pdf(contract['filename'], contract['title'], contract['content'])
    print("\n完成！請查看你的資料夾。")