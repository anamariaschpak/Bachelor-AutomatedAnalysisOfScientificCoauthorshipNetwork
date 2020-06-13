import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

import { Header } from "semantic-ui-react";

export default function Home() {
  const [graph, setGraph] = useState();
  const [isGraphDataFetched, setIsGraphDataFetched] = useState(false);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("http://localhost:3001/api/getGraphData", requestOptions)
      .then((response) => response.json())
      .then((graphData) => {
        setGraph(graphData);
        setIsGraphDataFetched(true);
      });
  }, []);

  const options = {
    height: "720px",
    width: "1280px",
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    nodes: {
      shape: "circle",
      margin: 1,
    },
    edges: {
      color: "#000000",
    },
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };

  return (
    <div>
      <Header>Hello!</Header>
      {isGraphDataFetched ? (
        <Graph graph={graph} options={options} events={events} />
      ) : null}
    </div>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Home />, rootElement);
