import { CustomFetcher } from '../../types';

export const addProject = async (
  customFetcher: CustomFetcher,
  title: string,
  membersEmails: string[],
  token?: string
) => {
  try {
    const response = await customFetcher(`/api/projects`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        membersEmails: membersEmails,
      }),
    });

    /*  if (response?.status === 200) {
      const project = await response.json();
      console.log(project);
      setProjects((prevState: any) => [project, ...prevState]); */
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
