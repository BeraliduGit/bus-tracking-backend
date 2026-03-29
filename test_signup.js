const fetch = require('node-fetch');

async function testSignup() {
  const email = `testdriver${Date.now()}@test.com`;
  const nic = `NIC${Date.now()}`;
  const drivingLicenseId = `LIC${Date.now()}`;
  const busNumber = `BUS${Date.now()}`;

  console.log('Testing signup with:', { email, busNumber });

  const res = await fetch('http://localhost:4000/api/driver/drivers/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Driver',
      email,
      phone: '0771234567',
      nic,
      drivingLicenseId,
      busNumber,
      busRouteNumber: '1',
      routeStartingLocation: 'Colombo',
      routeEndingLocation: 'Kandy',
      password: 'password123'
    })
  });

  const data = await res.json();
  console.log('Signup response:', JSON.stringify(data, null, 2));
}

testSignup().catch(console.error);
