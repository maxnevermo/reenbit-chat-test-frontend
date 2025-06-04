import styles from "./FormInput.module.css";

export default function FormInput({
  form,
  label,
  handleChange,
  name,
  ...args
}) {
  return (
    <div className={styles["form-input-wrapper"]}>
      <label>{label}</label>
      <input
        className={styles["form-input"]}
        name={name}
        value={form[`${name}`]}
        onChange={handleChange}
        {...args}
      />
    </div>
  );
}
