import fs from 'fs';

const data = JSON.parse(fs.readFileSync('C:/Users/HP/Downloads/intro_to_backend.routes (1).json', 'utf8'));

const citiesMap = new Map();

data.forEach(route => {
  if (route.startCity && route.startLocation) {
    citiesMap.set(route.startCity, {
      name: route.startCity,
      lat: route.startLocation.lat,
      lng: route.startLocation.lng
    });
  }
  if (route.endCity && route.endLocation) {
    citiesMap.set(route.endCity, {
      name: route.endCity,
      lat: route.endLocation.lat,
      lng: route.endLocation.lng
    });
  }
});

const cities = Array.from(citiesMap.values());

fetch('http://localhost:4000/api/v1/cities/bulk-upsert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cities })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
