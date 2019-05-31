import { Router } from 'express';
import Pixel from '../models/Pixel';

const routes = Router();

const RED = '#ff0000';
const GREEN = '#00ff00';
const YELLOW = '#ffff00';
const BLUE = '#0000ff';

routes.post('/', async (req, res) => {
  const { x, y } = req.body;
  if (!x || !y) {
    return res.json({});
  }

  const pixel = await Pixel.findOne({ x, y });
  return res.json(pixel);
});

routes.get('/all', async (req, res) => {
  const perPage = 100;
  const pageNo = parseInt(req.query.page) || 1;

  const pagination = {
    limit: perPage,
    skip: perPage * (pageNo - 1)
  };

  const pixels = await Pixel.find({})
    .limit(pagination.limit)
    .skip(pagination.skip)
    .exec();

  return res.json(pixels);
});

routes.post('/purchase', async (req, res, next) => {
  try {
    const { x, y, weblink, color, customColor } = req.body;
    if (!x || !y || !weblink || !color) {
      res.json({
        status: 'failed',
        message: 'One or more parameters is missing!'
      });
    }

    let resolvedColor = RED;

    if (color === 'custom') {
      resolvedColor = customColor;
    } else if (color === 'red') {
      resolvedColor = RED;
    } else if (color === 'green') {
      resolvedColor = GREEN;
    } else if (color === 'yellow') {
      resolvedColor = YELLOW;
    } else if (color === 'blue') {
      resolvedColor = BLUE;
    }

    let pixel = new Pixel({
      x,
      y,
      weblink,
      color: resolvedColor
    });

    // Reject if purchased
    const isPurchased = await Pixel.isPurchased({ x, y });
    if (isPurchased) {
      return res.status(400).json({
        status: 'failed',
        message: 'Pixel already purchased!'
      });
    }

    pixel = await pixel.save();
    return res.json(pixel);
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 'failed',
      message: 'Unexpected error occured!'
    });
  }
});

export default routes;
