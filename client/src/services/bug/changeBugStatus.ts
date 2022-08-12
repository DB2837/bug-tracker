import { CustomFetcher } from '../../types';

export const changeBugStatus = async (
  status: string,
  customFetcher: CustomFetcher,
  projectID: string,
  bugID: string,
  token?: string
) => {
  try {
    const response = await customFetcher(
      `/api/projects/${projectID}/bugs/${bugID}/${status}`,
      {
        method: 'PATCH',
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
