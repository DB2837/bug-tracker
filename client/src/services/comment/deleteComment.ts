import { CustomFetcher } from '../../types';

export const deleteComment = async (
  customFetcher: CustomFetcher,
  projectID: string,
  commentID: string,
  token?: string
) => {
  try {
    const response = await customFetcher(
      `/api/projects/${projectID}/comments/${commentID}`,
      {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
