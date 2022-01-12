import React from 'react'
import Table from './Table'

export default function TableList({ tables }) {
    return (
        <div className="container">
            {tables && (
                <div>
                    {tables.map((table, index) => (
                        <Table table={table} key={index} />
                    ))}
                </div>
            )}
        </div>
    )
}