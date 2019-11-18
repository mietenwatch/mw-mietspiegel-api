// INITIALIZE DATABASE
var sqlite3 = require("sqlite3").verbose();
exports.db = new sqlite3.Database("./static/mw-rentIndex-streetIndexes.sqlite");
const helpers = require("../helpers/variables.js");

// LOAD FUZZY SEARCH
const Fuse = require("fuse.js");
const _ = require("underscore");
var fuseOptions = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.7,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["district", "street"]
};

// INCLUDE STREETS JSON
const fs = require("fs");
var streetsBerlinRawData = fs.readFileSync("./static/streetsBerlin.json");
const streetsDistrictsBerlin = JSON.parse(streetsBerlinRawData);

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

exports.getHouseNumber = (obj_houseNumber, obj_houseNumberSupplement) => {
  let alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  let letterPosition = (alphabet.indexOf(obj_houseNumberSupplement) + 1).pad(2);
  let calculatedHouseNumber = new Array();
  calculatedHouseNumber["houseNumberDecimal"] = parseFloat(
    obj_houseNumber + "." + letterPosition
  );

  if (obj_houseNumber % 2 == 0) {
    calculatedHouseNumber["houseNumberBlock"] = "G";
  } else {
    calculatedHouseNumber["houseNumberBlock"] = "U";
  }

  return calculatedHouseNumber;
};

exports.getRentLimit = (obj_constructionYear, obj_areaWas, obj_spaceSqm) => {
  let rentLimit;
  if (obj_constructionYear < 1919) {
    rentLimit =
      obj_spaceSqm < 60
        ? helpers.rentLimits_Berlin_BMV[0][0]
        : helpers.rentLimits_Berlin_BMV[0][1];
  } else if (obj_constructionYear >= 1919 && obj_constructionYear <= 1949) {
    rentLimit =
      obj_spaceSqm < 60
        ? helpers.rentLimits_Berlin_BMV[1][0]
        : helpers.rentLimits_Berlin_BMV[1][1];
  } else if (obj_constructionYear >= 1950 && obj_constructionYear <= 1972) {
    rentLimit =
      obj_spaceSqm < 60
        ? helpers.rentLimits_Berlin_BMV[2][0]
        : helpers.rentLimits_Berlin_BMV[2][1];
  } else if (
    obj_constructionYear >= 1973 &&
    obj_constructionYear <= 1990 &&
    obj_areaWas == "W"
  ) {
    rentLimit =
      obj_spaceSqm < 60
        ? helpers.rentLimits_Berlin_BMV[3][0]
        : helpers.rentLimits_Berlin_BMV[3][1];
  } else if (
    obj_constructionYear >= 1973 &&
    obj_constructionYear <= 1990 &&
    obj_areaWas == "O"
  ) {
    rentLimit =
      obj_spaceSqm < 60
        ? helpers.rentLimits_Berlin_BMV[4][0]
        : helpers.rentLimits_Berlin_BMV[4][1];
  } else if (obj_constructionYear >= 1991 && obj_constructionYear <= 2002) {
    rentLimit =
      obj_spaceSqm < 60
        ? helpers.rentLimits_Berlin_BMV[5][0]
        : helpers.rentLimits_Berlin_BMV[5][1];
  } else if (obj_constructionYear >= 2003 && obj_constructionYear <= 2018) {
    rentLimit =
      obj_spaceSqm < 60
        ? helpers.rentLimits_Berlin_BMV[6][0]
        : helpers.rentLimits_Berlin_BMV[6][1];
  }
  return rentLimit;
};

exports.getStreetByZipCode = (street, obj_zipCode) => {
  let districts = this.getDistrictsForZipCode(obj_zipCode);
  let filteredStreetsList = this.filter(streetsDistrictsBerlin, districts);

  let fuse = new Fuse(filteredStreetsList[0], fuseOptions);
  let matchedStreet = _.first(fuse.search(street));
  let matchedStreetPretty = new Array();
  matchedStreetPretty["street"] = matchedStreet.item.street;
  matchedStreetPretty["district"] = matchedStreet.item.district;
  return matchedStreetPretty;
};

