import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
const API = process.env.REACT_APP_API;

const Register = () => {
    // 홈페이지 이동
    const history = useHistory();
    
    const [value, setValue] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        setValue({...value, [e.target.name]:e.target.value})
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API}/users`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:value.username,
                password:value.password,
                confirmPassword:value.confirmPassword
            })
        })
        const data = await res.json();
        if(data.hasOwnProperty('success')) {
            history.push({pathname: "/login"});
            history.go(0);
        }
        else {
            console.log(data);
            setErrors(data)
        }
    }

    return (
        <div className="register_container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>Register</h1>
                <Form.Input 
                    label="Username" 
                    placeholder="Username..." 
                    name="username" 
                    value={value.username}
                    error={errors.username || errors.exist}
                    onChange={onChange}
                />
                <Form.Input 
                    label="password" 
                    placeholder="password..." 
                    name="password" 
                    value={value.password}
                    error={errors.password}
                    onChange={onChange}
                    type="password"
                />
                <Form.Input 
                    label="confirmPassword" 
                    placeholder="confirmPassword..." 
                    name="confirmPassword" 
                    value={value.confirmPassword}
                    error={errors.confirmPassword} 
                    onChange={onChange}
                    type="password"
                />
                <Button type="submit" primary>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default Register
