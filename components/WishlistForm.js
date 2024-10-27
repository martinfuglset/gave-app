import { useState } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function WishlistForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleAddItem = async () => {
    const user = auth.currentUser;
    await addDoc(collection(db, `wishlists/${user.uid}/items`), {
      title,
      url,
      price,
      image,
      claimed: false,
    });
    setUrl(''); setTitle(''); setPrice(''); setImage('');
  };

  return (
    <div>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Item URL" />
      {/* Code to extract OpenGraph data from URL goes here */}
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <button onClick={handleAddItem}>Add to Wishlist</button>
    </div>
  );
}