exports.getStreetByDistrict = (street, district) => {
  console.log(street);
  districtArray = [];
  districtArray.push(district);
  console.log(districtArray);
  let filteredStreetsList = this.filter(streetsDistrictsBerlin, districtArray);

  let fuse = new Fuse(filteredStreetsList[0], fuseOptions);

  let matchedStreet = _.first(fuse.search(street));
  let matchedStreetPretty = new Array();
  matchedStreetPretty["street"] = matchedStreet.item.street;
  matchedStreetPretty["district"] = district;

  return matchedStreetPretty;
};

exports.filter = (data, needles) => {
  let filteredList = [];
  for (var i = 0; i < needles.length; i++) {
    filteredList.push(
      _.where(data, {
        district: needles[i]
      })
    );
  }
  return filteredList;
};

exports.getDistrictsForZipCode = obj_zipCode => {
  let matchedDistricts = [];
  for (var i = 0; i < helpers.zipCodes_Berlin.length; i++) {
    if (
      helpers.zipCodes_Berlin[i].zipCodes.indexOf(parseInt(obj_zipCode)) > -1
    ) {
      matchedDistricts.push(helpers.zipCodes_Berlin[i].district);
    }
  }
  return matchedDistricts;
};

exports.getYearCategory = (obj_constructionYear, obj_areaWas) => {
  obj_constructionYear = parseInt(obj_constructionYear);
  let yearCategory;

  if (obj_constructionYear < 1919) {
    yearCategory = 0;
  } else if (1919 <= obj_constructionYear && obj_constructionYear <= 1949) {
    yearCategory = 1;
  } else if (1950 <= obj_constructionYear && obj_constructionYear <= 1964) {
    yearCategory = 2;
  } else if (1965 <= obj_constructionYear && obj_constructionYear <= 1972) {
    yearCategory = 3;
  } else if (
    1973 <= obj_constructionYear &&
    obj_constructionYear <= 1990 &&
    obj_areaWas == "W"
  ) {
    yearCategory = 4;
  } else if (
    1973 <= obj_constructionYear &&
    obj_constructionYear <= 1990 &&
    obj_areaWas == "O"
  ) {
    yearCategory = 5;
  } else if (1991 <= obj_constructionYear && obj_constructionYear <= 2002) {
    yearCategory = 6;
  } else if (2003 <= obj_constructionYear && obj_constructionYear <= 2019) {
    yearCategory = 7;
  }

  return yearCategory;
};

exports.getSqmCategory = obj_spaceSqm => {
  let sqm;
  if (obj_spaceSqm < 40) {
    sqm = 0;
  } else if (40 <= obj_spaceSqm && obj_spaceSqm < 60) {
    sqm = 1;
  } else if (60 <= obj_spaceSqm && obj_spaceSqm < 90) {
    sqm = 2;
  } else {
    sqm = 3;
  }
  return sqm;
};

exports.calculateRentIndex = (
  rentIndexYear,
  obj_status,
  yearCategory,
  sqmCategory,
  featureGroup1,
  featureGroup2,
  featureGroup3,
  featureGroup4,
  featureGroup5
) => {
  if (rentIndexYear == 2017) {
    rentIndexValues =
      helpers.rentIndex_Berlin_2017[sqmCategory][obj_status][yearCategory];
  } else if (rentIndexYear == 2019) {
    rentIndexValues =
      helpers.rentIndex_Berlin_2019[sqmCategory][obj_status][yearCategory];
  }
  featureGroupFactor =
    1 +
    (parseInt(featureGroup1) +
      parseInt(featureGroup2) +
      parseInt(featureGroup3) +
      parseInt(featureGroup4) +
      parseInt(featureGroup5)) *
      0.2;

  let rentIndexSpecific;

  if (featureGroupFactor * rentIndexValues[0] > rentIndexValues[2]) {
    rentIndexSpecific = rentIndexValues[2];
  } else if (featureGroupFactor * rentIndexValues[0] < rentIndexValues[1]) {
    rentIndexSpecific = rentIndexValues[1];
  } else {
    rentIndexSpecific = featureGroupFactor * rentIndexValues[0];
  }

  rentIndexValues.push(rentIndexSpecific);
  rentIndexValues.push(featureGroupFactor);
  return rentIndexValues;
};
