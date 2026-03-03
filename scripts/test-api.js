const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/remedies',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data (first 500 chars):');
    console.log(data.substring(0, 500));
    
    // Parse and show count
    try {
      const parsed = JSON.parse(data);
      console.log(`\nTotal remedies: ${parsed.count}`);
      if (parsed.data && parsed.data.length > 0) {
        console.log(`First remedy: ${parsed.data[0].title}`);
      }
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
