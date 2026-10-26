/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppButton } from '@/components/ui/button';
import DeleteAccountScreen from '@/screens/settings/delete-account';

jest.mock('@/store/useDataContext', () => ({
  useDataContext: () => ({ state: {}, dispatch: jest.fn() }),
}));

jest.mock('@/utils/requests', () => ({ DeleteRequest: jest.fn() }));
jest.mock('@/utils/sign-out', () => ({ signOut: jest.fn() }));
jest.mock('@/components/ui/toast', () => ({ ShowNotify: jest.fn() }));

// The first render in a cold worker loads the theme and styles, which can pass Jest's default 5s.
jest.setTimeout(30000);

describe('DeleteAccountScreen buttons', () => {
  it('lets the user go back before choosing a reason, but not continue', async () => {
    const navigation = { goBack: jest.fn(), navigate: jest.fn() };
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(DeleteAccountScreen as any, { navigation }),
        ),
      );
    });

    const buttons = renderer!.root.findAllByType(AppButton);
    const goBack = buttons.find(b => b.props.title === 'Go Back')!;
    const continueToDelete = buttons.find(
      b => b.props.title === 'Continue to Delete',
    )!;

    expect(goBack.props.disabled).toBeFalsy();
    expect(continueToDelete.props.disabled).toBe(true);

    await ReactTestRenderer.act(() => {
      goBack.props.onPress();
    });
    expect(navigation.goBack).toHaveBeenCalledTimes(1);

    await ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
  });
});
