// App.js
import { Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';

function App() {
  return (
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            return <PrivateRoute key={index} path={route.path} element={<Page />} />;
          })}
        </Routes>
      </div>
  );
}

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return element;
  } else {
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    return <Navigate to="/login" />;
  }
};

export default App;
