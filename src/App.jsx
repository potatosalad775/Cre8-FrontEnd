import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout.jsx";
import HomePage from "./pages/Home.jsx";
import RecruitPage from "./pages/Recruit.jsx";
import JobPage from "./pages/Job.jsx";
import CommunityPage from "./pages/Community.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage, { action as registerAction } from "./pages/Register.jsx";
import TestPage from "./pages/Test.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "recruit",
        element: <RecruitPage />,
        children: [
          {}
        ]
      },
      {
        path: "job",
        element: <JobPage />,
        children: [
          {}
        ]
      },
      {
        path: "community",
        element: <CommunityPage />,
        children: [
          {}
        ]
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage />, action: registerAction },
      { path: "test", element: <TestPage /> }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
