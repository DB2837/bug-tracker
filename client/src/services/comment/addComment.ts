import { CustomFetcher } from '../../types';

export const addComment = async (
  customFetcher: CustomFetcher,
  projectID: string,
  bugID: string,
  description: string,
  token?: string
) => {
  try {
    const response = await customFetcher(
      `/api/projects/${projectID}/bugs/${bugID}/comments`,
      {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: description,
        }),
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
