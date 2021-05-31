import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
import { AuthContext } from '../context/auth';
const API = process.env.REACT_APP_API;

const Login = () => {
    //context
    const context = useContext(AuthContext)

    // 홈페이지 이동
    const history = useHistory();
    
    const [value, setValue] = useState({
        username: "",
        password: "",
    })

    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        setValue({...value, [e.target.name]:e.target.value})
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API}/users/login`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:value.username,
                password:value.password,
            })
        })
        const data = await res.json();
        if(data.hasOwnProperty('success')) {
            localStorage.setItem("userData",JSON.stringify({
                'username': value.username,
            }));
            context.login(value.username);
            history.push({pathname: "/"});
        }
        else {
            console.log(data);
            setErrors(data)
        }
    }

    return (
        <div className="register_container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>Login</h1>
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
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login
