import { Link } from "react-router-dom"

export default function NotFoundPage()
{
    return(
        <div className="flex justify-center items-center bg-background h-screen min-h-fit">
            <div className="max-w-200 bg-primary shadow-md rounded-md h-fit">
                <p className="font-light text-4xl m-2">404 not found</p>
                <p className="m-2">The page you where looking for could not be found. If you manually enterd the URL concider checking the typing.
                    If you where following a link to a page, we are sorry but the page most likely doesn't exist anymore.</p>
                <strong className="m-2">The button below will bring you back to the login page</strong>
                <Link to="/" className="bg-accent text-primary font-bold rounded-md p-2 m-4 block pointer hover:shadow-md">Back to the login page</Link>
            </div>
        </div>
    )
}