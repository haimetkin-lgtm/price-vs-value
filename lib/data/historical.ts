// נתוני מאקרו היסטוריים 2000–2024
// מקורות: למ"ס, בנק ישראל, דוחות יציבות פיננסית
// הנתונים הם אינדקסים ויחסים לצורך הצגה היסטורית — אינם תחליף לנתוני מקרו עדכניים

export interface YearlyData {
  year: number;
  housePriceIndex: number;   // מדד מחירי דירות (2000=100)
  incomeIndex: number;       // מדד הכנסה פנויה (2000=100)
  pir: number;               // מכפיל מחיר להכנסה (ממוצע ארצי)
  mortgageRate: number;      // ריבית משכנתה ממוצעת %
  hhDebtToGDP: number;       // חוב משקי בית / תמ"ג %
  rentYield: number;         // תשואת שכירות ברוטו %
  pricePremiumVsFundamental: number; // % חריגה ממחיר שיווי משקל (אומדן)
}

export const HISTORICAL_DATA: YearlyData[] = [
  { year: 2000, housePriceIndex: 100, incomeIndex: 100, pir: 6.1, mortgageRate: 8.5, hhDebtToGDP: 28, rentYield: 5.8, pricePremiumVsFundamental: -5 },
  { year: 2001, housePriceIndex: 95,  incomeIndex: 100, pir: 5.8, mortgageRate: 8.0, hhDebtToGDP: 27, rentYield: 6.1, pricePremiumVsFundamental: -10 },
  { year: 2002, housePriceIndex: 88,  incomeIndex: 99,  pir: 5.5, mortgageRate: 7.8, hhDebtToGDP: 26, rentYield: 6.5, pricePremiumVsFundamental: -15 },
  { year: 2003, housePriceIndex: 84,  incomeIndex: 99,  pir: 5.2, mortgageRate: 6.9, hhDebtToGDP: 26, rentYield: 6.8, pricePremiumVsFundamental: -18 },
  { year: 2004, housePriceIndex: 83,  incomeIndex: 101, pir: 5.0, mortgageRate: 5.8, hhDebtToGDP: 27, rentYield: 7.0, pricePremiumVsFundamental: -20 },
  { year: 2005, housePriceIndex: 85,  incomeIndex: 104, pir: 5.0, mortgageRate: 5.2, hhDebtToGDP: 28, rentYield: 6.9, pricePremiumVsFundamental: -18 },
  { year: 2006, housePriceIndex: 89,  incomeIndex: 108, pir: 5.1, mortgageRate: 5.5, hhDebtToGDP: 29, rentYield: 6.6, pricePremiumVsFundamental: -12 },
  { year: 2007, housePriceIndex: 96,  incomeIndex: 113, pir: 5.2, mortgageRate: 5.8, hhDebtToGDP: 30, rentYield: 6.2, pricePremiumVsFundamental: -8 },
  { year: 2008, housePriceIndex: 103, incomeIndex: 116, pir: 5.5, mortgageRate: 5.5, hhDebtToGDP: 31, rentYield: 5.9, pricePremiumVsFundamental: -3 },
  { year: 2009, housePriceIndex: 115, incomeIndex: 117, pir: 6.0, mortgageRate: 3.8, hhDebtToGDP: 33, rentYield: 5.4, pricePremiumVsFundamental: 5 },
  { year: 2010, housePriceIndex: 135, incomeIndex: 121, pir: 6.8, mortgageRate: 4.2, hhDebtToGDP: 36, rentYield: 4.8, pricePremiumVsFundamental: 15 },
  { year: 2011, housePriceIndex: 152, incomeIndex: 124, pir: 7.5, mortgageRate: 4.8, hhDebtToGDP: 38, rentYield: 4.4, pricePremiumVsFundamental: 22 },
  { year: 2012, housePriceIndex: 160, incomeIndex: 127, pir: 7.7, mortgageRate: 4.5, hhDebtToGDP: 39, rentYield: 4.2, pricePremiumVsFundamental: 25 },
  { year: 2013, housePriceIndex: 172, incomeIndex: 130, pir: 8.1, mortgageRate: 3.9, hhDebtToGDP: 40, rentYield: 3.9, pricePremiumVsFundamental: 28 },
  { year: 2014, housePriceIndex: 188, incomeIndex: 133, pir: 8.7, mortgageRate: 3.5, hhDebtToGDP: 41, rentYield: 3.6, pricePremiumVsFundamental: 32 },
  { year: 2015, housePriceIndex: 208, incomeIndex: 137, pir: 9.3, mortgageRate: 3.2, hhDebtToGDP: 43, rentYield: 3.3, pricePremiumVsFundamental: 38 },
  { year: 2016, housePriceIndex: 222, incomeIndex: 141, pir: 9.6, mortgageRate: 3.0, hhDebtToGDP: 44, rentYield: 3.1, pricePremiumVsFundamental: 40 },
  { year: 2017, housePriceIndex: 228, incomeIndex: 145, pir: 9.6, mortgageRate: 3.1, hhDebtToGDP: 44, rentYield: 3.1, pricePremiumVsFundamental: 38 },
  { year: 2018, housePriceIndex: 224, incomeIndex: 149, pir: 9.2, mortgageRate: 3.3, hhDebtToGDP: 43, rentYield: 3.2, pricePremiumVsFundamental: 34 },
  { year: 2019, housePriceIndex: 228, incomeIndex: 153, pir: 9.1, mortgageRate: 3.2, hhDebtToGDP: 43, rentYield: 3.2, pricePremiumVsFundamental: 32 },
  { year: 2020, housePriceIndex: 238, incomeIndex: 154, pir: 9.4, mortgageRate: 2.8, hhDebtToGDP: 46, rentYield: 3.0, pricePremiumVsFundamental: 35 },
  { year: 2021, housePriceIndex: 270, incomeIndex: 160, pir: 10.3, mortgageRate: 2.5, hhDebtToGDP: 48, rentYield: 2.7, pricePremiumVsFundamental: 45 },
  { year: 2022, housePriceIndex: 310, incomeIndex: 165, pir: 11.5, mortgageRate: 4.5, hhDebtToGDP: 49, rentYield: 2.5, pricePremiumVsFundamental: 52 },
  { year: 2023, housePriceIndex: 300, incomeIndex: 168, pir: 10.9, mortgageRate: 5.5, hhDebtToGDP: 48, rentYield: 2.7, pricePremiumVsFundamental: 46 },
  { year: 2024, housePriceIndex: 308, incomeIndex: 172, pir: 10.9, mortgageRate: 5.2, hhDebtToGDP: 48, rentYield: 2.8, pricePremiumVsFundamental: 44 },
];
