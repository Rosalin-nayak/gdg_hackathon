import Header from "./components/Dashboard/Header";
import LeftPanel from "./components/Dashboard/LeftPanel";
import CenterPanel from "./components/Dashboard/CenterPanel";
import RightPanel from "./components/Dashboard/RightPanel";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
    </div>
  );
}

export default App;