import { CustomFetcher, Priority } from '../../types';

export const updateBug = async (
  customFetcher: CustomFetcher,
  projectID: string,
  bugID: string,
  title: string,
  description: string,
  priority?: Priority,
  token?: string
) => {
  try {
    console.log(bugID, title, description, priority);
    const response = await customFetcher(
      `/api/projects/${projectID}/bugs/${bugID}/update`,
      {
        method: 'PATCH',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          priority: priority,
        }),
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
