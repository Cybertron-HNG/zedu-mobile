/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import SigninScreen from '@/screens/auth/signin';
import SignupScreen from '@/screens/auth/signup';
import { signInWithGoogle } from '@/lib/google-auth';

jest.mock('@/lib/google-auth', () => ({
  configureGoogleSignIn: jest.fn(),
  signInWithGoogle: jest.fn(),
}));
jest.mock('@/lib/apple-auth', () => ({ signInWithApple: jest.fn() }));
jest.mock('@/utils/requests', () => ({ PostRequest: jest.fn() }));
jest.mock('@/store/useDataContext', () => ({
  useDataContext: () => ({ state: {}, dispatch: jest.fn() }),
}));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

// The first render in a cold worker loads the theme and styles, which can pass Jest's default 5s.
jest.setTimeout(60000);

const mockSignIn = signInWithGoogle as jest.MockedFunction<
  typeof signInWithGoogle
>;

const googleButton = (root: ReactTestRenderer.ReactTestInstance) =>
  root
    .findAllByType(TouchableOpacity)
    .find(b =>
      b
        .findAllByType(Text)
        .some(t => /with Google/.test(String(t.props.children))),
    )!;

describe.each([
  ['Sign in', SigninScreen],
  ['Sign up', SignupScreen],
])('%s screen Google button', (_name, Screen) => {
  it('stops loading and can be pressed again after Google sign-in fails', async () => {
    mockSignIn.mockRejectedValue(new Error('No Play Services'));

    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(Screen as any),
        ),
      );
    });

    await ReactTestRenderer.act(async () => {
      await googleButton(renderer!.root).props.onPress();
    });

    expect(mockSignIn).toHaveBeenCalled();
    expect(renderer!.root.findAllByType(ActivityIndicator)).toHaveLength(0);
    expect(googleButton(renderer!.root).props.disabled).toBe(false);

    await ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
  });
});
