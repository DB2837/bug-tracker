export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type Project = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  createdBy: User;
  members: User[];
  bugs: any[];
};

export enum Priority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum DeletionTarget {
  notDefined,
  comment = 'comment',
  bug = 'bug',
  project = 'project',
}

export type Bug = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  closedAt: string | null;
  createdByUserId: string;
  closedByUserId: string | null;
  reopenedAt: string | null;
  createdBy: User;
  closedBy: User;
  reOpenedBy: User;
  isClosed: boolean;
  priority: Priority;
  comments: any[];
};

export type TPayload = {
  id: string;
  email: string;
  firstName: string;
  iat: number;
  exp: number;
};

export type TModals = {
  deleteModal: boolean;
  editTitleModal: boolean;
  addMembersModal: boolean;
  addProjectModal: boolean;
  addBugModal: boolean;
  editBugModal: boolean;
  addCommentModal: boolean;
  editCommentModal: boolean;
  leaveProjectModal: boolean;
};

export type CustomFetcher = (
  url: string,
  options: any
) => Promise<Response | undefined>;
