import { Restaurant, Product, RestaurantCategory, ProductCategory } from '../models/models.js'

const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Complete the following functions

const create = async function (req, res) {
  try {
    const newRestaurant = Restaurant.build(req.body)
    newRestaurant.userId = 1
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [{
        model: Product,
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      }],
      order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
    }
    )
    res.json(restaurant)
  } catch (error) {
    res.status(500).send(error)
  }
}

const update = async function (req, res) {
  try {
    const restaurant = Restaurant.findByPk(req.params.restaurantId)
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    const updatedRestaurant = req.body
    updatedRestaurant.userId = 1
    await restaurant.update(updatedRestaurant)
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    await restaurant.destroy()
    res.json({ message: 'Restaurant deleted' })
  } catch (err) {
    res.status(500).send(err)
  }
}

/* const destroy = async function (req, res) {
  try {
    const numDestroyed = await Restaurant.destroy({
      where: { id: req.params.restaurantId }
    });
    if (numDestroyed) {
      res.json({ message: 'Restaurant deleted' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
} */

const RestaurantController = {
  index,
  create,
  show,
  update,
  destroy
}
export default RestaurantController
