const axios = require('axios');
async function test() {
  try {
    console.log('Testing JioSaavn API...');
    const url = 'https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&n=50&p=1&q=90s+bollywood+romantic+hits';
    const response = await axios.get(url);
    console.log('Success, results:', response.data.results ? response.data.results.length : 0);
  } catch (e) {
    console.log('Axios error:', e.message, e.response?.status);
  }
}
test();
