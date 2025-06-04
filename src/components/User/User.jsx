import { useNavigate } from "react-router";
import styles from "./User.module.css";

const USER = {
  name: "Max Nevermo",
  avatar: "https://randomuser.me/api/portraits/men/64.jpg",
};

export default function User({ user }) {
  const { firstName, lastName, avatar } = user;
  const name = firstName + " " + lastName;

  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={styles["user-info"]}>
      <div>
        <img className={styles["user-avatar"]} src={avatar} alt="User avatar" />
        <p>{name}</p>
      </div>
      <button
        onClick={handleLogOut}
        className={styles["user-action"]}
        type="button"
      >
        Log Out
      </button>
    </div>
  );
}
