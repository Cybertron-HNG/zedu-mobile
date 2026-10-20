import { Folder, Media } from '@/types/thread';
import {
  matchesFolderDateFilter,
  sortFiles,
  sortFolders,
} from '@/utils/file-helpers';
import { FileManagementFilters } from '@/types/file-management';

type FolderFilterContext = Pick<
  FileManagementFilters,
  'mode' | 'uploadedByFilter' | 'dateFilter' | 'searchQuery' | 'sortBy'
> & {
  currentUserId?: string;
  // IDs of the members the "Uploaded By" filter matches. Folders only carry
  // the owner's user_id, not their name, so they are filtered by these IDs.
  uploadedByUserIds?: string[];
};

export const sortFileResults = (
  files: Media[],
  sortBy: FileManagementFilters['sortBy'],
): Media[] => {
  return sortFiles(files, sortBy);
};

export const filterFolders = (
  folders: Folder[],
  context: FolderFilterContext,
): Folder[] => {
  const {
    uploadedByFilter,
    uploadedByUserIds,
    dateFilter,
    searchQuery,
    sortBy,
  } = context;

  let result = [...folders];

  if (uploadedByFilter) {
    const ownerIds = new Set((uploadedByUserIds ?? []).map(String));
    result = result.filter(folder => ownerIds.has(String(folder.user_id)));
  }
  if (dateFilter !== 'any') {
    result = result.filter(folder =>
      matchesFolderDateFilter(folder, dateFilter),
    );
  }
  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    result = result.filter(folder => folder.name.toLowerCase().includes(query));
  }

  return sortFolders(result, sortBy);
};

type UploaderMember = { id: string; name?: string; username?: string };

/**
 * IDs of the members the "Uploaded By" filter refers to. Picking a member
 * from the sheet sets the filter to their label (`name || username`), so an
 * exact label match is used first; a typed search falls back to matching
 * names and usernames that contain the text, like the server's file search.
 */
export const resolveUploaderIds = (
  members: UploaderMember[],
  filter: string | null,
): string[] => {
  const query = filter?.trim().toLowerCase();
  if (!query) return [];

  const exact = members.filter(
    member => (member.name || member.username || '').toLowerCase() === query,
  );
  const matches = exact.length
    ? exact
    : members.filter(member =>
        [member.name, member.username].some(value =>
          (value || '').toLowerCase().includes(query),
        ),
      );
  return matches.map(member => String(member.id));
};
