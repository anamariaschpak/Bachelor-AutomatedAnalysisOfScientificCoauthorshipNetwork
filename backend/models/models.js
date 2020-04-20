const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("thesisDB", "root", "p@ss", {
  dialect: "mysql",
});

const Model = Sequelize.Model;

//doesn't log anything yet
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established succesfully.");
  })
  .then((err) => {
    console.log("Unable to connect to the DB: ", err);
  });

class User extends Model {}
User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, //would it be better to be a string and not autoIncrement-able?
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "user" }
);

const Author = sequelize.define("Author", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  isParsed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

const Coauthor = sequelize.define("Coauthor", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Authorcoauthors = sequelize.define("Authorcoauthors", {
  authorId: {
    type: Sequelize.STRING,
    references: {
      model: Author,
      key: "id",
    },
  },
  coAuthorId: {
    type: Sequelize.STRING,
    references: {
      model: Coauthor,
      key: "id",
    },
  },
});

// const AuthorCoauthors = sequelize.define(
//   "AuthorCoauthors",
//   { selfGranted: DataTypes.BOOLEAN },
//   { timestamps: false }
// );

Author.belongsToMany(Coauthor, {
  through: Authorcoauthors,
  foreignKey: "coAuthorId",
  as: "coauthor",
});
Coauthor.belongsToMany(Author, {
  through: Authorcoauthors,
  foreignKey: "authorId",
  as: "author",
});

sequelize.sync({ force: true });

module.exports = {
  sequelize,
  User,
  Author,
  Coauthor,
  Authorcoauthors,
};
