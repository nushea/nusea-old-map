#define _XOPEN_SOURCE
#include <stdio.h>
#include <time.h>
#include <string.h>
#include <inttypes.h>


#define ts_t int64_t // defining the timestamp type

//{{{ SI units
#define SI_YEAR_EXACT 365.24219
#define SI_YEAR 365
#define SI_SECONDS_DAY (60*60*24)
#define SI_SECONDS_YEAR (SI_SECONDS_DAY * SI_YEAR)
#define SI_SECONDS_YEAR_EXACT (SI_SECONDS_DAY * SI_YEAR_EXACT)
//}}}

#define EPOCH 8093917028686

//{{{ SC units
#define SC_YEAR 356
#define SC_YEAR_EXACT 356.2272
#define SC_MONTH 22
#define SC_SECONDS_DAY (22+33*60+60*60*24)
#define SC_SECONDS_YEAR ((ts_t)(SC_SECONDS_DAY * SC_YEAR))
#define SC_SECONDS_YEAR_EXACT ((ts_t)(SC_SECONDS_DAY * SC_YEAR_EXACT))
#define SC_SECONDS_MONTH (SC_SECONDS_DAY * SC_MONTH)
#define SC_SECONDS_HOUR (SC_SECONDS_DAY / 16)
#define SC_SECONDS_MINUTE (SC_SECONDS_HOUR / 120)
#define SC_ACTUAL_SECOND (SC_SECONDS_MINUTE / 120)
//}}}

// {{{ leap year determination code definitions

#define SC_LEAP_RULE_SIMPLE 4
#define SC_LEAP_RULE_REMOVE 0x20
#define SC_LEAP_RULE_READD 0x80
#define SC_LEAP_RULE_DOUBLE 0x800
#define SC_LEAP_RULE_TRIPLE 0x2000
#define SC_LEAP_RULE_QUADRUPLE 0x8000
#define SC_LEAP_RULE_NEVER 0x40000

//}}}


ts_t LeapCounter(ts_t year);
int GetMonthLength(int leaps, int month);
ts_t GetYear(ts_t* timeStamp);
int GetMonth(ts_t year, ts_t* timeStamp);
int GetDay(ts_t* timeStamp);
int GetHour(ts_t* timeStamp);
void Fancifier(char * oup, ts_t year, int month, int day, int hour, int minute, ts_t timeStamp);
void FancyYear(char * oup, ts_t year);
void FancyMonth(char * oup, int month, int day);
void FancyDay(char * oup, int month, int day);
void FancyHour(char * oup, int hour);
void FancyMinute(char * oup, int minute);
ts_t NewYear(ts_t* timeStamp);

ts_t LeapCounter(ts_t year){ //{{{    
    ts_t temp_leap = 0, leap_count = 3 * (year >= 0);
    
    temp_leap = year/SC_LEAP_RULE_SIMPLE;
    leap_count += temp_leap;

    temp_leap = year/SC_LEAP_RULE_REMOVE;
    leap_count -= temp_leap;

    temp_leap = year/SC_LEAP_RULE_READD;
    leap_count += temp_leap;

    temp_leap = year/SC_LEAP_RULE_DOUBLE;
    leap_count += temp_leap;

    temp_leap = year/SC_LEAP_RULE_TRIPLE;
    leap_count += temp_leap;

    temp_leap = year/SC_LEAP_RULE_QUADRUPLE;
    leap_count += temp_leap;

    temp_leap = year/SC_LEAP_RULE_NEVER;
    leap_count -= temp_leap;

    return leap_count; 
} //}}}


int GetLeapsYear(ts_t year){ //{{{
//        year += 0x38000;        
        if(year % SC_LEAP_RULE_NEVER == 0)
            return 3;
        else if(year % SC_LEAP_RULE_QUADRUPLE == 0)
            return 4;
        else if(year % SC_LEAP_RULE_TRIPLE == 0)
            return 3;
        else if(year % SC_LEAP_RULE_DOUBLE == 0)
            return 2;
        else if(year % SC_LEAP_RULE_READD == 0)
            return 1;
        else if(year % SC_LEAP_RULE_REMOVE == 0)
            return 0;
        else if(year % SC_LEAP_RULE_SIMPLE == 0)
            return 1;
        return 0;

} //}}}


