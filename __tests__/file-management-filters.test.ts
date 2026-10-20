/**
 * @format
 */

import { filterFolders } from '@/utils/file-management-filters';
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
