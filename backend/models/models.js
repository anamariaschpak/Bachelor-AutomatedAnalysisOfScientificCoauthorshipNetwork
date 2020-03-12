const Sequelize = require("sequelize");

const sequelize = new Sequelize("thesisDB", "root", "p@ss", {
  dialect: "mysql"
});

const Model = Sequelize.Model;

//doesn't log anything yet
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established succesfully.");
  })
  .then(err => {
    console.log("Unable to connect to the DB: ", err);
  });

class User extends Model {}
User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true //would it be better to be a string and not autoIncrement-able?
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { sequelize, modelName: "user" }
);

sequelize.sync();

module.exports = { sequelize, User };
