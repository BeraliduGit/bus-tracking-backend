import mongoose from 'mongoose';
import fs from 'fs';

const uri = 'mongodb://localhost:27017/test';

async function seedRoutes() {
  try {
    console.log('Connecting to MongoDB:', uri);
    await mongoose.connect(uri);
    console.log('Connected successfully!');

    // Get the actual collection to clear indexes if needed, 
    // but better to just satisfy the existing indexes.
    const RouteSchema = new mongoose.Schema({}, { strict: false });
    const Route = mongoose.model('Route', RouteSchema, 'routes');

    const filePath = 'c:\\Users\\HP\\Downloads\\intro_to_backend.routes.json';
    if (!fs.existsSync(filePath)) {
      console.error('Error: File not found at', filePath);
      process.exit(1);
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(rawData);

    console.log(`Found ${jsonData.length} routes. Mapping to match model schema...`);

    const cleanedData = jsonData.map(item => {
      // Satisfy the unique 'routeName' and 'routeNumber' constraints
      const routeName = `${item.routeNumber}: ${item.startCity} to ${item.endCity}`;
      
      return {
        routeName: routeName,
        routeNumber: String(item.routeNumber),
        // Keep these for current frontend compatibility
        startCity: item.startCity,
        endCity: item.endCity,
        // Match the backend model's startPoint/endPoint structure
        startPoint: {
          name: item.startCity,
          location: {
            type: "Point",
            coordinates: [item.startLocation.lng, item.startLocation.lat]
          }
        },
        endPoint: {
          name: item.endCity,
          location: {
            type: "Point",
            coordinates: [item.endLocation.lng, item.endLocation.lat]
          }
        },
        pathCoordinates: item.pathCoordinates,
        isActive: true
      };
    });

    console.log('Clearing existing routes...');
    await Route.deleteMany({});

    console.log('Uploading 10 routes...');
    const result = await Route.insertMany(cleanedData);

    console.log(`Successfully uploaded ${result.length} routes!`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL Error seeding routes:', error);
    process.exit(1);
  }
}

seedRoutes();
