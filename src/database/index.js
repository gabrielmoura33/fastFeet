import Sequelize from 'sequelize';
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
  }

  init() {
    this.connection = new Sequelize(datbaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
