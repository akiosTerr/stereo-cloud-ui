import { FC } from "react";
import { useAuthCtx } from "../Contexts";
import LoginPage from "../pages/LoginPage";


const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
  const authCtx = useAuthCtx()
  if (authCtx && authCtx.isLoggedIn) {
    return children;
  } 
  if(authCtx && !authCtx.isLoggedIn) {
    return <LoginPage login={authCtx.login} />;
  } else {
    return <></>
  }
};

const withAuth = (WrappedComponent: React.FC) => {
  const WithAuthVal = () => {
    return (
      <RequireAuth>
        <WrappedComponent />
      </RequireAuth>
    );
  };
  return WithAuthVal;
};

export default withAuth;
