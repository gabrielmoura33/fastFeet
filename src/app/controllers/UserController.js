import * as Yup from 'yup';
import Users from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Fail' });
    }

    const userExists = await Users.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User Already Exists' });
    }

    const { id, name, email, password, administrator } = await Users.create(
      req.body
    );

    return res.json({ id, name, email, password, administrator });
  }
}
export default new UserController();
