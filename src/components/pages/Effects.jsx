import { useState, useEffect } from 'react'
export default function Effects() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://dummyjson.com/products`)
                const data = await response.json()
                console.log('Product data:', data)
            } catch (error) {
                console.error('Error fetching product data:', error)
            }
        }

        fetchData()
    }, [count])

    return (
        <div>
            <h1>Effects</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    )
}
