const graphService = require("../service/graphService");

const getGraphData = async (request, response) => {
  const result = await graphService.getGraphData(request.body);

  if (result) {
    response.status(200).json(result);
  } else {
    response.status(404).json({
      message: "Graph data not found.",
    });
  }
};

module.exports = { getGraphData };
