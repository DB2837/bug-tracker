import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import styled from 'styled-components';
import { User, Project, TPayload, TModals } from '../../types';
import useAuth from '../../hooks/useAuth';
import useCustomFetch from '../../hooks/useCustomFetch';
import { USER_PROJECTS } from '../../utils/apis';
import ProjectCard from '../../components/ProjectCard';
import { GridContainer } from '../../styles/GridContainer';
import { StyledButton } from '../../styles/StyledButton';
import Slider from '../../components/Slider';
import AddProjectModal from '../../components/modals/AddProjectModal';
import DeleteModal from '../../components/modals/DeleteModal';
import AddMembersModal from '../../components/modals/AddMembersModal';
import EditProjectTitle from '../../components/modals/EditTitleModal';
import { deleteProject } from '../../services/deleteProject';

const getMembersEmails = (project: any) =>
  project.members.map((member: any) => member.email);

type TProps = {
  modals: TModals;

  setModals: React.Dispatch<React.SetStateAction<TModals>>;
};

const Home = ({ modals, setModals }: TProps) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProjectID, setSelectedProjectID] = useState<string>('');
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>('');
  const [selectedProjectMembers, setSelectedProjectMembers] = useState<User[]>(
    []
  );

  /* const [selectedProject, setSelectedProject] = useState<Project>(
    {} as Project
  ); */

  const _fetch = useCustomFetch();

  const pageSize = 6;
  const totalPages = Math.ceil(projects?.length / pageSize);
  const firstSliceIndex = (currentPage - 1) * pageSize;
  const lastSliceIndex = currentPage * pageSize;

  const urls: string[] = [USER_PROJECTS, '/api/users'];
  const payload: TPayload = jwt_decode(auth?.accessToken as string);
  const currentUserEmail = payload?.email;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const [userProjects, users] = await Promise.all(
          urls.map((url) =>
            _fetch(url, {
              method: 'GET',
              mode: 'cors',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${auth?.accessToken}`,
              },
              signal: signal,
            }).then((res) => res?.json())
          )
        );

        setProjects(userProjects);
        setUsers(users);
      } catch (error) {
        throw error;
      }
    })();

    return () => controller.abort();
  }, []);

  /*  console.log('USERS', users); */
  console.log('render');

  const handleDelete = async (event: React.SyntheticEvent) => {
    event.stopPropagation();
    const response = await deleteProject(
      _fetch,
      selectedProjectID,
      auth?.accessToken
    );
    setModals((prevState) => ({
      ...prevState,
      deleteModal: false,
    }));

    if (response?.status === 200) {
      setProjects(
        projects.filter((project: any) => project.id !== selectedProjectID)
      );
      return;
    }
  };

  return (
    <GridContainer>
      {modals.addProjectModal && (
        <AddProjectModal
          adminEmail={currentUserEmail}
          setProjects={setProjects}
          setModals={setModals}
          users={users}
        />
      )}

      {modals.editTitleModal && (
        <EditProjectTitle
          setModals={setModals}
          setSelectedProjectTitle={setSelectedProjectTitle}
          projectID={selectedProjectID}
          customFetch={_fetch}
        />
      )}

      {modals.deleteModal && (
        <DeleteModal
          title='Confirm Delete Project'
          setModals={setModals}
          handleDelete={handleDelete}
        />
      )}

      {modals.addMembersModal && (
        <AddMembersModal
          adminEmail={currentUserEmail}
          users={users}
          setSelectedProjectMembers={setSelectedProjectMembers}
          members={selectedProjectMembers}
          setModals={setModals}
          projectID={selectedProjectID}
        />
      )}

      <div
        style={{ textAlign: 'center', padding: '0.8rem', marginTop: '0.4rem' }}
      >
        <StyledButton
          onClick={() =>
            setModals((prevState) => ({ ...prevState, addProjectModal: true }))
          }
        >
          + New Project
        </StyledButton>{' '}
      </div>
      {projects?.length !== 0 && (
        <>
          {' '}
          <FlexContainer>
            {projects
              ?.map((project: any) => {
                let members = project.members;

                let projectTitle = project.title;
                /* project cards got rendered the first time whit project fetched info, when i click again on add members, home rerender and 
need to sync members email whit those setted on the modal*/
                if (project.id === selectedProjectID) {
                  members = selectedProjectMembers
                    ? selectedProjectMembers
                    : getMembersEmails(project);

                  projectTitle = selectedProjectTitle
                    ? selectedProjectTitle
                    : project.title;
                }

                return (
                  <ProjectCard
                    title={projectTitle}
                    admin={project.createdBy['email']}
                    bugs={project.bugs.length}
                    createdAt={project.createdAt}
                    navigate={() => navigate(`/project/${project.id}`)}
                    projectID={project.id}
                    key={project.id}
                    currentUser={currentUserEmail}
                    members={members}
                    setSelectedProjectMembers={setSelectedProjectMembers}
                    setModals={setModals}
                    setSelectedProjectID={setSelectedProjectID}
                  />
                );
              })
              .slice(firstSliceIndex, lastSliceIndex)}
          </FlexContainer>
          <Slider
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          ></Slider>{' '}
        </>
      )}
      {projects?.length === 0 && (
        <FlexContainer>
          <h2 style={{ textAlign: 'center' }}>
            Projects repo is empty. Create a new project!
          </h2>
        </FlexContainer>
      )}
    </GridContainer>
  );
};

export default Home;

export const FlexContainer = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 300px;
  margin: 0 auto;

  /*  min-height: 620px; */
  /*  border: 2px solid #fff; */
  /*  place-content: center; */
  /*  grid-template-columns: repeat(auto-fill, minmax(350px, 1600px)); */
  gap: 2rem;
  max-width: 1100px;
`;
