import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";

import RootLayout from "../pages/RootLayout.jsx";
import HomePage from "../pages/Home/Home.jsx";
import RecruitPostPage, { recruitPostLoader } from "../pages/Recruit/RecruitPost.jsx";
import RecruitEditPage from "../pages/Recruit/RecruitEdit.jsx";
import JobRecruitListPage from "../pages/Job/JobRecruitList.jsx";
import JobPostPage, { jobPostLoader } from "../pages/Job/JobPost.jsx";
import JobEditPage from "../pages/Job/JobEdit.jsx";
import BookmarkPage from "../pages/Bookmark/Bookmark.jsx";
import MyPostPage from "../pages/MyPost/MyPost.jsx";
import CommunityPage, { communityLoader } from "../pages/Community/Community.jsx";
import CommunityEditPage, { communityEditLoader } from "../pages/Community/CommunityEdit.jsx";
import CommunityPostPage, { communityPostLoader } from "../pages/Community/CommunityPost.jsx";
import ChatPage, { chatListLoader } from "../pages/Chat/Chat.jsx";
import LoginPage from "../pages/UserAuth/Login.jsx";
import RegisterPage, { action as registerAction } from "../pages/UserAuth/Register.jsx";
import RecoverPasswordPage from "../pages/UserAuth/RecoverPassword.jsx";
import ProfilePage, { profileLoader } from "../pages/Profile/Profile.jsx";
import ProfileEditPage from "../pages/Profile/ProfileEdit.jsx";
import PortfolioPage, { portfolioLoader } from "../pages/Portfolio/Portfolio.jsx";
import PortfolioEditPage from "../pages/Portfolio/PortfolioEdit.jsx";
import ErrorPage from "../pages/Error.jsx";
import TestPage from "../pages/Test.jsx";
import { tagLoader } from "../components/Tag/TagLoader.jsx";

const Routes = () => {
  const { isLoggedIn, reissueToken } = useAuth();

  // Refresh Token on initial open
  useEffect(() => {
    reissueToken();
  }, [])

  // Define public routes accessible to all users
  const routesForPublic = [
    { index: true, element: <HomePage /> },
    {
      path: "recruit",
      id: "recruit-page",
      loader: tagLoader,
      children: [
        {
          index: true,
          element: <JobRecruitListPage pageType="recruit"/>,
        },
        {
          path: ":recruitPostID",
          id: "recruitPost-page",
          loader: recruitPostLoader,
          element: <RecruitPostPage />,
        },
      ],
    },
    {
      path: "job",
      id: "job-page",
      loader: tagLoader,
      children: [
        {
          index: true,
          element: <JobRecruitListPage pageType="job"/>,
        },
        {
          path: ":jobPostID",
          id: "jobPost-page",
          loader: jobPostLoader,
          element: <JobPostPage />,
        },
        {
          path: ":jobPostID/:portfolioID",
          id: "portfolio-in-jobPost",
          loader: portfolioLoader,
          element: <PortfolioPage isFromJobPost={true} />,
        },
      ],
    },
    {
      path: "c",
      id: "community-page",
      loader: communityLoader,
      children: [
        {
          index: true,
          element: <CommunityPage />,
        },
        {
          path: ":communityPostID",
          id: "communityPost-page",
          loader: communityPostLoader,
          element: <CommunityPostPage />,
        },
      ],
    },
    {
      path: "p/:userID",
      id: "profile-page",
      loader: profileLoader,
      children: [
        {
          index: true,
          element: <ProfilePage />,
        },
        {
          path: ":portfolioID",
          id: "portfolio-page",
          loader: portfolioLoader,
          element: <PortfolioPage />,
        },
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
        {
          path: "p/:userID",
          id: "profile-page-edit",
          loader: profileLoader,
          children: [
            {
              path: "edit",
              element: <ProfileEditPage />,
            },
            {
              path: "edit/:portfolioID",
              id: "portfolio-page-edit",
              loader: portfolioLoader,
              element: <PortfolioEditPage />,
            },
          ],
        },
        {
          path: "recruit/edit",
          children: [
            {
              index: true,
              element: <RecruitEditPage />,
            },
            {
              path: ":recruitPostID",
              id: "recruit-page-edit",
              loader: recruitPostLoader,
              element: <RecruitEditPage />,
            }
          ]
        },
        {
          path: "job/edit",
          children: [
            {
              index: true,
              element: <JobEditPage />,
            },
            {
              path: ":jobPostID",
              id: "job-page-edit",
              loader: jobPostLoader,
              element: <JobEditPage />,
            }
          ]
        },
        {
          path: "c/edit",
          children: [
            {
              index: true,
              element: <CommunityEditPage />,
            },
            {
              path: ":communityPostID",
              id: "community-page-edit",
              loader: communityEditLoader,
              element: <CommunityEditPage />,
            },
          ]
        },
        {
          path: "bookmark",
          element: <BookmarkPage />
        },
        {
          path: "my-post",
          element: <MyPostPage />
        },
        {
          path: "chat",
          children: [
            {
              index: true,
              id: "chat-page",
              loader: chatListLoader,
              element: <ChatPage />,
            }
          ]
        },
      ],
    },
  ];

  // Accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    { path: "login", element: <LoginPage /> },
    { path: "recoverPassword", element: <RecoverPasswordPage /> },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        ...routesForPublic,
        ...(!isLoggedIn ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
      ],
    },
  ]);

  // Final Router Configuration
  return <RouterProvider router={router} />;
};

export default Routes;
