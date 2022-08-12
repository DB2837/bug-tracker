import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCustomFetch from '../../hooks/useCustomFetch';
import { GridContainer } from '../../styles/GridContainer';
import { StyledButton } from '../../styles/StyledButton';
import CommentBox from '../../components/CommentBox';
import { Bug, DeletionTarget, TModals, TPayload } from '../../types';
import { changeBugStatus } from '../../services/bug/changeBugStatus';
import EditBugModal from '../../components/modals/EditBugModal';
import DeleteModal from '../../components/modals/DeleteModal';
import { deleteBug } from '../../services/bug/deleteBug';
import AddCommentModal from '../../components/modals/AddCommentModal';
import { deleteComment } from '../../services/comment/deleteComment';
import EditCommentModal from '../../components/modals/EditCommentModal';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

type TProps = {
  modals: TModals;
  setModals: React.Dispatch<React.SetStateAction<TModals>>;
};

const BugDetails = ({ modals, setModals }: TProps) => {
  const _fetch = useCustomFetch();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { projectID, bugID } = useParams();
  const commentRef = useRef<any>({});
  const [CRUDLoading, setCRUDloading] = useState<boolean>(false);
  const [bug, setBug] = useState<Bug>({} as Bug);
  const [comments, setComments] = useState<any[]>([]);
  const [deletionTarget, setDelitionTarget] = useState<DeletionTarget>(
    DeletionTarget.notDefined
  );

  const payload: TPayload = useMemo(
    () => jwt_decode(auth?.accessToken as string),
    [auth?.accessToken]
  );
  const currentUserEmail = payload?.email;

  const { data, loading } = useFetchData(
    [`/api/projects/${projectID}/bugs/${bugID}`],
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

  useEffect(() => {
    if (data && data[0]) {
      setBug(() => data[0]);
      setComments(() => data[0].comments);
    }
  }, [data]);

  const handleChangeBugStatus = async (status: string) => {
    try {
      setCRUDloading(true);
      const response = await changeBugStatus(
        status,
        _fetch,
        projectID as string,
        bugID as string,
        auth?.accessToken
      );

      if (response?.status === 200) {
        const updatedBug = await response.json();
        setBug(() => updatedBug);
      }
    } catch (error) {
      throw error;
    } finally {
      setCRUDloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setCRUDloading(true);

      if (deletionTarget === DeletionTarget.bug) {
        const response = await deleteBug(
          _fetch,
          projectID as string,
          bug.id,
          auth?.accessToken
        );

        if (response?.status === 200) {
          setModals((prevState) => ({
            ...prevState,
            deleteModal: false,
          }));
          navigate(`/project/${projectID}`, { replace: true });
        }
      }

      if (deletionTarget === DeletionTarget.comment) {
        const response = await deleteComment(
          _fetch,
          projectID as string,
          commentRef.current.id,
          auth?.accessToken
        );

        if (response?.status === 200) {
          setComments(() =>
            comments.filter(
              (comment: any) => comment.id !== commentRef.current.id
            )
          );
          setModals((prevState) => ({
            ...prevState,
            deleteModal: false,
          }));
        }
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
      {modals.addCommentModal && (
        <AddCommentModal
          setModals={setModals}
          setComments={setComments}
          setCRUDloading={setCRUDloading}
          CRUDLoading={CRUDLoading}
          projectID={projectID as string}
          bugID={bugID as string}
        />
      )}
      {modals.editCommentModal && (
        <EditCommentModal
          setModals={setModals}
          setComments={setComments}
          setCRUDloading={setCRUDloading}
          CRUDLoading={CRUDLoading}
          selectedComment={commentRef.current}
          projectID={projectID as string}
        />
      )}
      {modals.editBugModal && (
        <EditBugModal
          projectID={projectID as string}
          bugID={bug.id}
          CRUDLoading={CRUDLoading}
          setCRUDloading={setCRUDloading}
          setModals={setModals}
          setBug={setBug}
          prevTitle={bug.title}
          prevPriority={bug.priority}
          prevDescription={bug.description}
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

      <FlexContainer>
        <MdOutlineKeyboardBackspace
          onClick={() => navigate(`/project/${projectID}`)}
          style={{
            color: '#f3f3f3',
            fontSize: '2.2rem',
            marginLeft: 'auto',
            cursor: 'pointer',
          }}
        />
        {bug.title && (
          <>
            <h2>{bug.title}</h2>
            <div>
              <p>author: {bug.createdBy['email']}</p>
              <p>priority: {bug.priority}</p>
              <p>status: {bug.isClosed ? 'closed' : 'open'}</p>
              <p>createdAt: {bug.createdAt}</p>
              {bug.closedBy !== null && bug.isClosed && (
                <p>closedBy: {bug.closedBy['email']}</p>
              )}
              {bug.reOpenedBy !== null && !bug.isClosed && (
                <p>re-openedBy: {bug.reOpenedBy['email']}</p>
              )}
            </div>
            <div>{bug.description}</div>
            <ButtonContainer>
              {bug.isClosed && (
                <StyledButton onClick={() => handleChangeBugStatus('open')}>
                  re-open
                </StyledButton>
              )}
              {!bug.isClosed && (
                <StyledButton onClick={() => handleChangeBugStatus('close')}>
                  close
                </StyledButton>
              )}

              {bug.createdBy['email'] === currentUserEmail && (
                <>
                  <StyledButton
                    onClick={() =>
                      setModals((prevState) => ({
                        ...prevState,
                        editBugModal: true,
                      }))
                    }
                  >
                    update info
                  </StyledButton>
                  <StyledButton
                    onClick={() => {
                      setDelitionTarget(DeletionTarget.bug);
                      setModals((prevState) => ({
                        ...prevState,
                        deleteModal: true,
                      }));
                    }}
                  >
                    delete
                  </StyledButton>
                </>
              )}
            </ButtonContainer>
          </>
        )}
      </FlexContainer>
      <FlexContainer>
        <Div>
          <h3>Comments</h3>
          <StyledButton
            onClick={() =>
              setModals((prevState) => ({
                ...prevState,
                addCommentModal: true,
              }))
            }
          >
            new comment
          </StyledButton>
        </Div>
        {bug.title &&
          comments?.map((comment: any) => {
            return (
              <CommentBox
                key={comment.id}
                comment={comment}
                currentUserEmail={currentUserEmail}
                setDelitionTarget={setDelitionTarget}
                selectedComment={commentRef}
                setModals={setModals}
              />
            );
          })}
      </FlexContainer>
    </GridContainer>
  );
};

export default BugDetails;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FlexContainer = styled.div`
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-width: 360px;
  width: 100%;
  gap: 1rem;
  max-width: 1100px;
`;

const ButtonContainer = styled.div`
  margin: 0.6rem 0;
  display: flex;
  max-width: 1100px;
`;
