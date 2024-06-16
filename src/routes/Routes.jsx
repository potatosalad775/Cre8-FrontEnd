import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";

import RootLayout from "../pages/RootLayout.jsx";
import HomePage from "../pages/Home.jsx";
import RecruitPage from "../pages/Recruit.jsx";
import JobPage from "../pages/Job.jsx";
import CommunityPage from "../pages/Community.jsx";
import ProfilePage, { profileLoader } from "../pages/Profile.jsx";
import EditProfilePage, { editProfileAction } from "../pages/EditProfile.jsx";
import LoginPage from "../pages/Login.jsx";
import RegisterPage, { action as registerAction } from "../pages/Register.jsx";
import ErrorPage from "../pages/Error.jsx";
import TestPage from "../pages/Test.jsx";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    { index: true, element: <HomePage /> },
    {
      path: "recruit",
      element: <RecruitPage />,
      children: [{}],
    },
    {
      path: "job",
      element: <JobPage />,
      children: [{}],
    },
    {
      path: "community",
      element: <CommunityPage />,
      children: [{}],
    },
    {
      path: "p/:userID",
      id: 'profile-page',
      loader: profileLoader,
      children: [
        {
          index: true,
          element: <ProfilePage />,
        },
        {
          path: "edit",
          element: <EditProfilePage />,
          action: editProfileAction,
        }
      ],
    },
    { path: "register", element: <RegisterPage />, action: registerAction },
    { path: "test", element: <TestPage /> },
  ];

  // Accessible only to authenticated users
  // non-authenticated users will redirected to login page.
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrapped in ProtectedRoute
      children: [
        {
          path: "logout",
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  // Accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "login",
      element: <LoginPage />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([{
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...routesForPublic,
      ...(!token ? routesForNotAuthenticatedOnly : []),
      ...routesForAuthenticatedOnly,
    ],
  }]);

  // Final Router Configuration
  return <RouterProvider router={router} />;
};

export default Routes;
