# Test health endpoint
curl http://localhost:4000/health

# Test initialize endpoint
curl -X POST http://localhost:4000/v1/auth/initialize \
  -H "Content-Type: application/json" \
  -d '{"state":"test-123"}'

# Test status endpoint
curl http://localhost:4000/v1/auth/editor/status?state=test-123

# Test complete endpoint
curl -X POST http://localhost:4000/v1/auth/complete \
  -H "Content-Type: application/json" \
  -d '{"state":"test-123"}'