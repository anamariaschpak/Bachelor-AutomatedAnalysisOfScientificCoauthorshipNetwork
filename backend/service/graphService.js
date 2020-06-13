const { Author, Coauthor, Authorcoauthors } = require("../models/models");

const author = {
  getGraphData: async () => {
    try {
      const graph = {
        nodes: [],
        edges: [],
      };

      const authorsAndCoauthorsData = await Author.findAll({
        include: [Coauthor],
      });

      authorsAndCoauthorsData.forEach((author) => {
        if (!graph.nodes.some((node) => node["id"] === author.name)) {
          graph.nodes.push({
            id: author.name,
            label: author.name,
          });
        }

        author.Coauthors.forEach((coauthor) => {
          if (!graph.nodes.some((node) => node["id"] === coauthor.name)) {
            graph.nodes.push({
              id: coauthor.name,
              label: coauthor.name,
            });

            graph.edges.push({
              from: author.name,
              to: coauthor.name,
            });
          }
        });
      });

      return graph;
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = author;
