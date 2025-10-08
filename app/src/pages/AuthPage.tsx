import React, { useState } from 'react';
import Button from '../components/Button.tsx';
import TextField from '../components/TextField.tsx';
import { fetchHelper } from "../helpers/fetchHelper.ts.ts";

import styles from './AuthPage.module.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetchHelper('/User/login', {
        method: 'POST',
        body: JSON.stringify({ username: email, password }), // match your API DTO
      });

      console.log('Login successful:', response.message);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputContainer}>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <TextField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.margin} ${styles.width}`}
              />
              <TextField
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.margin} ${styles.width}`}
              />
            </div>
            <div className={styles.buttonContainer}>
              <Button
                type="submit"
                disabled={loading}
                className={`${styles.margin} ${styles.width}`}
              >
                Log in with email & password
              </Button>
              <div className={styles.divider}><span>OR</span></div>
              <Button className={`${styles.margin} ${styles.width}`} primary>
                Log in with Google
              </Button>
            </div>
          </form>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.heroCard}>
            <h1 className={styles.title}>Manage appointments & events with ease</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
