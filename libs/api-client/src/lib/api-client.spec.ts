import { createOrchestrationApiClient } from './api-client';

describe('apiClient', () => {
  it('should work', () => {
    const client = createOrchestrationApiClient('http://localhost:8080');
    expect(client).toBeTruthy();
  });
});
