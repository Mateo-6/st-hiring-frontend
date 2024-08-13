import { Layout } from "./layout/layout";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>See Tickets Challange</h1>
      <Layout/>
    </div>
  );
}

export default App;
