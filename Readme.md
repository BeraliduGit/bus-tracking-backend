# Unified Bus Tracking Backend

This backend combines passenger and driver systems into one Express server while keeping modules separate.

## API namespaces

- Passenger (new): `/api/passenger/v1/*`
- Driver (new): `/api/driver/*`

Compatibility aliases are also mounted to reduce breakage:

- Passenger (legacy): `/api/v1/*`, `/api/bus/*`
- Driver (legacy): `/api/drivers/*`, `/api/passengers/*`, `/api/routes/*`, `/api/locations/*`

## Dual MongoDB setup

Two databases are used:

- `PASSENGER_MONGODB_URI` for passenger data
- `DRIVER_MONGODB_URI` for driver data

Passenger models are bound to a dedicated passenger connection. Driver module remains on its own connection and logic.

## Environment variables

Create `.env` based on `.env.example`.

Required:

- `PASSENGER_MONGODB_URI`
- `DRIVER_MONGODB_URI`
- `JWT_SECRET`

Optional:

- `PASSENGER_DB_NAME` (default from code constant)
- `DRIVER_DB_NAME`
- `PORT` (default `4000`)
- `CORS_ORIGIN` (comma-separated origins)

## Run

```bash
npm install
npm run dev
```

or

```bash
npm start
```

Health check:

- `GET /api/health`