/**
 * @format
 */

import { extractMessageUrls } from '@/utils/link-preview';

jest.mock('@env', () => ({ CLIENT_URL: 'https://zedu.chat' }), {
  virtual: true,
});

describe('extractMessageUrls', () => {
  it.each([
    'Email me at ada@zedu.com please',
    'Send it to ada@school.co.uk',
    'Mail first.last@mail.google.com today',
    'ada@zedu.com.ng',
  ])('does not treat the domain in an email address as a link: %s', text => {
    expect(extractMessageUrls(text)).toEqual([]);
  });

  it('still finds http(s) and www links', () => {
    expect(
      extractMessageUrls('See https://zedu.chat/pricing and www.example.org'),
    ).toEqual(['https://zedu.chat/pricing', 'https://www.example.org']);
  });

  it('still finds a bare domain and a full subdomain', () => {
    expect(extractMessageUrls('Open zedu.chat.io now')).toEqual([
      'https://zedu.chat.io',
    ]);
    expect(extractMessageUrls('Try mail.google.com')).toEqual([
      'https://mail.google.com',
    ]);
  });

  it('finds a link that comes right after an email address', () => {
    expect(extractMessageUrls('ada@zedu.com or see https://zedu.chat')).toEqual(
      ['https://zedu.chat'],
    );
  });

  it('does not match a bare domain that only starts a longer word', () => {
    expect(extractMessageUrls('The zedu.company page')).toEqual([]);
  });
});
