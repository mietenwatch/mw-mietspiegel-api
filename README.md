# API for Berlin Rent Index

API for determining rent index limits for Berlin addresses according to [Berlin 2017](https://www.berliner-mieterverein.de/uploads/2017/05/mietspiegel-2017-broschuere-190517.pdf) and [2019](https://www.stadtentwicklung.berlin.de/wohnen/mietspiegel/de/download/Mietspiegel2019.pdf) rent indexes. Residential status is calculated using the street directories for [2017](https://www.berliner-mieterverein.de/uploads/2017/05/mietspiegel-2017-strassenverzeichnis-190517.pdf) and [2019](https://www.stadtentwicklung.berlin.de/wohnen/mietspiegel/de/download/Strassenverzeichnis2019.pdf).

## Using the API

1. install Node dependencies `npm install`
2. run API `node ./www/bin`
3. send GET request to `http://localhost:3000/getRentIndex/` using the following body:

**required**
* `obj_street` (string): street of the object
* `obj_houseNumber` (string): house number of the object (with house number supplement if needed)
* `obj_zipCode` (integer): zip code of the object
* `obj_constructionYear` (integer) construction year of the object
* `rentIndexYear` (integer): requested rent index (2017 or 2019)
* `obj_spaceSqm` (float): space of the object in square meters

**optional**
* `featureGroups` (integer): array [1, 2, 3, 4, 5] covering different appartment features categories according to [page 13 and following](https://www.berliner-mieterverein.de/uploads/2017/05/mietspiegel-2017-broschuere-190517.pdf). For a positive feature category use `-1` for a neutral category use `0` and for a positive category use `1`. 

## API response

* `rentIndex`:
  * `rentIndexYear`: year of rent index used
  * `baseLocalComparativeRent`: medium value of determined rent index
  * `minLocalComparativeRent`: minimum value of determined rent index
  * `maxLocalComparativeRent`: maximum value of determined rent index
  

This project was funded by the German Federal Ministry of Education and Research within the Prototype Fund funding line organized by Open Knowledge Fundation.


![gefördert vom BMBF](https://raw.githubusercontent.com/mietenwatch/mietenwatch/master/static/bmbfgefoerdert.jpg)
