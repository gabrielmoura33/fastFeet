import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const deliveryMans = await DeliveryMan.findAll({
      attributes: ['name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(deliveryMans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!schema.isValid()) {
      return res.status(401).json({ error: 'Validation Fails' });
    }

    const deliveryManExists = await DeliveryMan.findOne({
      where: { email: req.body.email, name: req.body.name },
    });

    if (deliveryManExists) {
      return res.status(401).json({ error: 'DeliveryMan Already Registred' });
    }

    const { id, name, email, avatar } = await DeliveryMan.create(req.body);

    return res.json({ id, name, email, avatar });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!schema.isValid()) {
      return res.status(401).json({ error: 'Validation Fails' });
    }

    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryMan) {
      res.status(404).json({ error: 'DeliveryMan Not Found' });
    }

    const { id, name, email } = await deliveryMan.update(req.body);

    return res.json({ id, name, email });
  }

  async destroy(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);
    if (!deliveryMan) {
      return res.status(404).json({ error: 'DeliveryMan Not Foud' });
    }
    (await deliveryMan).destroy();

    return res.status(200).json({ sucess: true });
  }
}

export default new DeliveryManController();
