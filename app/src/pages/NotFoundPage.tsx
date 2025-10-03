import { Link } from "react-router-dom"

export default function NotFoundPage()
{
    return(
        <div>
            <h1>404 not found</h1>
            <p>The page you where looking for could not be found. If you manually enterd the URL concider checking the typing.
                If you where following a link to a page, we are sorry but the page most likely doesn't exist anymore.</p>
            <strong>The button below will bring you back to the login page</strong>
            <Link to="/">Back to the login page</Link>
        </div>
    )
}