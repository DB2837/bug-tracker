import { CustomFetcher } from '../../types';

export const updateProjectTitle = async (
  customFetcher: CustomFetcher,
  projectID: string,
  title: string,
  token?: string
) => {
  try {
    const response = await customFetcher(`/api/projects/${projectID}`, {
      method: 'PATCH',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        newTitle: title,
      }),
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
