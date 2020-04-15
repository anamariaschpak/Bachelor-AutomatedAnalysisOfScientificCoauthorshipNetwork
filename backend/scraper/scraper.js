const cheerio = require("cheerio");
const axios = require("axios");
var HTMLParser = require("node-html-parser");
var request = require("request");

const zamfiProfileUrl = "https://www.researchgate.net/profile/Zamfiroiu_Alin";

const modalZamfiUrl =
  "https://www.researchgate.net/lite.ProfileDetailsLoadMore.getCoAuthorByOffset.html?accountId=1855609&offset=50";

var visitedAuthors = [];

const getAuthorFromUrl = (authorUrl) => {
  return authorUrl.substring(authorUrl.lastIndexOf("/") + 1).replace(/_/g, " ");
};

const getModalUrl = (authorUrl) => {
  return new Promise((resolve) => {
    request(authorUrl, function (error, response, html) {
      var $ = cheerio.load(html);
      //console.log(response.statusCode);
      var anchors = $("#lite-page > main").find("a");
      anchors.each(function (i, elem) {
        if (
          $(this).attr("data-lite") &&
          $(this).attr("data-lite").includes("coauthors")
        ) {
          var modalUrl = $(this)
            .attr("data-lite")
            .match(
              "(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?"
            );
          resolve(modalUrl[0]);
        }
      });
    });
  });
};

// Call: getModalUrl(zamfiProfileUrl);

//DO NOT REMOVE: modalUrl - Modal is that window that appears when you click "View All" in the Top Co-authors section
const getCoAuthorsListAndUrlsCoAuthorsList = (modalUrl) => {
  return new Promise((resolve) => {
    request(modalUrl, function (error, response, modalHtml) {
      var $ = cheerio.load(modalHtml);

      var coAuthorsList = [];
      var hrefsCoAuthorsList = [];

      var anchorsCoAuthorsList = $("div").find("a");
      anchorsCoAuthorsList.each(function (i, elem) {
        if ($(this).text()) {
          coAuthorsList.push($(this).text());
          hrefsCoAuthorsList.push($(this).attr("href"));
        }
      });

      resolve({
        coAuthorsList: coAuthorsList,
        urlsCoAuthorsList: hrefsCoAuthorsList,
      });
    });
  });
};

const scrape = async (authorUrl) => {
  try {
    visitedAuthors.push(getAuthorFromUrl(authorUrl));
    var modalUrl = await getModalUrl(authorUrl);
    var lists = await getCoAuthorsListAndUrlsCoAuthorsList(modalUrl);
    // console.log(lists);
    var coAuthorsList = lists.coAuthorsList;
    var hrefsCoAuthorsList = lists.urlsCoAuthorsList;
    var userLimit = 3;

    console.log(`**********${getAuthorFromUrl(authorUrl)}**********`);
    console.log(coAuthorsList);
    console.log(hrefsCoAuthorsList);

    for (var i = 0; i < hrefsCoAuthorsList.length; i++) {
      if (
        !visitedAuthors.includes(hrefsCoAuthorsList[i]) &&
        visitedAuthors.length <= userLimit
      ) {
        scrape("https://www.researchgate.net/" + hrefsCoAuthorsList[i]);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

scrape(zamfiProfileUrl);

// module.exports = getAuthors;
