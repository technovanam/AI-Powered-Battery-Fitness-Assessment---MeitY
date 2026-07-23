import { Athlete, TestResult } from '../types/assessment';
import { TEST_PROTOCOLS } from '../constants/protocols';

export class ReportCardGenerator {
  /**
   * Generates bilingual HTML report card ready for offline printing or PDF export
   */
  public static generateHtmlReport(
    athlete: Athlete,
    results: TestResult[],
    language: 'en' | 'hi' = 'en'
  ): string {
    const isHindi = language === 'hi';
    const dateStr = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const resultsTableRows = Object.values(TEST_PROTOCOLS).map((protocol) => {
      const res = results.find(r => r.testId === protocol.id);
      const testName = isHindi ? protocol.nameHindi : protocol.name;
      
      if (!res) {
        return `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px;">${testName}</td>
            <td style="padding: 10px; color: #94a3b8; font-style: italic;">${isHindi ? 'नॉट डन' : 'Not Assessed'}</td>
            <td style="padding: 10px;">-</td>
            <td style="padding: 10px;">-</td>
          </tr>
        `;
      }

      const methodBadge = res.isAiMeasured
        ? `<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">AI Automated (${res.confidence}%)</span>`
        : `<span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Manual</span>`;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-weight: 500;">${testName}</td>
          <td style="padding: 10px; font-weight: bold; color: #0f172a;">${res.score} ${res.unit}</td>
          <td style="padding: 10px;">${methodBadge}</td>
          <td style="padding: 10px; font-size: 12px; color: #64748b;">${res.calibrationMethod || 'Standard'}</td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Fitness Assessment Report Card</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; background: #fff; }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .title { font-size: 20px; font-weight: bold; color: #1e3a8a; margin: 0; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            .badge { background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px; }
            .athlete-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .meta-item { font-size: 13px; }
            .meta-label { color: #64748b; }
            .meta-value { font-weight: 600; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            th { text-align: left; background: #f1f5f9; padding: 10px; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1; }
            .disclaimer-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; font-size: 11px; color: #92400e; margin-top: 24px; }
            .footer { margin-top: 30px; font-size: 10px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">${isHindi ? 'राष्ट्रीय फिटनेस बैटरी रिपोर्ट कार्ड' : 'National Battery Fitness Assessment'}</h1>
              <div class="subtitle">NeGD / MeitY / MYAS National Hackathon Standard</div>
            </div>
            <div>
              <span class="badge">${isHindi ? 'सत्यापित ऑन-डिवाइस' : 'Verified On-Device'}</span>
            </div>
          </div>

          <div class="athlete-box">
            <div class="meta-item"><span class="meta-label">${isHindi ? 'नाम' : 'Athlete Name'}:</span> <span class="meta-value">${athlete.name}</span></div>
            <div class="meta-item"><span class="meta-label">${isHindi ? 'आयु / श्रेणी' : 'Age / Category'}:</span> <span class="meta-value">${athlete.age} yrs (${athlete.category})</span></div>
            <div class="meta-item"><span class="meta-label">APAAR ID:</span> <span class="meta-value">${athlete.apaarId || 'N/A'}</span></div>
            <div class="meta-item"><span class="meta-label">NSRS ID:</span> <span class="meta-value">${athlete.nsrsId || 'N/A'}</span></div>
            <div class="meta-item"><span class="meta-label">${isHindi ? 'तारीख' : 'Assessment Date'}:</span> <span class="meta-value">${dateStr}</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>${isHindi ? 'परीक्षण का नाम' : 'Fitness Test'}</th>
                <th>${isHindi ? 'परिणाम' : 'Score'}</th>
                <th>${isHindi ? 'पद्धति' : 'Method & Confidence'}</th>
                <th>${isHindi ? 'कैलिब्रेशन' : 'Calibration Mode'}</th>
              </tr>
            </thead>
            <tbody>
              ${resultsTableRows}
            </tbody>
          </table>

          <div class="disclaimer-box">
            <strong>${isHindi ? 'महत्वपूर्ण सूचना' : 'Mandatory Compliance Notice'}:</strong><br />
            ${isHindi 
              ? 'सांकेतिक — भारतीय मानक अभी स्थापित नहीं किए गए हैं। सभी मान केवल प्रदर्शन और प्रारंभिक फिटनेस मूल्यांकन उद्देश्यों के लिए हैं।'
              : 'Illustrative — Indian norms not yet established. Percentile calculations are relative to mock baseline cohorts as specified in Section 8.5.'}
          </div>

          <div class="footer">
            Generated on-device via AI Battery Assessment App · Zero Raw Video Cloud Transmission Policy Compliant
          </div>
        </body>
      </html>
    `;
  }
}
