// Authentication modal component with Firebase
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

function AuthModal({ onClose, onLogin, onShowToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // clear error when user starts typing
    if (error) setError('');
  };

  // validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // handle form submission with Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password } = formData;

    // validation for signup
    if (!isLogin && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!isLogin && name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // email validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    // password validation
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (isLogin) {
        // Login with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
        const user = {
          email: userCredential.user.email,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0]
        };
        onLogin(user);
        onShowToast('Welcome back!');
      } else {
        // Sign up with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
        
        // Update user profile with name
        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });

        const user = {
          email: userCredential.user.email,
          name: name.trim()
        };
        onLogin(user);
        onShowToast('Account created successfully!');
      }

      onClose();
      // clear form
      setFormData({ name: '', email: '', password: '' });

    } catch (error) {
      // Handle Firebase errors
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        
        {error && (
          <div className="auth-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form auth-form-vertical">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="your name"
              value={formData.name}
              onChange={handleInputChange}
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          
          <div className="auth-actions">
            <button type="submit">
              {isLogin ? 'login' : 'create account'}
            </button>
            <button 
              type="button" 
              className="link-btn" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'create account' : 'back to login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
