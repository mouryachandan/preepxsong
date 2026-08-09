const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.cluster0.1ar7k.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('DNS Resolution failed:', err.message);
  } else {
    console.log('Resolved SRV:');
    console.log(addresses);
    
    if (addresses.length > 0) {
      const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
      const directUri = `mongodb://${hosts}/ai-interview-prod?ssl=true&replicaSet=atlas-xxxx-shard-0&authSource=admin&retryWrites=true&w=majority`;
      console.log('\nTry this direct connection string:');
      console.log(directUri);
    }
  }
});
