const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/test';
mongoose.connect(uri).then(async () => {
  console.log('Connected to:', uri);

  const Bus = mongoose.model('Bus', new mongoose.Schema({}, { strict: false }), 'buses');
  const Driver = mongoose.model('Driver', new mongoose.Schema({}, { strict: false }), 'drivers');

  const buses = await Bus.find().sort({ createdAt: -1 }).limit(5).lean();
  console.log('\nLatest 5 buses:');
  buses.forEach(b => console.log(' -', b.busNumber, '| assignedDriver:', b.assignedDriver, '| created:', b.createdAt));

  const drivers = await Driver.find().sort({ createdAt: -1 }).limit(5).lean();
  console.log('\nLatest 5 drivers:');
  drivers.forEach(d => console.log(' -', d.name, '| activeBus:', d.activeBus, '| busNumber:', d.busNumber, '| created:', d.createdAt));

  await mongoose.disconnect();
}).catch(e => console.error('Error:', e.message));
