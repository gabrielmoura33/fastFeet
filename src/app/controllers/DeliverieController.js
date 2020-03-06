import * as Yup from 'yup';
import {
  setSeconds,
  setMinutes,
  setHours,
  format,
  isBefore,
  isAfter,
  parseISO,
} from 'date-fns';
// import { Op } from 'sequelize';
import Deliverie from '../models/Deliverie';
import DeliveryMan from '../models/DeliveryMan';
import Signature from '../models/Signature';
import Withdraws from '../schemas/Withdraw';
import Mail from '../../lib/Mail';

class DeliverieController {
  async show(req, res) {
    const deliverie = await Deliverie.findAll({
      where: {
        deliveryman_id: req.params.deliveryman_id,
        end_date: null,
        canceled_at: null,
      },
    });

    if (!deliverie) {
      res
        .status(404)
        .json({ error: 'No Deliveries found for that DeliveryMan' });
    }

    return res.json(deliverie);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Fail' });
    }
    req.body.deliveryman_id = req.params.deliveryman_id;
    const deliverie = await Deliverie.create(req.body);

    const deliveryman = await DeliveryMan.findOne({
      where: { id: req.params.deliveryman_id },
    });

    if (deliveryman.email) {
      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Nova Encomenda Disponivel',
        template: 'newRecipient',
        context: {
          deliveryman: deliveryman.name,
          product: deliverie.product,
          recipientName: deliveryman.name,
        },
      });
    }

    return res.json(deliverie);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Fail' });
    }

    const deliveryManValid = await DeliveryMan.findOne({
      where: { id: req.params.deliveryman_id },
    });

    if (!deliveryManValid) {
      return res.status(404).json({ error: 'DeliveryMan Not Found' });
    }

    const delivery = await Deliverie.findOne({
      where: { id: req.body.id, deliveryman_id: req.params.deliveryman_id },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not Found' });
    }

    if (req.body.signature_id) {
      const signature = await Signature.findOne({
        where: { id: req.body.signature_id },
      });

      if (!signature) {
        return res.status(404).json({ error: 'Signature not Found' });
      }
    }

    if (isBefore(parseISO(req.body.end_date), delivery.start_date)) {
      return res
        .status(400)
        .json({ error: 'End Date of a Delivery should be after Start Date' });
    }

    if (req.body.start_date) {
      const schedule = ['08:00', '18:00'];

      const availableHours = schedule.map(time => {
        const [hour, minutes] = time.split(':');
        const value = setSeconds(
          setMinutes(setHours(parseISO(req.body.start_date), hour), minutes),
          0
        );
        return {
          value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        };
      });

      if (
        isBefore(
          parseISO(req.body.start_date),
          parseISO(availableHours[0].value)
        ) ||
        isAfter(
          parseISO(req.body.start_date),
          parseISO(availableHours[1].value)
        )
      ) {
        return res.status(400).json({
          error: 'Deliveries inicial date should be between 08h and 18h!',
        });
      }

      const count = await Withdraws.find({
        deliveryMan: req.params.deliveryman_id,
        date: req.body.start_date,
      });

      if (count.length > 5) {
        return res
          .status(401)
          .json({ error: 'Only 5 Withdraws per Deliveryman allowed Each Day' });
      }

      /**
       * Add Withdraw count
       */
      await Withdraws.create({
        deliveryMan: req.params.deliveryman_id,
        date: req.body.start_date,
      });
    }

    const del = await delivery.update({
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      signature_id: req.body.signature_id,
    });
    return res.json(del);
  }

  async destroy(req, res) {
    const delivery = await Deliverie.findOne({
      where: { id: req.body.id },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery Not Found' });
    }

    delivery.update({ canceled_at: new Date() });
    return res.json(delivery);
  }
}
export default new DeliverieController();
