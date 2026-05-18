import { render, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { vi } from 'vitest';

import { BrowserRouter } from 'react-router-dom';

import App from './app';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  })
});

describe('App', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      writable: true,
      value: vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ body: [] })
      } as Response)
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully', async () => {
    const { baseElement } = render(
      <MantineProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });

    expect(baseElement).toBeTruthy();
  });

  it('should render the home route content', async () => {
    const { getByText } = render(
      <MantineProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(getByText(/With this application, you can:/i)).toBeTruthy();
    });
  });
});
