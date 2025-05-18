import React from 'react'

interface SummaryCardProps {
  icon: React.ReactNode;
  text: string;
  number: number | string;
}

export default function SummaryCard({ icon, text, number }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
      <div className="p-3 bg-gray-50 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{text}</p>
        <p className="text-2xl font-semibold text-gray-800">{number}</p>
      </div>
    </div>
  )
}
