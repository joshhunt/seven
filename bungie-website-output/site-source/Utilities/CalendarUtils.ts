import moment from "moment";
import { RouteDefs } from "@Routes/RouteDefs";

//BEGIN:VCALENDAR
//VERSION:2.0
//PRODID:-//ZContent.net//Zap Calendar 1.0//EN
//CALSCALE:GREGORIAN
//METHOD:PUBLISH
//BEGIN:VEVENT
//SUMMARY:Abraham Lincoln
//UID:2008-04-28-04-15-56-62-@americanhistorycalendar.com
//SEQUENCE:0
//STATUS:CONFIRMED
//TRANSP:TRANSPARENT
//RRULE:FREQ=YEARLY;INTERVAL=1;BYMONTH=2;BYMONTHDAY=12
//DTSTART:20080212
//DTEND:20080213
//DTSTAMP:20150421T141403
//CATEGORIES:U.S. Presidents,Civil War People
//LOCATION:Hodgenville\, Kentucky
//GEO:37.5739497;-85.7399606
//DESCRIPTION:Born February 12\, 1809\nSixteenth President (1861-1865)\n\n\n
// \nhttp://AmericanHistoryCalendar.com
//URL:http://americanhistorycalendar.com/peoplecalendar/1,328-abraham-lincol
// n
//END:VEVENT
//END:VCALENDAR

//Required Fields
//SUMMARY*
//DTSTART*
//UID*

//20180501T212200000Z/20180501T222200000Z

/** Check CalendarUtils for additional attributes that can be added in a valid calendar(.ics) file  */
export interface ICalendarOptions {
  /**Required Format: 20180501T222200000Z*/
  start: string;

  summary: string;
  title: string;
  location?: string;
  url?: string;
  end?: string;
}

export class CalendarUtils {
  public static Instance = new CalendarUtils();

  public static AddToSystemCalendar(options: ICalendarOptions) {
    const addToCalendarInstance = CalendarUtils.Instance;

    const icsString = addToCalendarInstance.GenerateICSString(options);

    addToCalendarInstance.DownloadICS(icsString);
  }

  public static GenerateStartEndDateString(
    startDate: string,
    endDate: string
  ): string {
    return `${startDate}/${endDate}`.replace(/000Z/g, "Z");
  }

  public static AddGoogleEvent(calendarOptions: ICalendarOptions) {
    const startendString = CalendarUtils.GenerateStartEndDateString(
      calendarOptions.start,
      calendarOptions.end?.length > 0
        ? calendarOptions.end
        : calendarOptions.start
    );

    //Google Calendar API:
    //http://www.google.com/calendar/event?
    //action=TEMPLATE
    //&text=BANDNAME @ VENUE
    //&dates=VALIDSTARTDATE/VALIDENDDATE (ie. 20140127T224000Z)
    //&location=VENUE
    //&details=FULL BAND LIST
    //&trp=false
    //&sprop=LINK TO LMS GIG PAGE
    //&sprop=name:LEEDS MUSIC SCENE

    //VALIDSTARTDATE/VALIDENDDATE (ie. 20140127T224000Z)

    const calendar = `http://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
      calendarOptions.title
    )}&dates=${encodeURIComponent(
      startendString
    )}&location=${encodeURIComponent(
      calendarOptions.location
    )}&details=${encodeURIComponent(calendarOptions.summary)}`;

    window.open(calendar);
  }

  private DownloadICS(ics: string) {
    window.open("data:text/calendar;charset=utf8," + escape(ics));
  }

  protected GenerateICSString(options: ICalendarOptions): string {
    const startDate = options.start.replace(/000Z/g, "Z");
    const icsString = `BEGIN:VCALENDAR\nVERSION:2.0\nMETHOD:PUBLISH\nBEGIN:VEVENT\nSUMMARY:${
      options.title
    }\nLOCATION:${options.location}\nDESCRIPTION:${options.summary}\nUID:${
      options.start + options.summary
    }\nDTSTART:${startDate}\nURL:${options.url}\nEND:VEVENT\nEND:VCALENDAR`;

    return icsString;
  }
}
