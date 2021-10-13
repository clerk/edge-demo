import React from 'react';
import { UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
        <>
            <header>
                <UserButton/>
            </header>

            <boby>
                <div style={{display: 'flex',  justifyContent:'space-around', alignItems:'center', height: '100vh'}}>
                    <p>
                        <a href={'/regular'}>Try regular endpoint</a>
                    </p>
                    <p>
                        <a href={'/edge'}>Try edge endpoint</a>
                    </p>
                </div>
            </boby>
        </>
    )
}
