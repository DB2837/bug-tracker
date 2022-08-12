import { CustomFetcher } from '../../types';
export const leaveProject = async (
  customFetcher: CustomFetcher,
  projectID: string,
  token?: string
) => {
  try {
    const response = await customFetcher(`/api/projects/${projectID}/leave`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
