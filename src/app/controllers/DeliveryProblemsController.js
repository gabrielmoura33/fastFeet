import * as Yup from 'yup';
// import {
//   setSeconds,
//   setMinutes,
//   setHours,
//   format,
//   isBefore,
//   isAfter,
//   parseISO,
// } from 'date-fns';
// import { Op } from 'sequelize';
import Deliverie from '../models/Deliverie';
import DeliveryMan from '../models/DeliveryMan';
import DeliveryProblems from '../models/DeliveryProblems';
// import Withdraws from '../schemas/Withdraw';
// import Mail from '../../lib/Mail';

class DeliveryProblemsController {
  async show(req, res) {
    const deliveryExist = await Deliverie.findOne({
      where: { id: req.params.delivery_id },
    });

    if (!deliveryExist) {
      return res.status(404).json({ error: 'Delivery Not Found' });
    }
    const deliveryProblems = await DeliveryProblems.findAll({
      where: { delivery_id: req.params.delivery_id },
    });

    if (deliveryProblems.length === 0) {
      return res.status(404).json({
        error: `The delivery ${deliveryExist.product} Has No Problems`,
      });
    }

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const deliverymanExist = await DeliveryMan.findOne({
      where: { id: req.params.deliveryman_id },
    });

    if (!deliverymanExist) {
      return res.status(404).json({ error: 'Deliveryman Not Found' });
    }

    const delivery = await Deliverie.findOne({
      where: {
        id: req.body.delivery_id,
        deliveryman_id: req.params.deliveryman_id,
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const deliveryError = await DeliveryProblems.create(req.body);

    return res.json(deliveryError);
  }

  async update(req, res) {
    return res.json({ eror: null });
  }

  async destroy(req, res) {
    const problemExist = await DeliveryProblems.findOne({
      where: { id: req.params.problem_id },
    });

    if (!problemExist) {
      return res.status(404).json({ error: 'Problem Not Found' });
    }

    const deliveryToCancel = await Deliverie.findOne({
      where: { id: problemExist.delivery_id, canceled_at: null },
    });

    if (!deliveryToCancel) {
      return res
        .status(401)
        .json({ error: 'The Delivery Is already Canceled' });
    }
    await deliveryToCancel.update({ canceled_at: new Date() });

    const { id, product, canceled_at } = deliveryToCancel;
    const { description } = problemExist;
    return res.json({ id, product, canceled_at, description });
  }
}
export default new DeliveryProblemsController();
