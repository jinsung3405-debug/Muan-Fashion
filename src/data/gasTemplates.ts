/**
 * @file gasTemplates.ts
 * Google Apps Script 템플릿 코드 및 반별(각 반마다) 자동 시트 분리 연동 스크립트
 */

export const GOOGLE_SHEETS_WEBHOOK_SCRIPT = `/**
 * ==============================================================================
 * 🌸 써비쌤의 기술가정 패션 퀴즈 - 반별 자동 분리 및 실시간 누적 스크립트 🌸
 * ==============================================================================
 * 
 * [주요 기능]
 * 1. 각 반마다(예: 1반, 2반, 3반...) 자동으로 별도의 시트 탭이 생성되어 누적됩니다.
 * 2. '전체통합' 시트에도 모든 학생 데이터가 실시간으로 기록됩니다.
 * 3. GET/POST 요청을 모두 지원하여 모바일, 태블릿, 학교 와이파이에서도 100% 저장됩니다.
 * 
 * [적용 방법 - 1분 완성!]
 * 1. 구글 스프레드시트 메뉴 [확장 프로그램] -> [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 이 코드를 전부 붙여넣습니다 (Ctrl+A -> Ctrl+V).
 * 3. 상단 함수 선택창에서 [testSave]를 선택하고 [▷ 실행] 버튼을 꼭 한 번 누릅니다!
 *    - '권한 검토' 창이 뜨면 [고급] -> [이동(안전하지 않음)] -> [허용] 클릭 (권한 최초 1회 승인)
 * 4. 우측 상단 [배포] -> [배포 관리] 클릭:
 *    - 연필(수정) 아이콘 클릭 -> 버전에서 [새 버전] 선택 -> [배포] 클릭!
 *    (★새 코드가 적용되려면 꼭 '새 버전'으로 배포하셔야 합니다!)
 */

// 1. POST 방식 응답 수신
function doPost(e) {
  return handleRequest(e);
}

// 2. GET 방식 응답 수신 (CORS 차단 방지 및 백업 지원)
function doGet(e) {
  if (e && e.parameter && (e.parameter.data || e.parameter.studentName)) {
    return handleRequest(e);
  }
  return ContentService.createTextOutput("써비쌤의 기술가정 반별 응답 수집기 서버가 정상 작동 중입니다.");
}

// 공통 데이터 처리 및 반별 시트 자동 분리 함수
function handleRequest(e) {
  var lock = LockService.getScriptLock();
  // 동시 제출 시 충돌 방지 락
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error("스프레드시트를 찾을 수 없습니다. 구글 시트의 [확장 프로그램] > [Apps Script]에서 생성해 주세요.");
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("전송된 데이터가 없습니다.");
    }

    // 시간 포맷 (한국 표준시)
    var now = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");

    // 반 이름 정제 (예: '1반', '2반', '2-3반' 등)
    var rawClass = data.classNum || data.fullClassLabel || '미지정';
    var cleanClassName = String(rawClass).trim();
    if (!cleanClassName.endsWith('반') && !cleanClassName.includes('-')) {
      cleanClassName += '반';
    }

    var rowValues = [
      now,
      data.gradeLevel || '',
      cleanClassName,
      data.studentNumber || '',
      data.studentName || '익명',
      data.m1_1 || '',
      data.m1_2 || '',
      data.m1_3 || '',
      data.m1_4 || '',
      Number(data.m2_score !== undefined ? data.m2_score : (data.m2Score || 0)),
      data.m2_1 || '',
      data.m2_2 || '',
      data.m2_3 || '',
      data.m2_4 || '',
      data.bodyDiagnosis || '',
      data.body1 || '',
      data.body2 || '',
      data.body3 || ''
    ];

    // [1] '전체통합' 시트에 기록
    var totalSheet = getOrCreateSheet(ss, '전체통합', '#f8b3c3');
    totalSheet.appendRow(rowValues);

    // [2] 각 '반별 시트'(예: '1반', '2반'...)에 별도 기록
    var classSheet = getOrCreateSheet(ss, cleanClassName, '#bbf7d0');
    classSheet.appendRow(rowValues);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: cleanClassName + ' 및 전체통합 시트에 성공적으로 저장되었습니다!',
      recordedClass: cleanClassName
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

// 시트가 없으면 만들고 헤더를 예쁘게 입혀주는 도우미 함수
function getOrCreateSheet(ss, sheetName, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [
      '제출일시', '학년', '반', '번호', '이름',
      '미션1_1번(성격/직업)', '미션1_2번(성격/직업)',
      '미션1_3번(성격/직업)', '미션1_4번(성격/직업)',
      '전통의상 점수(4점)', '2_인도', '2_멕시코', '2_베트남', '2_일본',
      '체형 진단결과', '어깨vs골반', '살 붙는 부위', '상하체 비율'
    ];
    sheet.appendRow(headers);

    // 헤더 스타일링 (볼드체, 배경색, 가운데 정렬, 틀 고정)
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground(headerColor || '#f8b3c3')
      .setFontColor('#1c1917')
      .setHorizontalAlignment('center');
    
    sheet.setFrozenRows(1);

    // 열 너비 자동 맞춤
    sheet.setColumnWidth(1, 145); // 제출일시
    sheet.setColumnWidth(5, 90);  // 이름
    sheet.setColumnWidth(6, 170); // 미션1
    sheet.setColumnWidth(15, 160); // 체형
  }
  return sheet;
}

// 최초 1회 권한 승인 및 작동 테스트 함수 (Apps Script 상단에서 실행 클릭!)
function testSave() {
  var sample = {
    gradeLevel: '1학년',
    classNum: '1반',
    studentNumber: '1번',
    studentName: '김민수(테스트)',
    fullClassLabel: '1학년 1반',
    m1_1: '발랄함, 유쾌함 / 패션 디자이너',
    m1_2: '조용함, 우아함 / 미술 작가',
    m1_3: '다정함, 부드러움 / 선생님',
    m1_4: '자유로움, 용감한 / 개발자',
    m2_score: 4,
    m2_1: '정답 (인도)',
    m2_2: '정답 (멕시코)',
    m2_3: '정답 (베트남)',
    m2_4: '정답 (일본)',
    bodyDiagnosis: '균형 직사각형 (스트레이트형)',
    body1: '비슷함',
    body2: '얼굴, 팔, 가슴 등 상체',
    body3: '배꼽 가까이'
  };

  var result = handleRequest({ parameter: { data: JSON.stringify(sample) } });
  Logger.log(result.getContent());
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
    <div class="footer-brand">• made by 써비쌤 •</div>
  </div>
</body>
</html>`;
