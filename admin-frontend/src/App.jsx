import { BrowserRouter, Routes, Route } from "react-router";

import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PostsPage from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import CommentsPage from "./pages/CommentsPage";


import "./App.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <PostsPage />
                </AdminLayout>
              </ProtectedRoute>
          }       
        />


          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CreatePostPage />
                </AdminLayout>
              </ProtectedRoute>
          }
        />


          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <EditPostPage />
                </AdminLayout>
              </ProtectedRoute>
          }
        />



          <Route
            path="/comments"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CommentsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
