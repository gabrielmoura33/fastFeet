import Sequelize from 'sequelize';
import datbaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Recipient from '../app/models/Recipient';

const models = [User, Recipient, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(datbaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
