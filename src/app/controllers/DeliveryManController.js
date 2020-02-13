class DeliveryManController {
  async index(req, res) {
    return res.json({ error: false });
  }

  async store(req, res) {
    return res.json({ error: false });
  }
}

export default new DeliveryManController();
