import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function Wishlist({ userId }) {
  const [items, setItems] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `wishlists/${userId}/items`), (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  const claimItem = async (itemId) => {
    if (currentUser.uid !== userId) {
      const itemRef = doc(db, `wishlists/${userId}/items`, itemId);
      await updateDoc(itemRef, { claimed: true, claimedBy: currentUser.displayName });
    }
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <img src={item.image} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.price}</p>
          {currentUser.uid !== userId && !item.claimed && (
            <button onClick={() => claimItem(item.id)}>Claim</button>
          )}
          {item.claimed && currentUser.uid !== userId && (
            <p>Claimed by: {item.claimedBy}</p>
          )}
        </div>
      ))}
    </div>
  );
}
