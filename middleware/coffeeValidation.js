const Coffee = require("../models/coffee");

module.exports = async function coffeeValidation(req, res, next) {
  const errors = {};
  const coffeeObject = {
    name: undefined,
    continent: undefined,
    country: undefined,
    process: undefined,
    price: undefined,
    roast: undefined,
    descriptors: [],
    description: undefined,
  };

  const name = req.body.name;
  if (!name) {
    errors.name = "A name must be supplied";
  } else if (typeof name !== "string") {
    errors.name = "The supplied name must be a string";
  } else if (name.length > 20) {
    errors.name = "The supplied name must be <= 20 characters long";
  } else {
    const titleCaseName = name
      .toLowerCase()
      .replace(/ +(?= )/g, "")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    if (req.method === "POST") {
      try {
        const doc = await Coffee.findOne({ name: titleCaseName }).exec();
        if (doc) {
          errors.name = "A coffee with this name already exists";
        } else {
          coffeeObject.name = titleCaseName;
        }
      } catch (err) {
        throw err;
      }
    } else {
      coffeeObject.name = titleCaseName;
    }
  }

  const continent = req.body.continent;
  if (!continent) {
    errors.continent = "A continent must be supplied";
  } else if (acceptedContinents.indexOf(continent) === -1) {
    errors.continent =
      'The continent must be one of "N/A", "Africa", "Americas", or "Asia"';
  } else {
    coffeeObject.continent = continent;
  }

  const country = req.body.country;
  if (!country) {
    errors.country = "A country must be supplied";
  } else if (acceptedCountries.indexOf(country) === -1) {
    errors.country = "The country supplied is not an accepted value";
  } else {
    coffeeObject.country = country;
  }

  const process = req.body.process;
  if (!process) {
    errors.process = "A process must be supplied";
  } else if (acceptedProcesses.indexOf(process) === -1) {
    errors.process =
      'The process must be one of "N/A", "Honey", "Natural", "Pulped Natural", or "Washed"';
  } else {
    coffeeObject.process = process;
  }

  const price = req.body.price;
  if (!price) {
    errors.price = "A price must be supplied";
  } else if (typeof price !== "number") {
    errors.price = "The supplied price must be a number";
    // } else if (isNaN(price)) {
    //   errors.price = 'The supplied price must be a number';
  } else if (price < 0 || price > 30) {
    errors.price = "The price must be a number between 0 and 30";
  } else {
    const splitPrice = String(price).split(".");
    if (splitPrice.length > 1) {
      if (splitPrice[1].length > 2) {
        errors.price =
          "The price must be a number with 2 decimal places or less";
      } else {
        coffeeObject.price = price;
      }
    } else {
      coffeeObject.price = price;
    }
  }

  const roast = req.body.roast;
  if (!roast) {
    errors.roast = "A roast must be supplied";
  } else if (acceptedRoasts.indexOf(roast) === -1) {
    errors.roast =
      'The roast must be one of "N/A", "Light", "Medium", "Medium-dark", or "Dark"';
  } else {
    coffeeObject.roast = roast;
  }

  const descriptor1 = req.body.descriptor1;
  if (!descriptor1) {
    errors.descriptor1 = "3 descriptors must be supplied";
  } else if (typeof descriptor1 !== "string") {
    errors.descriptor1 = "The supplied descriptor must be a string";
  } else if (descriptor1.length > 15) {
    errors.descriptor1 =
      "The supplied descriptor must be <= 15 characters long";
  } else if (descriptor1.match(/[^\p{L} -]+/gu)) {
    errors.descriptor1 = "The supplied descriptor contains invalid characters";
  } else {
    const titleCaseName = descriptor1
      .toLowerCase()
      .replace(/ +(?= )/g, "")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    coffeeObject.descriptors.push(titleCaseName);
  }

  const descriptor2 = req.body.descriptor2;
  if (!descriptor2) {
    errors.descriptor2 = "3 descriptors must be supplied";
  } else if (typeof descriptor2 !== "string") {
    errors.descriptor2 = "The supplied descriptor must be a string";
  } else if (descriptor2.length > 15) {
    errors.descriptor2 =
      "The supplied descriptor must be <= 15 characters long";
  } else if (descriptor2.match(/[^\p{L} -]+/gu)) {
    errors.descriptor2 = "The supplied descriptor contains invalid characters";
  } else {
    const titleCaseName = descriptor2
      .toLowerCase()
      .replace(/ +(?= )/g, "")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    coffeeObject.descriptors.push(titleCaseName);
  }

  const descriptor3 = req.body.descriptor3;
  if (!descriptor3) {
    errors.descriptor3 = "3 descriptors must be supplied";
  } else if (typeof descriptor3 !== "string") {
    errors.descriptor3 = "The supplied descriptor must be a string";
  } else if (descriptor3.length > 15) {
    errors.descriptor3 =
      "The supplied descriptor must be <= 15 characters long";
  } else if (descriptor3.match(/[^\p{L} -]+/gu)) {
    errors.descriptor3 = "The supplied descriptor contains invalid characters";
  } else {
    const titleCaseName = descriptor3
      .toLowerCase()
      .replace(/ +(?= )/g, "")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    coffeeObject.descriptors.push(titleCaseName);
  }

  const description = req.body.description;
  if (!description) {
    errors.description = "A description must be supplied";
  } else if (typeof description !== "string") {
    errors.description = "The supplied description must be a string";
  } else {
    coffeeObject.description = description;
  }

  if (Object.keys(errors).length === 0) {
    req.coffeeObject = coffeeObject;
    next();
  } else {
    res.status(400).send({
      status: "fail",
      data: errors,
    });
  }
};

const acceptedContinents = ["N/A", "Africa", "Americas", "Asia"];
const acceptedProcesses = [
  "N/A",
  "Honey",
  "Natural",
  "Pulped Natural",
  "Washed",
];
const acceptedRoasts = ["N/A", "Light", "Medium", "Medium-dark", "Dark"];
const acceptedCountries = [
  "N/A",
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo, The Democratic Republic of The",
  "Cook Islands",
  "Costa Rica",
  "Cote D'ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands (Malvinas)",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-bissau",
  "Guyana",
  "Haiti",
  "Heard Island and Mcdonald Islands",
  "Holy See (Vatican City State)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran, Islamic Republic of",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Democratic People's Republic of",
  "Korea, Republic of",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libyan Arab Jamahiriya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Macedonia, The Former Yugoslav Republic of",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia, Federated States of",
  "Moldova, Republic of",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestinian Territory, Occupied",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Pierre and Miquelon",
  "Saint Vincent and The Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and The South Sandwich Islands",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Viet Nam",
  "Virgin Islands, British",
  "Virgin Islands, U.S.",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
