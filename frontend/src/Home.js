import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import Login from "./Login";

import {
  Header,
  Input,
  Sidebar,
  Segment,
  Menu,
  Icon,
  Button,
  Container,
  Grid,
  Label,
} from "semantic-ui-react";
import { LoginContext } from "./App";

export default function Home() {
  const [graph, setGraph] = useState();
  const [isGraphDataFetched, setIsGraphDataFetched] = useState(false);
  const [searchedAuthorURL, setSearchedAuthorURL] = useState();
  const { setIsLoggedIn } = useContext(LoginContext);

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
    height: "720px",
    width: "1280px",
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    nodes: {
      shape: "circle",
      margin: 1,
      mass: 8,
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
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible
        width="wide"
      >
        <Menu.Item as="a">
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item as="a">
          <Icon name="chart line" />
          Statistics
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setIsLoggedIn(false);
          }}
          as="a"
        >
          <Icon name="log out" />
          Log Out
        </Menu.Item>
      </Sidebar>

      <div>
        <Input
          size="huge"
          placeholder="Search for an author..."
          onChange={(event) => setSearchedAuthorURL(event.target.value)}
        ></Input>
        <Button icon size="huge" onClick={(event) => handleSearch(event)}>
          <Icon name="search" />
        </Button>
      </div>

      {isGraphDataFetched ? (
        <Graph graph={graph} options={options} events={events} />
      ) : null}
    </div>
  );
}
