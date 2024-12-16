import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Login() {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: any)=> {
        e.preventDefault();
        await login(name, password);
        console.log(user);
        navigate('/profil');

    }

    return <>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Név:</label><input type="text" onChange={(e)=> {setName(e.target.value)}} /><br/>
            <label htmlFor="name">Jelszó:</label><input type="text" onChange={(e)=> {setPassword(e.target.value)}} /><br/>

            <input type="submit" />
        </form>

    </>
}