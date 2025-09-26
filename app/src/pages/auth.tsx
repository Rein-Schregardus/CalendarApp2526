import Button from '../components/Button';
import WeatherForecast from '../components/WeatherForecast';


function Auth()
{
    const handleClick = () => {
        console.log("Button clicked!")
    }

    return (
        <>
            <Button className='' onClick={handleClick}>Log in with email and password</Button>
            <WeatherForecast />
        </>
    );
}


export default Auth;