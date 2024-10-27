import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, OAuthProvider, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import WishlistForm from '../components/WishlistForm';
import Wishlist from '../components/Wishlist';

export default function Home() {
  const [user, setUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);

  // Google sign-in
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google sign-in failed", error);
    }
  };

  // Apple sign-in
  const handleAppleLogin = async () => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Apple sign-in failed", error);
    }
  };

  // Sign out function
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Fetch family members
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (user) {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const members = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((member) => member.id !== user.uid);
        setFamilyMembers(members);
      }
    };
    fetchFamilyMembers();
  }, [user]);

  if (!user) {
    return (
      <div id="login-page">
        <h1>Welcome to the Family Christmas Wishlist!</h1>
        <button className="login-button google" onClick={handleGoogleLogin}>Sign in with Google</button>
        <button className="login-button apple" onClick={handleAppleLogin}>Sign in with Apple</button>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Welcome, {user.displayName}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {/* User's Wishlist Section */}
      <section>
        <h2>Your Wishlist</h2>
        <WishlistForm />
        <Wishlist userId={user.uid} />
      </section>

      {/* Family Members Section */}
      <section>
        <h2>Family Members' Wishlists</h2>
        {familyMembers.length > 0 ? (
          familyMembers.map((member) => (
            <div key={member.id}>
              <button onClick={() => setSelectedFamilyMember(member)}>
                View {member.displayName}'s Wishlist
              </button>
            </div>
          ))
        ) : (
          <p>No family members available</p>
        )}
      </section>

      {/* Selected Family Member Wishlist */}
      {selectedFamilyMember && (
        <section>
          <h2>{selectedFamilyMember.displayName}'s Wishlist</h2>
          <Wishlist userId={selectedFamilyMember.id} />
        </section>
      )}
    </div>
  );
}
