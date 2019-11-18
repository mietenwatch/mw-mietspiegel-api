const { check } = require("express-validator");

exports.validateInputRI = [
  check("obj_street", "Please provide a street name using 'obj_street'.")
    .not()
    .isEmpty(),
  check(
    "obj_houseNumber",
    "Please provide a house number using 'obj_houseNumber'."
  )
    .not()
    .isEmpty(),
  check("obj_houseNumber", "Please provide a valid house number.").isInt(),
  check("obj_zipCode", "Please provide a zip code using 'obj_zipCode'.")
    .not()
    .isEmpty(),
  check(
    "obj_zipCode",
    "Please provide a valid German zip code using 'obj_zipCode'."
  ).isInt(),
  check("obj_zipCode", "Please provide a valid German zip code.").isPostalCode(
    "DE"
  ),
  check(
    "obj_constructionYear",
    "Please provide a construction year for the requested object 'obj_constructionYear'."
  )
    .not()
    .isEmpty(),
  check(
    "obj_constructionYear",
    "Please provide a construction year for the requested object 'obj_constructionYear'."
  ).isInt(),
  check(
    "rentIndexYear",
    "Please provide a year for the rent index using 'rentIndexYear'."
  )
    .not()
    .isEmpty(),
  check(
    "rentIndexYear",
    "Please provide a valid year for the rent index using 'rentIndexYear'. Either 2017 or 2019."
  ).isIn([2017, 2019]),
  check(
    "obj_spaceSqm",
    "Please provide a valid flat size for the requested object 'obj_spaceSqm'."
  ).isFloat()
];

exports.validateInputCS = [
  check("obj_street", "Please provide a street name using 'obj_street'.")
    .not()
    .isEmpty(),
  check(
    "obj_houseNumber",
    "Please provide a house number using 'obj_houseNumber'."
  )
    .not()
    .isEmpty(),
  check("obj_houseNumber", "Please provide a valid house number.").isInt()
];

exports.validateInputRL = [
  check("obj_street", "Please provide a street name using 'obj_street'.")
    .not()
    .isEmpty(),
  check(
    "obj_houseNumber",
    "Please provide a house number using 'obj_houseNumber'."
  )
    .not()
    .isEmpty(),
  check("obj_houseNumber", "Please provide a valid house number.").isInt(),
  check("obj_zipCode", "Please provide a zip code using 'obj_zipCode'.")
    .not()
    .isEmpty(),
  check(
    "obj_zipCode",
    "Please provide a valid German zip code using 'obj_zipCode'."
  ).isInt(),
  check("obj_zipCode", "Please provide a valid German zip code.").isPostalCode(
    "DE"
  ),
  check(
    "obj_constructionYear",
    "Please provide a construction year for the requested object 'obj_constructionYear'."
  )
    .not()
    .isEmpty(),
  check(
    "obj_constructionYear",
    "Please provide a construction year for the requested object 'obj_constructionYear'."
  ).isInt()
];
