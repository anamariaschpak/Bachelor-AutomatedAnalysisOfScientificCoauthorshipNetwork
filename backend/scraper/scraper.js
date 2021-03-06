const cheerio = require("cheerio");
var request = require("request");
const { Author, Coauthor, Authorcoauthors } = require("../models/models");
const async = require("async");

var visitedAuthors = [];
var currentAuthorName = "";

const getAuthorNameFromUrl = (authorUrl) => {
  return authorUrl.substring(authorUrl.lastIndexOf("/") + 1).replace(/_/g, " ");
};

const delay = (interval) => {
  return new Promise((resolve) => setTimeout(resolve, interval));
};

const getModalUrl = (authorUrl) => {
  return new Promise(async (resolve) => {
    await delay(5000);
    request(authorUrl, function (error, response, html) {
      var $ = cheerio.load(html);
      console.log("Modal HTML status code: " + response.statusCode);
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
  return new Promise(async (resolve) => {
    await delay(5000);
    request(modalUrl, function (error, response, modalHtml) {
      var $ = cheerio.load(modalHtml);
      console.log("Coauthors list status code: " + response.statusCode);
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
    var modalUrl = await getModalUrl(authorUrl);
    var lists = await getCoAuthorsListAndHrefsCoAuthorsList(modalUrl);
    var coAuthorsList = lists.coAuthorsList;
    var hrefsCoAuthorsList = lists.hrefsCoAuthorsList;
    var userLimit = 5;

    currentAuthorName = getAuthorNameFromUrl(authorUrl);
    visitedAuthors.push(currentAuthorName);

    Author.findOrCreate({
      where: {
        name: currentAuthorName.trim(),
        isParsed: true,
      },
      defaults: {
        name: currentAuthorName.trim(),
      },
    }).then(function (authorResult) {
      var author = authorResult[0];
      var createdAuthor = authorResult[1]; //DO NOT REMOVE: 1 => created, 0 => found(already exists)

      if (!createdAuthor) {
        console.log("000000000000000 Author already exists 000000000000000");

        async.eachSeries(coAuthorsList, function (coAuthorName, callback) {
          Coauthor.findOrCreate({
            where: {
              name: coAuthorName.trim(),
            },
            defaults: {
              name: coAuthorName.trim(),
            },
          }).then(async function (coauthorResult) {
            var coauthor = coauthorResult[0];
            var createdCoauthor = coauthorResult[1];

            if (!createdCoauthor) {
              console.log(
                "000000000000000 CoAuthor already exists 000000000000000"
              );
              coauthor.addAuthor(author, { through: Authorcoauthors });
            } else {
              console.log("11111111111111 CoAuthor created 11111111111111");
              console.log(coAuthorName);

              author.addCoauthor(coauthor, { through: Authorcoauthors });
              author.isParsed = true;
              await author.save();
            }

            callback();
          });
        });
      } else {
        console.log("11111111111111 Author created 11111111111111");

        async.eachSeries(coAuthorsList, function (coAuthorName, callback) {
          Coauthor.findOrCreate({
            where: {
              name: coAuthorName.trim(),
            },
            defaults: {
              name: coAuthorName.trim(),
            },
          }).then(async function (coauthorResult) {
            var coauthor = coauthorResult[0];
            var createdCoauthor = coauthorResult[1];

            if (!createdCoauthor) {
              console.log(
                "000000000000000 CoAuthor already exists 000000000000000"
              );
              coauthor.addAuthor(author, { through: Authorcoauthors });
            } else {
              console.log("11111111111111 CoAuthor created 11111111111111");
              console.log(coAuthorName);

              author.addCoauthor(coauthor, { through: Authorcoauthors });
              author.isParsed = true;
              await author.save();
            }

            callback();
          });
        });
      }
    });

    console.log(`**********${getAuthorNameFromUrl(authorUrl)}**********`);
    console.log(coAuthorsList);
    console.log(hrefsCoAuthorsList);

    for (var i = 0; i < hrefsCoAuthorsList.length; i++) {
      if (
        !visitedAuthors.includes(getAuthorNameFromUrl(hrefsCoAuthorsList[i])) &&
        visitedAuthors.length < userLimit
      ) {
        await delay(5000);
        scrape("https://www.researchgate.net/" + hrefsCoAuthorsList[i]);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//DO NOT REMOVE: SQL query:
//   select ac.authorId,a.name,ac.coauthorId,c.name from authorcoauthors as ac,coauthors as c,authors as a where ac.coauthorId=c.id and ac.authorId=a.id order by ac.authorid ;

module.exports = { scrape, getAuthorNameFromUrl };
