import Button from '../components/Button';



function Auth()
{
    const handleClick = () => {
        console.log("Button clicked!")
    }

    return (
        <Button className='' onClick={handleClick}>Log in with email and password</Button>
    );
}


export default Auth;