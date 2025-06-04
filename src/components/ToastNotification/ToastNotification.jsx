export default function ToastNotification({ message, closeToast }) {
  return (
    <li>
      <button type="button" onClick={closeToast}>
        <img src={message.sender.avatar} alt="Sender photo" />
        <p>{`${message.sender.firstName} ${message.sender.lastName}`}</p>
        <p>{message.text}</p>
      </button>
    </li>
  );
}
