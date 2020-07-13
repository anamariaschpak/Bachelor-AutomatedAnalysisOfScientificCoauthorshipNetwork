import React, { useState, useContext, useEffect } from "react";
import Graph from "react-graph-vis";
import { Input, Icon, Button, Header } from "semantic-ui-react";
import { GraphDataContext } from "./App";

export default function Home() {
  const [isGraphDataFetched, setIsGraphDataFetched] = useState(false);
  const [searchedAuthorURL, setSearchedAuthorURL] = useState();
  const { graph, setGraph } = useContext(GraphDataContext);

  useEffect(() => {
    if (graph != null) {
      setIsGraphDataFetched(true);
    }
  }, []);

  async function handleSearch(event) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ URL: searchedAuthorURL }),
    };

    fetch(
      `${process.env.REACT_APP_REST_API_URL}/getGraphData`,
      requestOptions
    ).then((response) => {
      if (response.status == 404) {
        alert("Graph data not found!");
      }
      if (response.status == 200) {
        response.json().then((graphData) => {
          setGraph(graphData);
          setIsGraphDataFetched(true);
        });
      }
    });
  }

  const options = {
    width: window.innerWidth + "px",
    height: window.innerHeight - 150 + "px",
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    nodes: {
      shape: "circle",
      margin: 1,
      mass: 8,
      borderWidth: 2,
      color: {
        background: "#43bfb5",
        border: "#000000",
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

      arrowStrikethrough: false,
      width: 3,
      selectionWidth: function (width) {
        return width * 2;
      },
      smooth: {
        type: "discrete",
        forceDirection: "none",
      },
    },
    physics: {
      timestep: 0.2,
      adaptiveTimestep: true,
      wind: {
        x: 1,
        y: 1,
      },
      barnesHut: {
        gravitationalConstant: -8000,
        centralGravity: 2,
        springLength: 150,
        springConstant: 0.2,
        damping: 1,
        avoidOverlap: 1,
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
      <div>
        <Header as="h4">
          *Note: please be patient, requests may be in action
        </Header>
        <Input
          size="huge"
          placeholder="Search for an author..."
          onChange={(event) => setSearchedAuthorURL(event.target.value)}
        ></Input>
        <Button icon size="huge" onClick={(event) => handleSearch(event)}>
          <Icon name="search" />
        </Button>
      </div>
      <div>
        {isGraphDataFetched ? (
          <Graph graph={graph} options={options} events={events} />
        ) : null}
      </div>
    </div>
  );
}
