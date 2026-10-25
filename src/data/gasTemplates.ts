/**
 * @file gasTemplates.ts
 * Google Apps Script 템플릿 코드 및 구글 스프레드시트 Webhook 수신 코드
 */

export const GOOGLE_SHEETS_WEBHOOK_SCRIPT = `/**
 * ========================================================
 * 📝 써비쌤의 패션 퀴즈 - 구글 스프레드시트 실시간 연동 스크립트
 * ========================================================
 * 
 * [설치 방법 - 1분 완성!]
 * 1. 구글 스프레드시트를 새로 만듭니다 (예: '패션수업_학생응답결과')
 * 2. 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭
 * 3. 기존 코드를 모두 지우고 아래 코드를 그대로 붙여넣습니다.
 * 4. [저장(Ctrl+S)] 누른 후 우측 상단 [배포] -> [새 배포] 클릭
 * 5. 톱니바퀴 -> [웹 앱] 선택:
 *    - 설명: 학생 응답 수신용
 *    - 다음 사용자로 실행: 나(내 계정)
 *    - 액세스 권한: 모든 사용자 (Anyone)  <-- 중요!
 * 6. [배포] 클릭 후 나오는 '웹 앱 URL'을 복사하여 앱의 [선생님 설정]에 붙여넣으세요!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('학생응답');

    // 시트가 없으면 자동으로 첫 행(헤더)을 만들어줍니다.
    if (!sheet) {
      sheet = ss.insertSheet('학생응답');
      sheet.appendRow([
        '제출일시',
        '학번/정보',
        '이름',
        '미션1_1번(성격/직업)',
        '미션1_2번(성격/직업)',
        '미션1_3번(성격/직업)',
        '미션1_4번(성격/직업)',
        '미션2_총점(4점만점)',
        '미션2_1번(인도)',
        '미션2_2번(멕시코)',
        '미션2_3번(베트남)',
        '미션2_4번(일본)',
        '체형진단결과',
        '어깨vs골반',
        '살붙는부위',
        '상하비율'
      ]);
      // 헤더 스타일링 (써비쌤 핑크 테마)
      sheet.getRange(1, 1, 1, 16)
        .setFontWeight('bold')
        .setBackground('#f8b3c3')
        .setFontColor('#111827')
        .setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    // 전송된 데이터 파싱
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var now = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([
      now,
      data.studentGrade || '',
      data.studentName || '익명',
      data.m1_1 || '',
      data.m1_2 || '',
      data.m1_3 || '',
      data.m1_4 || '',
      data.m2_score || 0,
      data.m2_1 || '',
      data.m2_2 || '',
      data.m2_3 || '',
      data.m2_4 || '',
      data.bodyDiagnosis || '',
      data.body1 || '',
      data.body2 || '',
      data.body3 || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '써비쌤의 구글 시트에 성공적으로 저장되었습니다!'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 브라우저에서 직접 링크 열었을 때 안내 문구
function doGet(e) {
  return ContentService.createTextOutput("써비쌤의 기술가정 패션 퀴즈 응답 수집기 서버가 정상 작동 중입니다.");
}
`;

export const CODE_GS_TEMPLATE = `/**
 * @file Code.gs
 * Google Apps Script Web App Server (웹 앱 단독 배포용)
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('패션, 쉽지? - made by 써비쌤')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
`;

export const GAS_INDEX_HTML_SNIPPET = `<!-- index.html 단일 파일 기본 골격 -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>패션, 쉽지? - made by 써비쌤</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Jua&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #fdebed;
      --main-pink: #f8b3c3;
      --accent-green: #d1f2d9;
      --selected-color: #ff85a2;
      --border-color: #333333;
    }
    * { box-sizing: border-box; font-family: 'Gowun Dodum', sans-serif; user-select: none; }
    body { margin: 0; padding: 0; background-color: #222; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .footer-brand { text-align: center; font-size: 13px; color: #444; font-weight: bold; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- 1~14개 슬라이드 -->
    <div class="footer-brand">• made by 써비쌤 •</div>
  </div>
</body>
</html>`;
