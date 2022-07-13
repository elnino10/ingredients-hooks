import React, { useContext } from "react";

import Ingredients from "./components/Ingredients/Ingredients";
import { AuthContext } from "./context/auth-context";
import Auth from "./components/Auth";

const App = (props) => {
  const authCtx = useContext(AuthContext);

  let content;

  if (authCtx.isAuth) {
    content = <Ingredients />;
  } else {
    content = <Auth />;
  }

  return content;
};

export default App;
