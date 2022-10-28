import React from 'react'
import styles from './Login.module.css';

export const Login = () => {
  return (
    <div className={styles.loginCard}>
		<h1>Login</h1>
		<div className={styles.login_h2_flash}>
			<span className={styles.flash}>
			message
			</span>
		</div>
		<form action="http://localhost:8000/admin/login" method="post">
			<div className={styles.form}>
			  	<div className={`${styles.formElements}, ${styles.label}`}>
					<label for="Username">Username</label>
				</div>
				
				<div className={styles.formElements}>
					<input type="text" name="username" placeholder="Username" required/>
				</div>
				<div className={`${styles.formElements}, ${styles.label}`}>
					<label for="password">Password</label>
				</div>
				<div className={styles.formElements}>
					<input type="password" name="password" placeholder="Password" required/>
				</div>

				<div className={styles.formElements}>
					<input className={styles.login} type="submit" value="Login"/>
				</div>
			</div>
		</form>
	</div>
  )
}
