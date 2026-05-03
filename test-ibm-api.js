const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env manually
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  } catch (e) {
    console.error('Error loading .env:', e.message);
  }
}

loadEnv();

const IBM_API_KEY = process.env.BOBSHELL_API_KEY;

if (!IBM_API_KEY) {
  console.error('❌ BOBSHELL_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🔍 Testing IBM Cloud API Key...');
console.log(`📋 API Key: ${IBM_API_KEY.substring(0, 10)}...${IBM_API_KEY.substring(IBM_API_KEY.length - 4)}`);

// Step 1: Get IAM token
function getIAMToken(apiKey) {
  return new Promise((resolve, reject) => {
    const requestBody = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`;
    
    const options = {
      hostname: 'iam.cloud.ibm.com',
      port: 443,
      path: '/identity/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    console.log('\n📡 Step 1: Requesting IAM token from IBM Cloud...');
    
    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.access_token) {
            console.log('   ✅ Successfully obtained IAM token');
            console.log(`   Token type: ${response.token_type}`);
            console.log(`   Expires in: ${response.expires_in} seconds`);
            resolve(response.access_token);
          } else {
            console.error('   ❌ Failed to get IAM token');
            console.error('   Response:', JSON.stringify(response, null, 2));
            reject(new Error(`IAM token request failed: ${response.errorMessage || 'Unknown error'}`));
          }
        } catch (e) {
          console.error('   ❌ Failed to parse response');
          console.error('   Raw response:', data.substring(0, 500));
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('   ❌ Network error:', e.message);
      reject(new Error(`Network error: ${e.message}`));
    });
    
    req.write(requestBody);
    req.end();
  });
}

// Step 2: Test watsonx.ai API (optional - requires project/instance setup)
function testWatsonxAPI(token) {
  return new Promise((resolve, reject) => {
    console.log('\n📡 Step 2: Testing watsonx.ai API access...');
    console.log('   Note: This requires a watsonx.ai instance and project ID');
    
    // This is a basic test - actual usage requires project_id
    const requestBody = JSON.stringify({
      input: "Hello, this is a test",
      model_id: "ibm/granite-13b-chat-v2",
      project_id: "YOUR_PROJECT_ID" // User needs to provide this
    });
    
    const options = {
      hostname: 'us-south.ml.cloud.ibm.com',
      port: 443,
      path: '/ml/v1/text/generation?version=2023-05-29',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ watsonx.ai API is accessible');
          resolve(true);
        } else if (res.statusCode === 400 || res.statusCode === 404) {
          console.log('   ⚠️  API is accessible but requires proper project_id configuration');
          console.log('   Response:', data.substring(0, 200));
          resolve(true); // API key works, just needs configuration
        } else {
          console.log('   ❌ watsonx.ai API access failed');
          console.log('   Response:', data.substring(0, 200));
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error('   ❌ Network error:', e.message);
      resolve(false);
    });
    
    req.write(requestBody);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    const token = await getIAMToken(IBM_API_KEY);
    await testWatsonxAPI(token);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ API KEY TEST COMPLETE');
    console.log('='.repeat(60));
    console.log('\n📝 Summary:');
    console.log('   • Your IBM Cloud IAM API key is VALID');
    console.log('   • Authentication is working correctly');
    console.log('   • To use watsonx.ai, you need to:');
    console.log('     1. Create a watsonx.ai instance in IBM Cloud');
    console.log('     2. Create a project and get the project_id');
    console.log('     3. Configure the project_id in your application');
    console.log('\n');
    
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ API KEY TEST FAILED');
    console.error('='.repeat(60));
    console.error('\nError:', error.message);
    console.error('\n📝 Possible issues:');
    console.error('   • API key might be invalid or expired');
    console.error('   • Network connectivity issues');
    console.error('   • IBM Cloud service might be down');
    console.error('\n💡 Next steps:');
    console.error('   1. Verify your API key at: https://cloud.ibm.com/iam/apikeys');
    console.error('   2. Check if the key has proper permissions');
    console.error('   3. Try regenerating the API key if needed');
    console.error('\n');
    process.exit(1);
  }
}

runTests();
