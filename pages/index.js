import React, { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs";

export default function Home() {
    const [statusCode, setStatusCode] = useState(0)
    const [statusCodeEdge, setStatusCodeEdge] = useState(0)
    const [data, setData] = useState({})
    const [dataEdge, setDataEdge] = useState({})
    const [responseTime, setResponseTime] = useState(0)
    const [responseTimeEdge, setResponseTimeEdge] = useState(0)

    useEffect(async () => {
        const retrieveData = async () => {
            const start = new Date().getTime();

            const response = await fetch('/api/hello', {
                method: 'GET',
            })

            setResponseTime((new Date().getTime()) - start)
            setStatusCode(response.status)

            if (response.status === 200) {
                const data = await response.json()
                setData(data)
            }
        }

        await retrieveData()
    }, [])

    useEffect(async () => {
        const retrieveData = async () => {
            const start = new Date().getTime();

            const response = await fetch('/api/helloEdge', {
                method: 'GET',
            })

            setResponseTimeEdge((new Date().getTime()) - start)
            setStatusCodeEdge(response.status)

            if (response.status === 200) {
                const data = await response.json()
                setDataEdge(data)
            }
        }

        await retrieveData()
    }, [])

    return (
        <>
            <header>
                <UserButton/>
            </header>

            <boby>
                <div style={{display: 'flex',  justifyContent:'space-around', alignItems:'center', height: '100vh'}}>
                    <div>
                        <h2>Regular endpoint</h2>
                        <ul>
                            <li>Status code: <span style={{color: statusCode === 200 ? 'green' : 'red'}}> {statusCode} </span></li>
                            <li>Session id: {data.id}</li>
                            <li>User id: {data.userId}</li>
                            <li style={{fontWeight: 'bold'}}>Response time: {responseTime} ms</li>
                        </ul>
                    </div>
                    <div>
                        <h2>Edge endpoint</h2>
                        <ul>
                            <li>Status code: <span style={{color: statusCodeEdge === 200 ? 'green' : 'red'}}> {statusCodeEdge} </span></li>
                            <li>Session id: {dataEdge.id}</li>
                            <li>User id: {dataEdge.userId}</li>
                            <li style={{fontWeight: 'bold'}}>Response time: {responseTimeEdge} ms</li>
                        </ul>
                    </div>
                </div>
            </boby>
        </>
    )
}
