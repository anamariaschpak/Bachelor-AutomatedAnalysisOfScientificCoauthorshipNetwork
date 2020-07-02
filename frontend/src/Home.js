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
      mass: 2.5,
      color: {
        background: "#43bfb5",
        border: "#000000",
        border_width: 5,
        highlight: {
          background: "#f2cdc3",
          border: "#000000",
        },
      },
    },
    edges: {
      color: {
        color: "#000000",
        highlight: "#ec157a",
      },
      arrowScaleFactor: -1,
      width: 5,
    },
    physics: {
      barnesHut: {
        gravitationalConstant: -6500,
        centralGravity: 2.5,
        springLength: 200,
        springConstant: 0.1,
        damping: 1,
      },
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
