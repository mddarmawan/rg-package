import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Detail from './Detail';
import Login from './Login';
import List from './List';
import Form from './Form';
import { handleRouteRole } from '../helper';

const App = () => {
  handleRouteRole();

  return (
    <Router>
      <div className="bg-gray-100">
        <Switch>
          <Route path="/requests/:id" children={<Detail />} />
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/form">
            <Form />
          </Route>
          <Route path="/requests">
            <List />
          </Route>
          <Route path="/">
            <></>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
