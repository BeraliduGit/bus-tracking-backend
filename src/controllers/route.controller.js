import { getPassengerRouteModel } from "../modules/passenger/models/index.js";

const toFiniteNumber = (value) => {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    // Handles MongoDB extended-json style values if they appear in payloads.
    if (value && typeof value === "object") {
        const candidate = value.$numberDouble ?? value.$numberDecimal ?? value.$numberInt ?? value.$numberLong;
        if (candidate !== undefined) {
            const parsed = Number(candidate);
            return Number.isFinite(parsed) ? parsed : null;
        }
    }

    return null;
};

const normalizePoint = (point) => {
    if (!point) {
        return null;
    }

    let lat = null;
    let lng = null;

    if (Array.isArray(point) && point.length >= 2) {
        const first = toFiniteNumber(point[0]);
        const second = toFiniteNumber(point[1]);

        if (first !== null && second !== null) {
            // Accept either [lat, lng] or [lng, lat]
            if (first >= -90 && first <= 90 && second >= -180 && second <= 180) {
                lat = first;
                lng = second;
            } else if (second >= -90 && second <= 90 && first >= -180 && first <= 180) {
                lat = second;
                lng = first;
            }
        }
    } else {
        lat = toFiniteNumber(point.lat ?? point.latitude);
        lng = toFiniteNumber(point.lng ?? point.lon ?? point.longitude);
    }

    if (lat === null || lng === null) {
        return null;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return null;
    }

    return { lat, lng };
};

const normalizeRouteForClient = (route) => {
    const path = Array.isArray(route.pathCoordinates)
        ? route.pathCoordinates.map(normalizePoint).filter(Boolean)
        : [];

    const startLocation = normalizePoint(route.startLocation) || path[0] || null;
    const endLocation = normalizePoint(route.endLocation) || path[path.length - 1] || null;
    const routeNumber = route?.routeNumber == null ? "" : String(route.routeNumber).trim();
    const startCity = route?.startCity == null ? "" : String(route.startCity).trim();
    const endCity = route?.endCity == null ? "" : String(route.endCity).trim();

    return {
        ...route,
        routeNumber,
        startCity,
        endCity,
        startLocation,
        endLocation,
        pathCoordinates: path,
    };
};

const listRouteFilters = async (req, res) => {
    try {
        const Route = getPassengerRouteModel();
        const [routeNumbers, startCities, endCities] = await Promise.all([
            Route.distinct("routeNumber"),
            Route.distinct("startCity"),
            Route.distinct("endCity"),
        ]);

        const routeNumberOptions = routeNumbers.filter(Boolean).sort((a, b) => String(a).localeCompare(String(b)));
        const cityOptions = Array.from(
            new Set([...startCities.filter(Boolean), ...endCities.filter(Boolean)])
        ).sort((a, b) => String(a).localeCompare(String(b)));

        return res.status(200).json({
            routeNumbers: routeNumberOptions,
            cities: cityOptions,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching route filters",
            error: error.message,
        });
    }
};

const listRoutes = async (req, res) => {
    try {
        const Route = getPassengerRouteModel();
        const routeNumber = (req.query.routeNumber || "").trim();
        const startCity = (req.query.startCity || "").trim();
        const endCity = (req.query.endCity || "").trim();

        const query = {};

        if (routeNumber) {
            query.routeNumber = { $regex: routeNumber, $options: "i" };
        }

        if (startCity) {
            query.startCity = { $regex: `^${startCity}$`, $options: "i" };
        }

        if (endCity) {
            query.endCity = { $regex: `^${endCity}$`, $options: "i" };
        }

        const routes = await Route.find(query).sort({ routeNumber: 1, startCity: 1, endCity: 1 }).lean();
        const normalizedRoutes = routes.map(normalizeRouteForClient);

        return res.status(200).json({
            count: normalizedRoutes.length,
            routes: normalizedRoutes,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching routes",
            error: error.message,
        });
    }
};

export { listRoutes, listRouteFilters };
