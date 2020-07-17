import React, { useContext } from "react";
import {
  BarChart,
  CartesianGrid,
  Bar,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { GraphDataContext } from "./App";

export default function Statistics() {
  const { graph, setGraph } = useContext(GraphDataContext);

  const graphData = [];

  if (graph != null) {
    graph.nodes.forEach((node, index) => {
      const author = {
        name: node.id,
        numberOfConnections: 0,
      };

      graph.edges.forEach((edge, index) => {
        if (node.id === edge.from || node.id === edge.to) {
          author.numberOfConnections++;
        }
      });
      if (author.numberOfConnections > 2) {
        graphData.push(author);
      }
    });
  }

  const graphHeight = window.innerHeight - 100;
  const graphWidth = window.innerWidth - 50;

  return (
    <div>
      <div style={{ width: graphWidth, height: graphHeight }}>
        <ResponsiveContainer>
          <BarChart
            width={graphWidth}
            height={graphHeight}
            data={graphData}
            layout="vertical"
            margin={{ left: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="numberOfConnections" fill="#43bfb5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
