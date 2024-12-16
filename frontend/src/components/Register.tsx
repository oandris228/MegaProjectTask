import { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const newUser = {
            username: name,
            password: password
        };
        try {
            const response = await fetch(`http://localhost:3000/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
                //credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
            const data = await response.json();
            console.log('User registered successfully:', data);
        } catch (error: any) {
            alert(error.message);
        }
        navigate('/login');
    };
    

    return <>
        <h1>Regisztráció</h1>

        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Név:</label><input type="text" onChange={(e)=> {setName(e.target.value)}} /><br/>
            <label htmlFor="name">Jelszó:</label><input type="text" onChange={(e)=> {setPassword(e.target.value)}} /><br/>

            <input type="submit" />
        </form>
    </>
}