const PageNotFound = () => {
    return (
        <div className = {'notFoundBackground'}>
            <div className = {'notFoundMessage'}>
                <p>
                    Page not found
                </p>
                <p>
                    <a href = '/'>Return Home</a>
                </p>
            </div>
        </div>
        )
}

export default PageNotFound;