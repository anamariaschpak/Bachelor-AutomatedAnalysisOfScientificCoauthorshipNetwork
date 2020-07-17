const { Author, Coauthor } = require("../models/models");
const scraper = require("../scraper/scraper");

const author = {
  getGraphData: async (body) => {
    try {
      console.log(body.URL);
      const searchedAuthorName = scraper.getAuthorNameFromUrl(body.URL);

      const author = await Author.findAll({
        where: { name: searchedAuthorName },
        include: [Coauthor],
      });

      if (author[0] === undefined) {
        await scraper.scrape(body.URL);
      } else if (author[0].Coauthors[3]) {
        const coauthorAlsoAuthor = await Author.findOne({
          where: {
            name: author[0].Coauthors[3].name,
          },
        });

        if (!coauthorAlsoAuthor) {
          await scraper.scrape(body.URL);
        }
      }

      const graph = {
        nodes: [],
        edges: [],
      };

      var visitedAuthors = [];

      const fillNetworkWithData = async (name) => {
        const searchedAuthorData = await Author.findAll({
          where: { name: name },
          include: [Coauthor],
        });

        if (searchedAuthorData.length != 0) {
          if (!visitedAuthors.includes(searchedAuthorData[0].name)) {
            visitedAuthors.push(searchedAuthorData[0].name);

            if (
              !graph.nodes.some(
                (node) => node["id"] === searchedAuthorData[0].name
              )
            ) {
              graph.nodes.push({
                id: searchedAuthorData[0].name,
                label: searchedAuthorData[0].name,
              });
            }

            for (let i = 0; i < searchedAuthorData[0].Coauthors.length; i++) {
              if (
                !graph.nodes.some(
                  (node) =>
                    node["id"] === searchedAuthorData[0].Coauthors[i].name
                )
              ) {
                graph.nodes.push({
                  id: searchedAuthorData[0].Coauthors[i].name,
                  label: searchedAuthorData[0].Coauthors[i].name,
                });
              }
              graph.edges.push({
                from: searchedAuthorData[0].name,
                to: searchedAuthorData[0].Coauthors[i].name,
              });

              await fillNetworkWithData(
                searchedAuthorData[0].Coauthors[i].name
              );
            }
          }
        }
        return graph;
      };

      return await fillNetworkWithData(searchedAuthorName);
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = author;
