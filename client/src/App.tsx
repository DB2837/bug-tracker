import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
/* import NotFound from './pages/notFound/NotFound'; */
import SharedLayout from './components/SharedLayout';
import BugDetails from './pages/bug/BugDetails';
import PersistLogin from './components/PersistLogin';
import { lazy, Suspense, useState } from 'react';
import { TModals } from './types';
import ProjectDetails from './pages/project/ProjectDetails';
/* import Login from './pages/login/Login';
import Register from './pages/register/Register'; */
import Home from './pages/home/Home';
import Loader from './components/Loader';

function App() {
  const [modals, setModals] = useState<TModals>(() => ({
    deleteModal: false,
    editTitleModal: false,
    addMembersModal: false,
    addProjectModal: false,
    addBugModal: false,
    editBugModal: false,
    addCommentModal: false,
    editCommentModal: false,
    leaveProjectModal: false,
  }));

  const Login = lazy(() => import('./pages/login/Login'));
  const Register = lazy(() => import('./pages/register/Register'));
  /* const Home = lazy(() => import('./pages/home/Home')); */
  /*  const ProjectDetails = lazy(() => import('./pages/project/ProjectDetails')); */
  /*  const BugDetails = lazy(() => import('./pages/bug/BugDetails')); */
  const NotFound = lazy(() => import('./pages/notFound/NotFound'));

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<SharedLayout />}>
              <Route
                index
                element={<Home modals={modals} setModals={setModals} />}
              />
              <Route
                path='/project/:projectID'
                element={
                  <ProjectDetails modals={modals} setModals={setModals} />
                }
              />

              <Route
                path='/project/:projectID/bug/:bugID'
                element={<BugDetails modals={modals} setModals={setModals} />}
              />
            </Route>
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
