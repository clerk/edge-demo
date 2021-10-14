import React, {useState} from 'react';

export default function Edge() {
    const [statusCode, setStatusCode] = useState(0)
    const [data, setData] = useState('')
    const [responseTime, setResponseTime] = useState(0)

    const APIEndpoint = '/api/helloEdge'

    React.useEffect(async () => {
        const retrieveData = async () => {
            const start = new Date().getTime();

            const response = await fetch(APIEndpoint, {
                method: 'GET',
            })

            setResponseTime((new Date().getTime()) - start)
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
                Retrieved session from endpoint using edge middleware with status code:
                &nbsp;<span style={{fontWeight: 'bold', color: statusCode === 200 ? 'green' : 'red'}}> {statusCode} </span>

                <br /><br />

                Response time: {responseTime} ms

                <br /><br />

                Claims from the verified token:
                <br />
                <pre>{data}</pre>
            </div>
        </>
    );
}
