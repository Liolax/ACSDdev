import Wishlist from '../models/WishlistModel.js';

export async function getWishlist(req, res) {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
      await wishlist.save();
    }
    res.status(200).json(wishlist.items);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to retrieve wishlist items' });
  }
}

export async function addWishlistItem(req, res) {
  try {
    const userId = req.user._id;
    const { productId, name, price, image } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }
    const exists = wishlist.items.find(item => item.productId.toString() === productId);
    if (exists) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }
    wishlist.items.push({ productId, name, price, image });
    await wishlist.save();
    res.status(200).json(wishlist.items);
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
}

export async function removeWishlistItem(req, res) {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== id);
    await wishlist.save();
    res.status(200).json(wishlist.items);
  } catch (error) {
    console.error('Error removing wishlist item:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
}
