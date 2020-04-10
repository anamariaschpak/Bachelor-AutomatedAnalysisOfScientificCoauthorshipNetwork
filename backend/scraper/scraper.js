const cheerio = require("cheerio");
const axios = require("axios");

var htmlParser = require("node-html-parser");

const zamfiResearchGateProfileUrl =
  "https://www.researchgate.net/profile/Zamfiroiu_Alin";

// const viewAllTopCoAuthorsZamfiUrl =
//   "https://www.researchgate.net/lite.ProfileDetailsLoadMore.getCoAuthorByOffset.html?accountId=1855609&offset=50";

const authors = new Set();

const fetchData = async () => {
  //daca nu ii dai de cap, incearca cu Request, nu Axios: https://itnext.io/scraping-with-nodejs-and-cheerio-d4d34e2cf
  //                 https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping
  const result = await axios.get(
    "https://www.researchgate.net/profile/Zamfiroiu_Alin"
  );
  // const $ = cheerio.load(result.data);

  var HTMLParser = require("node-html-parser");

  var root = HTMLParser.parse(result.data);

  //console.log(root.text);

  // const test = $(
  //   ".nova-e-text nova-e-text--size-m nova-e-text--family-sans-serif nova-e-text--spacing-none nova-e-text--color-inherit nova-e-text--clamp nova-v-person-list-item__title>a"
  // );
  // console.log(test.text());
  // let token =
  //   ".nova-e-text nova-e-text--size-m nova-e-text--family-sans-serif nova-e-text--spacing-none nova-e-text--color-inherit nova-e-text--clamp nova-v-person-list-item__title>a";
  // console.log($(token, result.data).text());
};

fetchData();

// const getAuthors = async () => {
//   const $ = await cheerio.load(fetchData());

//   // console.log($("a"));
// };

var request = require("request");
request(
  "https://www.researchgate.net/lite.ProfileDetailsLoadMore.getCoAuthorByOffset.html?accountId=1855609&offset=50",
  function (error, response, html) {
    var $ = cheerio.load(html);
    // console.log(
    //   $(
    //     "#lite-page>.lite-page__below>#coauthors-modal>span>.nova-c-modal nova-c-modal--color-green nova-c-modal--position-center nova-c-modal--spacing-xxl nova-c-modal--width-s>.nova-c-modal__container>.nova-c-modal__window>.nova-c-modal__body nova-c-modal__body--spacing-inherit>.nova-c-modal__body-content>.coauthor__container>.nova-o-stack nova-o-stack--gutter-m nova-o-stack--spacing-none nova-o-stack--no-gutter-outside js-coauthors-list coauthor-modal__list>.nova-o-stack__item>.nova-v-person-list-item has-image>div>.nova-l-flex__item nova-l-flex__item--grow nova-v-person-list-item__body>.nova-v-person-list-item__stack nova-v-person-list-item__stack--gutter-s>.nova-v-person-list-item__stack-item>.nova-v-person-list-item__align>.nova-v-person-list-item__align-content>.nova-e-text nova-e-text--size-m nova-e-text--family-sans-serif nova-e-text--spacing-none nova-e-text--color-inherit nova-e-text--clamp nova-v-person-list-item__title>a.nova-e-link nova-e-link--color-inherit nova-e-link--theme-bare"
    //   ).text()
    // );
    //var span = $("#lite-page>.lite-page__below>#coauthors-modal").find("span");
    // var anchorViewAll = $(
    //   "#lite-page>.lite-page__main lite-page__main--wrap>.lite-page__side>.nova-o-stack nova-o-stack--gutter-m nova-o-stack--spacing-none nova-o-stack--no-gutter-outside>.nova-o-stack__item>.nova-c-card nova-c-card--spacing-xl nova-c-card--elevation-1-above>.nova-c-card__body nova-c-card__body--spacing-inherit>.nova-o-stack nova-o-stack--gutter-m nova-o-stack--spacing-none nova-o-stack--no-gutter-outside"
    // ).text();
    // console.log(anchorViewAll);
    // $("div").each(function (i, item) {
    //   console.log($(this).text());
    // });
    // var ul = $(
    //   "div#lite-page>main.lite-page__main lite-page__main--wrap>aside.lite-page__side>div.nova-o-stack nova-o-stack--gutter-m nova-o-stack--spacing-none nova-o-stack--no-gutter-outside"
    // )
    //   .next()
    //   .find(
    //     "div.nova-c-card nova-c-card--spacing-xl nova-c-card--elevation-1-above>div.nova-c-card__body nova-c-card__body--spacing-inherit>div.nova-o-stack nova-o-stack--gutter-m nova-o-stack--spacing-none nova-o-stack--no-gutter-outside"
    //   )
    //   .next()
    //   .find("ul").length;
    // console.log(ul);
    // var HTMLParser = require("node-html-parser");
    // var root = HTMLParser.parse(html);
    // console.log(root.text);

    var authorsList = [];

    var authorAnchors = $("div").find("a");
    authorAnchors.each(function (i, elem) {
      if ($(this).text()) {
        authorsList.push($(this).text());
        authorsList.push($(this).attr("href"));
      }
    });

    console.log(authorsList);
  }
);

// module.exports = getAuthors;
