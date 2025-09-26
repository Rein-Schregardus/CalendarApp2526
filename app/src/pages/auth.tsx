import React, { useState } from 'react';
import axios from 'axios';

import Button from '../components/Button';
import TextField from '../components/TextField';

import styles from './Auth.module.css';

const Auth = () =>
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post('127.0.0.1:7223/login', {
                email,
                password,
            });

            console.log('Login successful: ', response.data )
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className = {styles.container}>
            <div className = {styles.leftContainer}>
                <form onSubmit={handleSubmit} className = {styles.form}>
                    <div className= {styles.inputContainer}>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <TextField 
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            className = {`${styles.margin} ${styles.width}`} 
                        />
                        <TextField 
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className = {`${styles.margin} ${styles.width}`} 
                        />
                    </div>
                    <div className= {styles.buttonContainer}>
                        <Button type="submit" disabled={loading} className = {`${styles.margin} ${styles.width}`}>Log in with email & password</Button>
                        <div className = {styles.divider}><span>OR</span></div>
                        <Button className = {`${styles.margin} ${styles.width}`} primary>Log in with google</Button>
                    </div>
                </form>
            </div>
            <div className = {styles.rightContainer}>
                <div className = {styles.heroCard}>
                    <h1 className = {styles.title}>Manage appointments & events with ease</h1>
                </div>
            </div>
        </div>
    );
}


export default Auth;