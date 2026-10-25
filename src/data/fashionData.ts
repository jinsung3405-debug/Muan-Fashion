import { Mission1Item, Mission2Quiz, AppConfig } from '../types';

export const DEFAULT_CONFIG: AppConfig = {
  appTitle: '패션, 쉽지?',
  subTitle: '패션 테러리스트를 구해라',
  teacherBrand: 'made by 써비쌤',
  googleSheetWebhookUrl: '',
};

export const PERSONALITY_TRAITS = [
  '발랄함',
  '조용함',
  '유쾌함',
  '우아함',
  '털털함',
  '차가움',
  '다정함',
  '용감한',
  '자유로움',
  '부드러움',
  '엉뚱함',
  '섬세함',
];

export const MISSION1_ITEMS: Mission1Item[] = [
  {
    id: 1,
    numberLabel: '1번',
    imageUrl: 'https://lh3.googleusercontent.com/d/1iv_dcEiMrshJJiD-ZMI3258HiC_9EvRF',
    alt: '패션 코디 1번 인물',
  },
  {
    id: 2,
    numberLabel: '2번',
    imageUrl: 'https://lh3.googleusercontent.com/d/1NuEouJlAzZcH0w5vhGNh3x0iIgzxZj-o',
    alt: '패션 코디 2번 인물',
  },
  {
    id: 3,
    numberLabel: '3번',
    imageUrl: 'https://lh3.googleusercontent.com/d/12K-WGHq0rF8XChrrPj0LwfPJeBnaw4lq',
    alt: '패션 코디 3번 인물',
  },
  {
    id: 4,
    numberLabel: '4번',
    imageUrl: 'https://lh3.googleusercontent.com/d/1JX3ubdEfvQvteXqYyLpC84JeDjfZjrzJ',
    alt: '패션 코디 4번 인물',
  },
];

export const JOB_SUGGESTIONS = [
  '패션 디자이너',
  '대학생',
  '개발자',
  '미술 작가',
  '선생님',
  '바리스타',
  '마케터',
  '음악가',
  '사진작가',
  '운동선수',
];

export const ALL_COUNTRY_OPTIONS = [
  '중국',
  '일본',
  '인도',
  '스코틀랜드',
  '베트남',
  '멕시코',
  '스페인',
  '네덜란드',
];

export const MISSION2_QUIZZES: Mission2Quiz[] = [
  {
    id: 1,
    numberLabel: '1번',
    country: '인도',
    costumeName: '사리 (Sari)',
    imageUrl: 'https://lh3.googleusercontent.com/d/1Ijf4Gj9UNlqJz467b-1TTKnJUNhRAqKp',
    options: ALL_COUNTRY_OPTIONS,
    explanation: '인도의 전통의상인 사리(Sari)는 바느질하지 않은 약 5~9m 길이의 한 장의 천을 몸에 감아 입는 의상입니다.',
    climateTrivia: '무덥고 습한 열대 기후에서 통풍이 잘되도록 얇은 면이나 실크로 만들어졌으며, 몸을 조이지 않아 시원합니다.',
  },
  {
    id: 2,
    numberLabel: '2번',
    country: '멕시코',
    costumeName: '폰초(Poncho) & 솜브레로',
    imageUrl: 'https://lh3.googleusercontent.com/d/14FoxqfM50_Pn3t24sQWcsTrZ0RgTcp6T',
    options: ALL_COUNTRY_OPTIONS,
    explanation: '멕시코의 폰초(Poncho)는 직사각형 천 가운데에 머리를 넣을 구멍만 낸 간편한 겉옷입니다.',
    climateTrivia: '고원 지대의 큰 일교차와 강한 바람, 뜨거운 직사광선을 피하기 위해 챙이 넓은 모자(솜브레로)와 함께 착용합니다.',
  },
  {
    id: 3,
    numberLabel: '3번',
    country: '베트남',
    costumeName: '아오자이 (Ao Dai)',
    imageUrl: 'https://lh3.googleusercontent.com/d/1hKePx8ktOl_XGtzTYsr4DxgyBsUZmEtC',
    options: ALL_COUNTRY_OPTIONS,
    explanation: '베트남의 아오자이(Áo dài)는 "긴 옷"이라는 뜻으로, 상의 양옆이 깊게 트여 있어 바지와 함께 입는 의상입니다.',
    climateTrivia: '고온다습한 기후에 맞춰 얇고 부드러운 비단으로 만들어지며, 깊은 옆트임 덕분에 자전거를 탈 때나 걸을 때 바람이 잘 통합니다.',
  },
  {
    id: 4,
    numberLabel: '4번',
    country: '일본',
    costumeName: '기모노 (Kimono)',
    imageUrl: 'https://lh3.googleusercontent.com/d/1PNuAtgzl5O_dY_2-MeJ2pbwSBK8c1DDZ',
    options: ALL_COUNTRY_OPTIONS,
    explanation: '일본의 기모노(着物)는 직선으로 재단된 천을 교차시켜 몸에 두른 뒤 넓은 띠(오비)로 고정하는 평면 구성의 옷입니다.',
    climateTrivia: '사계절의 변화와 예절 문화를 반영하며, 온천이나 여름 축제 때 입는 간편한 면 기모노를 유카타라고 부릅니다.',
  },
];

