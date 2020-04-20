const cheerio = require("cheerio");
const axios = require("axios");
var HTMLParser = require("node-html-parser");
var request = require("request");
const sequelize = require("sequelize");
const { Author, Coauthor, Authorcoauthors } = require("../models/models");
const async = require("async");

const zamfiProfileUrl = "https://www.researchgate.net/profile/Zamfiroiu_Alin";
const modalZamfiUrl =
  "https://www.researchgate.net/lite.ProfileDetailsLoadMore.getCoAuthorByOffset.html?accountId=1855609&offset=50";
var visitedAuthors = [];
var currentAuthor = "";
var currentCoAuthor = "";

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

//DO NOT REMOVE: modalUrl - "Modal" is that window that appears when you click "View All" in the Top Co-authors section
const getCoAuthorsListAndHrefsCoAuthorsList = (modalUrl) => {
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

// const findCoAuthorsByAuthorId = () => {
//   CoAuthor.findAll({
//     where: {
//       otherKey: 1,
//     },
//   }).then((coAuthors) => {
//     coAuthors.forEach((item) => console.log(item.name));
//   });
// };

const scrape = async (authorUrl) => {
  try {
    visitedAuthors.push(getAuthorFromUrl(authorUrl));
    var modalUrl = await getModalUrl(authorUrl);
    var lists = await getCoAuthorsListAndHrefsCoAuthorsList(modalUrl);
    // console.log(lists);
    var coAuthorsList = lists.coAuthorsList;
    var hrefsCoAuthorsList = lists.hrefsCoAuthorsList;
    var userLimit = 1;

    currentAuthor = getAuthorFromUrl(authorUrl);

    //aici faci inserarea in baza de date, pt ca aici se obtine lista de co-autori:
    //   https://stackoverflow.com/questions/31815076/node-sequelize-how-to-check-if-item-exists-before-adding-async-confusion

    async.eachSeries(visitedAuthors, function (authorName, callback) {
      const newAuthor = Author.findOrCreate({
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
          console.log("000000000000000 Author already exists 000000000000000");
        } else {
          console.log("11111111111111 Author created 11111111111111");

          async.eachSeries(coAuthorsList, function (coAuthorName, callback) {
            const newCoAuthor = Coauthor.findOrCreate({
              where: {
                name: coAuthorName.trim(),
              },
              defaults: {
                name: coAuthorName.trim(),
              },
            }).then(function (result) {
              var coAuthor = result[0];
              var createdCoAuthor = result[1];

              if (!createdCoAuthor) {
                console.log(
                  "000000000000000 CoAuthor already exists 000000000000000"
                );
              } else {
                console.log("11111111111111 CoAuthor created 11111111111111");
                newAuthor.addcoauthor(newCoAuthor, {
                  through: "Authorcoauthors",
                });
              }

              callback();
            });
          });
        }

        callback();
      });
    });

    //https://github.com/sequelize/sequelize/issues/5325
    //https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
    //https://sequelize.readthedocs.io/en/v3/docs/associations/
    //https://github.com/sequelize/sequelize/issues/5036

    console.log(`**********${getAuthorFromUrl(authorUrl)}**********`);
    console.log(coAuthorsList);
    console.log(hrefsCoAuthorsList);

    for (var i = 0; i < hrefsCoAuthorsList.length; i++) {
      if (
        !visitedAuthors.includes(getAuthorFromUrl(hrefsCoAuthorsList[i])) &&
        visitedAuthors.length <= userLimit
      ) {
        currentCoAuthor = getAuthorFromUrl(hrefsCoAuthorsList[i]);
        scrape("https://www.researchgate.net/" + hrefsCoAuthorsList[i]);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

scrape(zamfiProfileUrl);

module.exports = scrape;
