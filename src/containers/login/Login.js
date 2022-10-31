import { Button } from 'antd';
import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom';
import styles from './Login.module.css';

const LOGIN_URL = 'http://localhost:8000/admin/login'

export const Login = () => {
	const history = useHistory();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const loginInputHandler = (e) => {
		setUsername(e.target.value)
	}
	const passInputHandler = (e) => {
		setPassword(e.target.value)
	}

  const submitHandler = async (e) => {
	e.preventDefault();
	const user = {
		username,
		password
	}
	
	fetch(LOGIN_URL, {
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	  }).then(async (res) => {
		const data = await res.json()
		if (res.status === 200) {
			sessionStorage.setItem("token", data.token);
			history.push('/admin/dashboard')

		} else {
			setErrorMessage(data.message)
		}

	  });
	
	// 
  };

  return (
    <div className={styles.loginCard}>
		<h1>Login</h1>
		<div className={styles.login_h2_flash}>
		
			<span className={styles.flash}>
			{errorMessage}
			</span>
		</div>
		<form action={LOGIN_URL} method="post" onSubmit={submitHandler}>
			<div className={styles.form}>
			  	<div className={`${styles.formElements}, ${styles.label}`}>
					<label for="Username">Username</label>
				</div>
				
				<div className={styles.formElements}>
					<input onChange={loginInputHandler} value={username} type="text" name="username" placeholder="Username" required/>
				</div>
				<div className={`${styles.formElements}, ${styles.label}`}>
					<label for="password">Password</label>
				</div>
				<div className={styles.formElements}>
					<input onChange={passInputHandler} type="password" name="password" value={password} placeholder="Password" required/>
				</div>

				<div className={styles.formElements}>
					<input type="submit" className={styles.login} value="Login"/>
				</div>
			</div>
		</form>
	</div>
  )
}
