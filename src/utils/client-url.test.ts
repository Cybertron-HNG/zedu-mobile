import { normalizeClientBaseUrl } from '@/utils/client-url';

describe('normalizeClientBaseUrl', () => {
  it('removes the entire run of trailing slashes', () => {
    expect(normalizeClientBaseUrl('https://example.com///')).toBe(
      'https://example.com',
    );
  });
});
