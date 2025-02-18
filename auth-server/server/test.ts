async function testEndpoints() {
    const baseUrl = 'http://localhost:4000';
    const state = 'test-state-123';

    try {
        // Test health endpoint
        console.log('\nTesting health endpoint...');
        const healthResponse = await fetch(`${baseUrl}/health`);
        console.log('Health status:', await healthResponse.json());

        // Test initialize endpoint
        console.log('\nTesting initialize endpoint...');
        const initResponse = await fetch(`${baseUrl}/v1/auth/initialize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state })
        });
        console.log('Initialize response:', await initResponse.json());

        // Test status endpoint
        console.log('\nTesting status endpoint...');
        const statusResponse = await fetch(`${baseUrl}/v1/auth/editor/status?state=${state}`);
        console.log('Status response:', await statusResponse.json());

        // Test complete endpoint
        console.log('\nTesting complete endpoint...');
        const completeResponse = await fetch(`${baseUrl}/v1/auth/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state })
        });
        console.log('Complete response:', await completeResponse.json());

        // Test final status
        console.log('\nTesting final status...');
        const finalStatusResponse = await fetch(`${baseUrl}/v1/auth/editor/status?state=${state}`);
        console.log('Final status response:', await finalStatusResponse.json());

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testEndpoints(); 