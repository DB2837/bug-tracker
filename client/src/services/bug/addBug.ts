import { CustomFetcher, Priority } from '../../types';

export const addBug = async (
  customFetcher: CustomFetcher,
  projectID: string,
  title: string,
  description: string,
  priority?: Priority,
  token?: string
) => {
  try {
    const response = await customFetcher(`/api/projects/${projectID}/bugs`, {
      method: 'POST',
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
