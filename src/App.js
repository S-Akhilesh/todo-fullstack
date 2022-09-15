import { BrowserRouter, Route, Switch } from "react-router-dom";
import Category from "./Category";
import { Registration } from "./Registration";
import Todos from "./Todos";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/todos" render={() => <Todos />} />
        <Route exact path="/category" render={() => <Category />} />
        <Route path="/" render={() => <Registration />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
