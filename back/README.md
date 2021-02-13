====================================================

GET /locations
Returns all locations info

Params:
filter[f]=v
· Returns only locations with value v for field f
· If a field is missing: error.
· If more than one field is provided: error.
· If more than one value is provided: error.

order[f]=ASC|DESC
· Returns filtered locations ordered by ascending / descending order of their field f
· If a field is missing: error.
· If more than one field is provided: error.
· If more than one value is provided: error.
· Only ascending / descending order is supported.

---

POST /locations
{
name: string,
country: string,
slug: string
}

· If either of the three is missing: error.
· No two items with the same (city, country) values can exist in the DB.
· No two items with the same (slug) value can exist in the DB.

====================================================

GET /forecast
Returns all weather info

Params:
location=c
· Only returns forecasts with value c for location field
· A location with slug c must already exist in the DB.

start=d
· Starting day of retrieved forecasts
· A valid date in format yyyy-mm-dd

end=n
· Number of days ahead of the starting day
· A valid date in format yyyy-mm-dd

Be aware that info is not necessary sorted

---

POST /forecast
{
locationSlug: {},
date: string, (format yyyy-mm-dd)
forecast: number[24],
}

· If either of the three is missing: error.
· A location with slug locationSlug must already exist in the DB.
· Date must have format yyyy-mm-dd
· No two items with the same (locationSlug, date) values can exist in the DB.
· Forecast must be an array
· Forecast must be an arra of 24 items
· All forecast items must numbers

---

GET /forecast/:citySlug/days/:number
Returns weather info of city with slug citySlug for the next number days

---

GET /forecast/:citySlug/date/:date
Returns weather info of city with slug citySlug for the specific date

====================================================
