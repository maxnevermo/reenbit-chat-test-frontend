import { ReactSVG } from "react-svg";

import EditIcon from "../../assets/icons/edit.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import NewIcon from "../../assets/icons/new.svg";
import CloseIcon from "../../assets/icons/close.svg";
import SendIcon from "../../assets/icons/send.svg";
import SearchIcon from "../../assets/icons/search.svg";
import CancelIcon from "../../assets/icons/cancel.svg";
import SentIcon from "../../assets/icons/sent.svg";

import styles from "./ActionButton.module.css";

const getIconByAction = (action) => {
  switch (action) {
    case "edit":
      return <ReactSVG style={{ fill: "#000000" }} src={EditIcon} />;
    case "delete":
      return <ReactSVG style={{ fill: "#000000" }} src={DeleteIcon} />;
    case "new":
      return <ReactSVG style={{ fill: "#000000" }} src={NewIcon} />;
    case "close":
      return <ReactSVG style={{ fill: "#000000" }} src={CloseIcon} />;
    case "send":
      return <ReactSVG style={{ fill: "#000000" }} src={SendIcon} />;
    case "search":
      return <ReactSVG style={{ fill: "#000000" }} src={SearchIcon} />;
    case "cancel":
      return <ReactSVG style={{ fill: "#000000" }} src={CancelIcon} />;
    case "sent":
      return <ReactSVG style={{ fill: "#000000" }} src={SentIcon} />;
  }
};

export default function ActionButton({ icon, actionFn }) {
  console.log(icon);

  return (
    <button
      type="button"
      className={styles["action-button"]}
      onClick={actionFn}
    >
      {getIconByAction(icon)}
    </button>
  );
}
