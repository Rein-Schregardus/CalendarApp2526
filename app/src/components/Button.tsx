import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  children: React.ReactNode;
}

const Button = ({ primary = false, children, className = '', ...props }: ButtonProps) => {
    return (
        <div className={`${styles.buttonWrapper} ${primary ? styles.primary : ''} ${className}`}>
            <button className={`${styles.buttonInner}`} {...props}>
                {children}
            </button>
        </div>
    );
}

export default Button;