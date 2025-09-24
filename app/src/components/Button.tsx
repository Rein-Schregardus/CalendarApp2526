import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  children: React.ReactNode;
}

function Button({ primary = false, children, className = '', ...props }: ButtonProps) {
    return (
        <div className={`${styles.buttonWrapper} ${primary ? styles.primary : ''}`}>
            <button className={`${styles.buttonInner} ${className}`} {...props}>
                {children}
            </button>
        </div>
    );
}

export default Button;