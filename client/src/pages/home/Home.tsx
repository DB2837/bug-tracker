import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
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
import { deleteProject } from '../../services/project/deleteProject';
import { updateProjectMembers } from '../../services/project/updateProjectMembers';
import { replaceItemInArray } from '../../utils/replaceItemInArray';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader';
import { FlexContainer } from '../../styles/FlexContainer';

type TProps = {
  modals: TModals;

  setModals: React.Dispatch<React.SetStateAction<TModals>>;
};

const urls: string[] = [USER_PROJECTS, '/api/users'];

const Home = ({ modals, setModals }: TProps) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const _fetch = useCustomFetch();
  const [CRUDLoading, setCRUDloading] = useState<boolean>(false);
  const { data, loading } = useFetchData(
    urls,
    {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${auth?.accessToken}`,
      },
    },
    []
  );

  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersChecked, setUsersChecked] = useState<string[]>([]);
  const projectRef = useRef<Project>({} as Project);

  const pageSize = 6;
  const totalPages = Math.ceil(projects?.length / pageSize);
  const firstSliceIndex = (currentPage - 1) * pageSize;
  const lastSliceIndex = currentPage * pageSize;

  const payload: TPayload = useMemo(
    () => jwt_decode(auth?.accessToken as string),
    [auth?.accessToken]
  );
  const currentUserEmail = payload?.email;

  useEffect(() => {
    if (data && data[0] && data[1]) {
      setProjects(() => data[0]);
      setUsers(() => data[1]);
    }
  }, [data]);

  console.log('render');

  const handleDelete = async () => {
    try {
      setCRUDloading(true);
      const response = await deleteProject(
        _fetch,
        projectRef.current.id,
        auth?.accessToken
      );
      setModals((prevState) => ({
        ...prevState,
        deleteModal: false,
      }));

      if (response?.status === 200) {
        setProjects(
          projects.filter(
            (project: any) => project.id !== projectRef.current.id
          )
        );
        return;
      }
    } catch (error) {
      throw error;
    } finally {
      setCRUDloading(false);
    }
  };

  const handleUpdateMembers = async () => {
    try {
      setCRUDloading(true);
      const response = await updateProjectMembers(
        _fetch,
        projectRef.current.id,
        usersChecked,
        auth?.accessToken
      );

      if (response?.status === 200) {
        const updatedProject = await response.json();

        setProjects((prevState) => {
          const newProjectsArray = replaceItemInArray(
            prevState,
            projectRef.current.id,
            updatedProject
          );

          return newProjectsArray;
        });
        setModals((prevState) => ({
          ...prevState,
          addMembersModal: false,
        }));
      }
    } catch (error) {
      throw error;
    } finally {
      setCRUDloading(false);
    }
  };

  return (
    <GridContainer>
      {loading && <Loader />}
      {CRUDLoading && <Loader />}

      {modals.addProjectModal && (
        <AddProjectModal
          adminEmail={currentUserEmail}
          users={users}
          CRUDLoading={CRUDLoading}
          setCRUDloading={setCRUDloading}
          setProjects={setProjects}
          setModals={setModals}
        />
      )}

      {modals.editTitleModal && (
        <EditProjectTitle
          setModals={setModals}
          setProjects={setProjects}
          setCRUDloading={setCRUDloading}
          CRUDLoading={CRUDLoading}
          selectedProject={projectRef.current}
        />
      )}

      {modals.deleteModal && (
        <DeleteModal
          title='Confirm Delete Project'
          CRUDLoading={CRUDLoading}
          setModals={setModals}
          handleDelete={handleDelete}
        />
      )}

      {modals.addMembersModal && (
        <AddMembersModal
          adminEmail={currentUserEmail}
          users={users}
          usersChecked={usersChecked}
          selectedProject={projectRef.current}
          CRUDLoading={CRUDLoading}
          setUsersChecked={setUsersChecked}
          setModals={setModals}
          handleUpdateMembers={handleUpdateMembers}
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
                return (
                  <ProjectCard
                    project={project}
                    navigate={() => navigate(`/project/${project.id}`)}
                    key={project.id}
                    currentUser={currentUserEmail}
                    setModals={setModals}
                    SelectedProject={projectRef}
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
