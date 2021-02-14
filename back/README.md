# Weather Forecast API

Base url = https://morning-falls-52071.herokuapp.com

This API allows GET, POST and DELETE on 2 types of data:

- Locations.
- Forecast.

## Locations

##### GET /locations

Returns a list of all locations.

Response example:

```json
[
  {
    "country": "Spain",
    "name": "Zaragoza",
    "slug": "zgz"
  },
  {}
]
```

###### Params

Locations can be filtered by any of their fields.
Endpoint examples:

```javascript
/locations?filter[name]=Madrid     // [{Madrid, Spain}, {Madrid, Mexico}, ...]
/locations?filter[country]=Germany // [{Bonn, Germany}, {Eseen, Germany}, ...]
```

Locations can be ordered by any of their fields.
Endpoint examples:

```javascript
/locations?order[name]=ASC  // [{Alicante}, {Barcelona}, {Zaragoza},...]
/locations?order[name]=DES  // [{Zaragoza}, {Barcelona}, {Alicante}...]
```

> There are two ordering criteria: ascending (ASC) and descending (DES).

Filters can be combined to refine search.
Endpoint examples:

```javascript
/locations?filter[country]=Spain&order[name]=DES
/locations?filter[name]=Zaragoza&order[country]=ASC
```

##### POST /locations

Insert a new location.

Payloaod example:

```json
{
  "name": "Helsinki",
  "country": "Finland",
  "slug": "hel"
}
```

Mind the following restrictions:

- The 3 fields are compulsory.
- No two items with the same `(name, country)` values can exist in the DB.
- No two items with the same `slug` value can exist in the DB.

##### DELETE /locations

Removes all locations data.

## Forecast

##### GET /forecast

Returns a list of all forecast information.

Response example:

```json
[
  {
    "date": "2021-02-13",
    "hourly": [
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      31,
      31,
      32,
      33,
      34
    ],
    "locationSlug": "zgz"
  },
  {}
]
```

###### Params

Forecast information can be filtered by location.
Endpoint examples:

```javascript
/forecast?location=bcn
```

> A location with the specified slug must already exist in the DB.

Forecast information can be filtered by date.
Use param `start` to get information after (>=) a specific date.
Use param `end`to get get information before (<=) a specific date.
Endpoint examples:

```javascript
/forecast?start=2021-02-20&end=2021-02-21 // Info for next weekend
```

> Dates are expected to be YYYY-MM-DD format

Filters can be combined to refine search.
Endpoint examples:

```javascript
/locations?filter[country]=Spain&order[name]=DES
/locations?filter[name]=Zaragoza&order[country]=ASC
```

##### POST /forecast

Insert a new forecast.

Payloaod example:

```json
    {
        "date": "2021-02-18",
        "hourly": [
            11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 31, 31, 32, 33, 34
        ],
        "locationSlug": "zgz"
    },
```

Mind the following restrictions:

- The 3 fields are compulsory.
- A location with slug `locationSlug` must already exist in the DB.
- `date` must have format YYYY-MM-DD.
- No two items with the same `(locationSlug, date)` values can exist in the DB.
- `hourly` must be an array.
- `hourly` must be an array of 24 items.
- All `hourly` items must be numbers.

##### DELETE /forecast

Removes all forecast information.
