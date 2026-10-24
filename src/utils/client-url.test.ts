import { normalizeClientBaseUrl } from '@/utils/client-url';

describe('normalizeClientBaseUrl', () => {
  it('removes the entire run of trailing slashes', () => {
    const origin = ['https:', '', 'example.com'].join('/');

    expect(normalizeClientBaseUrl(`${origin}///`)).toBe(origin);
  });
});
