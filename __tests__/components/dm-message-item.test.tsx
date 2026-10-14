import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import MessageItem from '@/components/layout/chat/messagItem';

jest.mock('@/theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: new Proxy({}, { get: () => '#000000' }),
  }),
}));
jest.mock('@/store/useDataContext', () => ({
  useDataContext: () => ({ state: {}, dispatch: jest.fn() }),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('react-native-video', () => 'Video');
jest.mock('react-native-fast-image', () => 'FastImage');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@/components/layout/chat/media-viewer', () => 'MediaViewer');
jest.mock('@/components/layout/chat/message-content', () => ({
  MessageContent: 'MessageContent',
}));
jest.mock('@/components/layout/chat/forwarded-message-block', () => ({
  ForwardedMessageBlock: 'ForwardedMessageBlock',
}));
jest.mock('@/components/layout/chat/audio-message-player', () => ({
  AudioMessagePlayer: 'AudioMessagePlayer',
}));
jest.mock('@/components/layout/chat/chat-file-attachment', () => ({
  ChatFileAttachmentCard: 'ChatFileAttachmentCard',
  ChatFilePreviewModal: 'ChatFilePreviewModal',
}));
jest.mock('@/components/layout/chat/reaction-details', () => 'ReactionDetails');

const baseItem = {
  thread_id: 't1',
  message: '<p>ok</p>',
  created_at: '2026-10-14T10:42:00Z',
  message_count: 0,
  media: [],
  sent: true,
  reactions: [{ reaction: '👍', reaction_id: 'r1' }],
};

const byTestId = (root: ReactTestRenderer.ReactTestInstance, id: string) =>
  root.findAll(n => typeof n.type === 'string' && n.props.testID === id);

const render = (item: object) => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <MessageItem
        item={item}
        index={0}
        messages={[item]}
        onLongPress={jest.fn()}
      />,
    );
  });
  return renderer;
};

describe('DM MessageItem reaction badge', () => {
  it.each([true, false])(
    'renders the badge outside the bubble, in flow (sent=%s)',
    sent => {
      const root = render({ ...baseItem, sent }).root;
      const [bubble] = byTestId(root, 'message-bubble');
      const [badge] = byTestId(root, 'reaction-badge');

      expect(byTestId(bubble, 'reaction-badge')).toHaveLength(0);
      const style = StyleSheet.flatten(badge.props.style);
      expect(style.position).not.toBe('absolute');
      expect(style.alignSelf).toBe(sent ? 'flex-end' : 'flex-start');
    },
  );

  it('keeps the time and Edited label inside the bubble', () => {
    const root = render({ ...baseItem, edited: true }).root;
    const [bubble] = byTestId(root, 'message-bubble');
    const texts = bubble
      .findAll(n => (n.type as string) === 'Text')
      .map(n => [n.props.children].flat().join(''));
    expect(texts).toContain('Edited');
  });

  it('renders no badge when there are no reactions', () => {
    const root = render({ ...baseItem, reactions: [] }).root;
    expect(byTestId(root, 'reaction-badge')).toHaveLength(0);
  });
});
