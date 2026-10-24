/**
 * @format
 */

import {
  filterFolders,
  resolveUploaderIds,
  uploaderLabel,
} from '@/utils/file-management-filters';
import { Folder } from '@/types/thread';

const folder = (id: string, userId: string, name: string): Folder => ({
  id,
  organisation_id: 'org-1',
  user_id: userId,
  name,
  created_at: '2026-10-20T10:00:00Z',
  updated_at: '2026-10-20T10:00:00Z',
  deleted_at: null,
  item_count: 0,
});

const folders = [
  folder('f1', 'user-me', 'My notes'),
  folder('f2', 'user-ada', 'Ada designs'),
];

const context = {
  mode: 'all' as const,
  sortBy: 'name_asc' as const,
  dateFilter: 'any' as const,
  searchQuery: '',
  uploadedByFilter: null as string | null,
  uploadedByUserIds: [] as string[],
};

describe('filterFolders "Uploaded By"', () => {
  it("keeps the chosen person's folders, matched by user ID", () => {
    const result = filterFolders(folders, {
      ...context,
      uploadedByFilter: 'sparklynjewel',
      uploadedByUserIds: ['user-me'],
    });

    expect(result.map(f => f.id)).toEqual(['f1']);
  });

  it('shows no folders when nobody matches the filter', () => {
    const result = filterFolders(folders, {
      ...context,
      uploadedByFilter: 'nobody',
      uploadedByUserIds: [],
    });

    expect(result).toEqual([]);
  });

  it('shows every folder when the filter is off', () => {
    expect(filterFolders(folders, context)).toHaveLength(2);
  });
});

describe('resolveUploaderIds', () => {
  const members = [
    { id: 'u1', name: 'sam', username: 'sam' },
    { id: 'u2', name: 'Samuel Okafor', username: 'samuelo' },
    { id: 'u3', name: '', username: 'ada' },
  ];

  it('matches only the member picked from the sheet, not similar names', () => {
    expect(resolveUploaderIds(members, 'sam', 'u1')).toEqual(['u1']);
  });

  it('keeps every partial match for typed text, even when one name is exact', () => {
    expect(resolveUploaderIds(members, 'sam')).toEqual(['u1', 'u2']);
  });

  it('matches typed text against usernames when a member has no name', () => {
    expect(resolveUploaderIds(members, 'ada')).toEqual(['u3']);
  });

  it('matches names and usernames that contain typed text', () => {
    expect(resolveUploaderIds(members, 'samu')).toEqual(['u2']);
  });

  it('returns nothing when the filter is empty', () => {
    expect(resolveUploaderIds(members, '  ')).toEqual([]);
  });
});

describe('uploaderLabel', () => {
  it('uses the name, then the username', () => {
    expect(uploaderLabel({ id: 'u1', name: 'Sam', username: 'sam' })).toBe(
      'Sam',
    );
    expect(uploaderLabel({ id: 'u3', name: '', username: 'ada' })).toBe('ada');
  });

  it('falls back to the email, then the ID, so the label is never empty', () => {
    expect(uploaderLabel({ id: 'u4', email: 'kemi@example.com' })).toBe(
      'kemi@example.com',
    );
    expect(uploaderLabel({ id: 'u5' })).toBe('u5');
  });
});
