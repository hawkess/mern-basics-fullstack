import Home from "./core/Home";

import React from "react";
import { Route, Switch } from "react-router-dom";

const MainRouter = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
};

export default MainRouter;
