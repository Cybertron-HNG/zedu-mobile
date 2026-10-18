/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TextInput } from 'react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import AddOrganisationScreen from '@/screens/org/add-organisation';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('@/store/useDataContext', () => ({
  useDataContext: () => ({ state: {}, dispatch: jest.fn() }),
}));

jest.mock('react-native-country-picker-modal', () => () => null);

// The first render in a cold worker loads the theme and styles, which can pass Jest's default 5s.
jest.setTimeout(30000);

describe('AddOrganisationScreen hints', () => {
  it('shows the organisation name and type hints with correct casing and punctuation', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(AddOrganisationScreen),
        ),
      );
    });

    const placeholders = renderer!.root
      .findAllByType(TextInput)
      .map(input => input.props.placeholder);
    expect(placeholders).toContain('Enter your organisation name');
    expect(placeholders).toContain('What does your organisation do?');

    await ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
  });
});
