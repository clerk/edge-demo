import React, {useState} from 'react';

export default function Regular() {
    const [statusCode, setStatusCode] = useState(0)
    const [data, setData] = useState('')

    const APIEndpoint = '/api/hello'

    React.useEffect(async () => {
        const retrieveData = async () => {
            const response = await fetch(APIEndpoint, {
                method: 'GET',
            })

            setStatusCode(response.status)

            if (response.status === 200) {
                const data = await response.json()
                setData(JSON.stringify(data, null, 2))
            } else {
                const data = await response.text()
                setData(data)
            }
        }

        await retrieveData()
    }, [])

    return (
        <>
            <div style={{padding: '15px', margin: '15px'}}>
                Retrieved session from regular endpoint with status code
                status code: &nbsp;<span style={{fontWeight: 'bold', color: statusCode === 200 ? 'green' : 'red'}}> {statusCode} </span>

                <br /><br />

                claims from the verified token:
                <br />
                <pre>{data}</pre>
            </div>
        </>
    );
}
