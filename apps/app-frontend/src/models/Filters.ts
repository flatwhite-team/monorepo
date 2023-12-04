import { Characteristic } from "@flatwhite-team/prisma";

export const 필터_카테고리 = {
  음식료: "음식료",
  종류: "종류",
  분위기: "분위기",
  시설: "시설",
} as const;

export type 필터_카테고리 = (typeof 필터_카테고리)[keyof typeof 필터_카테고리];

type 음식료_필터 = Extract<
  Characteristic,
  | "SPECIALTY_COFFEE"
  | "DECAFFEINATED_COFFEE"
  | "HAND_DRIP"
  | "COLD_BREW"
  | "SINGLE_ORIGIN"
  | "ESPRESSO"
  | "TEA"
  | "VEGAN"
>;

export const 음식료_필터: Record<음식료_필터, string> = {
  SPECIALTY_COFFEE: "스페셜티",
  DECAFFEINATED_COFFEE: "디카페인",
  HAND_DRIP: "핸드드립",
  COLD_BREW: "콜드브루",
  SINGLE_ORIGIN: "싱글오리진",
  ESPRESSO: "에스프레소",
  TEA: "차",
  VEGAN: "비건",
} as const;

type 종류_필터 = Extract<
  Characteristic,
  | "BAKERY"
  | "DESSERT"
  | "BRUNCH"
  | "ROASTERY"
  | "ESPRESSO_BAR"
  | "BOOK_CAFE"
  | "STUDY_CAFE"
>;

export const 종류_필터: Record<종류_필터, string> = {
  BAKERY: "베이커리",
  DESSERT: "디저트",
  BRUNCH: "브런치",
  ROASTERY: "로스터리",
  ESPRESSO_BAR: "에스프레소바",
  BOOK_CAFE: "북카페",
  STUDY_CAFE: "스터디카페",
} as const;

type 분위기_필터 = Extract<
  Characteristic,
  | "SPACIOUS"
  | "CALM"
  | "QUIET"
  | "COZY"
  | "WARM"
  | "MODERN"
  | "ANTIQUE"
  | "CLASSIC"
  | "LUXURY"
  | "TRENDY"
  | "CHIC"
  | "TALK"
  | "FAMILY"
  | "FRIENDS"
  | "DATE"
  | "GROUP"
  | "WORK"
  | "MEETING"
  | "STUDY"
  | "LONG_HOURS"
>;

export const 분위기_필터: Record<분위기_필터, string> = {
  SPACIOUS: "넓은",
  CALM: "차분한",
  QUIET: "조용한",
  COZY: "아늑한",
  WARM: "따뜻한",
  MODERN: "모던",
  ANTIQUE: "앤틱",
  CLASSIC: "클래식",
  LUXURY: "럭셔리",
  TRENDY: "트렌디",
  CHIC: "시크",
  TALK: "대화",
  FAMILY: "가족",
  FRIENDS: "친구모임",
  DATE: "데이트",
  GROUP: "단체",
  WORK: "업무",
  MEETING: "미팅",
  STUDY: "공부",
  LONG_HOURS: "장시간",
} as const;

type 시설_필터 = Extract<
  Characteristic,
  | "WIFI"
  | "OUTDOOR"
  | "PET_FRIENDLY"
  | "MULTI_FLOOR"
  | "PARKING"
  | "DRIVE_THRU"
  | "OUTLET"
  | "RESERVATION"
  | "RENT"
>;

export const 시설_필터: Record<시설_필터, string> = {
  WIFI: "와이파이",
  MULTI_FLOOR: "복층",
  OUTDOOR: "야외",
  PET_FRIENDLY: "반려동물",
  PARKING: "주차",
  DRIVE_THRU: "드라이브스루",
  OUTLET: "콘센트",
  RESERVATION: "예약",
  RENT: "대관",
} as const;

export function findCategory(characteristic: Characteristic) {
  if (Object.keys(음식료_필터).includes(characteristic)) {
    return 필터_카테고리.음식료;
  }

  if (Object.keys(종류_필터).includes(characteristic)) {
    return 필터_카테고리.종류;
  }

  if (Object.keys(분위기_필터).includes(characteristic)) {
    return 필터_카테고리.분위기;
  }

  if (Object.keys(시설_필터).includes(characteristic)) {
    return 필터_카테고리.시설;
  }

  throw new Error("Invalid characteristic");
}

export function getCategoryFilters(category: keyof typeof 필터_카테고리) {
  switch (category) {
    case 필터_카테고리.음식료:
      return 음식료_필터 as Record<Characteristic, string>;
    case 필터_카테고리.종류:
      return 종류_필터 as Record<Characteristic, string>;
    case 필터_카테고리.분위기:
      return 분위기_필터 as Record<Characteristic, string>;
    case 필터_카테고리.시설:
      return 시설_필터 as Record<Characteristic, string>;
    default:
      throw new Error("Invalid category");
  }
}
