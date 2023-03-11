import { useState } from "react";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  return (
    <div className="App">
      <Auth />
    </div>
  );
}

export default App;
