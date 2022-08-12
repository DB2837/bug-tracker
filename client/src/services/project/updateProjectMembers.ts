import { CustomFetcher } from '../../types';

export const updateProjectMembers = async (
  customFetcher: CustomFetcher,
  projectID: string,
  membersEmails: string[],
  token?: string
) => {
  try {
    const response = await customFetcher(
      `/api/projects/${projectID}/addmembers`,
      {
        method: 'PATCH',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ membersEmails: membersEmails }),
      }
    );

    if (response?.status === 200) {
      /* set(
        projects.filter((project: any) => project.id !== projectID)
      ); */
      return response;
    }

    console.log(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
