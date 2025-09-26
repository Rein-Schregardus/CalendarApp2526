import styles from './TextField.module.css';

type TextInputProps = {
  error?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement> 

const TextInput = ({ error = false, className = '', ...props}: TextInputProps) => {
    return (
        <div className={`${className} ${styles.inputWrapper} ${error ? styles.error : ""}`}>
            <input {...props} className={`${styles.input}`}/>
        </div>
    )
}

export default TextInput;