export const BODY_PROPORTION_IMAGE = 'https://lh3.googleusercontent.com/d/16sulroL4Fmy4Km0sIHDReN-glRmsY5aM';

export interface BodyDiagnosisResult {
  bodyTypeTitle: string;
  bodyTypeSubtitle: string;
  features: string[];
  stylingTips: string[];
  recommendedItems: string[];
  avoidItems: string[];
}

export function diagnoseBodyType(answers: { body1: string; body2: string; body3: string }): BodyDiagnosisResult {
  const { body1, body2, body3 } = answers;

  if (body1 === '어깨가 더 넓음' || body2 === '얼굴, 팔, 가슴 등 상체') {
    return {
      bodyTypeTitle: '역삼각형 (상체 집중형 체형)',
      bodyTypeSubtitle: '활동적이고 듬직한 어깨와 슬림한 하체가 매력적인 체형',
      features: [
        '골반에 비해 어깨나 흉곽이 발달한 편입니다.',
        '체중이 늘면 상체(얼굴, 팔, 등)에 먼저 집중되기 쉽습니다.',
        '상대적으로 다리 선이 슬림하고 길어 보이는 장점이 있습니다.',
      ],
      stylingTips: [
        'V넥이나 깊은 라운드넥 상의로 목선을 시원하게 트여 상체의 시선을 분산시키세요.',
        '하의에 와이드 팬츠, A라인 스커트나 밝은 컬러/패턴을 매치해 상하체 밸런스를 맞추면 멋집니다.',
        '어깨에 셔링이나 견장이 과한 옷보다는 래글런(나그랑) 소매나 드롭 숄더가 자연스럽습니다.',
      ],
      recommendedItems: ['V넥 니트/셔츠', '와이드 데님 팬츠', 'A라인 플리츠 스커트', '세로 스트라이프 셔츠'],
      avoidItems: ['어깨 패드가 과한 재킷', '보트넥 및 과한 어깨 퍼프 블라우스'],
    };
  }

  if (body1 === '골반이 더 넓음' || body2 === '엉덩이, 다리 등 하체') {
    return {
      bodyTypeTitle: '삼각형 (하체 안정형 / A자 체형)',
      bodyTypeSubtitle: '가녀린 허리선과 단아하고 여성스러운 골반 라인이 돋보이는 체형',
      features: [
        '어깨선이 아담하고 허리가 가늘며 골반과 힙 라인이 발달한 편입니다.',
        '체중이 늘 때 엉덩이나 허벅지 등 하체에 먼저 붙기 쉽습니다.',
        '허리 라인이 잘록해 여성스럽고 안정감 있는 실루엣을 가졌습니다.',
      ],
      stylingTips: [
        '상의에 밝은 컬러, 볼륨감 있는 카라, 보트넥으로 시선을 위로 끌어올리세요.',
        '허리선을 높게 잡아주는 하이웨이스트 바지나 롱 A라인 스커트가 가장 잘 어울립니다.',
        '하의는 어두운 톤이나 깔끔한 스트레이트 핏으로 정리하면 다리가 훨씬 길어 보입니다.',
      ],
      recommendedItems: ['보트넥/오프숄더 상의', '하이웨이스트 세미와이드 팬츠', 'A라인 롱스커트', '허리 벨트 원피스'],
      avoidItems: ['골반에 딱 붙는 로우라이즈 팬츠', '하의에 큼직한 가로 체크나 주머니 디테일'],
    };
  }

  if (body2 === '뱃살, 허리') {
    return {
      bodyTypeTitle: '라운드형 (중심 집중형 체형)',
      bodyTypeSubtitle: '부드러운 곡선미와 슬림한 발목/손목 라인이 돋보이는 친근한 체형',
      features: [
        '상체와 허리 중앙부에 볼륨이 집중되어 부드러운 인상을 줍니다.',
        '팔다리가 비교적 슬림해 이를 강조하면 날씬해 보입니다.',
        '원단감이 너무 빳빳하지 않고 유연하게 떨어지는 옷이 어울립니다.',
      ],
      stylingTips: [
        '가슴 바로 아래부터 자연스럽게 퍼지는 엠파이어 실루엣이나 튜닉 스타일이 좋습니다.',
        '오픈형 롱 가디건이나 재킷으로 가운데 세로 라인을 만들어주면 착시효과로 슬림해 보입니다.',
        '손목과 발목을 살짝 드러내 시선이 슬림한 곳으로 향하게 해보세요.',
      ],
      recommendedItems: ['오픈형 롱 카디건', '세로선 오픈 셔츠', '슬림 테이퍼드 슬랙스', '부드러운 면 소재 티셔츠'],
      avoidItems: ['허리 밴딩이 과하게 조이는 바지', '가슴/배 쪽에 큼직한 프린트가 있는 옷'],
    };
  }

  return {
    bodyTypeTitle: '균형 직사각형 (스트레이트형 체형)',
    bodyTypeSubtitle: '어깨와 골반이 이상적인 비율을 이루는 모던하고 트렌디한 체형',
    features: [
      '어깨와 골반 너비가 비슷하여 단정하고 깔끔한 실루엣을 가졌습니다.',
      '다양한 스타일의 옷을 개성 있게 소화할 수 있는 모델형 체형입니다.',
      '상하체 비율과 허리선 연출에 따라 캐주얼부터 포멀까지 무한한 변신이 가능합니다.',
    ],
    stylingTips: [
      body3 === '배꼽이 더 아래에' 
        ? '허리 위치를 높게 잡아주는 하이웨이스트 팬츠나 크롭 상의를 매치하면 황금비율이 완성됩니다.'
        : '벨트를 활용해 허리 라인을 살짝 강조하거나 셋업 수트를 착용하면 시크한 매력이 배가됩니다.',
      '레이어드 룩(셔츠 위에 니트 베스트, 재킷 등)을 연출해도 부해 보이지 않고 스타일리시합니다.',
      '컬러 대비(상의와 하의의 배색)를 센스 있게 주어 세련된 분위기를 연출해 보세요.',
    ],
    recommendedItems: ['크롭 재킷 & 하이웨이스트 팬츠', '오버핏 셔츠 & 벨트 코디', '셋업 수트', '스트레이트 핏 데님'],
    avoidItems: ['위아래 모두 펑퍼짐한 통짜 옷', '허리 구분 없는 긴 일자형 원피스'],
  };
}
