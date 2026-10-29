# AstroDash

Observing dashboard for **astrodash.apps.rjmlaird.co.uk**. Given a site and a date, it works out what is up, when it is dark, how good the Moon and weather are, and what the Sun and aurora are doing.

Apps index title: "Astro Mission Control". The page itself is titled AstroDash.

## Views

| Tab                   | What it shows                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tonight               | Night timeline, altitude through the night, best targets for your instrument, sky overhead, visible planets, next four Moon phases, next meteor shower peaks |
| Sky view              | All-sky chart and an "up now" list                                                                                                                           |
| Targets               | Target list from the built-in catalogue                                                                                                                      |
| Planner               | Session plan with observing order, suggested additions and free-text notes                                                                                   |
| Astrophotography      | Optics and star-trailing calculations, ISO guidance, calibration frames, field checklist, gear profiles                                                      |
| Sun, Moon & planets   | Sun and Moon details, moon-free darkness for the next 30 nights, solar system positions, minor planets and comets                                            |
| Planets               | Planet calendar (elongations, oppositions, conjunctions over 14 months), Jupiter and its moons, Saturn and its rings, Mars                                   |
| Meteors               | Meteor radiant map and shower peaks                                                                                                                          |
| Conditions            | Forecast, observing conditions you enter yourself, site and sky quality, session inputs, live source links                                                   |
| Aurora                | Kp forecast, viewing index, next four nights, aurora map, solar wind, "what Kp do you need here"                                                             |
| Solar                 | Sunspot regions, solar cycle, 27-day outlook, flares and X-rays, coronal mass ejections, solar wind, SDO and SOHO images                                     |
| Scope & field of view | What the chosen setup delivers, target in the field, observing location, session report                                                                      |
| Dark sky              | Dark-sky map and sites near you                                                                                                                              |

The page also contains a 7-day weather, air quality and pollen view with radar, and an equipment inventory view. Neither is in the tab bar.

A **Night vision** button switches to a red-only palette. A theme toggle is also available.

## Sites and location

There is no automatic geolocation. Pick one of the 12 built-in sites (default **Leicester (home)**: Kielder, Galloway, London, Edinburgh, Teide, Mauna Kea, Paranal, NamibRand, Washington DC, Tokyo, Sydney) or enter latitude, longitude, time zone and Bortle class manually.

## How it works

Positions are computed in the browser. Solar geometry follows Meeus, _Astronomical Algorithms_ (ch. 29), and planets use heliocentric ecliptic vectors. The page embeds its own catalogue: 434 deep-sky objects, 4,508 stars, 86 constellations and 3 minor bodies. Nothing in the repository depends on Skyfield or any Python library.

Live data is fetched by the browser:

| Source                                | Used for                                        |
| ------------------------------------- | ----------------------------------------------- |
| Open-Meteo (forecast and air quality) | Weather, air quality, pollen                    |
| NOAA SWPC                             | Kp, solar wind, flares, active regions, outlook |
| NASA DONKI                            | Coronal mass ejections                          |
| SDO and SOHO                          | Solar images                                    |
| Leaflet 1.9.4 (unpkg)                 | Loaded on demand for map views                  |
| Google Fonts                          | Typography                                      |

NASA DONKI uses the shared `DEMO_KEY` unless you enter a free key from api.nasa.gov in the app. That key is stored only in your browser.

## Data and privacy

Settings are saved in `localStorage` under the `astrodash.` prefix: location, instrument, gear profiles, session plan and notes, conditions, layers, theme, night mode and the NASA key. Nothing is sent to the Worker, which only serves static files. The equipment inventory can be exported as `astrodash-inventory.json`.

## Development

Single hand-written `index.html` (about 500 KB). The React files in `src/` are an unused scaffold.

```sh
pnpm --filter ./apps/astrodash dev
pnpm --filter ./apps/astrodash build
pnpm --filter ./apps/astrodash run cf:dev
pnpm --filter ./apps/astrodash run deploy
```

## Known issues

- Package metadata is `astrodash`, but the unused scaffold means `package.json` still lists React.
- The page is large and has no automated tests. Check changes by loading each tab.
- Aurora and solar views depend on NOAA and NASA feeds; the page shows a note when a feed is unavailable.
- Prediction thresholds and viewing indices are indicative, not forecasts you should rely on for safety.
