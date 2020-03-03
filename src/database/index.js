import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import datbaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Recipient from '../app/models/Recipient';
import DeliveryMan from '../app/models/DeliveryMan';
import Deliverie from '../app/models/Deliverie';
import Signature from '../app/models/Signature';

const models = [User, Recipient, File, DeliveryMan, Deliverie, Signature];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(datbaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/fastfeet',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
