import { beforeEach, describe, expect, it, vi } from 'vitest';
import { backend } from './backendAdapter';

const storeState = {
  backendApiSecret: null as string | null,
};

vi.mock('../store/useAppStore', () => {
  const useAppStore = Object.assign(vi.fn(), {
    getState: () => storeState,
  });
  return { useAppStore };
});

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('backendAdapter', () => {
  beforeEach(() => {
    storeState.backendApiSecret = null;
    vi.restoreAllMocks();
  });

  it('does not mark a backend as available when health passes but authenticated routes reject it', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/health')) {
        return jsonResponse({ status: 'ok', version: 'test', timestamp: 'now' });
      }
      if (url.endsWith('/settings')) {
        return jsonResponse({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    await backend.init();

    expect(backend.isAvailable).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/health'), expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/settings'), expect.any(Object));
  });

  it('marks a backend as available when health and authenticated routes pass', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/health')) {
        return jsonResponse({ status: 'ok', version: 'test', timestamp: 'now' });
      }
      if (url.endsWith('/settings')) {
        return jsonResponse({});
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    await backend.init();

    expect(backend.isAvailable).toBe(true);
  });

  it('uses the configured API secret when probing authenticated backend routes', async () => {
    storeState.backendApiSecret = 'secret-value';
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/health')) {
        return jsonResponse({ status: 'ok', version: 'test', timestamp: 'now' });
      }
      if (url.endsWith('/settings')) {
        return jsonResponse({});
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    await backend.init();

    const settingsCall = fetchMock.mock.calls.find(([url]) => String(url).endsWith('/settings'));
    expect(settingsCall?.[1]).toMatchObject({
      headers: expect.objectContaining({ Authorization: 'Bearer secret-value' }),
    });
  });
});
