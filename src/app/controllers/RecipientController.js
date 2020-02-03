import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Failed' });
    }

    const {
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    } = await Recipient.create(req.body);

    return res.json({ name, rua, numero, estado, cidade, cep, complemento });
  }
}

export default new RecipientController();
