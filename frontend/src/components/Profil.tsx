import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function Profil() {
  const { user, validate } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      try {
        await validate();
        if (!user?.username) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Validation error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, [user, validate, navigate]);

  if (loading) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container">
      {user?.username ? (
        <>
          <h1>Név: {user.username}</h1>
          <p>Jelszó: {user.password}</p>
        </>
      ) : (
        <h1>Unauthorized</h1>
      )}
    </div>
  );
}