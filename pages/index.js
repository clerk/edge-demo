import React from 'react';
import Link from 'next/link';
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
                        <Link href="/regular">
                            <a>Try regular endpoint</a>
                        </Link>
                    </p>
                    <p>
                        <Link href="/edge">
                            <a>Try edge endpoint</a>
                        </Link>
                    </p>
                </div>
            </boby>
        </>
    )
}
