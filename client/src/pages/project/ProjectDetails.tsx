import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import useAuth from '../../hooks/useAuth';
import useCustomFetch from '../../hooks/useCustomFetch';
import BugCard from '../../components/BugCard';
import { GridContainer } from '../../styles/GridContainer';
import { Bug, DeletionTarget, TModals, TPayload, User } from '../../types';
import { StyledButton } from '../../styles/StyledButton';
import { FlexContainer } from '../../styles/FlexContainer';
import DeleteModal from '../../components/modals/DeleteModal';
import { deleteBug } from '../../services/bug/deleteBug';
import AddBugModal from '../../components/modals/AddBugModal';
import AddMembersModal from '../../components/modals/AddMembersModal';
import { deleteProject } from '../../services/project/deleteProject';
import { updateProjectMembers } from '../../services/project/updateProjectMembers';
import { leaveProject } from '../../services/project/leaveProject';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader';

type TProjectInfo = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  createdBy: User;
  members: User[];
  bugs: Bug[];
};

type TProps = {
  modals: TModals;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
};

const ProjectDetails = ({ modals, setModals }: TProps) => {
  const _fetch = useCustomFetch();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { projectID } = useParams();
  const [CRUDLoading, setCRUDloading] = useState<boolean>(false);
  const urls: string[] = [`/api/projects/${projectID}`, '/api/users'];

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
  const [project, setProject] = useState<TProjectInfo>(() => ({
    id: '',
    title: '',
    createdAt: '',
    updatedAt: '',
    createdByUserId: '',
    createdBy: {} as User,
    members: [],
    bugs: [],
  }));

  const [usersChecked, setUsersChecked] = useState<string[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [selectedBugID, setSelectedBugID] = useState<string>('');
  const deletionTargetRef = useRef<DeletionTarget>(DeletionTarget.notDefined);

  const payload: TPayload = useMemo(
    () => jwt_decode(auth?.accessToken as string),
    [auth?.accessToken]
  );
  const currentUserEmail = payload?.email;

  useEffect(() => {
    if (data && data[0] && data[1]) {
      setUsers(() => data[1]);
      setProject(() => data[0]);
      setBugs(() => data[0].bugs);
    }
  }, [data]);

  const handleSubmit = async () => {
    setModals((prevState) => ({
      ...prevState,
      addBugModal: true,
    }));
  };

  const handleDelete = async (event: React.SyntheticEvent) => {
    event.stopPropagation();

    try {
      setCRUDloading(true);

      if (deletionTargetRef.current === DeletionTarget.bug) {
        const response = await deleteBug(
          _fetch,
          project.id,
          selectedBugID,
          auth?.accessToken
        );
        setModals((prevState) => ({
          ...prevState,
          deleteModal: false,
        }));

        if (response?.status === 200) {
          setBugs(() => bugs.filter((bug: Bug) => bug.id !== selectedBugID));
          return;
        }
      }

      if (deletionTargetRef.current === DeletionTarget.project) {
        const response = await deleteProject(
          _fetch,
          project.id,
          auth?.accessToken
        );
        setModals((prevState) => ({
          ...prevState,
          deleteModal: false,
        }));

        if (response?.status === 200) {
          navigate('/', { replace: true });
          return;
        }
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
        project.id,
        usersChecked,
        auth?.accessToken
      );

      if (response?.status === 200) {
        const updatedProject = await response.json();

        setProject(() => updatedProject);
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

  const handleLeaveProject = async () => {
    try {
      setCRUDloading(true);
      const response = await leaveProject(_fetch, projectID as string);

      if (response?.status === 200) {
        navigate('/', { replace: true });
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

      {modals.addMembersModal && (
        <AddMembersModal
          adminEmail={currentUserEmail}
          users={users}
          usersChecked={usersChecked}
          CRUDLoading={CRUDLoading}
          setUsersChecked={setUsersChecked}
          selectedProject={project}
          setModals={setModals}
          handleUpdateMembers={handleUpdateMembers}
        />
      )}

      {modals.deleteModal && (
        <DeleteModal
          title='Confirm Deletion'
          CRUDLoading={CRUDLoading}
          setModals={setModals}
          handleDelete={handleDelete}
        />
      )}

      {modals.addBugModal && (
        <AddBugModal
          projectID={project.id}
          CRUDLoading={CRUDLoading}
          setCRUDloading={setCRUDloading}
          setModals={setModals}
          setBugs={setBugs}
        />
      )}

      <ContainerP>
        <ButtonContainer>
          <MdOutlineKeyboardBackspace
            onClick={() => navigate('/')}
            style={{
              color: '#f3f3f3',
              fontSize: '2.2rem',
              marginRight: 'auto',
              cursor: 'pointer',
            }}
          />
          {project?.createdBy['email'] === currentUserEmail && (
            <>
              <StyledButton
                onClick={() =>
                  setModals((prevState) => ({
                    ...prevState,
                    addMembersModal: true,
                  }))
                }
              >
                update members
              </StyledButton>
              <StyledButton
                onClick={() => {
                  setModals((prevState) => ({
                    ...prevState,
                    deleteModal: true,
                  }));
                  deletionTargetRef.current = DeletionTarget.project;
                }}
              >
                delete project
              </StyledButton>
            </>
          )}

          {project?.createdBy['email'] !== currentUserEmail && (
            <>
              <StyledButton onClick={handleLeaveProject}>
                leave project
              </StyledButton>
            </>
          )}
        </ButtonContainer>

        {project && (
          <>
            <h2>{project.title}</h2>
            <div>
              <p>admin: {project.createdBy['email']}</p>
              <p>createdAt: {project.createdAt}</p>
            </div>
            <h3>Members</h3>

            <MembersBox>
              {' '}
              {project.members.map((member) => {
                return (
                  <UserBox key={member.id}>
                    <H4>{member.firstName}</H4>
                    <H4>{member.lastName}</H4>
                    <H4>{member.email}</H4>
                  </UserBox>
                );
              })}
            </MembersBox>
            <Div>
              <h3>Bugs</h3>
              <StyledButton onClick={handleSubmit}>add bug</StyledButton>
            </Div>
            <FlexContainer>
              {bugs.map((bug: Bug) => {
                return (
                  <BugCard
                    key={bug.id}
                    projectOwner={project.createdBy['email']}
                    bugID={bug.id}
                    currentUser={currentUserEmail}
                    title={bug.title}
                    priority={bug.priority}
                    isClosed={bug.isClosed}
                    author={bug.createdBy.email}
                    createdAt={bug.createdAt}
                    comments={bug.comments}
                    navigate={() =>
                      navigate(`/project/${project.id}/bug/${bug.id}`)
                    }
                    setSelectedBugID={setSelectedBugID}
                    setModals={setModals}
                    DelitionTarget={deletionTargetRef}
                  />
                );
              })}
            </FlexContainer>
          </>
        )}
      </ContainerP>
    </GridContainer>
  );
};

export default ProjectDetails;

const H4 = styled.h4`
  /*  width: 100%; */
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.6rem 0;
`;

const ButtonContainer = styled.div`
  margin: 0.6rem 0;
  display: flex;
  justify-content: flex-end;
  max-width: 1100px;
  /* @media screen and (max-width: 768px) {
    justify-content: space-between;
  } */
`;

const ContainerP = styled.div`
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  /*  justify-content: center; */
  min-width: 360px;
  width: 100%;
  /* min-height: 520px; */
  /* border: 2px solid #fff; */
  /*  place-content: center; */
  /*  grid-template-columns: repeat(auto-fill, minmax(350px, 1600px)); */
  gap: 1rem;
  max-width: 1100px;
`;

const MembersBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  max-height: 260px;
  overflow: auto;
  /*  min-width: 350px; */
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #fff;

  background-color: #111111;
`;

const UserBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 295px;
  /* min-width: 200px; */
  align-items: center;
  padding: 0.6rem 0.4rem;
  border-bottom: 2px solid #fff;
`;
