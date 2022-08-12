import { CustomFetcher } from '../../types';

export const updateComment = async (
  customFetcher: CustomFetcher,
  projectID: string,
  commentID: string,
  description: string,
  token?: string
) => {
  try {
    const response = await customFetcher(
      `/api/projects/${projectID}/comments/${commentID}`,
      {
        method: 'PATCH',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newDescription: description,
        }),
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
