const rentIndex = require("../models/indexModel");
const { validationResult } = require("express-validator");

exports.index = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      res.status(422).json({
        errors: errors.array()
      })
      );
    }
    const {
      rentIndexYear,
      obj_street,
      obj_houseNumber,
      obj_houseNumberSupplement,
      obj_zipCode,
      obj_spaceSqm,
      obj_constructionYear,
      obj_areaWas,
      featureGroup1,
      featureGroup2,
      featureGroup3,
      featureGroup4,
      featureGroup5
    } = req.body;
    console.log(obj_street, obj_zipCode);
    let matchedStreet = rentIndex.getStreetByZipCode(obj_street, obj_zipCode);
    let calculatedHouseNumber = rentIndex.getHouseNumber(
      obj_houseNumber,
      obj_houseNumberSupplement
      );
      
      let sqmCategory = rentIndex.getSqmCategory(obj_spaceSqm);
      let rentIndexTable =
      rentIndexYear == 2017
      ? "streetIndex_Berlin_2017"
      : "streetIndex_Berlin_2019";
      
  rentIndex.db.get(
    'SELECT *, (houseNumberEndDecimal- ?) AS houseNumberDiff FROM ' +
      rentIndexTable +
      ' WHERE street = ? AND district = ? AND B IN (?, "F", "K") GROUP BY id HAVING houseNumberDiff >= 0 ORDER BY `houseNumberDiff` ASC LIMIT 1',
    [
      calculatedHouseNumber["houseNumberDecimal"],
      matchedStreet["street"],
      matchedStreet["district"],
      calculatedHouseNumber["houseNumberBlock"]
    ],
    (err, row) => {
      if (typeof(row) == 'undefined' || row.length == 0 || err) {
        res.status(500).json({
          errors: "no result"
        });
      } else {
        let yearCategory = rentIndex.getYearCategory(obj_constructionYear, row.areaWas);
        calculatedRentIndex = rentIndex.calculateRentIndex(
          rentIndexYear,
          row.objectStatus,
          yearCategory,
          sqmCategory,
          featureGroup1,
          featureGroup2,
          featureGroup3,
          featureGroup4,
          featureGroup5
        );
        res.send({
          reqData: {
            postalCode: parseInt(obj_zipCode),
            street: obj_street,
            houseNumber: parseInt(obj_houseNumber),
            houseNumberSupplement: obj_houseNumberSupplement,
            constructionYear: parseInt(obj_constructionYear),
            spaceSqm: parseInt(obj_spaceSqm),
            featureGroups: {
              1: parseInt(featureGroup1),
              2: parseInt(featureGroup2),
              3: parseInt(featureGroup3),
              4: parseInt(featureGroup4),
              5: parseInt(featureGroup5)
            }
          },
          matchedStreet: matchedStreet["street"],
          matchedHouseNumberIntervalMin: parseFloat(
            row.houseNumberStartDecimal
          ),
          matchedHouseNumberIntervalMax: parseFloat(row.houseNumberEndDecimal),
          matchedHouseNumberIntervalId: parseInt(row.id),
          matchedDistrict: matchedStreet["district"],
          yearCategory: yearCategory,
          objectInfo: {
            areaWas: row.areaWas,
            objectStatus: row.objectStatus,
            noiseLevel: row.noiseLevel === "true" ? true : false,
            residentialSituation: row.residentialSituation
          },
          rentIndex: {
            rentIndexYear: parseInt(rentIndexYear),
            yearCategory: yearCategory,
            sqmCategory: sqmCategory,
            featureGroupsFactor: parseFloat(calculatedRentIndex[4]),
            baseLocalComparativeRent: parseFloat(calculatedRentIndex[0]),
            minLocalComparativeRent: parseFloat(calculatedRentIndex[1]),
            maxLocalComparativeRent: parseFloat(calculatedRentIndex[2]),
            spanLocalComparativeRentSqm: parseFloat(calculatedRentIndex[3]),
            spanLocalComparativeRentTotal:
              Math.ceil(calculatedRentIndex[3] * obj_spaceSqm * 100) / 100
          }
        });
      }
    }
  );
};