ts_t GetYear(ts_t* timeStamp){ //{{{
    ts_t year = 0;
    while(*timeStamp >= SC_SECONDS_YEAR + GetLeapsYear(year)*SC_SECONDS_DAY){
//        printf("leep %i | ", GetLeapsYear(year)); // debugs left as they describe the behavior of the code step by step
//        printf("%lli %lli | year %i \n", *timeStamp, SC_SECONDS_YEAR + SC_SECONDS_DAY * GetLeapsYear(year), year);
        *timeStamp -= GetLeapsYear(year) * SC_SECONDS_DAY;
        *timeStamp -= SC_SECONDS_YEAR;
        
        year += 1;
    }
//    printf("%lli \t", *timeStamp);
    return year;
} //}}}

ts_t NewYear(ts_t* timeStamp){ //{{{
    ts_t year = *timeStamp / SC_SECONDS_YEAR_EXACT;
    ts_t yearStart = year * SC_SECONDS_YEAR + LeapCounter(year - 1) * SC_SECONDS_DAY;
    ts_t yearDuration = SC_SECONDS_YEAR + GetLeapsYear(year) * SC_SECONDS_DAY;
    while (*timeStamp < yearStart) {
        year--;
        yearDuration = SC_SECONDS_YEAR + GetLeapsYear(year) * SC_SECONDS_DAY;
        yearStart -= yearDuration;
    }
    while (*timeStamp >= yearStart + yearDuration) {
        year++;
        yearStart += yearDuration;
        yearDuration = SC_SECONDS_YEAR + GetLeapsYear(year) * SC_SECONDS_DAY;
    }
    *timeStamp -= yearStart;
    return year;
}//}}}


//{{{ Month Calculations
int GetMonthLength(int leaps, int month){ //{{{
    if(month % 2)
        return SC_MONTH;
    if(month % 4 == 0)
        return SC_MONTH + 1;
    if(month == 2 && leaps)
        return SC_MONTH + 1;
    if(month == 6 && leaps > 1)
        return SC_MONTH + 1;
    if(month == 10 && leaps > 2)
        return SC_MONTH + 1;
    if(month == 14 && leaps > 3)
        return SC_MONTH + 1;
    return SC_MONTH;
}//}}}

int GetMonth(ts_t year, ts_t* timeStamp){
    int month = 1;
    int leaps = 0;
    if(*timeStamp >= SC_SECONDS_YEAR + GetLeapsYear(year) * SC_SECONDS_DAY){
        year = GetYear(timeStamp); 
    }
    leaps = GetLeapsYear(year);
//    printf("Month Debug:\n%lli %i\n",*timeStamp, leaps);
    while(*timeStamp >= SC_SECONDS_DAY * GetMonthLength(leaps, month)){
//        printf("%i %lli %i %lli %i\n", month, *timeStamp/SC_SECONDS_DAY, GetMonthLength(leaps, month), *timeStamp, SC_SECONDS_DAY * GetMonthLength(leaps, month));
        *timeStamp -= SC_SECONDS_DAY * GetMonthLength(leaps, month);
        month += 1;
    }
//    printf("%i %lli %i %lli %i\n", month, *timeStamp/SC_SECONDS_DAY, GetMonthLength(leaps, month), *timeStamp,  SC_SECONDS_DAY * GetMonthLength(leaps, month));
    return month - 1; 
} //}}}

//{{{ Day Calculations
int GetDay(ts_t* timeStamp){
    int day = 0;
    
    day = *timeStamp / SC_SECONDS_DAY;
    *timeStamp = *timeStamp % SC_SECONDS_DAY;
//    printf("days %lli\n", *timeStamp);
    return day;
}//}}}

//{{{ Hour Calculations
int GetHour(ts_t* timeStamp){
    int hour = *timeStamp / ( SC_SECONDS_DAY /16);
    *timeStamp = *timeStamp % (SC_SECONDS_DAY /16);
//    printf("hour %lli\n", *timeStamp);
    return hour; 
} //}}}

//{{{ Minute Calculations
int GetMinute(ts_t* timeStamp){
    int minute = *timeStamp / ((SC_SECONDS_DAY/16)/120);
    *timeStamp = *timeStamp % ((SC_SECONDS_DAY/16)/120);
//    printf("minute %lli\n", *timeStamp);
    return minute;
}//}}}


