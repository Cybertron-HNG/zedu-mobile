import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import FastImage from 'react-native-fast-image';
import { UserAvatar } from '@/screens/channels/user-avatar';

jest.mock('@/theme/ThemeProvider', () => ({
  useTheme: () => ({ colors: require('@/theme/palettes').lightColors }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const render = async (
  user: React.ComponentProps<typeof UserAvatar>['user'],
) => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<UserAvatar user={user} />);
  });
  return renderer;
};

const textOf = (renderer: ReactTestRenderer.ReactTestRenderer) =>
  renderer.root
    .findAll(node => typeof node.props.children === 'string')
    .map(node => node.props.children)
    .join('');

describe('UserAvatar', () => {
  it('shows the user initial when there is no avatar url', async () => {
    const renderer = await render({ username: 'eshiet.eshiet' });

    expect(renderer.root.findAllByType(FastImage)).toHaveLength(0);
    expect(
      renderer.root.findAllByProps({ testID: 'user-avatar-fallback' }).length,
    ).toBeGreaterThan(0);
    expect(textOf(renderer)).toContain('E');
  });

  it('keeps a whole emoji as the initial', async () => {
    const renderer = await render({ username: '😀smile' });

    const texts = renderer.root
      .findAll(node => typeof node.props.children === 'string')
      .map(node => node.props.children);

    expect(texts.length).toBeGreaterThan(0);
    texts.forEach(text => expect(text).toBe('😀'));
  });

  it('renders the avatar image when a url is present', async () => {
    const renderer = await render({
      username: 'eshiet.eshiet',
      avatar_url: 'a.png',
    });

    expect(renderer.root.findAllByType(FastImage)).toHaveLength(1);
    expect(
      renderer.root.findAllByProps({ testID: 'user-avatar-fallback' }),
    ).toHaveLength(0);
  });

  it('falls back to the initial when the image fails to load', async () => {
    const renderer = await render({
      username: 'eshiet.eshiet',
      avatar_url: 'broken.png',
    });

    await ReactTestRenderer.act(() => {
      renderer.root.findByType(FastImage).props.onError();
    });

    expect(renderer.root.findAllByType(FastImage)).toHaveLength(0);
    expect(textOf(renderer)).toContain('E');
  });

  it('shows the new image when the avatar url changes after a failure', async () => {
    const renderer = await render({
      username: 'eshiet.eshiet',
      avatar_url: 'broken.png',
    });

    await ReactTestRenderer.act(() => {
      renderer.root.findByType(FastImage).props.onError();
    });

    await ReactTestRenderer.act(() => {
      renderer.update(
        <UserAvatar
          user={{
            username: 'eshiet.eshiet',
            avatar_url: 'new.png',
          }}
        />,
      );
    });

    expect(renderer.root.findByType(FastImage).props.source).toEqual({
      uri: 'new.png',
    });
  });

  it('keeps a 44pt tap area inside the parent bounds', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <UserAvatar user={{ username: 'eshiet.eshiet' }} size={20} />,
      );
    });
    const button = renderer.root.findByProps({
      accessibilityLabel: 'Open profile',
    });
    const { width, margin } = Object.assign({}, ...button.props.style);
    const { left, right } = button.props.hitSlop;

    expect(left).toBeGreaterThan(0);
    expect(width + left + right).toBeGreaterThanOrEqual(44);
    // hitSlop is only tappable inside the parent, so the margin must cover it.
    expect(margin).toBe(left);
  });
});
