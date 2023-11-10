import React, { useEffect, useState } from 'react'
import { useAuth } from '../ContextWrapper'
import { Principal } from '@dfinity/principal'

const TableRow = ({ supplier, index, handleShowInfo }) => {


    return (
        <tr className="border-b dark:border-neutral-500">
            <td className="whitespace-nowrap px-6 py-4 font-medium">
                {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4">
                {supplier.companyName}
            </td>
            <td className="whitespace-nowrap px-6 py-4 flex items-center gap-3">
                <button
                    onClick={() => handleShowInfo(supplier)}
                    className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
                >
                    View information
                </button>
            </td>
            <td className="whitespace-nowrap px-6 py-4">
                {Number(supplier.points)}
            </td>
        </tr>
    )
}

export default TableRow