const 요일 = {
  SUN: "SUN",
  MON: "MON",
  TUE: "TUE",
  WED: "WED",
  THU: "THU",
  FRI: "FRI",
  SAT: "SAT",
  WEEKDAYS: "WEEKDAYS",
  WEEKENDS: "WEEKENDS",
  EVERYDAY: "EVERYDAY",
} as const;

type 요일 = (typeof 요일)[keyof typeof 요일];

const 요일_라벨 = {
  SUN: "일요일",
  MON: "월요일",
  TUE: "화요일",
  WED: "수요일",
  THU: "목요일",
  FRI: "금요일",
  SAT: "토요일",
  WEEKDAYS: "평일",
  WEEKENDS: "주말",
  EVERYDAY: "매일",
} as const;

type Time = `${"0" | "1"}${number}:${number}${number}`;

export class BusinessDay {
  dayOfWeek: 요일;
  openTime: Time | null;
  closeTime: Time | null;

  constructor(dayOfWeek: 요일, openTime: Time | null, closeTime: Time | null) {
    this.dayOfWeek = dayOfWeek;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }

  public static sort(businessDays: BusinessDay[]) {
    const dayOfWeekOrder = [
      요일.EVERYDAY,
      요일.WEEKDAYS,
      요일.WEEKENDS,
      요일.MON,
      요일.TUE,
      요일.WED,
      요일.THU,
      요일.FRI,
      요일.SAT,
      요일.SUN,
    ];

    return businessDays.sort((a, b) => {
      return (
        dayOfWeekOrder.indexOf(a.dayOfWeek) -
        dayOfWeekOrder.indexOf(b.dayOfWeek)
      );
    });
  }

  public static formatBusinessDay(businessDay: BusinessDay) {
    return `${요일_라벨[businessDay.dayOfWeek]} ${this.formatTime(
      businessDay.openTime
    )} ~ ${this.formatTime(businessDay.closeTime)}`;
  }

  public static getCurrentBusinessDay(businessDays: BusinessDay[]) {
    const currentDayOfWeek = this.getDayOfWeek(new Date());

    return businessDays.find((businessDay) => {
      if (businessDay.dayOfWeek === 요일.EVERYDAY) {
        return true;
      }

      if (businessDay.dayOfWeek === 요일.WEEKDAYS) {
        return currentDayOfWeek !== 요일.SAT && currentDayOfWeek !== 요일.SUN;
      }

      if (businessDay.dayOfWeek === 요일.WEEKENDS) {
        return currentDayOfWeek === 요일.SAT || currentDayOfWeek === 요일.SUN;
      }

      return businessDay.dayOfWeek === currentDayOfWeek;
    });
  }

  public static formatBusinessHours(businessDay: BusinessDay) {
    return `${this.formatTime(businessDay.openTime)} ~ ${this.formatTime(
      businessDay.closeTime
    )}`;
  }

  private static getDayOfWeek(date: Date): 요일 {
    const dayOfWeek = date.getDay();

    switch (dayOfWeek) {
      case 0:
        return 요일.SUN;
      case 1:
        return 요일.MON;
      case 2:
        return 요일.TUE;
      case 3:
        return 요일.WED;
      case 4:
        return 요일.THU;
      case 5:
        return 요일.FRI;
      case 6:
        return 요일.SAT;
      default:
        throw new Error("Invalid day of week");
    }
  }

  private static formatTime(time: Time | null) {
    if (time === null) {
      return "";
    }

    const [hourAsString, minuteAsString] = time.split(":");
    const hour = parseInt(hourAsString);
    const period = hour < 12 ? "오전" : "오후";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${period} ${formattedHour}:${minuteAsString}`;
  }
}