//{{{ The functions that make everything look up to spec

void FancyYear(char * oup, ts_t year){
    sprintf(oup+strlen(oup), "%04llX/", year % 0x4000);
}

void MonthName(char * oup, int month){
    switch (month){
        case  0: sprintf(oup+strlen(oup), "TI"); return;
        case  1: sprintf(oup+strlen(oup), "RI"); return;
        case  2: sprintf(oup+strlen(oup), "FO"); return;
        case  3: sprintf(oup+strlen(oup), "AC"); return;
        case  4: sprintf(oup+strlen(oup), "SN"); return;
        case  5: sprintf(oup+strlen(oup), "RN"); return;
        case  6: sprintf(oup+strlen(oup), "WI"); return;
        case  7: sprintf(oup+strlen(oup), "CR"); return;
        case  8: sprintf(oup+strlen(oup), "CY"); return;
        case  9: sprintf(oup+strlen(oup), "CO"); return;
        case 10: sprintf(oup+strlen(oup), "HO"); return;
        case 11: sprintf(oup+strlen(oup), "FS"); return;
        case 12: sprintf(oup+strlen(oup), "LV"); return;
        case 13: sprintf(oup+strlen(oup), "HM"); return;
        case 14: sprintf(oup+strlen(oup), "EM"); return;
        case 15: sprintf(oup+strlen(oup), "LM"); return;
        default: sprintf(oup+strlen(oup), "??"); return;
    }
}

void FancyMonth(char * oup, int month, int day){ 
    if(day == 22)
        sprintf(oup+strlen(oup), "X/");
    else
        sprintf(oup+strlen(oup), "%X/", month);
}

void FancyDay(char * oup, int month, int day){
    if(day == 22)
        switch (month){
            case 3:  sprintf(oup+strlen(oup), "CL "); break;
            case 7:  sprintf(oup+strlen(oup), "HR "); break;
            case 11: sprintf(oup+strlen(oup), "MN "); break;
            case 15: sprintf(oup+strlen(oup), "GD "); break;
            case 1:  sprintf(oup+strlen(oup), "TR "); break;
            case 5:  sprintf(oup+strlen(oup), "LI "); break;
            case 9:  sprintf(oup+strlen(oup), "DT "); break;
            case 13: sprintf(oup+strlen(oup), "SP "); break;
            default: sprintf(oup+strlen(oup), "\?\?/"); break;
        }
    else {
        if(day == 0){
            MonthName(oup, month);printf(" ");
        }
        else if(day < 8){
            if(day == 7)
                sprintf(oup+strlen(oup), "WI ");
            else
                sprintf(oup+strlen(oup), "%iW ", day - 1);
            }
        else if(day < 15){
            if(day == 14)
                sprintf(oup+strlen(oup), "HI ");
            else
                sprintf(oup+strlen(oup), "%iH ", day - 8);
            }
        else{
            if(day == 21)
                sprintf(oup+strlen(oup), "FI ");
            else
                sprintf(oup+strlen(oup), "%iF ", day - 15);
        }
    }
 
}

void FancyHour(char * oup, int hour){
    sprintf(oup+strlen(oup), "%X", hour);
}

void FancyMinute(char * oup, int minute){ 
    if(minute >= 60)
        sprintf(oup+strlen(oup), "x%02o", minute - 60);
    else
        sprintf(oup+strlen(oup), ":%02o", minute);
}

void Fancifier(char * oup, ts_t year, int month, int day, int hour, int minute, ts_t timeStamp){
//    printf("Time:");
    
    FancyYear(oup, year);
    FancyMonth(oup, month, day);
    FancyDay(oup, month, day);
    FancyHour(oup, hour);
    FancyMinute(oup, minute); 


    sprintf(oup+strlen(oup), ":%lli\n", timeStamp);
}

//}}}

int curtime(char * oup){
	memset(oup, 0, sizeof(*oup));
    ts_t testN = 0, t = 0;
	testN = time(NULL) + EPOCH;
    ts_t n_new = NewYear(&testN);
    int m_new = GetMonth(n_new, &testN);
    int d_new = GetDay(&testN);
    int h_new = GetHour(&testN);
    int min_new = GetMinute(&testN);

    Fancifier(oup, n_new, m_new, d_new, h_new, min_new, testN);
	
	return 5; 
}
