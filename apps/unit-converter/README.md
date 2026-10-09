# unit-converter

Physics, engineering and astronomy unit converter (length, mass, time, speed, force, pressure, energy, power, temperature, angle). Conversion logic lives in `@rjmlaird/utils` (`units.ts`).

## Run locally
```sh
pnpm --filter @rjmlaird/unit-converter dev
# open http://localhost:8788/unit-converter
```

## API
```sh
curl "http://localhost:8788/unit-converter/units"
curl "http://localhost:8788/unit-converter/convert?category=length&value=1&from=pc&to=ly"
curl "http://localhost:8788/unit-converter/convert?category=temperature&value=100&from=c&to=f"
```
