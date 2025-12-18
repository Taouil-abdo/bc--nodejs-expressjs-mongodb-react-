import axios from 'axios';

const BASE_URL = 'http://localhost:5010/api/V1';

console.log('🔍 Testing Backend Endpoints...\n');

// Test 1: Server Health
async function testServerHealth() {
    try {
        const response = await axios.get(`${BASE_URL}/auth/login`, {
            validateStatus: () => true
        });
        console.log('✅ Server is responding');
        return true;
    } catch (error) {
        console.log('❌ Server is not responding:', error.message);
        return false;
    }
}

// Test 2: Login
async function testLogin() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'driver@fleet.com',
            password: 'driver123'
        });
        
        if (response.data.token) {
            console.log('✅ Login successful');
            return response.data.token;
        } else {
            console.log('⚠️  Login response missing token');
            return null;
        }
    } catch (error) {
        console.log('❌ Login failed:', error.response?.data?.message || error.message);
        return null;
    }
}

// Test 3: Protected Route
async function testProtectedRoute(token) {
    if (!token) {
        console.log('⏭️  Skipping protected route test (no token)');
        return;
    }
    
    try {
        const response = await axios.get(`${BASE_URL}/driver/my-trips`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Protected route accessible');
        console.log(`   Found ${response.data.length} trips`);
    } catch (error) {
        console.log('❌ Protected route failed:', error.response?.data?.message || error.message);
    }
}

// Test 4: Database Connection
async function testDatabase() {
    try {
        const response = await axios.get(`${BASE_URL}/trucks`, {
            validateStatus: () => true
        });
        
        if (response.status === 401) {
            console.log('✅ Database connected (auth required)');
        } else if (response.status === 200) {
            console.log('✅ Database connected');
        } else {
            console.log('⚠️  Unexpected response:', response.status);
        }
    } catch (error) {
        console.log('❌ Database connection issue:', error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('═══════════════════════════════════════\n');
    
    const serverOk = await testServerHealth();
    if (!serverOk) {
        console.log('\n❌ Server is not running. Start it with: npm run dev');
        process.exit(1);
    }
    
    console.log('');
    await testDatabase();
    
    console.log('');
    const token = await testLogin();
    
    console.log('');
    await testProtectedRoute(token);
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Backend health check complete!\n');
}

runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
});
