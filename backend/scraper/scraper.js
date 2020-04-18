const cheerio = require("cheerio");
const axios = require("axios");
var HTMLParser = require("node-html-parser");
var request = require("request");
const Sequelize = require("sequelize");
const { Author, CoAuthor } = require("../models/models");
const async = require("async");

const sequelize = new Sequelize("thesisDB", "root", "p@ss", {
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established succesfully.");
  })
  .then((err) => {
    console.log("Unable to connect to the DB: ", err);
  });

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
      console.log(response.statusCode);
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
        hrefsCoAuthorsList: hrefsCoAuthorsList,
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
    var hrefsCoAuthorsList = lists.hrefsCoAuthorsList;
    var userLimit = 1;

    //aici faci inserarea in baza de date, pt ca aici se obtine lista de co-autori:
    //   https://stackoverflow.com/questions/31815076/node-sequelize-how-to-check-if-item-exists-before-adding-async-confusion

    async.eachSeries(visitedAuthors, function (authorName, callback) {
      Author.sync().then(function () {
        Author.findOrCreate({
          where: {
            name: authorName.trim(),
          },
          defaults: {
            name: authorName.trim(),
          },
        }).then(function (result) {
          var author = result[0];
          var createdAuthor = result[1]; // 1 => created, 0 => found(already exists)

          if (!createdAuthor) {
            console.log(
              "XXXXXXXXXXXXXXXXXX Author already exists XXXXXXXXXXXXXXXXXX"
            );
          } else {
            console.log("************Author created************");
          }

          callback();
        });
      });
    });

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

module.exports = scrape;
