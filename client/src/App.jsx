import { useEffect } from "react";
import API from "./services/api";

function App() {
  useEffect(() => {
    API.get("/leads").then(res => {
      console.log(res.data);
    });
  }, []);

  return <h1>CRM Frontend Running</h1>;
}

export default App;